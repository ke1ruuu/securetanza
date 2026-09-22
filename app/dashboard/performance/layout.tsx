import type { Metadata } from "next";

export const metadata: Metadata = { title: "Process Monitor" };

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
