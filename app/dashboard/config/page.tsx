"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { MapProvider } from "@/context/MapContext";
import { useTheme } from "@/context/ThemeContext";
import {
	ArrowLeft,
	Settings,
	FileSpreadsheet,
	CheckCircle2,
	XCircle,
	AlertCircle,
	Clock,
	Download,
	RefreshCw,
	Shield,
	UserPlus,
	Edit,
	Trash2,
	Key,
	Users,
	Lock,
	Fingerprint,
	ShieldCheck,
	Sun,
	Moon,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UploadLog {
	id: string;
	fileName: string;
	fileSize: number;
	recordsImported: number;
	status: string;
	errorMessage?: string;
	uploadedBy?: string;
	uploadedAt: string;
}

interface Permission {
	id: number;
	name: string;
	description: string | null;
}

interface User {
	id: number;
	accountNumber: string;
	fullName: string;
	permissions: Permission[];
	createdAt: string;
	updatedAt: string;
}

interface AvailablePermission {
	id: number;
	permissionName: string;
	description: string | null;
}

function ConfigContent() {
	const { user } = useAuth();
	const router = useRouter();
	const { theme, setTheme } = useTheme();

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
	const [activeTab, setActiveTab] = useState<"settings" | "upload-logs" | "preferences">("settings");

	// Upload logs state
	const [logs, setLogs] = useState<UploadLog[]>([]);
	const [logsLoading, setLogsLoading] = useState(false);
	const [totalLogs, setTotalLogs] = useState(0);

	// User management state
	const [users, setUsers] = useState<User[]>([]);
	const [availablePermissions, setAvailablePermissions] = useState<AvailablePermission[]>([]);
	const [usersLoading, setUsersLoading] = useState(true);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [mgmtError, setMgmtError] = useState("");
	const [mgmtSuccess, setMgmtSuccess] = useState("");

	const [formData, setFormData] = useState<{
		fullName: string;
		password?: string;
		permissionIds: number[];
	}>({
		fullName: "",
		password: "",
		permissionIds: [],
	});

	const loadLogs = async () => {
		setLogsLoading(true);
		try {
			const response = await fetch("/api/upload-logs?limit=100");
			const data = await response.json();

			if (data.success) {
				setLogs(data.logs);
				setTotalLogs(data.total);
			}
		} catch (error) {
			console.error("Error loading upload logs:", error);
		} finally {
			setLogsLoading(false);
		}
	};

	const fetchUsers = async () => {
		setUsersLoading(true);
		try {
			const response = await fetch("/api/users");
			const data = await response.json();
			if (data.success) {
				setUsers(data.data);
			} else setMgmtError(data.error || "Failed to fetch users");
		} catch (err) {
			setMgmtError("Failed to fetch users");
		} finally {
			setUsersLoading(false);
		}
	};

	const fetchPermissions = async () => {
		try {
			const response = await fetch("/api/permissions");
			const data = await response.json();
			if (data.success) {
				setAvailablePermissions(data.data);
			}
		} catch (err) {
			console.error("Failed to fetch permissions:", err);
		}
	};

	useEffect(() => {
		if (activeTab === "upload-logs") {
			loadLogs();
		} else if (activeTab === "settings") {
			fetchUsers();
			fetchPermissions();
		}
	}, [activeTab]);

	const handleCreateUser = async (e: React.FormEvent) => {
		e.preventDefault();
		setMgmtError("");
		setMgmtSuccess("");

		if (formData.permissionIds.length === 0) {
			setMgmtError("At least one permission role must be assigned.");
			return;
		}

		try {
			const response = await fetch("/api/users", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const data = await response.json();
			if (data.success) {
				setMgmtSuccess("Privileged user account authorized");
				setShowCreateModal(false);
				setFormData({ identifier: "", fullName: "", password: "", permissionIds: [] });
				fetchUsers();
			} else setMgmtError(data.error || "Failed to authorize user");
		} catch (err) {
			setMgmtError("Failed to authorize user");
		}
	};

	const handleUpdateUser = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedUser) return;
		setMgmtError("");
		setMgmtSuccess("");

		if (formData.permissionIds.length === 0) {
			setMgmtError("At least one permission role must be assigned.");
			return;
		}

		try {
			const response = await fetch(`/api/users/${selectedUser.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const data = await response.json();
			if (data.success) {
				setMgmtSuccess("Privileged access levels updated");
				setShowEditModal(false);
				setSelectedUser(null);
				fetchUsers();
			} else setMgmtError(data.error || "Failed to update access");
		} catch (err) {
			setMgmtError("Failed to update access");
		}
	};

	const handleDeleteUser = async (userId: number) => {
		if (!confirm("Are you sure you want to revoke this user's privileged access? This action is permanent.")) return;
		setMgmtError("");
		setMgmtSuccess("");
		try {
			const response = await fetch(`/api/users/${userId}`, { method: "DELETE" });
			const data = await response.json();
			if (data.success) {
				setMgmtSuccess("Access revoked successfully");
				fetchUsers();
			} else setMgmtError(data.error || "Failed to revoke access");
		} catch (err) {
			setMgmtError("Failed to revoke access");
		}
	};

	const openEditModal = (user: User) => {
		setSelectedUser(user);
		setFormData({
			fullName: user.fullName,
			password: "",
			permissionIds: user.permissions.map((p) => p.id),
		});
		setShowEditModal(true);
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		}).format(date);
	};

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "success":
				return <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
			case "failed":
				return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
			case "partial":
				return <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
			default:
				return <FileSpreadsheet className="h-5 w-5 text-slate-600 dark:text-slate-400" />;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "success":
				return "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300";
			case "failed":
				return "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300";
			case "partial":
				return "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300";
			default:
				return "bg-slate-50 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/20 text-slate-700 dark:text-slate-300";
		}
	};

	return (
		<div
			className={`flex flex-col h-screen transition-colors duration-700 overflow-hidden font-sans ${
				"bg-[#f1f5f9] text-slate-900 dark:bg-[#0f172a] dark:text-slate-100"
			}`}>
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
						<h1 className={`text-lg font-semibold ${"text-slate-900 dark:text-white"}`}>Privileged Access Management</h1>
					</div>
				</div>
			</header>

			<div
				className={`flex items-center gap-1 px-8 py-4 border-b ${
					"bg-white/60 border-slate-200/60 dark:bg-[#0f172a]/80 dark:border-white/[0.04]"
				}`}>
				<button
					onClick={() => setActiveTab("settings")}
					className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
						activeTab === "settings"
							? theme === 'dark' ? "bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20" : "bg-sky-50 text-[#0284C7] border border-sky-200"
							: theme === 'dark' ? "text-slate-400 hover:text-slate-300 hover:bg-white/[0.04]" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
					}`}>
					Privileged Users
				</button>
				<button
					onClick={() => setActiveTab("upload-logs")}
					className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
						activeTab === "upload-logs"
							? theme === 'dark' ? "bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20" : "bg-sky-50 text-[#0284C7] border border-sky-200"
							: theme === 'dark' ? "text-slate-400 hover:text-slate-300 hover:bg-white/[0.04]" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
					}`}>
					Activity Logs
				</button>
				<button
					onClick={() => setActiveTab("preferences")}
					className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
						activeTab === "preferences"
							? theme === 'dark' ? "bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20" : "bg-sky-50 text-[#0284C7] border border-sky-200"
							: theme === 'dark' ? "text-slate-400 hover:text-slate-300 hover:bg-white/[0.04]" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
					}`}>
					System Preferences
				</button>
			</div>

			<main className={`flex-1 flex flex-col min-w-0 overflow-hidden ${"bg-[#f1f5f9] dark:bg-[#0f172a]"}`}>
				<div className="flex-1 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar scroll-smooth">
					{activeTab === "settings" ? (
						<div className="flex flex-col gap-6 max-w-6xl mx-auto h-full">
							<div
								className={`rounded-2xl border p-8 ${
									"bg-white border-slate-200 shadow-sm dark:bg-slate-900/40 dark:border-white/[0.04]"
								}`}>
								<div className="flex justify-between items-start mb-8">
									<div className="space-y-1">
										<h2 className="text-2xl font-bold tracking-tight">Privileged Personnel Authorization</h2>
										<p className="text-slate-500 dark:text-slate-400 text-sm">
											Manage administrative and operational access for privileged users within the secure platform.
										</p>
									</div>
									<button
										onClick={() => {
											setFormData({
												identifier: "",
												fullName: "",
												password: "",
												permissionIds: [],
											});
											setShowCreateModal(true);
										}}
										className="flex items-center gap-2 px-5 py-2.5 bg-[#0EA5E9] hover:bg-[#0EA5E9]/80 text-white rounded-xl transition-all font-bold text-sm shadow-lg shadow-blue-500/20">
										<UserPlus className="w-4 h-4" />
										Authorize New Officer
									</button>
								</div>

								{mgmtError && (
									<div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-3 mb-6">
										<AlertCircle className="h-5 w-5" /> {mgmtError}
									</div>
								)}
								{mgmtSuccess && (
									<div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-sm flex items-center gap-3 mb-6">
										<CheckCircle2 className="h-5 w-5" /> {mgmtSuccess}
									</div>
								)}

								<div
									className={`rounded-xl border overflow-hidden ${
										"bg-white border-slate-200 dark:bg-slate-900/60 dark:border-white/[0.04]"
									}`}>
									<table className="w-full text-left">
										<thead>
											<tr className={"bg-slate-50 dark:bg-white/5"}>
												<th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Account No.</th>
												<th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</th>
												<th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
													Privileged Role
												</th>
												<th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
													Actions
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-white/[0.04]">
											{usersLoading ? (
												<tr>
													<td colSpan={4} className="px-6 py-12 text-center text-slate-500">
														<div className="flex flex-col items-center gap-3">
															<RefreshCw className="h-6 w-6 animate-spin" />
															<span>Synchronizing account records...</span>
														</div>
													</td>
												</tr>
											) : users.length === 0 ? (
												<tr>
													<td colSpan={5} className="px-6 py-12 text-center text-slate-500">
														No authorized personnel accounts found
													</td>
												</tr>
											) : (
												users.map((user) => (
													<tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
														<td className="px-6 py-4 text-slate-500 text-sm font-mono">{user.accountNumber}</td>
														<td className="px-6 py-4 font-medium">{user.fullName}</td>
														<td className="px-6 py-4">
															<div className="flex flex-wrap gap-1">
																{user.permissions.map((p, idx) => (
																	<span
																		key={idx}
																		className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tight ${
																			p.name.includes("admin")
																				? theme === 'dark' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-amber-50 text-amber-600 border border-amber-200"
																				: theme === 'dark' ? "bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20" : "bg-sky-50 text-[#0284C7] border border-sky-200"
																		}`}>
																		{p.name.replace("privileged_", "").replace("_view", "").replace(/_/g, " ")}
																	</span>
																))}
																{user.permissions.length === 0 && (
																	<span className="text-[10px] text-slate-600 italic">No Roles</span>
																)}
															</div>
														</td>
														<td className="px-6 py-4 text-right">
															<div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
																<button
																	onClick={() => openEditModal(user)}
																	className="p-2 hover:bg-[#0EA5E9]/10 rounded-lg text-slate-400 hover:text-[#0EA5E9] transition-all">
																	<Edit className="h-4 w-4" />
																</button>
																<button
																	onClick={() => handleDeleteUser(user.id)}
																	className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500 transition-all">
																	<Trash2 className="h-4 w-4" />
																</button>
															</div>
														</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					) : activeTab === "upload-logs" ? (
						<>
							{logsLoading ? (
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 animate-pulse">
									{[1, 2, 3].map((i) => (
										<div
											key={i}
											className={`p-6 rounded-xl border ${"bg-white border-slate-200 dark:bg-slate-900/50 dark:border-slate-800"}`}>
											<div className="flex items-center gap-4">
												<div className={`w-12 h-12 rounded-lg ${"bg-slate-300 dark:bg-white/10"}`}></div>
												<div className="flex-1">
													<div
														className={`h-8 w-16 rounded mb-2 ${"bg-slate-300 dark:bg-white/10"}`}></div>
													<div className={`h-4 w-24 rounded ${"bg-slate-300 dark:bg-white/10"}`}></div>
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
									<div
										className={`p-6 rounded-xl border ${"bg-white border-slate-200 dark:bg-slate-900/50 dark:border-slate-800"}`}>
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
												<FileSpreadsheet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
											</div>
											<div>
												<div className="text-2xl font-bold text-slate-900 dark:text-white">{totalLogs}</div>
												<div className="text-sm text-slate-500 dark:text-slate-400">Total Uploads</div>
											</div>
										</div>
									</div>
									<div
										className={`p-6 rounded-xl border ${"bg-white border-slate-200 dark:bg-slate-900/50 dark:border-slate-800"}`}>
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
												<CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
											</div>
											<div>
												<div className="text-2xl font-bold text-slate-900 dark:text-white">
													{logs.filter((l) => l.status === "success").length}
												</div>
												<div className="text-sm text-slate-500 dark:text-slate-400">Successful</div>
											</div>
										</div>
									</div>
									<div
										className={`p-6 rounded-xl border ${"bg-white border-slate-200 dark:bg-slate-900/50 dark:border-slate-800"}`}>
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
												<Download className="h-6 w-6 text-purple-600 dark:text-purple-400" />
											</div>
											<div>
												<div className="text-2xl font-bold text-slate-900 dark:text-white">
													{logs.reduce((sum, log) => sum + log.recordsImported, 0).toLocaleString()}
												</div>
												<div className="text-sm text-slate-500 dark:text-slate-400">Total Records</div>
											</div>
										</div>
									</div>
								</div>
							)}

							<div
								className={`rounded-xl border overflow-hidden ${"bg-white border-slate-200 dark:bg-slate-900/50 dark:border-slate-800"}`}>
								<div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
									<h2 className="text-lg font-semibold text-slate-900 dark:text-white">Upload History</h2>
									<button
										onClick={loadLogs}
										className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-lg text-sm text-slate-400 hover:text-white transition-colors">
										<RefreshCw className="h-4 w-4" /> Refresh
									</button>
								</div>
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead className={"bg-slate-50 dark:bg-slate-800/50"}>
											<tr>
												<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
													File Name
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
													Size
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
													Records
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
													Status
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
													Uploaded At
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-slate-200 dark:divide-slate-800">
											{logs.map((log) => (
												<tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
													<td className="px-6 py-4">
														<div className="flex items-center gap-3">
															{getStatusIcon(log.status)}
															<div>
																<div className="font-medium text-slate-900 dark:text-white">{log.fileName}</div>
																{log.errorMessage && (
																	<div className="text-xs text-red-600 dark:text-red-400 mt-1">
																		{log.errorMessage}
																	</div>
																)}
															</div>
														</div>
													</td>
													<td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
														{formatFileSize(log.fileSize)}
													</td>
													<td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
														{log.recordsImported.toLocaleString()}
													</td>
													<td className="px-6 py-4">
														<span
															className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(log.status)}`}>
															{log.status}
														</span>
													</td>
													<td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
														{formatDate(log.uploadedAt)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</>
					) : (
						<div className="flex flex-col gap-6 max-w-6xl mx-auto h-full">
							<div
								className={`rounded-2xl border p-8 ${
									"bg-white border-slate-200 shadow-sm dark:bg-slate-900/40 dark:border-white/[0.04]"
								}`}>
								<div className="flex justify-between items-start mb-8">
									<div className="space-y-1">
										<h2 className="text-2xl font-bold tracking-tight">System Preferences</h2>
										<p className="text-slate-500 dark:text-slate-400 text-sm">
											Manage visual appearance and other system-wide configurations.
										</p>
									</div>
								</div>

								<div className="flex flex-col gap-6">
									<div
										className={`p-6 rounded-2xl border flex items-center justify-between transition-colors ${
											"bg-slate-50 border-slate-200 dark:bg-slate-900/60 dark:border-white/[0.04]"
										}`}>
										<div className="flex items-center gap-4">
											<div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center">
												{theme === "light" ? (
													<Sun className="h-5 w-5 text-[#0EA5E9]" />
												) : (
													<Moon className="h-5 w-5 text-[#0EA5E9]" />
												)}
											</div>
											<div>
												<h4
													className={`text-sm font-bold uppercase tracking-widest transition-colors ${"text-slate-900 dark:text-white"}`}>
													Interface Theme
												</h4>
												<p className="text-sm text-slate-500 mt-0.5">
													Switch between high-contrast light and stealth-mode dark.
												</p>
											</div>
										</div>

										<div
											className={`flex p-1 rounded-xl border transition-colors ${
												"bg-slate-200/50 border-slate-200 dark:bg-slate-900/50 dark:border-white/5"
											}`}>
											<button
												onClick={() => setTheme("light")}
												className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${
													theme === "light" ? "bg-[#0EA5E9] text-white shadow-lg" : "text-slate-500 hover:text-slate-500"
												}`}>
												<Sun className="h-3 w-3" /> Light
											</button>
											<button
												onClick={() => setTheme("dark")}
												className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${
													"text-slate-500 hover:text-slate-400 dark:bg-[#0EA5E9] dark:text-white dark:shadow-lg"
												}`}>
												<Moon className="h-3 w-3" /> Dark
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</main>

			{/* Modals */}
			{(showCreateModal || showEditModal) && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
					<div
						className={`w-full max-w-md rounded-3xl border p-8 ${"bg-white border-slate-200 shadow-xl dark:bg-slate-900 dark:border-white/10 dark:shadow-2xl"}`}>
						<div className="flex items-center gap-3 mb-6">
							<div className="w-10 h-10 rounded-2xl bg-[#0EA5E9]/10 flex items-center justify-center">
								{showCreateModal ? <UserPlus className="h-5 w-5 text-[#0EA5E9]" /> : <Edit className="h-5 w-5 text-[#0EA5E9]" />}
							</div>
							<h2 className="text-xl font-bold">{showCreateModal ? "Authorize Officer" : "Update Privileged Access"}</h2>
						</div>

						<form onSubmit={showCreateModal ? handleCreateUser : handleUpdateUser} className="space-y-4">
							<div className="space-y-1.5">
								<Label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Identifier</Label>
								<Input
									className="h-11 bg-transparent border-white/10 focus:border-[#0EA5E9] transition-all"
									placeholder="e.g. jdoe"
									value={formData.identifier}
									onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
									required
								/>
							</div>

							<div className="space-y-1.5">
								<Label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Full Name</Label>
								<Input
									className="h-11 bg-transparent border-white/10 focus:border-[#0EA5E9] transition-all"
									placeholder="Officer Full Name"
									value={formData.fullName}
									onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
									required
								/>
							</div>

							<div className="space-y-1.5">
								<Label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Secure Password</Label>
								<Input
									type="password"
									className="h-11 bg-transparent border-white/10 focus:border-[#0EA5E9] transition-all"
									placeholder={showEditModal ? "Leave empty to keep current" : "Minimum 8 characters"}
									value={formData.password}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									required={showCreateModal}
								/>
							</div>

							<div className="space-y-4">
								<div className="space-y-1.5">
									<Label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">System Role Type</Label>
									<div className="flex p-1 bg-slate-950/50 rounded-xl border border-white/5">
										<button
											type="button"
											onClick={() => {
												const adminPerm = availablePermissions.find((p) => p.permissionName === "admin_operational_officer");
												if (adminPerm) setFormData((prev) => ({ ...prev, permissionIds: [adminPerm.id] }));
											}}
											className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
												formData.permissionIds.length === 1 &&
												availablePermissions.find((p) => p.id === formData.permissionIds[0])?.permissionName ===
													"admin_operational_officer"
													? "bg-[#0EA5E9] text-white shadow-lg"
													: "text-slate-500 hover:text-slate-300"
											}`}>
											Admin Officer
										</button>
										<button
											type="button"
											onClick={() => {
												// Switch to privileged - clear and let user select
												setFormData((prev) => ({ ...prev, permissionIds: [] }));
											}}
											className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
												formData.permissionIds.length === 0 ||
												availablePermissions.filter(
													(p) => formData.permissionIds.includes(p.id) && p.permissionName.startsWith("privileged_"),
												).length > 0
													? "bg-[#0EA5E9] text-white shadow-lg"
													: "text-slate-500 hover:text-slate-300"
											}`}>
											Privileged User
										</button>
									</div>
								</div>

								{(formData.permissionIds.length === 0 ||
									availablePermissions.some(
										(p) => formData.permissionIds.includes(p.id) && p.permissionName.startsWith("privileged_"),
									)) && (
									<div className="space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
										<Label className="text-[10px] uppercase tracking-widest text-[#0EA5E9] font-black">
											Authorized Module Access
										</Label>
										<div className="grid grid-cols-1 gap-2">
											{availablePermissions
												.filter((p) => p.permissionName.startsWith("privileged_"))
												.map((p) => {
													const isSelected = formData.permissionIds.includes(p.id);
													return (
														<button
															key={p.id}
															type="button"
															onClick={() => {
																setFormData((prev) => ({
																	...prev,
																	permissionIds: isSelected
																		? prev.permissionIds.filter((id) => id !== p.id)
																		: [
																				...prev.permissionIds.filter((id) => {
																					const perm = availablePermissions.find((ap) => ap.id === id);
																					return (
																						perm && perm.permissionName !== "admin_operational_officer"
																					);
																				}),
																				p.id,
																			],
																}));
															}}
															className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
																isSelected
																	? "bg-[#0EA5E9]/10 border-[#0EA5E9]/30 text-white"
																	: "bg-transparent border-white/5 text-slate-500 hover:border-white/10"
															}`}>
															<div className="flex flex-col">
																<span
																	className={`text-[11px] font-bold uppercase tracking-tight ${isSelected ? "text-[#0EA5E9]" : "text-slate-400"}`}>
																	{p.permissionName
																		.replace("privileged_", "")
																		.replace("_view", "")
																		.replace(/_/g, " ")}
																</span>
																<span className="text-[10px] opacity-60 leading-tight mt-0.5">{p.description}</span>
															</div>
															<div
																className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
																	isSelected ? "bg-[#0EA5E9] border-[#0EA5E9]" : "border-slate-700"
																}`}>
																{isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
															</div>
														</button>
													);
												})}
										</div>
									</div>
								)}
							</div>

							<div className="flex gap-3 pt-6">
								<button
									type="submit"
									className="flex-1 py-3 bg-[#0EA5E9] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#0EA5E9]/90 transition-all shadow-lg shadow-blue-500/20">
									{showCreateModal ? "Authorize Account" : "Apply Changes"}
								</button>
								<button
									type="button"
									onClick={() => {
										setShowCreateModal(false);
										setShowEditModal(false);
										setSelectedUser(null);
									}}
									className="px-6 py-3 rounded-2xl font-bold text-slate-500 hover:text-white transition-all uppercase text-xs tracking-widest">
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
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
