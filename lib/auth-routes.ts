/**
 * Client-safe authorization route resolver and permission checks.
 * Does not import any server-side dependencies (such as next/headers, prisma, etc.).
 */

export interface MinimalUserAuth {
  permissions?: string[];
  defaultLandingPage?: string | null;
}

/**
 * Check if the given permissions list includes any admin-level access.
 */
export function isAdminUser(permissions?: string[] | null): boolean {
  if (!permissions) return false;
  return (
    permissions.includes("admin_operational_officer") ||
    permissions.includes("admin") ||
    permissions.includes("operational_officer")
  );
}

/**
 * Check if the user is authorized to view interactive map features (Map, Compare, Overview).
 */
export function hasMapAccess(permissions?: string[] | null): boolean {
  if (!permissions) return false;
  return isAdminUser(permissions) || permissions.includes("privileged_map_view");
}

/**
 * Check if the user is authorized to view cases and incidents.
 */
export function hasCasesAccess(permissions?: string[] | null): boolean {
  if (!permissions) return false;
  return isAdminUser(permissions) || permissions.includes("privileged_cases_view");
}

/**
 * Check if the user is authorized to view analytics dashboards and reports.
 */
export function hasAnalyticsAccess(permissions?: string[] | null): boolean {
  if (!permissions) return false;
  return isAdminUser(permissions) || permissions.includes("privileged_analytics_view");
}

/**
 * Determines the best valid landing route for a user based on their granted permissions
 * and saved/stored preferences.
 * 
 * If a preference is set and the user holds permission for it, the preference is respected.
 * Otherwise, falls back to the user's primary permitted module in priority order:
 * 1. Map / Overview (if map access granted)
 * 2. Cases (if cases access granted)
 * 3. Analytics (if analytics access granted)
 * 4. Account Preferences (if no dashboard access granted)
 */
export function getDefaultRouteForUser(
  user: MinimalUserAuth | null | undefined,
  fallbackPref?: string | null
): string {
  if (!user || !user.permissions || user.permissions.length === 0) {
    return "/login";
  }

  const permissions = user.permissions;
  const canMap = hasMapAccess(permissions);
  const canCases = hasCasesAccess(permissions);
  const canAnalytics = hasAnalyticsAccess(permissions);

  const rawPref =
    user.defaultLandingPage ||
    fallbackPref ||
    (typeof window !== "undefined" ? localStorage.getItem("landingPage") : null);

  const pref = rawPref === "dashboard" ? "overview" : rawPref;

  // 1. Explicit preference check with permission verification:
  if (pref === "map" && canMap) return "/";
  if (pref === "overview" && canMap) return "/dashboard/overview";
  if (pref === "analytics" && canAnalytics) return "/dashboard/analytics";
  if (pref === "cases" && canCases) return "/dashboard/cases";

  // 2. Permission-based fallback hierarchy:
  if (canMap) return "/dashboard/overview";
  if (canCases) return "/dashboard/cases";
  if (canAnalytics) return "/dashboard/analytics";

  // 3. Fallback for authenticated users with restricted clearances:
  return "/dashboard/config/preferences";
}
