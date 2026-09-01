"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Upload, Menu, X, BookOpen, Settings } from "lucide-react";
import { useMapContext } from "@/context/MapContext";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import UploadModal from "./upload-modal";
import UserMenu from "./user-menu";
import NotificationBell from "@/components/notifications/notification-bell";

interface MapHeaderProps {
  isVisible: boolean;
}

const navItems = [
  { id: "map", label: "Map", href: "/", permission: "privileged_map_view" },
  { id: "overview", label: "Overview", path: "/dashboard/overview", permission: "privileged_map_view" },
  { id: "incidents", label: "Cases", path: "/dashboard/cases", permission: "privileged_cases_view" },
  { id: "analytics", label: "Analytics", path: "/dashboard/analytics", permission: "privileged_analytics_view" },
  { id: "reports", label: "Reports", path: "/dashboard/reports", permission: "privileged_analytics_view" },
];

export default function MapHeader({ isVisible }: MapHeaderProps) {
  const { user } = useAuth();
  const { selectedBarangay, setSelectedBarangay } = useMapContext();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync selectedBarangay from URL ?name= param on dashboard pages
  useEffect(() => {
    if (pathname.startsWith("/dashboard")) {
      const nameParam = searchParams.get("name");
      if (nameParam && nameParam !== selectedBarangay) {
        setSelectedBarangay(nameParam);
      } else if (!nameParam && selectedBarangay) {
        // On general dashboard, clear selection
        setSelectedBarangay(null);
      }
    }
  }, [pathname, searchParams, selectedBarangay, setSelectedBarangay]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const buildDashboardUrl = (path: string) => {
    const params = new URLSearchParams();
    // Only add barangay name if one is selected, otherwise show general dashboard
    if (selectedBarangay && selectedBarangay !== "General Dashboard") {
      params.set("name", selectedBarangay);
    }
    const qs = params.toString();
    return `${path}${qs ? `?${qs}` : ""}`;
  };

  // Determine if a nav item is active
  const isNavItemActive = (item: typeof navItems[0]) => {
    if (item.id === "map") {
      return pathname === "/map";
    }
    // For dashboard pages, check if pathname matches
    return pathname === item.path;
  };

  // Filter navigation items based on user permissions
  const filteredNavItems = navItems.filter((item) => {
    if (!user) return false;
    // Admin has access to everything
    if (user.permissions.includes("admin_operational_officer") || user.permissions.includes("admin")) {
      return true;
    }
    // Check specific module permission
    return user.permissions.includes(item.permission);
  });

  return (
    <header 
      className={`w-full backdrop-blur-xl border-b pointer-events-auto z-50 transition-all duration-500 ease-in-out bg-white/80 border-slate-200 dark:bg-[#0F172A]/80 dark:border-white/[0.06] ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex items-center h-16 px-4 sm:px-6 lg:px-8">
        {/* ── Logo + Brand ── */}
        <Link
          href="/"
          data-tour="brand"
          className="flex items-center gap-2 sm:gap-2.5 no-underline shrink-0 group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center relative">
            <Image
              src="/SC LOGO W 1.png"
              alt="SECURE Tanza Logo"
              width={34}
              height={34}
              className="hidden dark:block object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-200"
              priority
            />
            <Image
              src="/SC LOGO 2.png"
              alt="SECURE Tanza Logo"
              width={34}
              height={34}
              className="block dark:hidden object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-200"
              priority
            />
          </div>
          <span
            className="text-[15px] sm:text-[17px] font-bold tracking-tight leading-none whitespace-nowrap text-slate-900 dark:text-white/90"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Secure Tanza
          </span>
        </Link>

        {/* Desktop Navigation - Hidden on mobile */}
        <nav data-tour="main-nav" className="hidden lg:flex items-center gap-1 h-full absolute left-1/2 -translate-x-1/2">
          {filteredNavItems.map((item) => {
            const isActive = isNavItemActive(item);
            const href = item.id === "map" ? "/map" : buildDashboardUrl(item.path!);

            return (
              <Link
                key={item.id}
                href={href}
                className={`relative flex items-center h-full px-4 xl:px-5 text-[14px] xl:text-[15px] font-medium tracking-wide no-underline transition-colors duration-200 ${
                  isActive
                    ? "text-[#4e86fd] dark:text-[#0EA5E9]"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {item.label}
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[#4e86fd] dark:bg-[#0EA5E9]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {/* Upload Button - Admin Only */}
          {user && (user.permissions.includes("admin_operational_officer") || user.permissions.includes("admin")) && (
            <button
              onClick={() => setShowUploadModal(true)}
              data-tour="upload-data"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center border transition-all duration-200 cursor-pointer bg-[#4e86fd]/10 border-[#4e86fd]/20 text-[#4e86fd] hover:bg-[#4e86fd]/20 hover:border-[#4e86fd]/30 dark:bg-[#0EA5E9]/10 dark:border-[#0EA5E9]/20 dark:text-[#0EA5E9] dark:hover:bg-[#0EA5E9]/20 dark:hover:border-[#0EA5E9]/30"
              title="Upload Data"
            >
              <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          )}

          {/* Notification Bell */}
          <NotificationBell />

          {/* User Menu */}
          <UserMenu />

          {/* Mobile Menu Button - Only on mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.06]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t backdrop-blur-xl border-slate-200 bg-white/95 dark:border-white/[0.06] dark:bg-[#0F172A]/95">
          <nav className="px-4 py-3 space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = isNavItemActive(item);
              const href = item.id === "map" ? "/map" : buildDashboardUrl(item.path!);

              return (
                <Link
                  key={item.id}
                  href={href}
                  className={`block px-4 py-3 rounded-lg text-[15px] font-medium tracking-wide no-underline transition-colors duration-200 ${
                    isActive
                      ? "text-[#4e86fd] bg-[#4e86fd]/10 dark:text-[#0EA5E9] dark:bg-[#0EA5E9]/10"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.06]"
                  }`}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {item.label}
                </Link>
              );
            })}
            
            {/* Mobile-only menu items - Removed as they are now in UserMenu */}
          </nav>
        </div>
      )}

      {/* Upload Modal */}
      <UploadModal open={showUploadModal} onOpenChange={setShowUploadModal} />
    </header>
  );
}
