# Crime Data Excel Upload Template

## Required Columns

The following columns are **required** and must be present in your Excel file:

- `barangay` - Name of the barangay
- `date_reported` - Date when the crime was reported
- `time_reported` - Time when the crime was reported (HH:MM:SS format)
- `date_committed` - Date when the crime was committed
- `time_committed` - Time when the crime was committed (HH:MM:SS format)
- `incident_type` - Type of crime/incident

## Optional Columns

The following columns are optional but recommended:

### Blotter Information
- `blotter_no` - Blotter number
- `date_encoded` - When record was encoded

### Police Organization
- `police_regional_office` (or `pro`) - Police Regional Office
- `police_provincial_office` (or `ppo`) - Police Provincial Office
- `station` (or `stn`) - Police Station
- `police_community_precinct` (or `pcp`) - Police Community Precinct

### Location Details
- `region` - Region name
- `province` - Province name
- `municipality` (or `municipal`) - Municipality name
- `street` - Street address
- `type_of_place` - Type of location (e.g., Residential, Commercial, Public)

### Incident Details
- `iscime` - Is this a crime? (YES/NO or TRUE/FALSE)
- `mode_reporting` - How the crime was reported
- `stage_of_felony` - Stage of the felony

### Legal Information
- `offense` - Legal offense description
- `offense_type` - Type of offense
- `section` - Legal section reference

### Crime Details
- `modus` - Method of operation
- `suspect_motive` - Motive of the suspect
- `suspect_sub_motive` - Sub-motive of the suspect

### Crime Classification
- `heinous` - Is crime heinous? (YES/NO)
- `sensational` - Is crime sensational? (YES/NO)

### Threat Group
- `threat_grp` - Threat group involvement (YES/NO)
- `grp_affiliation` - Group affiliation details
- `incident_type_threat_grp` - Incident type threat group
- `mrs` - MRS field

### Suspect Information
- `suspect_is_ego` - Is suspect elected/government official? (YES/NO)
- `suspect_ego_position` - Suspect's government position
- `suspect_ego_class` - Suspect's government class
- `suspect_count` - Number of suspects (numeric)

### Victim Information
- `victim_is_ego` - Is victim elected/government official? (YES/NO)
- `victim_ego_position` - Victim's government position
- `victim_ego_class` - Victim's government class
- `victim_count` - Number of victims (numeric)

### Case Management
- `case_status` - Case status (e.g., Cleared, Under Investigation)
- `investigator` - Assigned investigator
- `head_investigator` (or `head_inves`) - Head investigator

### Geographic Coordinates
- `lat` - Latitude (decimal)
- `lng` - Longitude (decimal)

## Data Format Guidelines

### Dates
- Can be in Excel date format or string format (YYYY-MM-DD)
- Examples: `2026-01-15`, `01/15/2026`

### Times
- Should be in HH:MM:SS or HH:MM format
- Examples: `14:30:00`, `14:30`

### Boolean Fields (YES/NO)
- Accepted values: `YES`, `NO`, `TRUE`, `FALSE`, `1`, `0`, `Y`, `N`
- Case insensitive

### Numbers
- Suspect count and victim count should be whole numbers
- Latitude and longitude should be decimal numbers

## Column Name Flexibility

The system accepts column names with:
- Different casing (e.g., `Barangay`, `BARANGAY`, `barangay`)
- Spaces instead of underscores (e.g., `Date Reported` = `date_reported`)
- The system will automatically normalize column names

## Example Row

| barangay | date_reported | time_reported | date_committed | time_committed | incident_type | modus | type_of_place | case_status |
|----------|---------------|---------------|----------------|----------------|---------------|-------|---------------|-------------|
| Amaya I  | 2026-01-15    | 14:30:00      | 2026-01-15     | 13:00:00       | Theft         | Breaking and Entering | Residential | Under Investigation |

## Upload Process

1. Click "Upload Data" button in the header
2. Drag and drop your Excel file or click to browse
3. System will validate:
   - File type (must be .xlsx or .xls)
   - File size (max 10MB)
   - Column names (checks for required columns)
4. Review the validation results:
   - ✓ Found columns (green)
   - ⚠ Missing columns (amber) - optional fields
   - ℹ Extra columns (blue) - will be ignored
5. Click "Upload Data" to import
6. System will process each row and report results

## Error Handling

- Rows with missing required fields will be skipped
- Invalid date formats will be skipped
- Errors will be reported with row numbers
- Successfully imported rows will be counted

## Tips

- Use the first row for column headers
- Ensure dates are properly formatted
- Use consistent YES/NO values for boolean fields
- Remove any empty rows at the end of your file
- Test with a small file first (10-20 rows) before uploading large datasets
