"use client";

import React, { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { MapProvider } from "@/context/MapContext";
import { ArrowLeft, Shield, ShieldCheck, Activity, FileSpreadsheet, Settings, Bell, Lock, UserCircle } from "lucide-react";

import AccessSecurityTab from "./components/AccessSecurityTab";
import AuditLogsTab from "./components/AuditLogsTab";
import DataExportsTab from "./components/DataExportsTab";
import AccountSettingsTab from "./components/AccountSettingsTab";
import NotificationSettingsTab from "./components/NotificationSettingsTab";
import ProfileTab from "./components/ProfileTab";

function ConfigContent() {
	const { user } = useAuth();
	const router = useRouter();

	const [activeTab, setActiveTab] = useState<string>("profile");

	if (user && !user.permissions.includes("admin_operational_officer") && !user.permissions.includes("admin")) {
		return (
			<div className={`flex flex-col h-screen ${"bg-[#f1f5f9] text-slate-900 dark:bg-[#0f172a] dark:text-white"}`}>
				<header className={`w-full backdrop-blur-xl border-b pointer-events-auto z-50 ${"bg-white/80 border-slate-200 dark:bg-[#0F172A]/80 dark:border-white/[0.06]"}`}>
					<div className="flex items-center h-16 px-8">
						<button
							onClick={() => router.back()}
							className={`flex items-center gap-2 transition-colors duration-200 ${"text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}>
							<ArrowLeft className="h-5 w-5" />
							<span className="text-sm font-medium">Back</span>
						</button>
						<div className="ml-8 flex items-center gap-3">
							<Shield className="h-5 w-5 text-[#0EA5E9]" />
							<h1 className={`text-lg font-semibold ${"text-slate-900 dark:text-white"}`}>System Configuration</h1>
						</div>
					</div>
				</header>
				<div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
					<div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6">
						<Lock className="h-8 w-8 text-amber-500" />
					</div>
					<h2 className="text-2xl font-bold mb-2">Administrative Access Only</h2>
					<p className="text-slate-500 max-w-md mb-8">
						This module is reserved for Admin Operational Officers. You do not have the necessary privileges to modify system
						configurations.
					</p>
				</div>
			</div>
		);
	}

	const sidebarNavItems = [
		{ id: "profile", label: "My Profile", icon: UserCircle, description: "Account & password" },
		{ id: "access-security", label: "Access & Security", icon: ShieldCheck, description: "Users and 2FA" },
		{ id: "audit-logs", label: "Audit Logs", icon: Activity, description: "Uploads and activity" },
		{ id: "data-exports", label: "Data Exports", icon: FileSpreadsheet, description: "Scheduled exports" },
		{ id: "account", label: "Account Preferences", icon: Settings, description: "Theme and views" },
		{ id: "notifications", label: "Notifications", icon: Bell, description: "Alerts and triggers" },
	];

	return (
		<div className={`flex flex-col h-screen transition-colors duration-700 overflow-hidden font-sans ${"bg-[#f1f5f9] text-slate-900 dark:bg-[#0f172a] dark:text-slate-100"}`}>
			<header className={`w-full backdrop-blur-xl border-b pointer-events-auto z-50 flex-none ${"bg-white/80 border-slate-200 dark:bg-[#0F172A]/80 dark:border-white/[0.06]"}`}>
				<div className="flex items-center h-16 px-8">
					<button
						onClick={() => router.back()}
						className={`flex items-center gap-2 transition-colors duration-200 ${"text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}>
						<ArrowLeft className="h-5 w-5" />
						<span className="text-sm font-medium">Back</span>
					</button>
					<div className="ml-8 flex items-center gap-3">
						<Settings className="h-5 w-5 text-[#0EA5E9]" />
						<h1 className={`text-lg font-semibold ${"text-slate-900 dark:text-white"}`}>System Settings</h1>
					</div>
				</div>
			</header>

			<main className="flex-1 flex overflow-hidden">
				{/* Sidebar */}
				<aside className="w-80 border-r border-slate-200 dark:border-white/[0.06] bg-white/50 dark:bg-slate-900/20 overflow-y-auto">
					<div className="p-6">
						<nav className="space-y-1.5">
							{sidebarNavItems.map((item) => {
								const isActive = activeTab === item.id;
								return (
									<button
										key={item.id}
										onClick={() => setActiveTab(item.id)}
										className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left ${
											isActive
												? "bg-[#0EA5E9]/10 text-[#0EA5E9] shadow-sm"
												: "hover:bg-slate-200/50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400"
										}`}>
										<div className={`p-2 rounded-lg ${isActive ? "bg-[#0EA5E9]/20" : "bg-transparent"}`}>
											<item.icon className="h-5 w-5" />
										</div>
										<div>
											<div className={`font-semibold text-sm ${isActive ? "text-[#0EA5E9]" : "text-slate-700 dark:text-slate-300"}`}>
												{item.label}
											</div>
											<div className="text-[11px] mt-0.5 text-slate-400 dark:text-slate-500">{item.description}</div>
										</div>
									</button>
								);
							})}
						</nav>
					</div>
				</aside>

				{/* Content Area */}
				<div className="flex-1 overflow-y-auto p-8 custom-scrollbar scroll-smooth">
					{activeTab === "profile" && <ProfileTab />}
					{activeTab === "access-security" && <AccessSecurityTab />}
					{activeTab === "audit-logs" && <AuditLogsTab />}
					{activeTab === "data-exports" && <DataExportsTab />}
					{activeTab === "account" && <AccountSettingsTab />}
					{activeTab === "notifications" && <NotificationSettingsTab />}
				</div>
			</main>
		</div>
	);
}

export default function ConfigPage() {
	return (
		<MapProvider>
			<Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
				<ConfigContent />
			</Suspense>
		</MapProvider>
	);
}
