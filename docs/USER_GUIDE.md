# SecureTanza User Guide & Operational Manual

**Enterprise Documentation for GIS Crime Mapping and Statistical Analytics**  
*Municipality of Tanza, Cavite, Philippines*

---

## Table of Contents

1. [Executive Summary & System Architecture](#1-executive-summary--system-architecture)
2. [Getting Started & System Access](#2-getting-started--system-access)
3. [Role-Based Access Control (RBAC) Matrix](#3-role-based-access-control-rbac-matrix)
4. [Interactive GIS Crime Map](#4-interactive-gis-crime-map)
5. [Interactive Map Comparison Tool](#5-interactive-map-comparison-tool)
6. [Executive Dashboard & Overview](#6-executive-dashboard--overview)
7. [Historical Crime Analytics & Intelligence](#7-historical-crime-analytics--intelligence)
8. [Crime Cases & Blotter Dossier Management](#8-crime-cases--blotter-dossier-management)
9. [Institutional PDF Report Generator](#9-institutional-pdf-report-generator)
10. [Analytical Alert & Notification Rules Engine](#10-analytical-alert--notification-rules-engine)
11. [System Settings, Security & Configuration](#11-system-settings-security--configuration)
12. [Batch Data Ingestion & Excel Schema](#12-batch-data-ingestion--excel-schema)
13. [Interactive Guided Onboarding Tour](#13-interactive-guided-onboarding-tour)
14. [Role-Based Operational Playbooks](#14-role-based-operational-playbooks)
15. [Diagnostics & Troubleshooting Matrix](#15-diagnostics--troubleshooting-matrix)
16. [Glossary of Terms](#16-glossary-of-terms)

---

## 1. Executive Summary & System Architecture

### 1.1 What is SecureTanza?

**SecureTanza** is a specialized Geographic Information System (GIS) and crime intelligence platform developed for the **Municipality of Tanza, Cavite**. Designed to modernize police blotter operations and municipal peace-and-order governance, SecureTanza replaces disjointed spreadsheet records with an integrated analytical hub.

### 1.2 Core Capabilities

- **Interactive GIS Crime Mapping:** Polygon boundary rendering of all 41 barangays, dynamic threat level coloration, coordinate pinpointing, and chronological animation scrubber.
- **Dual-Pane Map Comparison:** Synchronized side-by-side period comparisons, unified threat scaling, and automated net change ledger.
- **Executive KPI Monitoring:** Instant calculation of municipal crime volume, top offense categories, critical hotspot identification, and 12-month activity curves.
- **Tactical Spatial-Temporal Analytics:** 24-hour polar radar time patterns, modus operandi breakdown, location type categorizations, and full-spectrum monthly heatmap matrix.
- **Comprehensive Blotter Dossiers:** Incident tracking with Heinous/Sensational flags, Elected/Government Official (EGO) victim/suspect tags, investigator assignments, and legal status tracking.
- **Publication-Ready PDF Reports:** Institutional black-and-white reports with embedded vector chart captures and strategic recommendations for Peace and Order Councils.
- **Automated Intelligence Alerts:** Threshold-based rule engine detecting hourly volume spikes, barangay surges, and heinous crime events.
- **Role-Based Security & Accessibility:** Tiered clearances for Administrators, Operational Officers, and Privileged Users, coupled with immediate app-wide accessibility customization (reduced motion, high contrast, text scaling).

```
+-------------------------------------------------------------------------------+
|                             SecureTanza Platform                             |
+-------------------------------------------------------------------------------+
|  Presentation: Next.js 14 App Router, Tailwind CSS, Leaflet/Mapbox, Driver.js |
|  API Layer: Next.js API Routes (REST), Jose JWT Auth Middleware               |
|  Database: PostgreSQL via Prisma ORM (CrimeIncidents, Users, Notifications)  |
+-------------------------------------------------------------------------------+
```

---

## 2. Getting Started & System Access

### 2.1 System Requirements

- **Supported Web Browsers:** Google Chrome 90+, Mozilla Firefox 88+, Microsoft Edge 90+, Apple Safari 14+.
- **Display Resolution:** Optimized for desktop (1920x1080 / 1366x768), tablet (768x1024), and mobile viewport layouts.
- **Network Access:** Stable HTTPS connection to the SecureTanza server and OpenStreetMap / Carto tile services.

### 2.2 First-Time Access & Authentication

1. Open your browser and navigate to the application URL (e.g., `https://securetanza.local` or `http://localhost:3000`).
2. The public landing view presents the **Interactive GIS Crime Map**.
3. To access administrative, case dossier, or report export tools, click the **User Menu** (top-right) and select **Login** or navigate to `/login`.
4. Enter your designated **Account Number** and **Password**.
5. Once authenticated, your session token is verified via secure JWT cookies.

---

## 3. Role-Based Access Control (RBAC) Matrix

SecureTanza enforces role-based clearance levels to protect sensitive blotter information and maintain data governance.

| Module / Action | Administrator (`admin`) | Operational Officer (`operational_officer`) | Privileged User / Viewer (`privileged_user`) |
| :--- | :---: | :---: | :---: |
| **Interactive Crime Map** | Full Access | Full Access | Full Access |
| **Time Scrubber & Animation** | Full Access | Full Access | Full Access |
| **Map Comparison Tool (`/compare`)** | Full Access | Full Access | Full Access (with Map Clearance) |
| **Executive Dashboard & KPIs** | Full Access | Full Access | Read-Only |
| **Historical Crime Analytics** | Full Access | Full Access | Read-Only |
| **Case Blotter Search & List** | Full Access | Full Access | Restricted |
| **Full Case Dossier & EGO Flags**| Full Access | Full Access | Restricted |
| **PDF Report Compilation** | Full Custom Export | Full Custom Export | Basic Summary |
| **Batch Excel Ingestion** | Authorized | Authorized | Restricted |
| **User Administration & RBAC** | Exclusive Access | Restricted | Restricted |
| **Notification Rules Engine** | Exclusive Access | Restricted | Restricted |
| **Audit Logs Inspection** | Exclusive Access | Read-Only | Restricted |
| **Account Preferences & Accessibility** | Full Access | Full Access | Full Access |
| **Role-Based Guided Walkthrough** | 9-Stage Tour | 8-Stage Tour | 6-Stage Tour |

### 3.1 Role-Based Guided Walkthroughs

SecureTanza provides tailored, multi-stage interactive tours (powered by Driver.js) dynamically adapted to the user's clearance level:

1. **Operational Officer Walkthrough (8 Stages):**
   - *Stage 1 (Map):* Tactical GIS layers, Excel blotter ingestion (`.xlsx`), peak-hour automated alerts, and officer badge clearance.
   - *Stage 2 (Compare):* Dual-pane synchronized map comparison (Period A vs Period B), linked pan/zoom controls, shared threat color scaling, and live Change Ledger.
   - *Stage 3 (Overview):* Municipality KPI snapshots, monthly volume trends, and recent blotter activity.
   - *Stage 4 (Cases):* Case blotter search filters, incident dossiers, and modus operandi analysis.
   - *Stage 5 (Analytics):* 24-hour patrol radar, vulnerable premise profiling, and crime category heatmap matrix.
   - *Stage 6 (Reports):* Analytical section selection and publication-ready PDF report compilation.
   - *Stage 7 (Preferences):* Account preferences and accessibility controls (Reduce Motion, High Contrast, Text Size scaling, Default Landing Page).
   - *Stage 8 (Docs):* Operational SOPs and batch ingestion playbooks.

2. **Privileged User / Analyst Walkthrough (6 Stages):**
   - *Stages:* Tailored according to granted permissions (`privileged_map_view`, `privileged_cases_view`, `privileged_analytics_view`) across Map, Compare, Overview, Cases, Analytics, Reports, Account Preferences & Accessibility, and Docs.

3. **System Administrator Walkthrough (9 Stages):**
   - *Full Platform:* Includes all operational modules: Map, Compare, Overview, Cases, Analytics, Reports, System Settings (RBAC user provisioning, role assignments, automated alert rules, and upload audit logs), Account Preferences & Accessibility, and Docs.

Users can relaunch their role walkthrough at any time from the **User Menu** or the **Documentation Hub** (`/docs`).

---

## 4. Interactive GIS Crime Map

**Route:** `/`

The GIS Map serves as the visual command center, rendering geospatial distribution across Tanza's 41 barangays.

### 4.1 Threat Level Color Classification

Barangay boundary polygons dynamically render fill colors based on total recorded incidents in the active time filter:

| Threat Level | Incident Threshold | Fill Color | Tactical Guidance |
| :--- | :---: | :---: | :--- |
| **Secure** | 0 - 5 incidents | 🟢 Emerald | Routine patrol maintenance; community engagement |
| **Low** | 6 - 10 incidents | 🔵 Sky Blue | Standard mobile roving shifts |
| **Moderate** | 11 - 20 incidents | 🟡 Amber | Increased checkpoint presence during peak hours |
| **High** | 21 - 30 incidents | 🟠 Orange | Dedicated roving team; targeted investigative focus |
| **Critical** | 31+ incidents | 🔴 Crimson | Priority hotspot intervention; station commander briefing |

### 4.2 Map Controls & Operation

- **Barangay Selector Dropdown (Top-Left):** Select one or multiple barangays. The camera smoothly pans and fits the viewport to the selected polygon bounds.
- **Crime Type Filter Dropdown (Top-Left):** Filter markers and polygon counts by specific statutory categories (Theft, Robbery, Physical Injury, etc.).
- **Map Legend (Top-Right):** Displays current threat level classifications.
- **Zoom & Reset Controls (Bottom-Right):** Adjust zoom scale or instantly reset map viewport to full Tanza municipal extent.
- **Export Map Capture (Bottom-Right):** Generates a high-resolution PNG image of the current map canvas for briefing slides.
- **Real-Time Clock & Timeline Toggle (Bottom-Left):** Displays current date/time. Clicking the clock button toggles the **Temporal Filter Drawer**.

### 4.3 Temporal Filter Drawer & Animation Scrubber

When toggled, the bottom drawer allows chronological slicing of crime data:
1. **Filter Modes:**
   - **Quarter Mode:** Q1 (Jan-Mar), Q2 (Apr-Jun), Q3 (Jul-Sep), Q4 (Oct-Dec).
   - **Half-Year Mode:** H1 (Jan-Jun), H2 (Jul-Dec).
   - **Month Mode:** Select any combination of the 12 calendar months.
   - **Day Mode:** Granular day-by-day analysis.
2. **Animation Playback:** Click the **Play (▶)** button to chronologically step through time periods automatically, animating hotspot shifts across Tanza.
3. Click **Apply** to confirm or close the drawer to reset to all-time view.

### 4.4 Interactive Barangay Intelligence Drawer

Clicking on any barangay polygon opens the right-hand slide drawer:
- **Barangay Name & Overview:** Total crime count and primary offense type.
- **Safety Index & Clearance Rate:** Quantified security metrics.
- **Demographics:** Population count and area density.
- **Quick Links:** One-click navigation to open the filtered **Overview Dashboard** or **Case Blotter** for that barangay.

---

## 5. Interactive Map Comparison Tool

**Route:** `/compare`

The **Map Comparison Tool** delivers a dual-viewport spatial analytical workspace designed to compare crime patterns between distinct time periods (e.g., Year-over-Year, Quarter-over-Quarter, or Month-over-Month) or evaluate different crime categories side by side.

### 5.1 Dual-Pane Architecture (Pane A vs Pane B)

- **Independent Filtering:** Pane A (left) and Pane B (right) run isolated state containers. Each pane features dedicated dropdown selectors:
  - **Temporal Filter:** Select any historical year, quarter, half-year, month, or custom date span.
  - **Crime Type Filter:** Isolate specific statutory offenses (e.g., Robbery in Period A vs Theft in Period B) or inspect all recorded crimes.
- **Unified Visual Styling:** Both panes render Tanza's 41 barangay boundary polygons with dynamic threat-level fills.

### 5.2 Synchronized Map Navigation

- **Coupled Viewports (`MapLink`):** Panning or zooming either map automatically updates the neighboring viewport in real time, guaranteeing exact geographic synchronization across both screens.
- **Global Map Controls:** Pinned navigation buttons allow one-click action across both viewports:
  - **Zoom In (+):** Zoom in both map viewports uniformly.
  - **Zoom Out (-):** Zoom out both map viewports uniformly.
  - **Fit All Extents (Crosshair):** Instantly recenters and zooms both maps to encapsulate all 41 Tanza barangays.

### 5.3 Shared Threat Level Scale Harmonization

To prevent misleading comparative impressions caused by differing scale ranges, SecureTanza dynamically harmonizes the threat scale across both datasets:
- **Shared Thresholds:** The highest incident volume between Pane A and Pane B establishes the upper bound of the threat scale.
- **Consistent Color Bands:** Secure, Low, Moderate, High, and Critical thresholds apply identical numerical ranges to both maps, ensuring visual color shifts reflect true statistical differences.

### 5.4 Live Change Ledger & Barangay Shift Rankings

The right-hand **Change Ledger** column provides automated delta calculations and bidirectional interaction:
1. **Municipal Net Change Metrics:**
   - Total recorded incidents for Period A and Period B.
   - Net absolute incident difference ($\Delta = \text{Total}_B - \text{Total}_A$).
   - Net percentage variation ($\% \Delta$).
2. **Barangay Delta Rankings:**
   - **Rises Tab:** Filters barangays that recorded an increase in incident volume from Period A to Period B.
   - **Falls Tab:** Filters barangays that recorded a reduction in incident volume.
   - **All Tab:** Displays all 41 barangays sorted alphabetically or by magnitude of change.
3. **Bidirectional Spatial Linking:**
   - **Hover Highlighting:** Hovering over any row in the ledger illuminates that barangay simultaneously on both map canvases with prominent focus borders.
   - **Click to Focus:** Clicking a barangay row smoothly pans and centers both maps directly onto that barangay's polygon boundary.

---

## 6. Executive Dashboard & Overview

**Route:** `/dashboard/overview`

The Executive Dashboard consolidates critical municipal metrics into a high-level briefing display.

### 6.1 Key Metrics Strip

- **Total Crimes:** Cumulative incident count matching current geographic and temporal filters.
- **Top Offense Type:** The most prevalent crime category (e.g., *Theft* or *Physical Injury*).
- **Critical Hotspot:** The barangay recording the highest incident density (visible in General Dashboard view).

### 6.2 Visual Charts & Incident Feed

- **12-Month Crime Volume Trajectory:** Area chart showing monthly trend line with peak markers.
- **Crime Distribution:** Ranked bars showing each top offense type's share of all incidents.
- **Recent Blotter Activity Table:** Real-time log of the latest 10 recorded incidents showing Case ID, date/time, barangay, and status badges.
- **"View Cases →" Action:** Deep-links directly to the Case Blotter with matching filters applied.

---

## 7. Historical Crime Analytics & Intelligence

**Route:** `/dashboard/analytics`

Designed for crime intelligence analysts and patrol commanders to detect systemic patterns.

### 7.1 Mathematical KPI Calculations

#### Resolution Rate (%)
$$\text{Resolution Rate} = \frac{\text{Cleared Cases} + \text{Solved Cases}}{\text{Total Incident Records}} \times 100\%$$
*Measures police operational clearance efficiency.*

#### Safety Index Score (0 - 100)
$$\text{Safety Index} = 100 - \left( w_1 \cdot \text{Critical Rate} + w_2 \cdot \text{Unresolved Ratio} \right)$$
*Standardized index where 100 indicates maximum community safety.*

### 7.2 Analytical Visualizations

1. **24-Hour Polar Radar Time Pattern:**
   - Plots incident volume across all 24 hours of the day.
   - Identifies peak risk windows (e.g., 20:00 - 02:00) for optimal patrol shift scheduling.
2. **Modus Operandi Breakdown:**
   - Bar chart quantifying criminal methods (e.g., forced door entry, motorcycle riding-in-tandem, snatching, pickpocketing).
3. **Location Type Distribution:**
   - Categorizes incidents by environment: *Residential*, *Commercial*, *Public Thoroughfare*, *Highway*, *Vacant Lot*.
   - Directs municipal CCTV placement and street lighting initiatives.
4. **Monthly Crime Matrix Heatmap:**
   - Cross-tabulated grid mapping crime categories (vertical) against calendar months (horizontal).
   - High-density color cells immediately reveal seasonal spikes.
5. **Barangay Comparison Rankings:**
   - Comparative bar chart of top 10 barangays by crime volume.

---

## 8. Crime Cases & Blotter Dossier Management

**Route:** `/dashboard/cases`

The Case Management suite provides investigative officers with full blotter case records, search filters, and geographic context.

### 8.1 Case Clearance Classifications

- 🟢 **Cleared:** Suspect has been identified, sufficient evidence collected, and case referred to the prosecutor.
- 🔵 **Under Investigation:** Active inquiry ongoing by the assigned investigator.
- 🟣 **Filed in Court:** Formally docketed with the Municipal or Regional Trial Court.
- ⚪ **Archived / Closed:** Inactive or closed post-judicial proceedings.
- 🟡 **Pending:** Initial blotter entry awaiting investigator assignment.

### 8.2 Investigation Dossier Fields

- **Blotter Number:** Standard Philippine National Police (PNP) blotter entry format.
- **Organizational Hierarchy:** Police Regional Office (PRO), Provincial Police Office (PPO), Police Station, and Community Precinct (PCP).
- **Incident Timeline:** Date/time committed vs. date/time reported.
- **Special Crime Classifications:**
  - **Heinous Crime Flag (True/False):** Flags murder, homicide, rape, robbery with violence.
  - **Sensational Crime Flag (True/False):** Incidents attracting intense media scrutiny.
  - **Threat Group Affiliation:** Organized syndicate or gang tags.
- **Elected / Government Official (EGO) Tracking:**
  - Flags if suspect or victim is an elected/government official (`suspect_is_ego`, `victim_is_ego`).
  - Records government position and classification.
- **Investigative Assignment:** Designated lead investigator and chief investigator.
- **Geographic Pin:** Precise latitude/longitude coordinates.

---

## 9. Institutional PDF Report Generator

**Route:** `/dashboard/reports`

Generates publication-ready PDF reports formatted to institutional standards for police briefings and municipal peace-and-order council meetings.

### 9.1 Configurable Report Sections

Users can toggle individual analytical sections on or off:
1. 📋 **Executive Summary:** High-level narrative of key findings and trends.
2. 📊 **Current Statistics:** Snapshot of total volume and clearance ratios.
3. 📈 **Temporal Trends:** 12-month historical crime curves.
4. ⏰ **Time Patterns:** 24-hour radar time analysis for roving shifts.
5. 🔍 **Crime Classification:** Category-by-category volume rankings.
6. 📍 **Barangay Comparison:** Cross-barangay comparative metrics.
7. 🔥 **Heatmap Matrix:** Cross-tabulated monthly crime type grid.
8. 💡 **Tactical Recommendations:** Structured security recommendations.

### 9.2 Generation Workflow

1. Navigate to **Dashboard → Reports**.
2. Choose geographic scope (General Municipal or specific Barangay).
3. Toggle desired sections using the interactive cards.
4. Review document metadata and publication cover preview in the right panel.
5. Click **"Export Report"** — the client renders high-resolution vector charts and downloads the PDF automatically.

---

## 10. Analytical Alert & Notification Rules Engine

**Route:** Header Bell Icon & `/dashboard/config/notifications` *(Notification Rules Tab)*

SecureTanza monitors incident streams and notifies personnel of statistical anomalies and high-priority crimes.

### 10.1 Alert Severity Tiers

- 🔴 **CRITICAL:** Heinous crimes detected, sudden surge in violent crimes, or severe data pipeline validation errors.
- 🟡 **WARNING:** Hourly peak threshold exceedances (>25% of daily volume in one hour) or rapid barangay percentage increases.
- 🔵 **INFO:** Batch upload completion summaries, scheduled exports, and system login audit logs.

### 10.2 Notification Categories

- `PEAK_HOUR`: Extreme volume concentration during specific hours.
- `CRIME_ACTIVITY`: Significant shifts in crime categories or hotspot emergence.
- `DATASET_PROCESSING`: Validation results and record counts from batch imports.
- `SYSTEM`: User role modifications and administrative actions.

---

## 11. System Settings, Security & Configuration

**Route:** `/dashboard/config`

The System Configuration Hub provides comprehensive administrative oversight, security enforcement, and individual user environment customization.

### 11.1 Sub-Modules & Navigation Hub

1. **My Profile (`/dashboard/config`):** Update full name, account password, and inspect security clearance tags.
2. **Account Preferences (`/dashboard/config/preferences`):** Customize appearance, interface themes, immediate app-wide accessibility options, and landing page routing.
3. **Access & Security (RBAC) (`/dashboard/config/access`):** Provision personnel accounts, assign administrative roles, and enforce granular security clearances.
4. **Notification Rules (`/dashboard/config/notifications`):** Configure alert thresholds, enable/disable rule keys (e.g., `HOURLY_PERCENT_EXCEEDS`, `HEINOUS_CRIME_DETECTED`), and adjust sensitivity parameters.
5. **Audit Logs (`/dashboard/config/audit-logs`):** Full history of dataset batch imports, record counts, user attribution, and validation traces.
6. **Data Exports (`/dashboard/config/exports`):** Automated schedules for CSV and Excel bulk exports.
7. **Backups (`/dashboard/config/backups`):** Retained dataset archives and system restoration points.

### 11.2 Account Preferences & Accessibility Controls

Located at `/dashboard/config/preferences`, these settings allow officers and administrators to tailor their interface experience for diverse field conditions. All accessibility settings are **applied immediately app-wide** without requiring a page reload:

- **Interface Theme:**
  - *Light Mode:* High-brightness presentation suited for daylight briefing rooms and outdoors.
  - *Dark Mode:* Deep palette optimized for dispatch control rooms and low-light night operations.
  - *System Sync:* Automatically adopts the host operating system's color scheme.
- **Accessibility Suite:**
  - *Reduce Motion:* Suppresses UI animations, sliding transitions, and interactive transform effects across cards, map panels, and dialogs.
  - *High Contrast:* Intensifies border borders, heightens text contrast, and adds prominent focus outlines around buttons and interactive elements for tactile control on ruggedized touchscreens.
  - *Dynamic Text Size:* Choose between **Default**, **Large**, or **Larger** typographic scaling to ensure effortless readability on patrol vehicles, tablets, and distant monitors.
- **Default Landing Page:**
  - Choose which interface opens automatically upon authentication: **GIS Crime Map**, **Executive Overview**, or **Case Blotter**.

---

## 12. Batch Data Ingestion & Excel Schema

**Route:** Main Navigation → Upload Button (`/api/crimes/upload`)

SecureTanza accepts Excel spreadsheets (`.xlsx` or `.xls`) for bulk blotter data ingestion.

### 12.1 Column Header Specification

| Column Header | Type | Requirement | Description & Valid Examples |
| :--- | :---: | :---: | :--- |
| `incident_type` or `Crime Type` | String | **Mandatory** | THEFT, ROBBERY, PHYSICAL INJURY, HOMICIDE, etc. |
| `barangay` | String | **Mandatory** | Valid Tanza barangay name (e.g. Amaya 1, Julugan 1, Daang Amaya) |
| `date_committed` | Date | **Mandatory** | Date of incident: `YYYY-MM-DD` or `MM/DD/YYYY` |
| `time_committed` | Time | **Mandatory** | Time of incident: `HH:MM:SS` or `HH:MM` (24-hour format) |
| `date_reported` | Date | **Mandatory** | Date reported to station: `YYYY-MM-DD` |
| `time_reported` | Time | Optional | Time reported: `HH:MM:SS` |
| `case_status` | String | Recommended | Cleared, Under Investigation, Filed in Court, Archived |
| `blotter_no` | String | Optional | PNP Blotter Entry Number |
| `modus` | String | Optional | Method of operation (e.g. Forced entry, Snatching, Riding-in-tandem) |
| `type_of_place` | String | Optional | Residential, Commercial, Street, Highway, Public Place |
| `heinous` | Boolean | Optional | YES / NO or TRUE / FALSE |
| `sensational` | Boolean | Optional | YES / NO or TRUE / FALSE |
| `suspect_is_ego` | Boolean | Optional | YES / NO (Elected/Govt Official suspect) |
| `victim_is_ego` | Boolean | Optional | YES / NO (Elected/Govt Official victim) |
| `lat` / `lng` | Float | Optional | Coordinates (e.g. `14.3942`, `120.8523`). *Auto-assigns barangay centroid if blank.* |

---

## 13. Interactive Guided Onboarding Tour

SecureTanza features a multi-stage interactive tour powered by **Driver.js**, providing automated step-by-step guidance tailored to the user's role:

- **Automatic First-Time Launch:** Authenticated personnel are greeted on their initial login with a guided walkthrough.
- **Continuous Multi-Stage Navigation:** The walkthrough transitions seamlessly between routes:
  1. **Stage 1 — GIS Crime Map (`/`):** Spatial layers, boundary fills, filters, and animation scrubber.
  2. **Stage 2 — Map Comparison (`/compare`):** Dual-viewport baseline vs. target panes, synchronized pan/zoom navigation, harmonized threat scales, and dynamic change ledger.
  3. **Stage 3 — Executive Overview (`/dashboard/overview`):** High-level municipal KPIs, monthly curves, and blotter feed.
  4. **Stage 4 — Case Blotter (`/dashboard/cases`):** Search suite, case directory, and investigation dossiers.
  5. **Stage 5 — Historical Analytics (`/dashboard/analytics`):** 24-hour polar radar, modus breakdown, and crime matrix heatmap.
  6. **Stage 6 — PDF Reports (`/dashboard/reports`):** Section selector, cover preview, and institutional export.
  7. **Stage 7 — System Settings (`/dashboard/config`):** Configuration hub, RBAC user provisioning, and alert rules engine *(Admin only)*.
  8. **Stage 8 — Account Preferences & Accessibility (`/dashboard/config/preferences`):** Interface themes, reduced motion, high contrast, and dynamic typographic scaling.
  9. **Stage 9 — Documentation Hub (`/docs`):** Complete user manuals, playbooks, and tour replay controls.
- **Replay Anytime:** Personnel can relaunch their role-specific tour at any point by clicking **User Menu → Replay Tour** or the **Start Tour** button in `/docs`.

---

## 14. Role-Based Operational Playbooks

### Playbook A: Chief of Police / Station Commander (Daily Briefing)
1. **08:00 Hours — Review Municipal Snapshot:** Open `/dashboard/overview`. Inspect 24-hour total incident volume and critical hotspot barangays.
2. **Review Incident Spikes & Alerts:** Check the Notification Bell for any `CRITICAL` heinous crime alerts or `WARNING` peak-hour flags.
3. **Compare Periods:** Open `/compare` to examine current-month incidents against the previous month, noting any barangays exhibiting incident surges.
4. **Analyze Time Patterns:** Open `/dashboard/analytics`. Check the 24-Hour Radar Plot to allocate police roving patrol shifts for the evening.
5. **Export Briefing Report:** Navigate to `/dashboard/reports`, select *Executive Summary*, *Trends*, *Radar Time Patterns*, and *Recommendations*, then export the PDF briefing for the Mayor's peace-and-order briefing.

### Playbook B: Crime Intelligence Analyst (Strategic Planning)
1. **Monthly Dataset Verification:** Verify that all station blotter sheets have been uploaded via `/api/crimes/upload` and check `/dashboard/config/audit-logs`.
2. **Review Temporal Trends & Trajectory:** Examine the 12-month trend line on `/dashboard/analytics`, evaluate monthly variations, and identify seasonal crime patterns.
3. **Comparative Analysis:** Utilize `/compare` to contrast quarterly statistics, identifying barangays moving into High or Critical threat tiers.
4. **Cross-Tabulated Pattern Identification:** Examine the Crime Matrix Heatmap to detect emerging offense categories.
5. **Formulate Recommendations:** Compile recommendations for checkpoint repositioning and submit formal quarterly PDF reports.

### Playbook C: Desk Officer / Blotter Encoder (Incident Intake)
1. **Record Blotter Entry:** Ensure standardized encoding of Crime Type, Barangay, Date/Time Committed, and Modus Operandi.
2. **Tag Special Classifications:** Verify if the case involves heinous offenses or Elected/Government Officials (EGO tags).
3. **Batch Import:** Upload weekly Excel batch files and verify successful record count without validation errors.
4. **Personalize Interface:** Open `/dashboard/config/preferences` to enable High Contrast or adjust Text Size for comfortable prolonged data encoding.

### Playbook D: IT & Security Administrator (System Maintenance)
1. **User Provisioning:** Access `/dashboard/config/access`. Issue new user accounts with designated role clearances.
2. **Rule Configuration:** Fine-tune threshold triggers in Notification Rules (`/dashboard/config/notifications`).
3. **Audit Log Review:** Regularly inspect upload logs and system audit trails for unauthorized access or corrupted batch imports.

---

## 15. Diagnostics & Troubleshooting Matrix

| Symptom | Probable Cause | Corrective Action |
| :--- | :--- | :--- |
| **Map canvas is blank / grey tiles** | Network timeout or browser WebGL disabled | Refresh page (`Ctrl+F5`), verify internet connection, enable hardware acceleration in browser. |
| **Compare view maps out of sync** | MapLink initialization delay | Click the **Fit All Extents** (crosshair) button to recalibrate both viewports simultaneously. |
| **Excel upload returns schema error** | Missing required headers or invalid date formats | Ensure headers match `incident_type`, `barangay`, `date_committed`, `time_committed`; dates must be `YYYY-MM-DD`. |
| **PDF export fails to download** | Pop-up blocker triggered or memory limit reached | Allow automatic downloads for domain in browser settings; deselect 1-2 optional sections to reduce render buffer. |
| **Cannot access Cases or Config page** | User role does not possess required clearance | Contact System Administrator to assign `admin` or `operational_officer` role in Access & Security settings. |
| **Text size or theme does not persist** | Browser storage permissions restricted | Ensure cookies and LocalStorage are enabled for the SecureTanza domain. |

---

## 16. Glossary of Terms

- **Barangay:** Smallest administrative division in the Philippines (Tanza has 41 barangays).
- **Blotter:** Official police record of crime incidents and complaints.
- **Change Ledger:** Numerical accounting column tracking absolute and percentage variations between two comparative time periods.
- **EGO:** Elected / Government Official classification tag.
- **Harmonized Scale:** Statistical calibration applying identical threat thresholds across multiple maps for unbiased comparison.
- **Heinous Crime:** Gravely punishable offenses (e.g., Murder, Rape, Severe Robbery).
- **Modus Operandi (MO):** Distinctive method or procedure of committing a criminal offense.
- **RBAC:** Role-Based Access Control — security framework restricting system access by clearance level.
- **Resolution Rate:** Proportion of total recorded cases that have been cleared or solved.
- **Safety Index:** Normalized composite score (0-100) reflecting relative community security.

---

*SecureTanza Crime Mapping & Analytics System • Developed for the Municipality of Tanza, Cavite.*  
*Documentation maintained by the SecureTanza Development Team.*
