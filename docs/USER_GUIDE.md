# SecureTanza User Guide & Operational Manual

**Enterprise Documentation for GIS Crime Mapping and Statistical Analytics**  
*Municipality of Tanza, Cavite, Philippines*

---

## Table of Contents

1. [Executive Summary & System Architecture](#1-executive-summary--system-architecture)
2. [Getting Started & System Access](#2-getting-started--system-access)
3. [Role-Based Access Control (RBAC) Matrix](#3-role-based-access-control-rbac-matrix)
4. [Interactive GIS Crime Map](#4-interactive-gis-crime-map)
5. [Executive Dashboard & Overview](#5-executive-dashboard--overview)
6. [Historical Crime Analytics & Intelligence](#6-historical-crime-analytics--intelligence)
7. [Crime Cases & Blotter Dossier Management](#7-crime-cases--blotter-dossier-management)
8. [Institutional PDF Report Generator](#8-institutional-pdf-report-generator)
9. [Analytical Alert & Notification Rules Engine](#9-analytical-alert--notification-rules-engine)
10. [System Settings, Security & Configuration](#10-system-settings-security--configuration)
11. [Batch Data Ingestion & Excel Schema](#11-batch-data-ingestion--excel-schema)
12. [Interactive Guided Onboarding Tour](#12-interactive-guided-onboarding-tour)
13. [Role-Based Operational Playbooks](#13-role-based-operational-playbooks)
14. [Diagnostics & Troubleshooting Matrix](#14-diagnostics--troubleshooting-matrix)
15. [Glossary of Terms](#15-glossary-of-terms)

---

## 1. Executive Summary & System Architecture

### 1.1 What is SecureTanza?

**SecureTanza** is a specialized Geographic Information System (GIS) and crime intelligence platform developed for the **Municipality of Tanza, Cavite**. Designed to modernize police blotter operations and municipal peace-and-order governance, SecureTanza replaces disjointed spreadsheet records with an integrated analytical hub.

### 1.2 Core Capabilities

- **Interactive GIS Crime Mapping:** Polygon boundary rendering of all 41 barangays, dynamic threat level coloration, coordinate pinpointing, and chronological animation scrubber.
- **Executive KPI Monitoring:** Instant calculation of municipal crime volume, top offense categories, critical hotspot identification, and 12-month activity curves.
- **Tactical Spatial-Temporal Analytics:** 24-hour polar radar time patterns, modus operandi breakdown, location type categorizations, and full-spectrum monthly heatmap matrix.
- **Comprehensive Blotter Dossiers:** Incident tracking with Heinous/Sensational flags, Elected/Government Official (EGO) victim/suspect tags, investigator assignments, and legal status tracking.
- **Publication-Ready PDF Reports:** Institutional black-and-white reports with embedded vector chart captures and strategic recommendations for Peace and Order Councils.
- **Automated Intelligence Alerts:** Threshold-based rule engine detecting hourly volume spikes, barangay surges, and heinous crime events.
- **Role-Based Security (RBAC):** Tiered clearances for Administrators, Operational Officers, and Privileged Users.

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
| **Executive Dashboard & KPIs** | Full Access | Full Access | Read-Only |
| **Historical Crime Analytics** | Full Access | Full Access | Read-Only |
| **Case Blotter Search & List** | Full Access | Full Access | Restricted |
| **Full Case Dossier & EGO Flags**| Full Access | Full Access | Restricted |
| **PDF Report Compilation** | Full Custom Export | Full Custom Export | Basic Summary |
| **Batch Excel Ingestion** | Authorized | Authorized | Restricted |
| **User Administration & RBAC** | Exclusive Access | Restricted | Restricted |
| **Notification Rules Engine** | Exclusive Access | Restricted | Restricted |
| **Audit Logs Inspection** | Exclusive Access | Read-Only | Restricted |
| **Role-Based Guided Walkthrough** | 7-Stage Tour | 6-Stage Tour | 4-Stage Tour |

### 3.1 Role-Based Guided Walkthroughs

SecureTanza provides tailored, multi-stage interactive tours (powered by Driver.js) dynamically adapted to the user's clearance level:

1. **Operational Officer Walkthrough (6 Stages):**
   - *Stage 1 (Map):* Tactical GIS layers, Excel blotter ingestion (`.xlsx`), peak-hour automated alerts, and officer account management.
   - *Stage 2 (Overview):* Municipality KPI snapshots, monthly volume trends, and recent blotter activity.
   - *Stage 3 (Cases):* Case blotter search filters, incident dossiers, and modus operandi analysis.
   - *Stage 4 (Analytics):* 24-hour patrol radar, vulnerable premise profiling, and crime category heatmap matrix.
   - *Stage 5 (Reports):* Analytical section selection and publication-ready PDF report compilation.
   - *Stage 6 (Docs):* Operational SOPs and batch ingestion playbooks.

2. **Privileged User / Analyst Walkthrough (4 Stages):**
   - *Stages:* Tailored according to granted permissions (`privileged_map_view`, `privileged_cases_view`, `privileged_analytics_view`) with executive KPI cards, spatial-temporal trends, and case dossiers.

3. **System Administrator Walkthrough (7 Stages):**
   - *Full Platform:* Includes all operational modules plus System Settings (RBAC user provisioning, role assignments, automated alert rule engine, and dataset audit logging).

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

## 5. Executive Dashboard & Overview

**Route:** `/dashboard/overview`

The Executive Dashboard consolidates critical municipal metrics into a high-level briefing display.

### 5.1 Primary Metric Cards

- **Total Crimes:** Cumulative incident count matching current geographic and temporal filters.
- **Top Offense Type:** The most prevalent crime category (e.g., *Theft* or *Physical Injury*).
- **Critical Hotspot:** The barangay recording the highest incident density (visible in General Dashboard view).

### 5.2 Visual Charts & Incident Feed

- **12-Month Crime Volume Trajectory:** Area chart showing monthly trend line with peak markers.
- **Categorical Distribution Donut:** Proportional percentage breakdown of index vs. non-index offenses.
- **Recent Blotter Activity Table:** Real-time log of the latest 10 recorded incidents showing Case ID, date/time, barangay, and status badges.
- **"View Cases →" Action:** Deep-links directly to the Case Blotter with matching filters applied.

---

## 6. Historical Crime Analytics & Intelligence

**Route:** `/dashboard/analytics`

Designed for crime intelligence analysts and patrol commanders to detect systemic patterns.

### 6.1 Mathematical KPI Calculations

#### Resolution Rate (%)
$$\text{Resolution Rate} = \frac{\text{Cleared Cases} + \text{Solved Cases}}{\text{Total Incident Records}} \times 100\%$$
*Measures police operational clearance efficiency.*

#### Safety Index Score (0 - 100)
$$\text{Safety Index} = 100 - \left( w_1 \cdot \text{Critical Rate} + w_2 \cdot \text{Unresolved Ratio} \right)$$
*Standardized index where 100 indicates maximum community safety.*

### 6.2 Analytical Visualizations

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

## 7. Crime Cases & Blotter Dossier Management

**Route:** `/dashboard/cases`

The Case Management suite provides investigative officers with full blotter case records, search filters, and geographic context.

### 7.1 Case Clearance Classifications

- 🟢 **Cleared:** Suspect has been identified, sufficient evidence collected, and case referred to the prosecutor.
- 🔵 **Under Investigation:** Active inquiry ongoing by the assigned investigator.
- 🟣 **Filed in Court:** Formally docketed with the Municipal or Regional Trial Court.
- ⚪ **Archived / Closed:** Inactive or closed post-judicial proceedings.
- 🟡 **Pending:** Initial blotter entry awaiting investigator assignment.

### 7.2 Investigation Dossier Fields

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

## 8. Institutional PDF Report Generator

**Route:** `/dashboard/reports`

Generates publication-ready PDF reports formatted to institutional standards for police briefings and municipal peace-and-order council meetings.

### 8.1 Configurable Report Sections

Users can toggle individual analytical sections on or off:
1. 📋 **Executive Summary:** High-level narrative of key findings and trends.
2. 📊 **Current Statistics:** Snapshot of total volume and clearance ratios.
3. 📈 **Temporal Trends:** 12-month historical crime curves.
4. ⏰ **Time Patterns:** 24-hour radar time analysis for roving shifts.
5. 🔍 **Crime Classification:** Category-by-category volume rankings.
6. 📍 **Barangay Comparison:** Cross-barangay comparative metrics.
7. 🔥 **Heatmap Matrix:** Cross-tabulated monthly crime type grid.
8. 💡 **Tactical Recommendations:** Structured security recommendations.

### 8.2 Generation Workflow

1. Navigate to **Dashboard → Reports**.
2. Choose geographic scope (General Municipal or specific Barangay).
3. Toggle desired sections using the interactive cards.
4. Review document metadata and publication cover preview in the right panel.
5. Click **"Export Report"** — the client renders high-resolution vector charts and downloads the PDF automatically.

---

## 9. Analytical Alert & Notification Rules Engine

**Route:** Header Bell Icon & `/dashboard/config` *(Notification Rules Tab)*

SecureTanza monitors incident streams and notifies personnel of statistical anomalies and high-priority crimes.

### 9.1 Alert Severity Tiers

- 🔴 **CRITICAL:** Heinous crimes detected, sudden surge in violent crimes, or severe data pipeline validation errors.
- 🟡 **WARNING:** Hourly peak threshold exceedances (>25% of daily volume in one hour) or rapid barangay percentage increases.
- 🔵 **INFO:** Batch upload completion summaries, scheduled exports, and system login audit logs.

### 9.2 Notification Categories

- `PEAK_HOUR`: Extreme volume concentration during specific hours.
- `CRIME_ACTIVITY`: Significant shifts in crime categories or hotspot emergence.
- `DATASET_PROCESSING`: Validation results and record counts from batch imports.
- `SYSTEM`: User role modifications and administrative actions.

---

## 10. System Settings, Security & Configuration

**Route:** `/dashboard/config`

### 10.1 Sub-Modules & Tabs

1. **My Profile:** Update full name, account password, and inspect security clearance tags.
2. **Access & Security (RBAC):**
   - Create new user accounts with designated **Account Numbers**.
   - Assign roles: `admin`, `operational_officer`, `privileged_user`.
   - Revoke or reassign permissions.
3. **Notification Rules:** Configure alert thresholds, enable/disable rule keys (e.g., `HOURLY_PERCENT_EXCEEDS`, `HEINOUS_CRIME_DETECTED`), and adjust sensitivity parameters.
4. **Audit Logs:** Full history of dataset batch imports, record counts, user attribution, and error traces.
5. **Data Exports:** Automated schedules for CSV and Excel bulk exports.
6. **Account Preferences:** Switch between Dark and Light mode themes and adjust display preferences.

---

## 11. Batch Data Ingestion & Excel Schema

**Route:** Main Navigation → Upload Button (`/api/crimes/upload`)

SecureTanza accepts Excel spreadsheets (`.xlsx` or `.xls`) for bulk blotter data ingestion.

### 11.1 Column Header Specification

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

## 12. Interactive Guided Onboarding Tour

SecureTanza includes an automated, multi-stage interactive tour powered by **Driver.js**:
- **Automatic First-Time Launch:** Automatically greets new authenticated users on their first visit.
- **Multi-Module Walkthrough:** Chains seamlessly across `/` (Map), `/dashboard/overview`, `/dashboard/cases`, `/dashboard/analytics`, `/dashboard/reports`, `/dashboard/config` (System Settings), and `/docs` (User Guide).
- **Replay Anytime:** Click the **User Menu → Replay Tour** or the **Start Tour** button in `/docs` to relaunch the guide at any time.

---

## 13. Role-Based Operational Playbooks

### Playbook A: Chief of Police / Station Commander (Daily Briefing)
1. **08:00 Hours — Review Municipal Snapshot:** Open `/dashboard/overview`. Inspect 24-hour total incident volume and critical hotspot barangays.
2. **Review Incident Spikes & Alerts:** Check the Notification Bell for any `CRITICAL` heinous crime alerts or `WARNING` peak-hour flags.
3. **Analyze Time Patterns:** Open `/dashboard/analytics`. Check the 24-Hour Radar Plot to allocate police roving patrol shifts for the evening.
4. **Export Briefing Report:** Navigate to `/dashboard/reports`, select *Executive Summary*, *Trends*, *Radar Time Patterns*, and *Recommendations*, then export the PDF briefing for the Mayor's peace-and-order briefing.

### Playbook B: Crime Intelligence Analyst (Strategic Planning)
1. **Monthly Dataset Verification:** Verify that all station blotter sheets have been uploaded via `/api/crimes/upload` and check `/dashboard/upload-logs`.
2. **Review Temporal Trends & Trajectory:** Examine the 12-month trend line on `/dashboard/analytics`, evaluate monthly variations, and identify seasonal crime patterns.
3. **Cross-Tabulated Pattern Identification:** Examine the Crime Matrix Heatmap to detect emerging offense categories.
4. **Formulate Recommendations:** Compile recommendations for checkpoint repositioning and submit formal quarterly PDF reports.

### Playbook C: Desk Officer / Blotter Encoder (Incident Intake)
1. **Record Blotter Entry:** Ensure standardized encoding of Crime Type, Barangay, Date/Time Committed, and Modus Operandi.
2. **Tag Special Classifications:** Verify if the case involves heinous offenses or Elected/Government Officials (EGO tags).
3. **Batch Import:** Upload weekly Excel batch files and verify successful record count without validation errors.

### Playbook D: IT & Security Administrator (System Maintenance)
1. **User Provisioning:** Access `/dashboard/config` → Access & Security. Issue new user accounts with designated role clearances.
2. **Rule Configuration:** Fine-tune threshold triggers in Notification Rules (adjust percentage sensitivities as incident volume evolves).
3. **Audit Log Review:** Regularly inspect upload logs and system audit trails for unauthorized access or corrupted batch imports.

---

## 14. Diagnostics & Troubleshooting Matrix

| Symptom | Probable Cause | Corrective Action |
| :--- | :--- | :--- |
| **Map canvas is blank / grey tiles** | Network timeout or browser WebGL disabled | Refresh page (`Ctrl+F5`), verify internet connection, enable hardware acceleration in browser. |
| **Excel upload returns schema error** | Missing required headers or invalid date formats | Ensure headers match `incident_type`, `barangay`, `date_committed`, `time_committed`; dates must be `YYYY-MM-DD`. |
| **PDF export fails to download** | Pop-up blocker triggered or memory limit reached | Allow automatic downloads for domain in browser settings; deselect 1-2 optional sections to reduce render buffer. |
| **Cannot access Cases or Config page** | User role does not possess required clearance | Contact System Administrator to assign `admin` or `operational_officer` role in Access & Security settings. |

---

## 15. Glossary of Terms

- **Barangay:** Smallest administrative division in the Philippines (Tanza has 41 barangays).
- **Blotter:** Official police record of crime incidents and complaints.
- **EGO:** Elected / Government Official classification tag.
- **Heinous Crime:** Gravely punishable offenses (e.g., Murder, Rape, Severe Robbery).
- **Modus Operandi (MO):** Distinctive method or procedure of committing a criminal offense.
- **RBAC:** Role-Based Access Control — security framework restricting system access by clearance level.
- **Resolution Rate:** Proportion of total recorded cases that have been cleared or solved.
- **Safety Index:** Normalized composite score (0-100) reflecting relative community security.

---

*SecureTanza Crime Mapping & Analytics System • Developed for the Municipality of Tanza, Cavite.*  
*Documentation maintained by the SecureTanza Development Team.*
