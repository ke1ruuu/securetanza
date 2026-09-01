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

// Permissions for each stage: stage 0 (system-map on "/") is public,
// while dashboard stages require respective module permissions.
const STAGE_PERMISSIONS: Record<string, string> = {
	"system-map": "privileged_map_view",
	overview: "privileged_map_view",
	cases: "privileged_cases_view",
	analytics: "privileged_analytics_view",
	reports: "privileged_analytics_view",
};

function hasModulePermission(permissions: string[] | undefined, permission: string | undefined): boolean {
	if (!permission) return true;
	if (!permissions) return false;
	return (
		permissions.includes("admin") ||
		permissions.includes("admin_operational_officer") ||
		permissions.includes("operational_officer") ||
		permissions.includes("privileged_user") ||
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
	// client-side navigations, so this resets when navigating away from stage paths.
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

	const runStage = useCallback(
		(stageIndex: number) => {
			const stage = TOUR_STAGES[stageIndex];
			if (!stage) return;

			// Don't run a protected dashboard stage if the user lacks module access
			if (stageIndex > 0 && !hasModulePermission(user?.permissions, STAGE_PERMISSIONS[stage.id])) {
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

					// Filter stage steps to only include elements that exist and are visible
					const visibleSteps = stage.steps.filter((step) => {
						if (!step.element) return true;
						if (typeof step.element === "string") {
							const el = document.querySelector(step.element) as HTMLElement | null;
							if (!el) return !step.skipMissingElement;
							const rect = el.getBoundingClientRect();
							const style = window.getComputedStyle(el);
							if (
								style.display === "none" ||
								style.visibility === "hidden" ||
								(rect.width === 0 && rect.height === 0)
							) {
								return false;
							}
						}
						return true;
					});

					if (visibleSteps.length === 0) return;

					let steps: DriveStep[] = visibleSteps;

					if (!isFinalStage && nextStage && nextStageAllowed) {
						// Attach a completion hook to the last step only, so
						// finishing this stage's steps hands off to the next
						// page instead of just closing the tour.
						steps = visibleSteps.map((step, i) => {
							if (i !== visibleSteps.length - 1) return step;
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
			}, 350);
		},
		[router, user],
	);

	// Auto-start / auto-resume.
	useEffect(() => {
		if (loading) return;

		const stageIndex = TOUR_STAGES.findIndex((s) => s.path === pathname);
		if (stageIndex === -1) {
			decidedForPath.current = null;
			return;
		}

		const pending = readLocal(TOUR_PENDING_KEY) === "1";
		const storedStageIndex = Number(readLocal(TOUR_STAGE_KEY) ?? "0");
		const completed = readLocal(TOUR_COMPLETED_KEY) === "1";

		// A stage is waiting to resume on this exact page (either chained
		// forward from the previous stage, or a manual replay landed here).
		if (pending && storedStageIndex === stageIndex) {
			removeLocal(TOUR_PENDING_KEY);
			decidedForPath.current = pathname;
			runStage(stageIndex);
			return;
		}

		if (decidedForPath.current === pathname) return;
		decidedForPath.current = pathname;

		// Fresh, first-ever visit: only auto-start from the very first
		// stage/page, never mid-way if someone lands deep-linked.
		if (!completed && stageIndex === 0) {
			runStage(0);
		}
	}, [loading, pathname, runStage]);

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
		const firstStage = TOUR_STAGES[0];
		removeLocal(TOUR_COMPLETED_KEY);
		writeLocal(TOUR_STAGE_KEY, "0");
		decidedForPath.current = null;

		if (pathname === firstStage.path) {
			removeLocal(TOUR_PENDING_KEY);
			decidedForPath.current = pathname;
			runStage(0);
			return;
		}

		writeLocal(TOUR_PENDING_KEY, "1");
		router.push(firstStage.path);
	}, [pathname, router, runStage]);

	return <TourContext.Provider value={{ replayTour }}>{children}</TourContext.Provider>;
}
