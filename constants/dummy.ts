export interface Incident {
  id: string;
  type: string;
  date: string;
  status: "Active" | "Solved" | "Investigating" | "Pending" | "Cleared" | "Under Investigation" | "Filed in Court" | "Archived";
  severity: "High" | "Medium" | "Low";
  location: string;
  timeReported?: string;
  dateCommitted?: string;
  timeCommitted?: string;
}

export interface HistoricalIncident extends Incident {
  month: string;
  year: string;
}

export const GENERATE_YEARS = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];
export const GENERATE_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface BarangayData {
  name: string;
  stats: {
    activeCases: number;
    resolvedToday: number;
    safetyIndex: string;
    activePatrols: number;
    status: string;
    risk: string;
  };
  activity: number[];
  incidents: Incident[];
  analysis: {
    safetyPerformance: string;
    description: string;
    distribution: { label: string; val: number }[];
    hotspots: string[];
  };
}

export const BARANGAY_NAMES = [
  "Amaya I", "Amaya II", "Amaya III", "Banza", "Biga", "Biñan", "Bukal", "Calibuyo", 
  "Capipisa", "Daang Amaya I", "Daang Amaya II", "Daang Amaya III", "Halayhay", "Julugan I", 
  "Julugan II", "Julugan III", "Julugan IV", "Julugan V", "Julugan VI", "Julugan VII", 
  "Julugan VIII", "Lambac", "Paradahan I", "Paradahan II", "Poblacion I", "Poblacion II", 
  "Poblacion III", "Poblacion IV", "Punta I", "Punta II", "Sahud Ulan", "San Jose", 
  "Santol", "Tanauan", "Tanza (Poblacion)", "Tres Cruses"
];

// General/Aggregate data for the "General Dashboard" view
export const GENERAL_DASHBOARD_DATA: BarangayData = {
  name: "General Dashboard",
  stats: {
    activeCases: 412,
    resolvedToday: 85,
    safetyIndex: "82%",
    activePatrols: 124,
    status: "Operational",
    risk: "Moderate",
  },
  activity: [40, 55, 30, 85, 45, 90, 60, 75, 45, 90, 65, 80],
  incidents: [
    { id: "INC-2026-001X", type: "Security Breach", date: "1h ago", status: "Active", severity: "High", location: "Sector A" },
    { id: "INC-2026-002B", type: "Asset Theft", date: "3h ago", status: "Solved", severity: "Medium", location: "Sector F" },
    { id: "INC-2026-003C", type: "Unauthorized Access", date: "5h ago", status: "Investigating", severity: "High", location: "Sector D" },
    { id: "INC-2026-004P", type: "Public Nuisance", date: "Yesterday", status: "Solved", severity: "Low", location: "Sector B" },
  ],
  analysis: {
    safetyPerformance: "Stable Output",
    description: "Overall security metrics for the Tanza municipality are performing within expected system parameters for Q2.",
    distribution: [
      { label: "Asset Theft", val: 78 },
      { label: "Unauthorized Access", val: 62 },
      { label: "System Breach", val: 41 },
    ],
    hotspots: ["Sector 4", "East Pier", "Central Hub"],
  }
};

// Historical data generator
export const getHistoricalIncidents = (barangayName: string, month: string, year: string): HistoricalIncident[] => {
  const seed = (barangayName.length + month.length + year.length) % 10;
  const types = ["Theft", "Public Disorder", "Aggravated Assault", "Property Damage", "Trespass"];
  
  return Array.from({ length: 3 + (seed % 4) }, (_, i) => ({
    id: `HIST-${year}-${month}-${barangayName.slice(0, 2).toUpperCase()}-${i}`,
    type: types[(seed + i) % types.length],
    date: `${month} ${5 + i * 4}, ${year}`,
    status: (seed + i) % 2 === 0 ? "Solved" : "Pending",
    severity: (seed + i) % 3 === 0 ? "High" : "Medium",
    location: `${barangayName} Sector ${i + 1}`,
    month,
    year
  }));
};

// Simplified hotspot logic for mapping
export const getHotspotSectorForDate = (month: string, year: string): string => {
  const combined = month + year;
  const index = Math.abs(combined.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % BARANGAY_NAMES.length;
  return BARANGAY_NAMES[index] || "Amaya I";
};

// Function to generate randomized yet deterministic-looking dummy data for each barangay
export const generateBarangayData = (name: string, month: string = "Apr", year: string = "2026"): BarangayData => {
  // Simple deterministic seed from name length and date
  const s = name.length + month.length + year.length;
  const isHotspot = getHotspotSectorForDate(month, year) === name;
  const historicalIncidents = getHistoricalIncidents(name, month, year);
  
  return {
    name,
    stats: {
      activeCases: isHotspot ? 45 + (s % 10) : Math.floor(5 + (s % 20)),
      resolvedToday: Math.floor(1 + (s % 10)),
      safetyIndex: isHotspot ? `${60 + (s % 10)}%` : `${80 + (s % 15)}%`,
      activePatrols: isHotspot ? 10 + (s % 5) : Math.floor(2 + (s % 6)),
      status: isHotspot ? "Alert" : (s % 3 === 0) ? "Secure" : "Nominal",
      risk: isHotspot ? "High" : (s % 4 === 0) ? "Low" : "Medium",
    },
    activity: Array.from({ length: 12 }, (_, i) => (isHotspot ? 40 : 20) + ((s + i * 7) % 50)),
    incidents: historicalIncidents,
    analysis: {
      safetyPerformance: isHotspot ? "Critical Zone" : "Stable Output",
      description: `Targeted metrics for ${name} during ${month} ${year}. This sector is currently designated as ${isHotspot ? "HIGH THREAT" : "NOMINAL"}.`,
      distribution: [
        { label: "Theft", val: 30 + (s % 20) },
        { label: "Public Order", val: 25 + (s % 15) },
        { label: "Vandalism", val: 15 + (s % 10) },
      ],
      hotspots: [
        `${name} Sector ${1 + (s % 3)}`,
        `${name} Main St.`
      ],
    }
  };
};

export const MOCK_REPORTS = [
  { name: "Sector_A Security Audit", date: "Apr 25, 2026", size: "2.4 MB" },
  { name: "Sector_B Maintenance Log", date: "Apr 22, 2026", size: "1.8 MB" },
  { name: "Barangay General Safety", date: "Apr 18, 2026", size: "3.1 MB" },
  { name: "Zone_4 Patrol Sync", date: "Apr 15, 2026", size: "0.9 MB" },
];
