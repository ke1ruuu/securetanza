import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportConfig {
  includeExecutiveSummary: boolean;
  includeOverview: boolean;
  includeTrends: boolean;
  includeTimePatterns: boolean;
  includeCrimeTypes: boolean;
  includeBarangayComparison: boolean;
  includeCrimeMatrix: boolean;
  includeRecommendations: boolean;
}

interface AnalyticsData {
  crimesByType: Array<{ type: string; count: number }>;
  crimesByMonth: Array<{ month: number; count: number }>;
  crimesByBarangay: Array<{ barangay: string; count: number }>;
  timePatterns: {
    hourlyDistribution: number[];
    peakHour: number;
  };
  trends: {
    monthlyChange: number;
    resolutionRate: number;
    safetyIndex: number;
    trendLevel: string;
    trendDirection: string;
    currentThreatLevel: string;
    previousThreatLevel: string;
    currentQuarterCrimes: number;
    previousQuarterCrimes: number;
    currentQuarterLabel: string;
    previousQuarterLabel: string;
  };
}

interface ReportData {
  barangayName: string;
  timeRange: string;
  analyticsData: AnalyticsData;
  totalCrimes: number;
}

export class PDFReportGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private currentY: number;
  private sectionCounter: number = 0;

  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 20;
    this.currentY = this.margin;
  }

  private addHeader() {
    // Simple header with line
    this.doc.setDrawColor(0, 0, 0);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, 15, this.pageWidth - this.margin, 15);

    // Title
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('CRIME ANALYTICS CASE STUDY REPORT', this.pageWidth / 2, 22, { align: 'center' });

    // Subtitle
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('SecureTanza Crime Analytics System', this.pageWidth / 2, 28, { align: 'center' });

    // Bottom line
    this.doc.line(this.margin, 32, this.pageWidth - this.margin, 32);

    this.currentY = 40;
  }

  private addFooter(pageNumber: number) {
    this.doc.setFontSize(8);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(
      `Page ${pageNumber}`,
      this.pageWidth / 2,
      this.pageHeight - 10,
      { align: 'center' }
    );
    this.doc.text(
      'SecureTanza Crime Analytics System',
      this.margin,
      this.pageHeight - 10
    );
  }

  private checkPageBreak(requiredSpace: number): boolean {
    if (this.currentY + requiredSpace > this.pageHeight - 30) {
      this.doc.addPage();
      this.currentY = this.margin;
      return true;
    }
    return false;
  }

  private addSectionTitle(title: string) {
    this.checkPageBreak(20);
    this.sectionCounter++;

    // Draw top border line
    this.doc.setDrawColor(0, 0, 0);
    this.doc.setLineWidth(0.3);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    
    this.currentY += 5;

    // Section number and title
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(`${this.sectionCounter}. ${title.toUpperCase()}`, this.margin, this.currentY);

    this.currentY += 3;
    
    // Draw bottom border line
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);

    this.currentY += 8;
  }

  private addParagraph(text: string, fontSize: number = 10, isBold: boolean = false) {
    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    this.doc.setTextColor(0, 0, 0);

    const lines = this.doc.splitTextToSize(text, this.pageWidth - 2 * this.margin);
    const lineHeight = fontSize * 0.5;

    lines.forEach((line: string) => {
      this.checkPageBreak(lineHeight);
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += lineHeight;
    });

    this.currentY += 3;
  }

  private addKeyValuePair(key: string, value: string, highlight: boolean = false) {
    this.checkPageBreak(8);

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(`${key}:`, this.margin, this.currentY);

    this.doc.setFont('helvetica', highlight ? 'bold' : 'normal');
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(value, this.margin + 50, this.currentY);

    this.currentY += 7;
  }

  private addStatBox(label: string, value: string, xOffset: number = 0) {
    const boxWidth = (this.pageWidth - 2 * this.margin - 10) / 3;
    const boxHeight = 20;
    const x = this.margin + xOffset;

    // Draw border only (no fill)
    this.doc.setDrawColor(0, 0, 0);
    this.doc.setLineWidth(0.5);
    this.doc.rect(x, this.currentY, boxWidth, boxHeight);

    // Label
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(label, x + boxWidth / 2, this.currentY + 8, { align: 'center' });

    // Value
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(value, x + boxWidth / 2, this.currentY + 16, { align: 'center' });
  }

  async addExecutiveSummary(data: ReportData) {
    this.addSectionTitle('Executive Summary');

    this.addParagraph(
      `This comprehensive case study report provides an in-depth analysis of crime patterns and trends in ${
        data.barangayName === 'General Dashboard' ? 'all barangays of Tanza, Cavite' : `Barangay ${data.barangayName}`
      } for the period: ${data.timeRange}.`,
      10
    );

    this.addParagraph('Key Findings:', 11, true);

    const { trends, crimesByType } = data.analyticsData;
    const topCrimeType = crimesByType.length > 0 ? crimesByType[0].type : 'N/A';

    this.addParagraph(
      `Total Incidents: ${data.totalCrimes} crime incidents were recorded during this period.`,
      10
    );
    this.addParagraph(
      `Threat Level: Current threat assessment is "${trends.currentThreatLevel.toUpperCase()}" with a ${
        trends.trendDirection === 'improved' ? 'positive' : trends.trendDirection === 'worsened' ? 'concerning' : 'stable'
      } trend (${trends.monthlyChange > 0 ? '+' : ''}${trends.monthlyChange}% change).`,
      10
    );
    this.addParagraph(
      `Resolution Rate: ${trends.resolutionRate}% of cases have been cleared, with an overall safety index of ${trends.safetyIndex}%.`,
      10
    );
    this.addParagraph(
      `Primary Concern: ${topCrimeType} represents the most frequent incident type in this area.`,
      10
    );

    this.currentY += 5;
  }

  private drawBarChart(
    data: Array<{ label: string; value: number }>,
    title: string,
    maxValue?: number
  ) {
    const chartWidth = this.pageWidth - 2 * this.margin - 40;
    const chartHeight = Math.min(data.length * 8, 100);
    const barHeight = 6;
    const gap = 2;
    const max = maxValue || Math.max(...data.map(d => d.value));

    this.checkPageBreak(chartHeight + 20);

    // Draw title
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 8;

    // Draw bars
    data.forEach((item, index) => {
      const barWidth = (item.value / max) * chartWidth;
      const y = this.currentY + index * (barHeight + gap);

      // Draw bar with black fill
      this.doc.setFillColor(0, 0, 0);
      this.doc.rect(this.margin + 35, y, barWidth, barHeight, 'F');

      // Draw label
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(item.label, this.margin, y + 4, { align: 'left' });

      // Draw value
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(item.value.toString(), this.margin + 37 + barWidth + 2, y + 4);
    });

    this.currentY += data.length * (barHeight + gap) + 10;
  }

  addSituationalOverview(data: ReportData) {
    this.addSectionTitle('Situational Overview');

    this.addParagraph(
      `This section provides a comprehensive overview of the crime situation in ${
        data.barangayName === 'General Dashboard' ? 'Tanza, Cavite' : `Barangay ${data.barangayName}`
      }.`,
      10
    );

    this.currentY += 5;

    // Key metrics in bordered boxes
    const boxWidth = (this.pageWidth - 2 * this.margin - 10) / 3;
    const startY = this.currentY;
    
    this.addStatBox('Total Crimes', data.totalCrimes.toString(), 0);
    this.addStatBox('Resolution Rate', `${data.analyticsData.trends.resolutionRate}%`, boxWidth + 5);
    this.addStatBox('Safety Index', `${data.analyticsData.trends.safetyIndex}%`, 2 * (boxWidth + 5));

    this.currentY = startY + 25;

    // Add crime type bar chart
    const chartData = data.analyticsData.crimesByType.slice(0, 10).map(crime => ({
      label: crime.type.length > 15 ? crime.type.substring(0, 15) + '...' : crime.type,
      value: crime.count
    }));
    
    this.drawBarChart(chartData, 'Top 10 Crime Types');

    // Crime breakdown table
    this.addParagraph('Detailed Crime Type Distribution:', 11, true);

    const tableData = data.analyticsData.crimesByType.slice(0, 10).map((crime) => [
      crime.type,
      crime.count.toString(),
      `${((crime.count / data.totalCrimes) * 100).toFixed(1)}%`,
    ]);

    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Crime Type', 'Count', 'Percentage']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        textColor: [0, 0, 0],
      },
      margin: { left: this.margin, right: this.margin },
      didDrawPage: (data) => {
        this.currentY = data.cursor?.y || this.currentY;
      },
    });

    this.currentY += 10;
  }

  addTrendAnalysis(data: ReportData) {
    this.addSectionTitle('Trend Analysis');

    const { trends } = data.analyticsData;

    this.addParagraph(
      'This section analyzes crime trends over time, comparing current patterns with historical data.',
      10
    );

    this.currentY += 5;

    this.addKeyValuePair('Current Period', trends.currentQuarterLabel, true);
    this.addKeyValuePair('Current Crimes', trends.currentQuarterCrimes.toString());
    this.addKeyValuePair('Previous Period', trends.previousQuarterLabel);
    this.addKeyValuePair('Previous Crimes', trends.previousQuarterCrimes.toString());
    this.addKeyValuePair(
      'Trend Direction',
      trends.trendDirection === 'improved'
        ? 'Improved (Crime Decreased)'
        : trends.trendDirection === 'worsened'
        ? 'Worsened (Crime Increased)'
        : 'Stable',
      true
    );
    this.addKeyValuePair('Change Percentage', `${trends.monthlyChange > 0 ? '+' : ''}${trends.monthlyChange}%`);

    this.currentY += 5;

    this.addParagraph('Threat Level Assessment:', 11, true);
    this.addKeyValuePair('Current Threat Level', trends.currentThreatLevel.toUpperCase(), true);
    this.addKeyValuePair('Previous Threat Level', trends.previousThreatLevel.toUpperCase());

    this.currentY += 5;

    // Add monthly trend chart
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyChartData = data.analyticsData.crimesByMonth.map((item) => ({
      label: monthNames[item.month - 1],
      value: item.count
    }));
    
    this.drawBarChart(monthlyChartData, 'Monthly Crime Trend');

    // Monthly distribution table
    this.addParagraph('Detailed Monthly Distribution:', 11, true);

    const monthlyData = data.analyticsData.crimesByMonth.map((item) => [
      monthNames[item.month - 1],
      item.count.toString(),
    ]);

    // Split into two columns for better layout
    const col1 = monthlyData.slice(0, 6);
    const col2 = monthlyData.slice(6, 12);
    const combinedData = col1.map((row, idx) => [...row, col2[idx][0], col2[idx][1]]);

    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Month', 'Count', 'Month', 'Count']],
      body: combinedData,
      theme: 'grid',
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        textColor: [0, 0, 0],
      },
      margin: { left: this.margin, right: this.margin },
      didDrawPage: (data) => {
        this.currentY = data.cursor?.y || this.currentY;
      },
    });

    this.currentY += 10;
  }

  addTemporalAnalysis(data: ReportData) {
    this.addSectionTitle('Temporal Analysis');

    const { timePatterns } = data.analyticsData;

    this.addParagraph(
      'This section examines crime patterns across different times of day to identify peak activity periods.',
      10
    );

    this.currentY += 5;

    // Format peak hour in 12-hour format
    const formatHour = (hour: number) => {
      if (hour === 0) return '12:00 AM';
      if (hour === 12) return '12:00 PM';
      if (hour < 12) return `${hour}:00 AM`;
      return `${hour - 12}:00 PM`;
    };

    this.addKeyValuePair('Peak Crime Hour', formatHour(timePatterns.peakHour), true);
    this.addKeyValuePair(
      'Peak Hour Incidents',
      timePatterns.hourlyDistribution[timePatterns.peakHour].toString()
    );

    this.currentY += 5;

    // Add time period summary chart (grouped by 4-hour blocks)
    const timeBlocks = [
      { label: '12AM-4AM', value: timePatterns.hourlyDistribution.slice(0, 4).reduce((a, b) => a + b, 0) },
      { label: '4AM-8AM', value: timePatterns.hourlyDistribution.slice(4, 8).reduce((a, b) => a + b, 0) },
      { label: '8AM-12PM', value: timePatterns.hourlyDistribution.slice(8, 12).reduce((a, b) => a + b, 0) },
      { label: '12PM-4PM', value: timePatterns.hourlyDistribution.slice(12, 16).reduce((a, b) => a + b, 0) },
      { label: '4PM-8PM', value: timePatterns.hourlyDistribution.slice(16, 20).reduce((a, b) => a + b, 0) },
      { label: '8PM-12AM', value: timePatterns.hourlyDistribution.slice(20, 24).reduce((a, b) => a + b, 0) },
    ];
    
    this.drawBarChart(timeBlocks, 'Crime Distribution by Time Period (4-Hour Blocks)');

    this.addParagraph('Detailed Hourly Crime Distribution:', 11, true);

    // Create hourly distribution table (4 columns x 6 rows)
    const hourlyData: string[][] = [];
    for (let i = 0; i < 6; i++) {
      const row: string[] = [];
      for (let j = 0; j < 4; j++) {
        const hour = i * 4 + j;
        row.push(formatHour(hour));
        row.push(timePatterns.hourlyDistribution[hour].toString());
      }
      hourlyData.push(row);
    }

    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Time', 'Count', 'Time', 'Count', 'Time', 'Count', 'Time', 'Count']],
      body: hourlyData,
      theme: 'grid',
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 8,
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [0, 0, 0],
      },
      margin: { left: this.margin, right: this.margin },
      didDrawPage: (data) => {
        this.currentY = data.cursor?.y || this.currentY;
      },
    });

    this.currentY += 10;

    // Time period insights
    this.addParagraph('Key Insights:', 11, true);

    const morningCrimes = timePatterns.hourlyDistribution.slice(6, 12).reduce((a, b) => a + b, 0);
    const afternoonCrimes = timePatterns.hourlyDistribution.slice(12, 18).reduce((a, b) => a + b, 0);
    const eveningCrimes = timePatterns.hourlyDistribution.slice(18, 24).reduce((a, b) => a + b, 0);
    const nightCrimes = timePatterns.hourlyDistribution.slice(0, 6).reduce((a, b) => a + b, 0);

    this.addParagraph(`Morning (6 AM - 12 PM): ${morningCrimes} incidents`, 10);
    this.addParagraph(`Afternoon (12 PM - 6 PM): ${afternoonCrimes} incidents`, 10);
    this.addParagraph(`Evening (6 PM - 12 AM): ${eveningCrimes} incidents`, 10);
    this.addParagraph(`Night (12 AM - 6 AM): ${nightCrimes} incidents`, 10);

    this.currentY += 5;
  }

  addCrimeClassification(data: ReportData) {
    this.addSectionTitle('Crime Classification');

    this.addParagraph(
      'Detailed breakdown of crime incidents by type, showing the distribution and frequency of different offense categories.',
      10
    );

    this.currentY += 5;

    const tableData = data.analyticsData.crimesByType.map((crime, index) => [
      (index + 1).toString(),
      crime.type,
      crime.count.toString(),
      `${((crime.count / data.totalCrimes) * 100).toFixed(2)}%`,
    ]);

    autoTable(this.doc, {
      startY: this.currentY,
      head: [['#', 'Crime Type', 'Incidents', 'Percentage']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        textColor: [0, 0, 0],
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: this.margin, right: this.margin },
      didDrawPage: (data) => {
        this.currentY = data.cursor?.y || this.currentY;
      },
    });

    this.currentY += 10;
  }

  addComparativeAnalysis(data: ReportData) {
    this.addSectionTitle('Comparative Analysis');

    if (data.barangayName !== 'General Dashboard') {
      this.addParagraph(
        `This section compares crime statistics for Barangay ${data.barangayName} with other barangays in Tanza, Cavite.`,
        10
      );
    } else {
      this.addParagraph(
        'This section provides a comparative analysis of crime distribution across all barangays in Tanza, Cavite.',
        10
      );
    }

    this.currentY += 5;

    const tableData = data.analyticsData.crimesByBarangay.map((item, index) => [
      (index + 1).toString(),
      item.barangay,
      item.count.toString(),
      `${((item.count / data.totalCrimes) * 100).toFixed(2)}%`,
    ]);

    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Rank', 'Barangay', 'Incidents', 'Percentage']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        textColor: [0, 0, 0],
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: this.margin, right: this.margin },
      didDrawPage: (data) => {
        this.currentY = data.cursor?.y || this.currentY;
      },
    });

    this.currentY += 10;
  }

  addStrategicRecommendations(data: ReportData) {
    this.addSectionTitle('Strategic Recommendations');

    const { trends, crimesByType, timePatterns } = data.analyticsData;

    this.addParagraph(
      'Based on the comprehensive analysis of crime data, the following strategic recommendations are proposed:',
      10
    );

    this.currentY += 5;

    // Recommendation 1: Based on trend
    this.addParagraph('1. Trend-Based Interventions', 11, true);
    if (trends.trendDirection === 'worsened') {
      this.addParagraph(
        `Crime incidents have increased by ${Math.abs(trends.monthlyChange)}% compared to the previous period. Immediate action is recommended:`,
        10
      );
      this.addParagraph('   - Increase police visibility and patrol frequency in high-risk areas', 10);
      this.addParagraph('   - Implement community watch programs and neighborhood coordination', 10);
      this.addParagraph('   - Conduct public awareness campaigns on crime prevention', 10);
    } else if (trends.trendDirection === 'improved') {
      this.addParagraph(
        `Crime incidents have decreased by ${Math.abs(trends.monthlyChange)}%. Continue current strategies:`,
        10
      );
      this.addParagraph('   - Maintain current patrol schedules and community engagement programs', 10);
      this.addParagraph('   - Document successful interventions for replication in other areas', 10);
      this.addParagraph('   - Monitor for any emerging patterns or displacement effects', 10);
    } else {
      this.addParagraph('Crime levels remain stable. Focus on prevention and monitoring:', 10);
      this.addParagraph('   - Continue regular patrols and community engagement', 10);
      this.addParagraph('   - Implement proactive crime prevention measures', 10);
    }

    this.currentY += 5;

    // Recommendation 2: Based on crime types
    this.addParagraph('2. Crime-Type Specific Strategies', 11, true);
    const topCrime = crimesByType[0];
    if (topCrime) {
      this.addParagraph(`The most frequent crime type is "${topCrime.type}" (${topCrime.count} incidents):`, 10);
      this.addParagraph('   - Deploy specialized units trained in handling this specific crime type', 10);
      this.addParagraph('   - Conduct targeted awareness campaigns for potential victims', 10);
      this.addParagraph('   - Establish hotlines and reporting mechanisms for quick response', 10);
    }

    this.currentY += 5;

    // Recommendation 3: Based on time patterns
    this.addParagraph('3. Time-Based Patrol Optimization', 11, true);
    const formatHour = (hour: number) => {
      if (hour === 0) return '12:00 AM';
      if (hour === 12) return '12:00 PM';
      if (hour < 12) return `${hour}:00 AM`;
      return `${hour - 12}:00 PM`;
    };
    this.addParagraph(
      `Peak crime activity occurs at ${formatHour(timePatterns.peakHour)} with ${
        timePatterns.hourlyDistribution[timePatterns.peakHour]
      } incidents:`,
      10
    );
    this.addParagraph('   - Increase patrol presence during peak hours', 10);
    this.addParagraph('   - Deploy mobile units for rapid response during high-activity periods', 10);
    this.addParagraph('   - Coordinate with barangay officials for community-based monitoring', 10);

    this.currentY += 5;

    // Recommendation 4: Resolution improvement
    this.addParagraph('4. Case Resolution Enhancement', 11, true);
    this.addParagraph(`Current resolution rate is ${trends.resolutionRate}%:`, 10);
    if (trends.resolutionRate < 50) {
      this.addParagraph('   - Strengthen investigative capabilities through training and resources', 10);
      this.addParagraph('   - Improve evidence collection and documentation procedures', 10);
      this.addParagraph('   - Enhance coordination with prosecution and judicial systems', 10);
    } else {
      this.addParagraph('   - Maintain current investigative standards and procedures', 10);
      this.addParagraph('   - Share best practices with other units', 10);
      this.addParagraph('   - Continue professional development for investigators', 10);
    }

    this.currentY += 5;

    // Recommendation 5: Community engagement
    this.addParagraph('5. Community Partnership Programs', 11, true);
    this.addParagraph('Strengthen community involvement in crime prevention:', 10);
    this.addParagraph('   - Establish regular community forums and feedback sessions', 10);
    this.addParagraph('   - Create youth engagement programs to prevent juvenile delinquency', 10);
    this.addParagraph('   - Develop partnerships with local businesses for area security', 10);
    this.addParagraph('   - Implement neighborhood watch and reporting systems', 10);

    this.currentY += 10;
  }

  async generateReport(config: ReportConfig, data: ReportData): Promise<Blob> {
    // Add header
    this.addHeader();

    // Add report metadata
    this.addParagraph('Report Information', 12, true);
    this.addKeyValuePair('Location', data.barangayName, true);
    this.addKeyValuePair('Time Period', data.timeRange, true);
    this.addKeyValuePair('Report Type', 'Case Study Report');
    this.addKeyValuePair('Generated On', new Date().toLocaleString());
    this.currentY += 10;

    // Add sections based on configuration
    if (config.includeExecutiveSummary) {
      await this.addExecutiveSummary(data);
    }

    if (config.includeOverview) {
      this.addSituationalOverview(data);
    }

    if (config.includeTrends) {
      this.addTrendAnalysis(data);
    }

    if (config.includeTimePatterns) {
      this.addTemporalAnalysis(data);
    }

    if (config.includeCrimeTypes) {
      this.addCrimeClassification(data);
    }

    if (config.includeBarangayComparison) {
      this.addComparativeAnalysis(data);
    }

    if (config.includeRecommendations) {
      this.addStrategicRecommendations(data);
    }

    // Add footer to all pages
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.addFooter(i);
    }

    // Return as blob
    return this.doc.output('blob');
  }
}
