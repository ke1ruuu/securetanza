"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type TextSize = "default" | "large" | "larger";

interface AccessibilityContextType {
	reduceMotion: boolean;
	setReduceMotion: (value: boolean) => void;
	highContrast: boolean;
	setHighContrast: (value: boolean) => void;
	textSize: TextSize;
	setTextSize: (value: TextSize) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

/** Also read directly by the pre-hydration bootstrap script in app/layout.tsx —
 *  keep both in sync if these ever change. */
export const A11Y_STORAGE_KEYS = {
	reduceMotion: "a11y-reduce-motion",
	highContrast: "a11y-high-contrast",
	textSize: "a11y-text-size",
} as const;

/**
 * System-wide accessibility settings, applied the same way the theme picker
 * applies dark mode: one attribute on <html> per setting, read by plain CSS
 * in globals.css so every component reacts automatically — no prop drilling,
 * no per-component opt-in required.
 *
 * Each setting defaults to whatever the OS already reports (prefers-reduced-
 * motion, prefers-contrast) the first time, then remembers whatever the
 * officer explicitly chose from then on — same "system by default,
 * overridable" shape the theme picker already uses for prefers-color-scheme.
 */
export function AccessibilityProvider({ children }: { children: ReactNode }) {
	const [reduceMotion, setReduceMotion] = useState(false);
	const [highContrast, setHighContrast] = useState(false);
	const [textSize, setTextSize] = useState<TextSize>("default");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);

		const storedMotion = localStorage.getItem(A11Y_STORAGE_KEYS.reduceMotion);
		if (storedMotion !== null) {
			setReduceMotion(storedMotion === "true");
		} else if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
			setReduceMotion(true);
		}

		const storedContrast = localStorage.getItem(A11Y_STORAGE_KEYS.highContrast);
		if (storedContrast !== null) {
			setHighContrast(storedContrast === "true");
		} else if (window.matchMedia?.("(prefers-contrast: more)").matches) {
			setHighContrast(true);
		}

		const storedTextSize = localStorage.getItem(A11Y_STORAGE_KEYS.textSize);
		if (storedTextSize === "large" || storedTextSize === "larger") {
			setTextSize(storedTextSize);
		}
	}, []);

	// Applied independently (not as one combined effect) so toggling any single
	// setting never touches the others' attributes.
	useEffect(() => {
		if (!mounted) return;
		document.documentElement.setAttribute("data-reduce-motion", String(reduceMotion));
		localStorage.setItem(A11Y_STORAGE_KEYS.reduceMotion, String(reduceMotion));
	}, [reduceMotion, mounted]);

	useEffect(() => {
		if (!mounted) return;
		document.documentElement.setAttribute("data-high-contrast", String(highContrast));
		localStorage.setItem(A11Y_STORAGE_KEYS.highContrast, String(highContrast));
	}, [highContrast, mounted]);

	useEffect(() => {
		if (!mounted) return;
		document.documentElement.setAttribute("data-text-size", textSize);
		localStorage.setItem(A11Y_STORAGE_KEYS.textSize, textSize);
	}, [textSize, mounted]);

	const value: AccessibilityContextType = {
		reduceMotion,
		setReduceMotion,
		highContrast,
		setHighContrast,
		textSize,
		setTextSize,
	};

	return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility() {
	const context = useContext(AccessibilityContext);
	if (context === undefined) {
		throw new Error("useAccessibility must be used within an AccessibilityProvider");
	}
	return context;
}
