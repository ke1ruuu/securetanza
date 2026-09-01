"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { UserPlus, AlertCircle, CheckCircle2, Edit, Trash2, RefreshCw, Copy, X, Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
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
	const { user: currentUser } = useAuth();

	// User management state
	const [users, setUsers] = useState<User[]>([]);
	const [availablePermissions, setAvailablePermissions] = useState<AvailablePermission[]>([]);
	const [usersLoading, setUsersLoading] = useState(true);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [mgmtError, setMgmtError] = useState("");
	const [mgmtSuccess, setMgmtSuccess] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isCopied, setIsCopied] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [newAccount, setNewAccount] = useState<{fullName: string, accountNumber: string, tempPassword?: string} | null>(null);
	
	const [userToDelete, setUserToDelete] = useState<User | null>(null);
	const [deleteConfirmation, setDeleteConfirmation] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);
	
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const [formData, setFormData] = useState<{
		fullName: string;
		permissionIds: number[];
	}>({
		fullName: "",
		permissionIds: [],
	});

	const fetchUsers = async () => {
		setUsersLoading(true);
		try {
			const response = await fetch("/api/users");
			if (!response.ok) {
				setMgmtError("Failed to fetch users (unauthorized or network error)");
				return;
			}
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
			if (!response.ok) return;
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
		if (isSubmitting) return;
		
		setMgmtError("");
		setMgmtSuccess("");

		if (formData.permissionIds.length === 0) {
			setMgmtError("At least one permission role must be assigned.");
			return;
		}

		setIsSubmitting(true);
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
				setFormData({ fullName: "", permissionIds: [] });
				fetchUsers();
				setNewAccount(data.data);
			} else setMgmtError(data.error || "Failed to authorize user");
		} catch {
			setMgmtError("Failed to authorize user");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleUpdateUser = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedUser || isSubmitting) return;
		setMgmtError("");
		setMgmtSuccess("");

		if (formData.permissionIds.length === 0) {
			setMgmtError("At least one permission role must be assigned.");
			return;
		}

		setIsSubmitting(true);
		try {
			const response = await fetch(`/api/users/${selectedUser.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			if (!response.ok) {
				const errorText = await response.text();
				try {
					const errorJson = JSON.parse(errorText);
					setMgmtError(errorJson.error || "Failed to update access");
				} catch {
					setMgmtError("Failed to update access");
				}
				return;
			}
			const data = await response.json();
			if (data.success) {
				setMgmtSuccess("Privileged access levels updated");
				setShowEditModal(false);
				setSelectedUser(null);
				fetchUsers();
			} else setMgmtError(data.error || "Failed to update access");
		} catch {
			setMgmtError("Failed to update access");
		} finally {
			setIsSubmitting(false);
		}
	};

	const executeDelete = async (userId: number) => {
		setIsDeleting(true);
		setMgmtError("");
		setMgmtSuccess("");
		try {
			const response = await fetch(`/api/users/${userId}`, { method: "DELETE" });
			if (!response.ok) {
				const errorText = await response.text();
				try {
					const errorJson = JSON.parse(errorText);
					setMgmtError(errorJson.error || "Failed to revoke access");
				} catch {
					setMgmtError("Failed to revoke access");
				}
				return;
			}
			const data = await response.json();
			if (data.success) {
				setMgmtSuccess("Access revoked successfully");
				setUserToDelete(null);
				setDeleteConfirmation("");
				fetchUsers();
			} else setMgmtError(data.error || "Failed to revoke access");
		} catch {
			setMgmtError("Failed to revoke access");
		} finally {
			setIsDeleting(false);
		}
	};

	const openEditModal = (user: User) => {
		setSelectedUser(user);
		setFormData({
			fullName: user.fullName,
			permissionIds: user.permissions.map((p) => p.id),
		});
		setShowEditModal(true);
	};

	const totalPages = Math.ceil(users.length / itemsPerPage);
	const validCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
	const paginatedUsers = users.slice((validCurrentPage - 1) * itemsPerPage, validCurrentPage * itemsPerPage);

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
										fullName: "",
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
										paginatedUsers.map((user) => (
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
													<div className="flex justify-end gap-1 transition-opacity">
														<button
															onClick={() => openEditModal(user)}
															disabled={user.id === currentUser?.id}
															title={user.id === currentUser?.id ? "Cannot modify your own access level" : "Edit access"}
															className={`p-2 rounded-lg transition-all ${user.id === currentUser?.id ? "text-slate-300 dark:text-slate-600 cursor-not-allowed" : "text-slate-400 hover:text-[#0EA5E9] hover:bg-[#0EA5E9]/10"}`}>
															<Edit className="h-4 w-4" />
														</button>
														<button
															onClick={() => setUserToDelete(user)}
															disabled={user.id === currentUser?.id}
															title={user.id === currentUser?.id ? "Cannot remove your own account" : "Remove access"}
															className={`p-2 rounded-lg transition-all ${user.id === currentUser?.id ? "text-slate-300 dark:text-slate-600 cursor-not-allowed" : "text-slate-400 hover:text-red-500 hover:bg-red-500/10"}`}>
															<Trash2 className="h-4 w-4" />
														</button>
													</div>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
							
							{users.length > 0 && (
								<div className="px-6 py-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
									<span className="text-xs font-medium text-slate-500 dark:text-slate-400">
										Showing {(validCurrentPage - 1) * itemsPerPage + 1} to {Math.min(validCurrentPage * itemsPerPage, users.length)} of {users.length} officers
									</span>
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
											disabled={validCurrentPage === 1}
											className="h-8 text-xs font-semibold px-4"
										>
											Previous
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
											disabled={validCurrentPage === totalPages}
											className="h-8 text-xs font-semibold px-4"
										>
											Next
										</Button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Modals for Create/Edit/Success */}
			{(showCreateModal || showEditModal || newAccount) && typeof document !== "undefined" && createPortal(
				<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
					{newAccount ? (
						<div className="w-full max-w-md rounded-2xl border p-8 bg-white border-slate-200 shadow-xl dark:bg-slate-900 dark:border-white/10 dark:shadow-2xl animate-in zoom-in-95 duration-200">
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
										<CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
									</div>
									<h2 className="text-xl font-bold text-slate-900 dark:text-white">Account Created</h2>
								</div>
								<button onClick={() => setNewAccount(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
									<X className="w-5 h-5" />
								</button>
							</div>

							<div className="space-y-4 mb-8 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-white/5">
								<div className="flex items-center gap-3">
									<span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 w-44 whitespace-nowrap">Full Name:</span>
									<span className="text-sm font-medium text-slate-900 dark:text-white">{newAccount.fullName}</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 w-44 whitespace-nowrap">Account Number:</span>
									<span className="text-sm font-medium text-blue-600 dark:text-blue-400">{newAccount.accountNumber}</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 w-44 whitespace-nowrap">Temporary Password:</span>
									<div className="flex items-center gap-2">
										<span className="text-sm font-medium text-slate-900 dark:text-white min-w-[100px]">
											{showPassword ? newAccount.tempPassword : "••••••••••"}
										</span>
										<button 
											onClick={() => setShowPassword(!showPassword)}
											className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
										>
											{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
										</button>
									</div>
								</div>
								<p className="text-xs text-slate-500 dark:text-slate-400 italic pt-2 border-t border-slate-200 dark:border-white/10 mt-4">Please sign in and change your password.</p>
							</div>

							<Button
								onClick={() => {
									navigator.clipboard.writeText(`Secure Tanza Account Created\nFull Name: ${newAccount.fullName}\nAccount Number: ${newAccount.accountNumber}\nTemporary Password: ${newAccount.tempPassword}\n\nPlease sign in and change your password.`);
									setIsCopied(true);
								}}
								className={`w-full h-11 rounded-xl font-semibold gap-2 transition-all duration-300 ${isCopied ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"}`}>
								{isCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
								{isCopied ? "Credentials Copied!" : "Copy Credentials"}
							</Button>
						</div>
					) : (
						<div className="w-full max-w-xl rounded-2xl border p-8 bg-white border-slate-200 shadow-xl dark:bg-slate-900 dark:border-white/10 dark:shadow-2xl animate-in zoom-in-95 duration-200">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center">
									{showCreateModal ? <UserPlus className="h-5 w-5 text-slate-900 dark:text-white" /> : <Edit className="h-5 w-5 text-slate-900 dark:text-white" />}
								</div>
								<h2 className="text-xl font-bold text-slate-900 dark:text-white">{showCreateModal ? "Authorize Officer" : "Update Privileged Access"}</h2>
							</div>

							<form onSubmit={showCreateModal ? handleCreateUser : handleUpdateUser} className="space-y-4">
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

								<div className="space-y-2.5">
									<Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Access Control</Label>
									<div className="grid grid-cols-2 gap-2">
										{(() => {
											const isAdminSelected = availablePermissions.some(p => 
												(p.permissionName === 'admin' || p.permissionName === 'admin_operational_officer') && 
												formData.permissionIds.includes(p.id)
											);
											const isPrivilegeSelected = availablePermissions.some(p => 
												p.permissionName.startsWith('privileged_') && 
												formData.permissionIds.includes(p.id)
											);

											return availablePermissions.map((p) => {
												const isSelected = formData.permissionIds.includes(p.id);
												const isAdminRole = p.permissionName === 'admin' || p.permissionName === 'admin_operational_officer';
												const isPrivilegeRole = p.permissionName.startsWith('privileged_');

												return (
													<div key={p.id} className="relative group">
														<button
															type="button"
															onClick={() => {
																setFormData((prev) => {
																	if (isSelected) {
																		return { ...prev, permissionIds: prev.permissionIds.filter((id) => id !== p.id) };
																	}

																	let newIds = [...prev.permissionIds, p.id];
																	
																	if (isAdminRole) {
																		const privilegeIds = availablePermissions.filter(ap => ap.permissionName.startsWith('privileged_')).map(ap => ap.id);
																		newIds = newIds.filter(id => !privilegeIds.includes(id));
																	} else if (isPrivilegeRole) {
																		const adminIds = availablePermissions.filter(ap => ap.permissionName === 'admin' || ap.permissionName === 'admin_operational_officer').map(ap => ap.id);
																		newIds = newIds.filter(id => !adminIds.includes(id));
																	}

																	return { ...prev, permissionIds: newIds };
																});
															}}
															className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
																isSelected
																	? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900"
																	: "bg-transparent border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-white/20"
															}`}>
															<div className="flex flex-col gap-0.5">
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
														{p.description && (
															<div className="absolute left-1/2 -bottom-2 translate-y-full -translate-x-1/2 w-48 p-2.5 bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-[11px] rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[110] shadow-xl pointer-events-none text-center">
																<div className="absolute -top-1 left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-b-4 border-b-slate-800 dark:border-b-white"></div>
																{p.description}
															</div>
														)}
													</div>
												);
											});
										})()}
									</div>
								</div>

								<div className="flex gap-3 pt-6">
									<Button
										type="submit"
										disabled={isSubmitting}
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
					)}
				</div>,
				document.body
			)}

			{userToDelete && createPortal(
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
					<div className="bg-white dark:bg-slate-900 p-8 rounded-3xl max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden">
						{/* Background Decorative Element */}
						<div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
						
						<div className="flex items-center gap-3 mb-6">
							<div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
								<AlertCircle className="w-6 h-6 text-red-600 dark:text-red-500" />
							</div>
							<div>
								<h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Revoke Access</h3>
								<p className="text-sm font-medium text-red-600 dark:text-red-400">Critical Action</p>
							</div>
						</div>
						
						<p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
							This action is permanent and cannot be undone. All administrative privileges will be revoked immediately. 
							To confirm, please type <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md mx-1 tracking-tight">{userToDelete.accountNumber}</span> below.
						</p>
						
						<div className="space-y-4">
							<Input
								value={deleteConfirmation}
								onChange={(e) => setDeleteConfirmation(e.target.value)}
								placeholder={`Type ${userToDelete.accountNumber} to confirm`}
								className="h-12 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-white/10 focus:border-red-500 dark:focus:border-red-500 transition-all rounded-xl"
							/>
							
							<div className="flex gap-3">
								<Button 
									variant="outline" 
									onClick={() => { setUserToDelete(null); setDeleteConfirmation(""); }} 
									className="flex-1 h-12 rounded-xl font-semibold border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800"
								>
									Cancel
								</Button>
								<Button 
									variant="destructive" 
									disabled={deleteConfirmation !== userToDelete.accountNumber || isDeleting}
									onClick={() => executeDelete(userToDelete.id)}
									className="flex-1 h-12 font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all disabled:opacity-50"
								>
									{isDeleting ? (
										<div className="w-5 h-5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
									) : "Revoke Access"}
								</Button>
							</div>
						</div>
					</div>
				</div>,
				document.body
			)}
		</div>
	);
}
