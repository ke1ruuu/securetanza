import { LucideIcon } from "lucide-react";
import React from "react";

export interface DocsSectionItem {
  id: string;
  title: string;
  icon: LucideIcon;
  badge?: string;
  tags?: string[];
  component: React.ComponentType<{ onReplayTour?: () => void }>;
}
