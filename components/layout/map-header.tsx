"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Settings, User, Upload } from "lucide-react";
import { useMapContext } from "@/context/MapContext";
import { usePathname, useSearchParams } from "next/navigation";
import UploadModal from "./upload-modal";
import YearSelector from "./year-selector";

interface MapHeaderProps {
  isVisible: boolean;
}

const navItems = [
  { id: "map", label: "Map", href: "/" },
  { id: "overview", label: "Overview", path: "/dashboard/overview" },
  { id: "incidents", label: "Cases", path: "/dashboard/cases" },
  { id: "analytics", label: "Analytics", path: "/dashboard/analytics" },
  { id: "reports", label: "Reports", path: "/dashboard/reports" },
  { id: "upload-logs", label: "Upload Logs", path: "/dashboard/upload-logs" },
];

export default function MapHeader({ isVisible }: MapHeaderProps) {
  const { selectedBarangay, setSelectedBarangay } = useMapContext();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showUploadModal, setShowUploadModal] = useState(false);

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
      return pathname === "/";
    }
    // For dashboard pages, check if pathname matches
    return pathname === item.path;
  };

  return (
    <header 
      className={`w-full bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/[0.06] pointer-events-auto z-50 transition-transform duration-500 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex items-center h-16 px-8">
        {/* ── Logo + Brand ── */}
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline shrink-0 mr-10 group"
        >
          <div className="w-9 h-9 flex items-center justify-center">
            <Image
              src="/SC LOGO W 1.png"
              alt="SECURE Tanza Logo"
              width={34}
              height={34}
              className="object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-200"
              priority
            />
          </div>
          <span
            className="text-[17px] font-bold text-white/90 tracking-tight leading-none whitespace-nowrap"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Secure Tanza
          </span>
        </Link>

        {/* ── Navigation Links ── */}
        <nav className="flex items-center gap-1 h-full">
          {navItems.map((item) => {
            const isActive = isNavItemActive(item);
            const href = item.id === "map" ? "/" : buildDashboardUrl(item.path!);

            return (
              <Link
                key={item.id}
                href={href}
                className={`relative flex items-center h-full px-5 text-[15px] font-medium tracking-wide no-underline transition-colors duration-200 ${
                  isActive
                    ? "text-[#0EA5E9]"
                    : "text-slate-400 hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {item.label}
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#0EA5E9] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Right Actions ── */}
        <div className="ml-auto flex items-center gap-2">
          <YearSelector />
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 text-[#0EA5E9] hover:bg-[#0EA5E9]/20 hover:border-[#0EA5E9]/30 transition-all duration-200 cursor-pointer"
            title="Upload Data"
          >
            <Upload className="h-4 w-4" />
            <span className="text-sm font-semibold">Upload Data</span>
          </button>
          <Link
            href={buildDashboardUrl("/dashboard/config")}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all duration-200 no-underline"
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>
          <button
            className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all duration-200 cursor-pointer"
            title="Profile"
          >
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal open={showUploadModal} onOpenChange={setShowUploadModal} />
    </header>
  );
}
