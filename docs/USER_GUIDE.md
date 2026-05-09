# SecureTanza User Guide

**Complete Documentation for Crime Mapping & Analytics System**

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Main Features](#main-features)
4. [Interactive Crime Map](#interactive-crime-map)
5. [Dashboard & Analytics](#dashboard--analytics)
6. [Crime Cases Management](#crime-cases-management)
7. [Reports & Export](#reports--export)
8. [Predictive Analytics](#predictive-analytics)
9. [Settings & Configuration](#settings--configuration)
10. [Tips & Best Practices](#tips--best-practices)
11. [Troubleshooting](#troubleshooting)

---

## Introduction

### What is SecureTanza?

SecureTanza is a comprehensive crime mapping and analytics system designed for Tanza, Cavite. It provides real-time visualization, statistical analysis, and predictive insights to help law enforcement and local government make data-driven decisions for public safety.

### Key Capabilities

- **Interactive Crime Map** - Visualize crime incidents across all barangays
- **Advanced Analytics** - Comprehensive statistical analysis and trends
- **Predictive Forecasting** - AI-powered crime prediction using ARIMA models
- **Case Management** - Track and manage crime cases with detailed information
- **Report Generation** - Export professional PDF reports with analytics
- **Data Upload** - Import crime data from Excel files
- **Dark Mode** - Eye-friendly interface for extended use

---

## Getting Started

### System Requirements

- **Browser:** Chrome, Firefox, Safari, or Edge (latest versions)
- **Screen Resolution:** 1280x720 minimum (responsive design supports mobile)
- **Internet Connection:** Required for database access

### First Time Access

1. Open your web browser
2. Navigate to the SecureTanza URL
3. The system loads with the **Interactive Crime Map** as the home page
4. Use the navigation menu to explore different features

### Navigation Overview

**Main Navigation (Top Bar):**
- **SecureTanza Logo** - Return to home (crime map)
- **Dashboard** - Access analytics and statistics
- **Theme Toggle** - Switch between dark/light mode
- **Settings** - Configuration and upload logs

**Dashboard Navigation (Sidebar):**
- Overview
- Analytics
- Cases
- Reports
- Upload Logs
- Settings

---

## Main Features

### 1. Interactive Crime Map 🗺️

**Location:** Home page (/)

The crime map is your primary interface for visualizing crime data geographically.

#### Map Controls

**Top Left:**
- **Barangay Filter** - Select specific barangays to view
- **Crime Type Filter** - Filter by crime categories

**Top Right:**
- **Map Legend** - Color-coded threat levels
  - 🟢 Secure (0-5 crimes)
  - 🔵 Low (6-10 crimes)
  - 🟡 Moderate (11-20 crimes)
  - 🟠 High (21-30 crimes)
  - 🔴 Critical (31+ crimes)

**Bottom Left:**
- **Real-Time Clock** - Current date and time
- **Time Filter Toggle** - Activate temporal filtering

**Bottom Right:**
- **Zoom Controls** - Zoom in/out
- **Reset View** - Return to default view
- **Export Map** - Download map as image

#### Using the Map

**View Crime Data:**
1. Hover over any barangay to see quick stats
2. Click on a barangay to view detailed information
3. Use the drawer panel to explore barangay-specific data

**Filter by Location:**
1. Click the **Barangay Filter** dropdown
2. Select one or more barangays
3. Map updates to show only selected areas

**Filter by Crime Type:**
1. Click the **Crime Type Filter** dropdown
2. Select specific crime categories
3. Map markers update accordingly

**Time-Based Filtering:**
1. Click the **clock icon** (bottom left)
2. Time filter panel appears at bottom
3. Choose filter mode:
   - **Quarter** - Q1, Q2, Q3, Q4
   - **Half-Year** - H1, H2
   - **Month** - Individual months
   - **Day** - Specific dates
4. Select time periods (multi-select supported)
5. Click **Play** to animate through time periods
6. Click **Apply** to filter data

**Export Map:**
1. Click the **Export** button (bottom right)
2. Map is captured as PNG image
3. File downloads automatically

---

### 2. Dashboard & Analytics 📊

**Location:** /dashboard

The dashboard provides comprehensive statistical analysis and visualizations.

#### Overview Tab

**What You'll See:**
- **Total Crimes** - All-time crime count
- **Most Frequent Crime Type** - Top crime category
- **Critical Area** - Barangay with highest crime rate (General Dashboard only)
- **Crime Trend Chart** - Monthly activity over 12 months
- **Crime Distribution** - Pie chart showing crime type breakdown
- **Recent Crime Activity** - Table of latest incidents

**How to Use:**
1. Select a barangay from the dropdown (top) or view all barangays
2. Scroll through the overview cards
3. Hover over charts for detailed tooltips
4. Click "View Cases →" to see full case list

#### Analytics Tab

**Historical Mode (Default):**

**Summary Cards:**
- **Crime Trend** - Quarterly comparison (increased/decreased/stable)
- **Peak Hours** - Time of day with most incidents
- **Resolution Rate** - Percentage of cleared cases
- **Safety Index** - Overall safety score

**Charts & Visualizations:**
1. **Time Patterns (Radar Chart)**
   - 24-hour incident distribution
   - Identifies peak crime hours
   - Hover for exact counts

2. **Crime Types Distribution (Bar Chart)**
   - Top 8 crime categories
   - Horizontal bars with counts
   - Color-coded for easy identification

3. **Monthly Crime Trends (Area Chart)**
   - 12-month trend line
   - Shows seasonal patterns
   - Gradient fill for visual appeal

4. **Barangay Comparison (Bar Chart)**
   - Top 10 barangays by crime count
   - Only visible in General Dashboard
   - Helps identify hotspots

5. **Crime Modus Operandi (Bar Chart)**
   - Common methods used in crimes
   - Helps understand crime patterns
   - Hover for full descriptions

6. **Crime Location Types (Bar Chart)**
   - Where crimes occur (residential, commercial, etc.)
   - Aids in targeted security measures

7. **Crime Matrix Heatmap**
   - Monthly distribution by crime type
   - Color intensity shows frequency
   - Full-width visualization

**Predictive Mode (AI-Powered):**

Toggle to **Predictive** mode to access forecasting features.

**Summary Cards:**
- **Avg Forecast** - Predicted crimes per month
- **Total Predicted** - 12-month forecast total
- **Model MAPE** - Accuracy metric (lower is better)
- **Validation Status** - Model performance assessment

**Forecast Chart:**
- 12-month crime prediction
- Upper and lower confidence bounds (95%)
- Interactive tooltips with exact values
- Training period information

**Validation Results:**
- Month-by-month comparison
- Actual vs Forecast values
- Error metrics
- Color-coded accuracy indicators:
  - 🟢 Good (< 20% error)
  - 🟡 Moderate (20-40% error)
  - 🔴 Poor (> 40% error)

**Understanding the Forecast:**
- Model uses 2023-2025 data for training
- ARIMA (AutoRegressive Integrated Moving Average) algorithm
- Automatically optimized parameters
- Validated against actual 2026 data

---

### 3. Crime Cases Management 📋

**Location:** /dashboard/cases

View, search, and manage all crime cases in the system.

#### Features

**Case Table Columns:**
- **Type** - Crime category
- **Location** - Barangay and specific address
- **Time Reported** - When case was filed
- **Date Committed** - When crime occurred
- **Time Committed** - Time of incident
- **Status** - Current case status
- **Actions** - View details, edit, delete

**Case Status Types:**
- 🟢 **Cleared** - Case resolved
- 🔵 **Under Investigation** - Active investigation
- 🟣 **Filed in Court** - Legal proceedings
- ⚪ **Archived** - Closed/archived
- 🟡 **Pending** - Awaiting action

#### Using the Cases Page

**View All Cases:**
1. Navigate to Dashboard → Cases
2. Table displays all crime cases
3. Scroll to view more entries

**Filter by Barangay:**
1. Use the barangay selector (top)
2. Select specific barangay
3. Table updates to show only that barangay's cases

**Search Cases:**
1. Use the search bar (if available)
2. Enter keywords (crime type, location, etc.)
3. Results filter in real-time

**View Case Details:**
1. Click on any case row
2. Detailed information panel opens
3. View all case attributes

**Sort Cases:**
1. Click on column headers
2. Sort ascending/descending
3. Multi-column sorting supported

---

### 4. Reports & Export 📄

**Location:** /dashboard/reports

Generate comprehensive PDF reports with analytics and recommendations.

#### Report Configuration

**Report Scope:**
- **Location** - All Barangays or specific barangay
- **Time Range** - Based on current filter selection

**Available Sections:**
1. **📋 Executive Summary** - Key findings overview
2. **📊 Overview** - Current statistics and metrics
3. **📈 Trends** - Historical patterns and analysis
4. **⏰ Time Patterns** - Peak hours and temporal analysis
5. **🔍 Classification** - Crime type breakdown
6. **📍 Comparison** - Cross-barangay data (General Dashboard only)
7. **🔥 Heatmap** - Monthly distribution matrix
8. **💡 Recommendations** - Strategic insights and suggestions

#### Generating a Report

**Step 1: Select Sections**
1. Click on section cards to toggle inclusion
2. Selected sections have blue border and checkmark
3. Use "Select All" or "Clear" for quick selection

**Step 2: Review Summary**
- Right panel shows:
  - Number of sections selected
  - Estimated file size
  - Export format (PDF)

**Step 3: Export**
1. Click "Export Report" button
2. Progress bar shows generation status
3. PDF downloads automatically when complete

**Report Features:**
- **Black & White Design** - Professional academic style
- **Numbered Sections** - Easy navigation
- **Charts & Tables** - Visual data representation
- **Recommendations** - Actionable insights
- **Metadata** - Generation date, time range, location

---

### 5. Predictive Analytics 🔮

**Location:** /dashboard/analytics (Predictive Mode)

AI-powered crime forecasting using advanced statistical models.

#### How It Works

**Training Data:**
- Uses historical crime data from 2023-2025
- 36 months of training data
- Automatically cleaned and preprocessed

**Model:**
- **ARIMA** (AutoRegressive Integrated Moving Average)
- Automatic parameter optimization
- Seasonal pattern detection
- Trend analysis

**Validation:**
- Compares predictions with actual 2026 data
- Calculates accuracy metrics
- Provides confidence intervals

#### Understanding the Metrics

**MAPE (Mean Absolute Percentage Error):**
- Measures average prediction error
- Lower is better
- < 15%: Excellent
- 15-25%: Good
- 25-40%: Moderate
- > 40%: Poor

**MAE (Mean Absolute Error):**
- Average difference between predicted and actual
- Measured in number of crimes

**RMSE (Root Mean Square Error):**
- Penalizes large errors more heavily
- Useful for identifying outliers

**Confidence Intervals:**
- 95% confidence bounds
- Upper and lower prediction limits
- Accounts for uncertainty

#### Using Predictions

**For Planning:**
- Allocate resources based on predicted hotspots
- Schedule patrols during predicted peak periods
- Prepare for seasonal crime patterns

**For Prevention:**
- Implement preventive measures in high-risk areas
- Launch awareness campaigns before predicted spikes
- Adjust security protocols proactively

**For Budgeting:**
- Forecast resource needs
- Plan staffing requirements
- Justify budget allocations with data

---

### 6. Settings & Configuration ⚙️

**Location:** /dashboard/config

Manage system settings and view upload history.

#### Settings Tab

**Available Settings:**
- Application configuration
- User preferences
- System parameters

*(Settings features are being developed)*

#### Upload Logs Tab

**View Upload History:**
- **Total Uploads** - Number of files imported
- **Successful** - Successfully processed files
- **Total Records** - All imported crime records

**Upload Log Table:**
- **File Name** - Original filename
- **Size** - File size in MB/KB
- **Records** - Number of records imported
- **Status** - Success/Failed/Partial
- **Uploaded At** - Date and time of upload

**Status Indicators:**
- 🟢 **Success** - All records imported
- 🔴 **Failed** - Import failed
- 🟡 **Partial** - Some records imported with errors

**Refresh Logs:**
- Click "Refresh" button to update log list
- Automatically loads latest 100 entries

---

### 7. Data Upload 📤

**Location:** Dashboard → Upload (via API)

Import crime data from Excel files into the system.

#### Supported File Format

**Excel Requirements:**
- File format: .xlsx or .xls
- Maximum size: 10 MB
- Required columns:
  - Crime Type
  - Barangay
  - Date Committed
  - Time Committed
  - Date Reported
  - Time Reported
  - Status
  - Location/Address
  - Modus Operandi
  - Type of Place
  - Suspect Arrested (Yes/No)

#### Upload Process

**Via API Endpoint:**
```
POST /api/crimes/upload
Content-Type: multipart/form-data
Body: file (Excel file)
```

**Response:**
- Success: Records imported count
- Error: Detailed error message
- Partial: Successfully imported records + errors

**After Upload:**
1. Upload log is created automatically
2. View in Upload Logs page
3. Data appears in map and analytics immediately

---

## Tips & Best Practices

### For Effective Analysis

**1. Use Time Filters Strategically**
- Compare quarters to identify seasonal patterns
- Use monthly view for detailed analysis
- Day view for incident-specific investigation

**2. Combine Multiple Filters**
- Filter by barangay + crime type for focused analysis
- Use time range + location for trend identification
- Layer filters to drill down into specific patterns

**3. Export Data Regularly**
- Generate monthly reports for record-keeping
- Export maps for presentations
- Save analytics for comparison over time

### For Better Visualization

**1. Choose Appropriate Views**
- Use General Dashboard for city-wide overview
- Switch to specific barangay for detailed analysis
- Toggle between historical and predictive modes

**2. Leverage Charts**
- Hover over charts for exact values
- Use radar chart to identify peak crime hours
- Reference heatmap for monthly patterns

**3. Customize Reports**
- Include only relevant sections
- Add recommendations for actionable insights
- Use black & white format for professional documents

### For Predictive Analytics

**1. Understand Limitations**
- Predictions are based on historical patterns
- Unexpected events can affect accuracy
- Use as guidance, not absolute truth

**2. Validate Regularly**
- Check validation results monthly
- Compare predictions with actual data
- Adjust strategies based on accuracy

**3. Act on Insights**
- Use forecasts for resource planning
- Implement preventive measures proactively
- Monitor effectiveness of interventions

---

## Troubleshooting

### Common Issues

#### Map Not Loading

**Problem:** Map appears blank or doesn't load

**Solutions:**
1. Check internet connection
2. Refresh the page (F5 or Cmd+R)
3. Clear browser cache
4. Try a different browser
5. Check if database is accessible

#### Forecast Not Available

**Problem:** Predictive mode shows "Forecast Unavailable"

**Solutions:**
1. Verify forecast API is running (port 8000)
2. Check `.env.local` has correct API URL
3. Ensure training data exists (2023-2025)
4. Review browser console for errors
5. Contact system administrator

#### Charts Not Displaying

**Problem:** Analytics charts show as blank or loading forever

**Solutions:**
1. Wait for data to load completely
2. Check if time range has data
3. Try different barangay selection
4. Refresh the page
5. Check browser console for JavaScript errors

#### Report Export Fails

**Problem:** PDF report doesn't download or shows error

**Solutions:**
1. Ensure at least one section is selected
2. Wait for analytics data to load
3. Check browser allows downloads
4. Try exporting fewer sections
5. Check available disk space

#### Upload Fails

**Problem:** Excel file upload returns error

**Solutions:**
1. Verify file format (.xlsx or .xls)
2. Check file size (< 10 MB)
3. Ensure all required columns exist
4. Validate data format (dates, times)
5. Check for special characters in data
6. Review upload logs for specific errors

### Performance Issues

#### Slow Loading

**If system is slow:**
1. Close unnecessary browser tabs
2. Clear browser cache and cookies
3. Check internet speed
4. Use latest browser version
5. Disable browser extensions temporarily

#### Large Datasets

**For better performance with large data:**
1. Use time filters to reduce data load
2. Filter by specific barangay
3. Limit date ranges
4. Export data in smaller chunks
5. Consider data archiving for old records

### Browser Compatibility

**Recommended Browsers:**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Not Recommended:**
- ❌ Internet Explorer (any version)
- ❌ Outdated browser versions

---

## Keyboard Shortcuts

### Global Shortcuts

- **Esc** - Close modals/drawers
- **F5** - Refresh page
- **Ctrl/Cmd + F** - Search (in tables)
- **Ctrl/Cmd + P** - Print (in reports)

### Map Shortcuts

- **+** - Zoom in
- **-** - Zoom out
- **Arrow Keys** - Pan map
- **Home** - Reset view

---

## Glossary

**ARIMA** - AutoRegressive Integrated Moving Average, a statistical model for time series forecasting

**Barangay** - Smallest administrative division in the Philippines

**Confidence Interval** - Range of values likely to contain the true value

**Heatmap** - Visual representation using colors to show data intensity

**MAPE** - Mean Absolute Percentage Error, measures forecast accuracy

**Modus Operandi** - Method of operation used in committing a crime

**Predictive Analytics** - Using historical data to forecast future events

**Resolution Rate** - Percentage of cases that have been cleared/solved

**Safety Index** - Overall safety score based on cleared and solved cases

**Threat Level** - Risk classification based on crime frequency

**Time Pattern** - Distribution of incidents across different time periods

**Validation** - Process of checking model accuracy against actual data

---

## Support & Contact

### Getting Help

**For Technical Issues:**
- Check this user guide first
- Review troubleshooting section
- Contact system administrator
- Report bugs with screenshots

**For Training:**
- Request user training sessions
- Review video tutorials (if available)
- Practice with test data
- Explore features systematically

**For Feature Requests:**
- Submit suggestions to development team
- Provide use case examples
- Explain expected benefits
- Prioritize critical needs

---

## Version Information

**Current Version:** 1.0.0
**Last Updated:** May 10, 2026
**System:** SecureTanza Crime Mapping & Analytics
**Location:** Tanza, Cavite, Philippines

---

## Quick Reference Card

### Essential Features

| Feature | Location | Purpose |
|---------|----------|---------|
| Crime Map | Home (/) | Visualize crime geographically |
| Overview | Dashboard → Overview | Quick statistics summary |
| Analytics | Dashboard → Analytics | Detailed analysis & charts |
| Predictive | Analytics → Predictive | AI-powered forecasting |
| Cases | Dashboard → Cases | Manage crime cases |
| Reports | Dashboard → Reports | Export PDF reports |
| Upload Logs | Dashboard → Upload Logs | View import history |
| Settings | Dashboard → Settings | System configuration |

### Quick Actions

| Action | Steps |
|--------|-------|
| View barangay data | Click barangay on map |
| Filter by time | Click clock icon → Select period |
| Export map | Click export button (bottom right) |
| Generate report | Reports → Select sections → Export |
| View forecast | Analytics → Toggle Predictive |
| Search cases | Cases → Use search bar |
| Switch theme | Click theme toggle (top right) |

---

**End of User Guide**

For the latest updates and additional resources, visit the SecureTanza documentation portal or contact your system administrator.
