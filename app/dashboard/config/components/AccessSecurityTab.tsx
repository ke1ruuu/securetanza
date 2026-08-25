"use client";

import React, { useEffect, useState } from "react";
import { UserPlus, AlertCircle, CheckCircle2, Edit, Trash2, RefreshCw } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

export default function AccessSecurityTab() {
	const { theme } = useTheme();

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
		identifier?: string;
		fullName: string;
		password?: string;
		permissionIds: number[];
	}>({
		fullName: "",
		password: "",
		permissionIds: [],
	});

	const fetchUsers = async () => {
		setUsersLoading(true);
		try {
			const response = await fetch("/api/users");
			const data = await response.json();
			if (data.success) {
				setUsers(data.data);
			} else setMgmtError(data.error || "Failed to fetch users");
		} catch {
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
		fetchUsers();
		fetchPermissions();
	}, []);

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
		} catch {
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
		} catch {
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
		} catch {
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

	return (
		<div className="flex flex-col items-center w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="w-full max-w-4xl flex flex-col gap-8 pb-12">
				{/* Header */}
				<div className="flex justify-between items-end pb-4">
					<div className="space-y-1">
						<h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
							Access & Security
						</h2>
					</div>
				</div>

				<div className="space-y-12">
					<div className="space-y-4">
						<div className="flex justify-between items-end">
							<div className="space-y-1">
								<h3 className="text-lg font-bold text-slate-900 dark:text-white">Privileged Personnel</h3>
								<p className="text-sm text-slate-500 dark:text-slate-400">
									Manage administrative access for system officers.
								</p>
							</div>
							<Button
								onClick={() => {
									setFormData({
										identifier: "",
										fullName: "",
										password: "",
										permissionIds: [],
									});
									setShowCreateModal(true);
								}}
								className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 gap-2">
								<UserPlus className="h-4 w-4" />
								Authorize New Officer
							</Button>
						</div>
						
						{mgmtError && (
							<div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
								<AlertCircle className="h-5 w-5" /> {mgmtError}
							</div>
						)}
						{mgmtSuccess && (
							<div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-3">
								<CheckCircle2 className="h-5 w-5" /> {mgmtSuccess}
							</div>
						)}

						{/* The Card */}
						<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
							<table className="w-full text-left">
								<thead>
									<tr className="bg-slate-50 dark:bg-slate-950/50">
										<th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/5">Account No.</th>
										<th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/5">Full Name</th>
										<th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/5">Privileged Role</th>
										<th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/5">Actions</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100 dark:divide-white/5">
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
											<td colSpan={4} className="px-6 py-12 text-center text-slate-500">
												No authorized personnel accounts found
											</td>
										</tr>
									) : (
										users.map((user) => (
											<tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
												<td className="px-6 py-4 text-slate-500 text-sm font-mono">{user.accountNumber}</td>
												<td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{user.fullName}</td>
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
			</div>

			{/* Modals for Create/Edit */}
			{(showCreateModal || showEditModal) && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
					<div className="w-full max-w-md rounded-2xl border p-8 bg-white border-slate-200 shadow-xl dark:bg-slate-900 dark:border-white/10 dark:shadow-2xl">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center">
								{showCreateModal ? <UserPlus className="h-5 w-5 text-slate-900 dark:text-white" /> : <Edit className="h-5 w-5 text-slate-900 dark:text-white" />}
							</div>
							<h2 className="text-xl font-bold text-slate-900 dark:text-white">{showCreateModal ? "Authorize Officer" : "Update Privileged Access"}</h2>
						</div>

						<form onSubmit={showCreateModal ? handleCreateUser : handleUpdateUser} className="space-y-4">
							<div className="space-y-1.5">
								<Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Identifier</Label>
								<Input
									className="h-11 bg-transparent border-slate-200 dark:border-white/10 focus:border-slate-900 dark:focus:border-white transition-all"
									placeholder="e.g. jdoe"
									value={formData.identifier || ""}
									onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
									required={showCreateModal}
								/>
							</div>

							<div className="space-y-1.5">
								<Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</Label>
								<Input
									className="h-11 bg-transparent border-slate-200 dark:border-white/10 focus:border-slate-900 dark:focus:border-white transition-all"
									placeholder="Officer Full Name"
									value={formData.fullName}
									onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
									required
								/>
							</div>

							<div className="space-y-1.5">
								<Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Secure Password</Label>
								<Input
									type="password"
									className="h-11 bg-transparent border-slate-200 dark:border-white/10 focus:border-slate-900 dark:focus:border-white transition-all"
									placeholder={showEditModal ? "Leave empty to keep current" : "Minimum 8 characters"}
									value={formData.password}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									required={showCreateModal}
								/>
							</div>

							<div className="space-y-2.5">
								<Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Authorized Role Types</Label>
								<div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
									{availablePermissions.map((p) => {
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
															: [...prev.permissionIds, p.id],
													}));
												}}
												className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
													isSelected
														? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900"
														: "bg-transparent border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-white/20"
												}`}>
												<div className="flex flex-col">
													<span className={`text-[11px] font-bold uppercase tracking-tight ${isSelected ? "text-white dark:text-slate-900" : "text-slate-600 dark:text-slate-400"}`}>
														{p.permissionName.replace(/_/g, " ")}
													</span>
												</div>
												<div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
														isSelected ? "bg-white border-white dark:bg-slate-900 dark:border-slate-900" : "border-slate-300 dark:border-slate-600"
													}`}>
													{isSelected && <CheckCircle2 className="w-3 h-3 text-slate-900 dark:text-white" />}
												</div>
											</button>
										);
									})}
								</div>
							</div>

							<div className="flex gap-3 pt-6">
								<Button
									type="submit"
									className="flex-1 h-11 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-xl font-semibold">
									{showCreateModal ? "Authorize Account" : "Apply Changes"}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										setShowCreateModal(false);
										setShowEditModal(false);
										setSelectedUser(null);
									}}
									className="px-6 h-11 rounded-xl font-semibold">
									Cancel
								</Button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
