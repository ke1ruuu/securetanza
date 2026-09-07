import { LucideIcon } from "lucide-react";
import React from "react";

export interface DocsSubSectionItem {
  id: string;
  title: string;
  tags?: string[];
}

export interface DocsSectionItem {
  id: string;
  title: string;
  icon: LucideIcon;
  badge?: string;
  tags?: string[];
  subsections?: DocsSubSectionItem[];
  component: React.ComponentType<{ onReplayTour?: () => void }>;
}

export interface DocsCategoryItem {
  id: string;
  title: string;
  icon?: LucideIcon;
  description?: string;
  sectionIds: string[];
}
