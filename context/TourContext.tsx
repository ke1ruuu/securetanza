"use client";

import React, { createContext, useContext, useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { driver, type Driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import "@/components/tour/tour.css";
import { useAuth } from "@/context/AuthContext";
import { TOUR_STAGES, TOUR_COMPLETED_KEY, TOUR_STAGE_KEY, TOUR_PENDING_KEY } from "@/lib/tour/steps";

interface TourContextType {
	/** Manually (re)start the full tour from the beginning, navigating to its first page if needed. */
	replayTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function useTour() {
	const ctx = useContext(TourContext);
	if (!ctx) throw new Error("useTour must be used within a TourProvider");
	return ctx;
}

// Permissions that unlock the tour: admins always see it, otherwise the
// user needs at least the map permission (the tour's first stage lives on
// the Map page).
function canSeeTour(permissions: string[] | undefined): boolean {
	if (!permissions) return false;
	return (
		permissions.includes("admin") ||
		permissions.includes("admin_operational_officer") ||
		permissions.includes("privileged_map_view")
	);
}

// Each stage additionally requires its own module permission, so a user
// without (say) Cases access never gets auto-navigated into that stage.
const STAGE_PERMISSIONS: Record<string, string> = {
	"system-map": "privileged_map_view",
	overview: "privileged_map_view",
	cases: "privileged_cases_view",
	analytics: "privileged_analytics_view",
	reports: "privileged_analytics_view",
};

function hasModulePermission(permissions: string[] | undefined, permission: string | undefined): boolean {
	if (!permissions || !permission) return false;
	return (
		permissions.includes("admin") ||
		permissions.includes("admin_operational_officer") ||
		permissions.includes(permission)
	);
}

function readLocal(key: string): string | null {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

function writeLocal(key: string, value: string) {
	try {
		localStorage.setItem(key, value);
	} catch {
		// localStorage may be unavailable (e.g. private mode); ignore.
	}
}

function removeLocal(key: string) {
	try {
		localStorage.removeItem(key);
	} catch {
		// ignore
	}
}

// Resolves once `selector` exists in the DOM, or after `timeoutMs` elapses,
// whichever comes first. Pages like Overview and Cases fetch their data
// client-side and render a loading skeleton (with none of the tour's
// `data-tour` targets present) until that finishes — driving the tour
// before then leaves it pointed at elements that don't exist yet. A
// selector-less stage resolves immediately, preserving old behavior.
function waitForElement(selector: string | undefined, timeoutMs = 10000, intervalMs = 150): Promise<void> {
	if (!selector) return Promise.resolve();
	return new Promise((resolve) => {
		const start = Date.now();
		const check = () => {
			if (document.querySelector(selector) || Date.now() - start >= timeoutMs) {
				resolve();
				return;
			}
			window.setTimeout(check, intervalMs);
		};
		check();
	});
}

export function TourProvider({ children }: { children: React.ReactNode }) {
	const { user, loading } = useAuth();
	const pathname = usePathname();
	const router = useRouter();
	const driverRef = useRef<Driver | null>(null);
	// Tracks the pathname we've already made an auto-start/resume decision
	// for. TourProvider lives in the root layout and never remounts between
	// client-side navigations, so a single boolean flag would block every
	// later stage after the first — this must reset per pathname instead.
	const decidedForPath = useRef<string | null>(null);
	// Set right before we manually destroy() a driver instance to chain
	// into the next stage, so the shared onDestroyed handler below knows
	// not to mark the *whole* tour as completed.
	const advancingToNextStage = useRef(false);
	// Kept in sync with `pathname` so the async readiness wait below (which
	// closes over the pathname from whenever runStage was called) can tell
	// if the user has since navigated away before it finishes waiting.
	const currentPathnameRef = useRef(pathname);
	useEffect(() => {
		currentPathnameRef.current = pathname;
	}, [pathname]);

	const eligible = canSeeTour(user?.permissions);

	const runStage = useCallback(
		(stageIndex: number) => {
			const stage = TOUR_STAGES[stageIndex];
			if (!stage || pathname !== stage.path) return;

			// Don't run a stage the user doesn't actually have module access
			// to (e.g. arrived here via a chained/pending resume but their
			// permissions changed, or lack Cases access).
			if (!hasModulePermission(user?.permissions, STAGE_PERMISSIONS[stage.id])) {
				writeLocal(TOUR_COMPLETED_KEY, "1");
				removeLocal(TOUR_STAGE_KEY);
				return;
			}

			const isFinalStage = stageIndex === TOUR_STAGES.length - 1;
			const nextStage = TOUR_STAGES[stageIndex + 1];
			const nextStageAllowed =
				!!nextStage && hasModulePermission(user?.permissions, STAGE_PERMISSIONS[nextStage.id]);

			// Give the page a beat to finish rendering its data-tour targets
			// (async stats, chart data, etc. load in after first paint), then
			// wait for the stage's readySelector (if any) so we don't start
			// driving while the page is still showing a loading skeleton.
			window.setTimeout(() => {
				waitForElement(stage.readySelector).then(() => {
					// The user may have navigated away from this stage's page
					// while we were waiting for its data to load — don't start
					// (or restart) a tour on whatever page they're on now.
					if (currentPathnameRef.current !== stage.path) return;

					driverRef.current?.destroy();

					let steps: DriveStep[] = stage.steps;

					if (!isFinalStage && nextStage && nextStageAllowed) {
						// Attach a completion hook to the last step only, so
						// finishing this stage's steps hands off to the next
						// page instead of just closing the tour.
						steps = stage.steps.map((step, i) => {
							if (i !== stage.steps.length - 1) return step;
							return {
								...step,
								popover: {
									...step.popover,
									onDoneClick: (_element, _step, opts) => {
										advancingToNextStage.current = true;
										writeLocal(TOUR_STAGE_KEY, String(stageIndex + 1));
										writeLocal(TOUR_PENDING_KEY, "1");
										opts.driver.destroy();
										router.push(nextStage.path);
									},
								},
							};
						});
					}

					const d = driver({
						showProgress: true,
						allowClose: true,
						overlayOpacity: 0.6,
						stagePadding: 6,
						popoverClass: "secure-tanza-tour",
						steps,
						onDestroyed: () => {
							if (advancingToNextStage.current) {
								advancingToNextStage.current = false;
								return;
							}
							// Finished the final stage naturally, or closed early
							// on any stage — either way, stop auto-starting.
							writeLocal(TOUR_COMPLETED_KEY, "1");
							removeLocal(TOUR_STAGE_KEY);
						},
					});

					driverRef.current = d;
					d.drive();
				});
			}, 400);
		},
		[pathname, router, user],
	);

	// Auto-start / auto-resume.
	useEffect(() => {
		if (loading || !eligible) return;

		const stageIndex = TOUR_STAGES.findIndex((s) => s.path === pathname);
		if (stageIndex === -1 || decidedForPath.current === pathname) return;
		decidedForPath.current = pathname;

		const pending = readLocal(TOUR_PENDING_KEY) === "1";
		const storedStageIndex = Number(readLocal(TOUR_STAGE_KEY) ?? "0");
		const completed = readLocal(TOUR_COMPLETED_KEY) === "1";

		// A stage is waiting to resume on this exact page (either chained
		// forward from the previous stage, or a manual replay landed here).
		if (pending && storedStageIndex === stageIndex) {
			removeLocal(TOUR_PENDING_KEY);
			runStage(stageIndex);
			return;
		}

		// Fresh, first-ever visit: only auto-start from the very first
		// stage/page, never mid-way if someone lands deep-linked.
		if (!completed && stageIndex === 0) {
			runStage(0);
		}
	}, [loading, eligible, pathname, runStage]);

	// Clean up the driver instance whenever we navigate away from a stage
	// page — driver.js appends its overlay straight to document.body, so it
	// won't be cleared just because React unmounted the page underneath it
	// (e.g. the user clicks a nav link mid-tour instead of finishing it).
	useEffect(() => {
		return () => {
			driverRef.current?.destroy();
		};
	}, [pathname]);

	const replayTour = useCallback(() => {
		if (!eligible) return;

		const firstStage = TOUR_STAGES[0];
		writeLocal(TOUR_STAGE_KEY, "0");

		if (pathname === firstStage.path) {
			removeLocal(TOUR_PENDING_KEY);
			decidedForPath.current = pathname;
			runStage(0);
			return;
		}

		writeLocal(TOUR_PENDING_KEY, "1");
		router.push(firstStage.path);
	}, [eligible, pathname, router, runStage]);

	return <TourContext.Provider value={{ replayTour }}>{children}</TourContext.Provider>;
}
