import type { Metadata } from "next";
import ConfigFrame from "./_components/config-frame";

// The profile page is the settings root; every other settings route sets its own title.
export const metadata: Metadata = { title: "My Profile" };

export default function ConfigLayout({ children }: { children: React.ReactNode }) {
	return <ConfigFrame>{children}</ConfigFrame>;
}
