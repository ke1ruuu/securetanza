"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Hash, LogOut, CheckCircle2, Key } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function ProfileTab() {
	const { user, logout } = useAuth();
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [saved, setSaved] = useState(false);
	const [twoFA, setTwoFA] = useState(false);

	const initials = user?.fullName
		? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
		: "??";

	const primaryRole = user?.permissions?.[0]
		?.replace(/_/g, " ")
		.replace(/\b\w/g, (c) => c.toUpperCase()) ?? "Officer";

	const handleChangePassword = (e: React.FormEvent) => {
		e.preventDefault();
		setPasswordError("");

		if (newPassword.length < 8) {
			setPasswordError("New password must be at least 8 characters.");
			return;
		}
		if (newPassword !== confirmPassword) {
			setPasswordError("New passwords do not match.");
			return;
		}

		// TODO: wire up to API
		setSaved(true);
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
		setTimeout(() => setSaved(false), 3000);
	};

	return (
		<div className="flex flex-col items-center w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="w-full max-w-3xl flex flex-col gap-8 pb-12">
				{/* Header */}
				<div className="pb-4">
					<h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
						My Profile
					</h2>
				</div>

				<div className="space-y-12">
					{/* Identity Card */}
					<div className="space-y-4">
						<div className="space-y-1">
							<h3 className="text-lg font-bold text-slate-900 dark:text-white">Account Identity</h3>
							<p className="text-sm text-slate-500 dark:text-slate-400">
								Your account information as registered in the system.
							</p>
						</div>

						<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
							{/* Avatar + Name row */}
							<div className="flex items-center gap-6 p-6 border-b border-slate-200 dark:border-white/5">
								<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center flex-shrink-0">
									<span className="text-xl font-black text-white">{initials}</span>
								</div>
								<div>
									<p className="text-xl font-bold text-slate-900 dark:text-white">{user?.fullName ?? "—"}</p>
									<span className="inline-flex items-center mt-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20">
										{primaryRole}
									</span>
								</div>
							</div>

							{/* Fields */}
							<div className="divide-y divide-slate-100 dark:divide-white/5">
								<div className="flex items-center justify-between px-6 py-4">
									<div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
										<Hash className="h-4 w-4" />
										<span className="text-sm font-semibold">Account Number</span>
									</div>
									<span className="text-sm font-mono font-semibold text-slate-900 dark:text-white">
										{user?.accountNumber ?? "—"}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Change Password */}
					<div className="space-y-4">
						<div className="space-y-1">
							<h3 className="text-lg font-bold text-slate-900 dark:text-white">Change Password</h3>
							<p className="text-sm text-slate-500 dark:text-slate-400">
								Update your login credentials. Must be at least 8 characters.
							</p>
						</div>

						<form onSubmit={handleChangePassword}>
							<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
								<div className="p-6 space-y-4">
									<div className="space-y-2">
										<Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Password</Label>
										<Input
											type="password"
											placeholder="Enter current password"
											value={currentPassword}
											onChange={(e) => setCurrentPassword(e.target.value)}
											required
											className="h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
										/>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</Label>
											<Input
												type="password"
												placeholder="Minimum 8 characters"
												value={newPassword}
												onChange={(e) => setNewPassword(e.target.value)}
												required
												className="h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
											/>
										</div>
										<div className="space-y-2">
											<Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</Label>
											<Input
												type="password"
												placeholder="Repeat new password"
												value={confirmPassword}
												onChange={(e) => setConfirmPassword(e.target.value)}
												required
												className="h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
											/>
										</div>
									</div>
									{passwordError && (
										<p className="text-sm font-medium text-red-500">{passwordError}</p>
									)}
								</div>
								<div className="px-6 pb-6 flex justify-end">
									{saved ? (
										<div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg text-sm font-medium">
											<CheckCircle2 className="h-4 w-4" /> Password Updated
										</div>
									) : (
										<Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
											Update Password
										</Button>
									)}
								</div>
							</div>
						</form>
					</div>

					{/* 2FA */}
					<div className="space-y-4">
						<div className="space-y-1">
							<h3 className="text-lg font-bold text-slate-900 dark:text-white">Two-Factor Authentication</h3>
							<p className="text-sm text-slate-500 dark:text-slate-400">
								Add an extra layer of security to your account.
							</p>
						</div>
						<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-4">
									<div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
										<Key className="h-5 w-5 text-[#0EA5E9]" />
									</div>
									<div className="space-y-0.5">
										<Label className="text-sm font-semibold text-slate-900 dark:text-white">Enable 2FA for my account</Label>
										<p className="text-xs text-slate-500">
											Require a verification code on every login in addition to your password.
										</p>
									</div>
								</div>
								<Switch checked={twoFA} onCheckedChange={setTwoFA} />
							</div>
						</div>
					</div>

					{/* Danger Zone */}
					<div className="space-y-4">
						<div className="space-y-1">
							<h3 className="text-lg font-bold text-slate-900 dark:text-white">Session</h3>
						</div>
						<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-6 shadow-sm flex items-center justify-between">
							<div className="space-y-0.5">
								<Label className="text-sm font-semibold text-slate-900 dark:text-white">Sign Out</Label>
								<p className="text-sm text-slate-500">End your current session and return to the login screen.</p>
							</div>
							<Button
								variant="outline"
								onClick={logout}
								className="gap-2 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-300">
								<LogOut className="h-4 w-4" /> Sign Out
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
