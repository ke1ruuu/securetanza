"use client";

import React, { createContext, useContext, useCallback, useEffect, useRef, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { driver, type Driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import "@/components/tour/tour.css";
import { useAuth } from "@/context/AuthContext";
import {
	TOUR_COMPLETED_KEY,
	TOUR_STAGE_KEY,
	TOUR_PENDING_KEY,
	TOUR_ROLE_KEY,
	type UserRoleType,
	type TourStage,
	getTourStagesForRole,
} from "@/lib/tour/steps";

interface TourContextType {
	/** Manually (re)start a guided tour, optionally specifying a role walkthrough. */
	replayTour: (roleOverride?: UserRoleType) => void;
	/** Current effective user role for tours */
	activeRole: UserRoleType;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function useTour() {
	const ctx = useContext(TourContext);
	if (!ctx) throw new Error("useTour must be used within a TourProvider");
	return ctx;
}

function getUserRole(user: any): UserRoleType {
	if (!user) return "public";
	const perms: string[] = user.permissions || [];
	if (perms.includes("admin") || perms.includes("admin_operational_officer")) {
		return "admin";
	}
	if (perms.includes("operational_officer")) {
		return "operational_officer";
	}
	return "privileged_user";
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

// Resolves once `selector` exists in the DOM, or after `timeoutMs` elapses.
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

	const decidedForPath = useRef<string | null>(null);
	const advancingToNextStage = useRef(false);
	const currentPathnameRef = useRef(pathname);

	useEffect(() => {
		currentPathnameRef.current = pathname;
	}, [pathname]);

	const currentRole = useMemo<UserRoleType>(() => {
		return getUserRole(user);
	}, [user]);

	const getActiveStages = useCallback((): { stages: TourStage[]; role: UserRoleType } => {
		const storedRole = readLocal(TOUR_ROLE_KEY) as UserRoleType | null;
		const role: UserRoleType = storedRole || currentRole;
		return {
			stages: getTourStagesForRole(role, user?.permissions || []),
			role,
		};
	}, [currentRole, user?.permissions]);

	const runStage = useCallback(
		(stageIndex: number) => {
			const { stages, role } = getActiveStages();
			const stage = stages[stageIndex];
			if (!stage) return;

			const isFinalStage = stageIndex >= stages.length - 1;
			const nextStage = !isFinalStage ? stages[stageIndex + 1] : undefined;

			window.setTimeout(() => {
				waitForElement(stage.readySelector).then(() => {
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

					if (!isFinalStage && nextStage) {
						steps = visibleSteps.map((step, i) => {
							if (i !== visibleSteps.length - 1) return step;
							return {
								...step,
								popover: {
									...step.popover,
									doneBtnText: "Next Module →",
									onDoneClick: (_element, _step, opts) => {
										advancingToNextStage.current = true;
										writeLocal(TOUR_STAGE_KEY, String(stageIndex + 1));
										writeLocal(TOUR_PENDING_KEY, "1");
										writeLocal(TOUR_ROLE_KEY, role);
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
							writeLocal(TOUR_COMPLETED_KEY, "1");
							removeLocal(TOUR_STAGE_KEY);
							removeLocal(TOUR_ROLE_KEY);
						},
					});

					driverRef.current = d;
					d.drive();
				});
			}, 350);
		},
		[getActiveStages, router],
	);

	// Auto-start / auto-resume.
	useEffect(() => {
		if (loading) return;

		const { stages } = getActiveStages();
		const stageIndex = stages.findIndex((s) => s.path === pathname);
		if (stageIndex === -1) {
			decidedForPath.current = null;
			return;
		}

		const pending = readLocal(TOUR_PENDING_KEY) === "1";
		const storedStageIndex = Number(readLocal(TOUR_STAGE_KEY) ?? "0");
		const completed = readLocal(TOUR_COMPLETED_KEY) === "1";

		if (pending && storedStageIndex === stageIndex) {
			removeLocal(TOUR_PENDING_KEY);
			decidedForPath.current = pathname;
			runStage(stageIndex);
			return;
		}

		if (decidedForPath.current === pathname) return;
		decidedForPath.current = pathname;

		// Fresh, first-ever visit: auto-start from first stage
		if (!completed && stageIndex === 0) {
			runStage(0);
		}
	}, [loading, pathname, getActiveStages, runStage]);

	// Clean up driver instance on unmount or navigation
	useEffect(() => {
		return () => {
			driverRef.current?.destroy();
		};
	}, [pathname]);

	const replayTour = useCallback(
		(roleOverride?: UserRoleType) => {
			if (roleOverride) {
				writeLocal(TOUR_ROLE_KEY, roleOverride);
			} else {
				removeLocal(TOUR_ROLE_KEY);
			}

			const effectiveRole = roleOverride || currentRole;
			const stages = getTourStagesForRole(effectiveRole, user?.permissions || []);
			if (stages.length === 0) return;

			const firstStage = stages[0];
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
		},
		[currentRole, user?.permissions, pathname, router, runStage],
	);

	return (
		<TourContext.Provider value={{ replayTour, activeRole: currentRole }}>
			{children}
		</TourContext.Provider>
	);
}
