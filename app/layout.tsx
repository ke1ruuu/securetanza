import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import { TourProvider } from "@/context/TourContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const manrope = Manrope({
	variable: "--font-manrope",
	subsets: ["latin"],
	weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
	// The main map and the login page use the bare name; every other page adds its own
	// title through this template ("Analytics | Secure Tanza").
	title: { default: "Secure Tanza", template: "%s | Secure Tanza" },
	description: "A map-based platform for crime monitoring and response in Tanza, Cavite.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${inter.variable} ${manrope.variable} h-full antialiased`} suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
              try {
                // Same synchronous, pre-hydration bootstrap as the theme check
                // above, for the accessibility settings in AccessibilityContext —
                // without this, text size in particular would visibly reflow the
                // instant React mounts and picks up the stored preference.
                var rm = localStorage.getItem('a11y-reduce-motion');
                var reduceMotion = rm !== null ? rm === 'true' : (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
                document.documentElement.setAttribute('data-reduce-motion', String(reduceMotion));

                var hc = localStorage.getItem('a11y-high-contrast');
                var highContrast = hc !== null ? hc === 'true' : (window.matchMedia && window.matchMedia('(prefers-contrast: more)').matches);
                document.documentElement.setAttribute('data-high-contrast', String(highContrast));

                var ts = localStorage.getItem('a11y-text-size');
                document.documentElement.setAttribute('data-text-size', (ts === 'large' || ts === 'larger') ? ts : 'default');
              } catch (_) {}
            `,
					}}
				/>
			</head>
			<body className="min-h-full flex flex-col bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-700">
				<ThemeProvider>
				<AccessibilityProvider>
					<AuthProvider>
					<TourProvider>{children}</TourProvider>
				</AuthProvider>
				</AccessibilityProvider>
				</ThemeProvider>
				<Toaster />
			</body>
		</html>
	);
}
