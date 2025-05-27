"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Download, BarChart, PieChart, LineChart, Users, AlertTriangle, CheckCircle } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { UserActivityReport } from "@/components/admin/user-activity-report"
import { ErrorCategoryReport } from "@/components/admin/error-category-report"
import { ResolutionTimeReport } from "@/components/admin/resolution-time-report"
import { PlatformUsageReport } from "@/components/admin/platform-usage-report"
import { getCookie } from "@/utils/cookies"
import jsPDF from 'jspdf';
// No need to import 'jsPDFType' separately if you're extending the module
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable'; // Ensure this is installed: npm install jspdf-autotable

// Extend jsPDF type to include autoTable
// This tells TypeScript that jsPDF instances will have an autoTable method.
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (...args: any[]) => jsPDF; // autoTable typically returns the jsPDF instance for chaining
  }
}

interface PlatformStats {
  total_users: number
  change_in_users: string
  total_errors: number
  change_in_errors: string
  total_solutions: number
  change_in_solutions: string
  solution_rate: string
  change_in_solution_rate: string
}

interface MonthData {
  [key: string]: {
    users?: number
    solutions?: number
    errors?: number
    comments?: number
    free?: number
    premium?: number
  }
}

interface LanguageError {
  [key: string]: {
    errors: number
    percentage: string
  }
}

interface ResolutionTimeData {
  [key: string]: {
    average_hours: number
    median_hours: number
  }
}

export default function ReportsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null)
  const [platformGrowth, setPlatformGrowth] = useState<MonthData[]>([])
  const [userActivity, setUserActivity] = useState<MonthData[]>([])
  const [userGrowth, setUserGrowth] = useState<MonthData[]>([])
  const [languageErrors, setLanguageErrors] = useState<LanguageError[]>([])
  const [resolutionTime, setResolutionTime] = useState<ResolutionTimeData[]>([])
  const [loading, setLoading] = useState({
    stats: true,
    growth: true,
    activity: true,
    userGrowth: true,
    langErrors: true,
    resolution: true
  })
  const [error, setError] = useState({
    stats: false,
    growth: false,
    activity: false,
    userGrowth: false,
    langErrors: false,
    resolution: false
  })
  const [isExporting, setIsExporting] = useState(false); // For loading state on button
  const csrftoken = getCookie("csrftoken")

  useEffect(() => {
    // --- Existing fetch logic remains the same ---
    // Fetch platform stats
    fetch('http://127.0.0.1:8000/bugtracker/platform-stats/', {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken ?? "" ,
        }
      })
      .then(response => response.json())
      .then(data => {
        const stats = data.reduce((acc: any, item: any) => ({ ...acc, ...item }), {})
        setPlatformStats(stats)
        setLoading(prev => ({ ...prev, stats: false }))
      })
      .catch(() => {
        setError(prev => ({ ...prev, stats: true }))
        setLoading(prev => ({ ...prev, stats: false }))
      })

    // Fetch platform growth
    fetch('http://127.0.0.1:8000/bugtracker/platform-growth/', {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken ?? "" ,
        }
      })
      .then(response => response.json())
      .then(data => {
        setPlatformGrowth(data)
        setLoading(prev => ({ ...prev, growth: false }))
      })
      .catch(() => {
        setError(prev => ({ ...prev, growth: true }))
        setLoading(prev => ({ ...prev, growth: false }))
      })

    // Fetch user activity
    fetch('http://127.0.0.1:8000/bugtracker/user-activity/', {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken ?? "" ,
        }
      })
      .then(response => response.json())
      .then(data => {
        setUserActivity(data)
        setLoading(prev => ({ ...prev, activity: false }))
      })
      .catch(() => {
        setError(prev => ({ ...prev, activity: true }))
        setLoading(prev => ({ ...prev, activity: false }))
      })

    // Fetch user growth
    fetch('http://127.0.0.1:8000/bugtracker/user-growth/', {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken ?? "" ,
        }
      })
      .then(response => response.json())
      .then(data => {
        setUserGrowth(data)
        setLoading(prev => ({ ...prev, userGrowth: false }))
      })
      .catch(() => {
        setError(prev => ({ ...prev, userGrowth: true }))
        setLoading(prev => ({ ...prev, userGrowth: false }))
      })

    // Fetch language errors
    fetch('http://127.0.0.1:8000/bugtracker/lang-error/', {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken ?? "" ,
        }
      })
      .then(response => response.json())
      .then(data => {
        setLanguageErrors(data)
        setLoading(prev => ({ ...prev, langErrors: false }))
      })
      .catch(() => {
        setError(prev => ({ ...prev, langErrors: true }))
        setLoading(prev => ({ ...prev, langErrors: false }))
      })

    // Fetch resolution time data
    fetch('http://127.0.0.1:8000/bugtracker/resolution-time/', {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken ?? "" ,
        }
      })
      .then(response => response.json())
      .then(data => {
        setResolutionTime(data)
        setLoading(prev => ({ ...prev, resolution: false }))
      })
      .catch(() => {
        setError(prev => ({ ...prev, resolution: true }))
        setLoading(prev => ({ ...prev, resolution: false }))
      })
  }, [csrftoken]) // Added csrftoken to dependency array

  // Transform platform growth data for charts
  const transformGrowthData = (data: MonthData[]) => {
    return data.map(monthObj => {
      const month = Object.keys(monthObj)[0]
      return {
        name: month,
        ...monthObj[month]
      }
    })
  }

  // Transform language error data for charts
  const transformLanguageData = (data: LanguageError[]) => {
    return data.map(langObj => {
      const lang = Object.keys(langObj)[0]
      return {
        name: lang,
        ...langObj[lang]
      }
    })
  }

  // Transform resolution time data for charts
  const transformResolutionData = (data: ResolutionTimeData[]) => {
    return data.map(timeObj => {
      const month = Object.keys(timeObj)[0]
      return {
        name: month,
        ...timeObj[month]
      }
    })
  }

  const handleExportAllReports = async () => {
  setIsExporting(true);
  const doc = new jsPDF('p', 'mm', 'a4');
  let yPos = 15;
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  const lineHeight = 7;
  const cellPadding = 4;

  // Helper functions (same as before)
  const addImageToPdf = async (canvas: HTMLCanvasElement, sectionTitle: string) => {
    const imgData = canvas.toDataURL('image/png');
    const imgProps = doc.getImageProperties(imgData);
    let imgHeight = (imgProps.height * contentWidth) / imgProps.width;

    if (yPos + imgHeight > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      doc.setFontSize(18);
      doc.text(`${sectionTitle} (Continued)`, margin, yPos);
      yPos += 8;
    }
    
    doc.addImage(imgData, 'PNG', margin, yPos, contentWidth, imgHeight);
    yPos += imgHeight + 10;
  };

  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  const addSectionHeader = (title: string) => {
    checkPageBreak(20);
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text(title, margin, yPos);
    yPos += 10;
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;
  };

  const addDataTable = (headers: string[], data: any[][], title?: string) => {
    if (title) {
      checkPageBreak(15);
      doc.setFontSize(14);
      doc.text(title, margin, yPos);
      yPos += 8;
    }

    const colCount = headers.length;
    const colWidth = contentWidth / colCount;
    const rowHeight = lineHeight + cellPadding * 2;

    // Check if we have space for at least header + 1 row
    checkPageBreak(rowHeight * 2);

    // Draw table header
    doc.setFontSize(10);
    doc.setFillColor(41, 128, 185);
    doc.setTextColor(255, 255, 255);
    
    headers.forEach((header, i) => {
      doc.rect(
        margin + i * colWidth, 
        yPos, 
        colWidth, 
        rowHeight, 
        'F'
      );
      doc.text(
        header,
        margin + i * colWidth + cellPadding,
        yPos + cellPadding + lineHeight / 2
      );
    });

    yPos += rowHeight;
    doc.setTextColor(0, 0, 0);

    // Draw table rows
    doc.setFontSize(9);
    data.forEach((row, rowIndex) => {
      // Check if we need a new page before drawing this row
      if (checkPageBreak(rowHeight)) {
        // Redraw headers on new page
        doc.setFillColor(41, 128, 185);
        doc.setTextColor(255, 255, 255);
        headers.forEach((header, i) => {
          doc.rect(
            margin + i * colWidth, 
            yPos, 
            colWidth, 
            rowHeight, 
            'F'
          );
          doc.text(
            header,
            margin + i * colWidth + cellPadding,
            yPos + cellPadding + lineHeight / 2
          );
        });
        yPos += rowHeight;
        doc.setTextColor(0, 0, 0);
      }

      // Alternate row colors
      doc.setFillColor(rowIndex % 2 === 0 ? 240 : 255, 240, 240);
      
      // Draw row background
      doc.rect(margin, yPos, contentWidth, rowHeight, 'F');
      
      // Draw cell borders and text
      headers.forEach((_, i) => {
        doc.rect(
          margin + i * colWidth, 
          yPos, 
          colWidth, 
          rowHeight
        );
        
        const cellValue = row[i] !== undefined ? String(row[i]) : '';
        doc.text(
          cellValue,
          margin + i * colWidth + cellPadding,
          yPos + cellPadding + lineHeight / 2,
          { maxWidth: colWidth - cellPadding * 2 }
        );
      });

      yPos += rowHeight;
    });

    yPos += 10; // Add some space after table
  };

  // Cover Page (same as before)
  doc.setFontSize(22);
  doc.text("Complete Platform Report", pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;
  
  doc.setFontSize(14);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;
  
  if (date) {
    doc.text(`Report date: ${format(date, "PPP")}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 20;
  }

  // 1. Platform Summary Section (same as before)
  addSectionHeader("Platform Summary");
  
  const summaryContainer = document.getElementById('summary-cards-container');
  if (summaryContainer) {
    try {
      const canvas = await html2canvas(summaryContainer, { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#ffffff',
        logging: false 
      });
      await addImageToPdf(canvas, "Platform Summary");
    } catch (e) {
      console.error("Error capturing summary cards:", e);
      doc.setTextColor(255, 0, 0);
      doc.text("Could not capture summary cards.", margin, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 10;
    }
  }

  if (platformStats) {
    addDataTable(
      ['Metric', 'Value', 'Change'],
      [
        ['Total Users', platformStats.total_users, platformStats.change_in_users],
        ['Total Errors', platformStats.total_errors, platformStats.change_in_errors],
        ['Total Solutions', platformStats.total_solutions, platformStats.change_in_solutions],
        ['Resolution Rate', platformStats.solution_rate, platformStats.change_in_solution_rate]
      ],
      'Detailed Platform Statistics'
    );
  }

  // 2. Platform Growth Data (same as before)
  if (platformGrowth.length > 0) {
    addSectionHeader("Platform Growth Data");
    
    const growthData = platformGrowth.map(item => {
      const month = Object.keys(item)[0];
      const data = item[month];
      return [
        month,
        data.users || 0,
        data.errors || 0,
        data.solutions || 0,
        data.comments || 0,
        data.free || 0,
        data.premium || 0
      ];
    });

    addDataTable(
      ['Month', 'Users', 'Errors', 'Solutions', 'Comments', 'Free', 'Premium'],
      growthData
    );
  }

  // 3. Enhanced Tab Content Capture
  addSectionHeader("Detailed Reports");
  
  const tabDefinitions = [
    { 
      value: 'overview', 
      title: 'Overview Report',
      component: PlatformUsageReport,
      props: { 
        data: transformGrowthData(platformGrowth),
        loading: loading.growth,
        error: error.growth
      }
    },
    { 
      value: 'users', 
      title: 'User Activity Report',
      component: UserActivityReport,
      props: {
        activityData: transformGrowthData(userActivity),
        growthData: transformGrowthData(userGrowth),
        loading: loading.activity || loading.userGrowth,
        error: error.activity || error.userGrowth
      }
    },
    { 
      value: 'errors', 
      title: 'Error Categories Report',
      component: ErrorCategoryReport,
      props: {
        data: transformLanguageData(languageErrors),
        loading: loading.langErrors,
        error: error.langErrors
      }
    },
    { 
      value: 'resolution', 
      title: 'Resolution Time Report',
      component: ResolutionTimeReport,
      props: {
        data: transformResolutionData(resolutionTime),
        loading: loading.resolution,
        error: error.resolution
      }
    }
  ];

  // Find the tabs container
  const tabsContainer = document.querySelector('[data-orientation="horizontal"]');
  const tablistElement = tabsContainer?.querySelector('[role="tablist"]');
  
  // Store original active tab
  let originalActiveTab: HTMLElement | null = null;
  if (tablistElement) {
    originalActiveTab = tablistElement.querySelector('[role="tab"][data-state="active"]');
  }

  for (const tabDef of tabDefinitions) {
    checkPageBreak(25);
    doc.setFontSize(18);
    doc.text(tabDef.title, margin, yPos);
    yPos += 8;

    // Try to capture the rendered tab content first
    let captured = false;
    if (tablistElement) {
      const trigger = tablistElement.querySelector<HTMLButtonElement>(`[role="tab"][value="${tabDef.value}"]`);
      
      if (trigger) {
        // Temporarily activate the tab
        trigger.click();
        await new Promise(resolve => setTimeout(resolve, 700));

        const contentPanelId = trigger.getAttribute('aria-controls');
        let contentElement: HTMLElement | null = null;
        
        if (contentPanelId) {
          contentElement = document.getElementById(contentPanelId);
        }
        if (!contentElement) {
          contentElement = document.querySelector<HTMLElement>(`div[role="tabpanel"][data-state="active"]`);
        }
        if (!contentElement && trigger.id) {
          contentElement = document.querySelector<HTMLElement>(`div[role="tabpanel"][aria-labelledby="${trigger.id}"]`);
        }
        
        if (contentElement) {
          contentElement.scrollTop = 0;

          try {
            const canvas = await html2canvas(contentElement, {
              scale: 2,
              useCORS: true,
              logging: false,
              backgroundColor: '#ffffff',
              height: contentElement.scrollHeight,
              width: contentElement.scrollWidth,
              windowHeight: contentElement.scrollHeight,
              windowWidth: contentElement.scrollWidth,
            });
            await addImageToPdf(canvas, tabDef.title);
            captured = true;
          } catch (e) {
            console.error(`Error capturing tab content for ${tabDef.title}:`, e);
          }
        }
      }
    }

    // If we couldn't capture the rendered tab, create a temporary render
    if (!captured) {
      try {
        // Create a temporary container
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.width = `${contentWidth}px`;
        document.body.appendChild(tempContainer);
        
        // Render the component directly
        const { createRoot } = await import('react-dom/client');
        const root = createRoot(tempContainer);
        root.render(
          // Use React.createElement for dynamic component rendering with props
          // eslint-disable-next-line react/no-children-prop
          (window as any).React.createElement(tabDef.component, { ...tabDef.props })
        );
        
        // Wait for rendering to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Capture the temporary container
        const canvas = await html2canvas(tempContainer, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: contentWidth
        });
        
        await addImageToPdf(canvas, tabDef.title);
        
        // Clean up
        root.unmount();
        document.body.removeChild(tempContainer);
      } catch (e) {
        console.error(`Error creating temporary render for ${tabDef.title}:`, e);
        doc.setTextColor(255, 0, 0);
        doc.text(`Could not capture content for ${tabDef.title}.`, margin, yPos);
        doc.setTextColor(0, 0, 0);
        yPos += 10;
      }
    }

    // Add supplemental data for each tab
    switch (tabDef.value) {
      case 'overview':
        if (platformGrowth.length > 0) {
          addDataTable(
            ['Month', 'Users', 'Errors', 'Solutions', 'Comments', 'Free', 'Premium'],
            platformGrowth.map(item => {
              const month = Object.keys(item)[0];
              const data = item[month];
              return [
                month,
                data.users || 0,
                data.errors || 0,
                data.solutions || 0,
                data.comments || 0,
                data.free || 0,
                data.premium || 0
              ];
            }),
            'Platform Growth Data'
          );
        }
        break;
        
      case 'users':
        if (userActivity.length > 0) {
          addDataTable(
            ['Month', 'Active Users', 'Errors Reported', 'Solutions Provided'],
            userActivity.map(item => {
              const month = Object.keys(item)[0];
              const data = item[month];
              return [month, data.users || 0, data.errors || 0, data.solutions || 0];
            }),
            'User Activity Data'
          );
        }
        if (userGrowth.length > 0) {
          addDataTable(
            ['Month', 'New Users', 'Free Users', 'Premium Users'],
            userGrowth.map(item => {
              const month = Object.keys(item)[0];
              const data = item[month];
              return [month, data.users || 0, data.free || 0, data.premium || 0];
            }),
            'User Growth Data'
          );
        }
        break;
        
      case 'errors':
        if (languageErrors.length > 0) {
          addDataTable(
            ['Language', 'Error Count', 'Percentage'],
            languageErrors.map(item => {
              const lang = Object.keys(item)[0];
              const data = item[lang];
              return [lang, data.errors, data.percentage];
            }),
            'Error Distribution by Language'
          );
        }
        break;
        
      case 'resolution':
        if (resolutionTime.length > 0) {
          addDataTable(
            ['Month', 'Average Resolution (hours)', 'Median Resolution (hours)'],
            resolutionTime.map(item => {
              const month = Object.keys(item)[0];
              const data = item[month];
              return [month, data.average_hours.toFixed(2), data.median_hours.toFixed(2)];
            }),
            'Resolution Time Data'
          );
        }
        break;
    }
  }

  // Restore original active tab if we changed it
  if (originalActiveTab) {
    (originalActiveTab as HTMLElement).click();
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Final Page - Summary (same as before)
  doc.addPage();
  yPos = margin;
  addSectionHeader("Report Summary");
  
  doc.setFontSize(14);
  doc.text("This report contains:", margin, yPos);
  yPos += 10;
  
  doc.text("- Platform summary statistics", margin, yPos);
  yPos += 7;
  doc.text("- Detailed growth metrics", margin, yPos);
  yPos += 7;
  doc.text("- Visual reports from all tabs", margin, yPos);
  yPos += 7;
  doc.text("- Raw data tables for reference", margin, yPos);
  yPos += 15;
  
  doc.text("Report generated by BugTracker Analytics", margin, yPos);
  yPos += 7;
  doc.text(new Date().toLocaleString(), margin, yPos);

  doc.save(`BugTracker_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  setIsExporting(false);
};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Button onClick={handleExportAllReports} variant="outline" disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Exporting..." : "Export Reports"}
          </Button>
        </div>
      </div>

      {/* IMPORTANT: Add id="summary-cards-container" to this div */}
      <div id="summary-cards-container" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {error.stats ? (
              <div className="text-red-500 text-xs">Error loading data</div>
            ) : loading.stats ? (
              <div className="animate-pulse">
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded mt-2"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{platformStats?.total_users || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {platformStats?.change_in_users || '+0%'} from last period
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {error.stats ? (
              <div className="text-red-500 text-xs">Error loading data</div>
            ) : loading.stats ? (
              <div className="animate-pulse">
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded mt-2"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{platformStats?.total_errors || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {platformStats?.change_in_errors || '+0%'} from last period
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Solutions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {error.stats ? (
              <div className="text-red-500 text-xs">Error loading data</div>
            ) : loading.stats ? (
              <div className="animate-pulse">
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded mt-2"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{platformStats?.total_solutions || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {platformStats?.change_in_solutions || '+0%'} from last period
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {error.stats ? (
              <div className="text-red-500 text-xs">Error loading data</div>
            ) : loading.stats ? (
              <div className="animate-pulse">
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded mt-2"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{platformStats?.solution_rate || '0%'}</div>
                <p className="text-xs text-muted-foreground">
                  {platformStats?.change_in_solution_rate || '+0%'} from last period
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <BarChart className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            User Activity
          </TabsTrigger>
          <TabsTrigger value="errors">
            <PieChart className="mr-2 h-4 w-4" />
            Error Categories
          </TabsTrigger>
          <TabsTrigger value="resolution">
            <LineChart className="mr-2 h-4 w-4" />
            Resolution Time
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4 mt-6">
          <PlatformUsageReport 
            data={transformGrowthData(platformGrowth)} 
            loading={loading.growth} 
            error={error.growth} 
          />
        </TabsContent>
        <TabsContent value="users" className="space-y-4 mt-6">
          <UserActivityReport 
            activityData={transformGrowthData(userActivity)} 
            growthData={transformGrowthData(userGrowth)} 
            loading={loading.activity || loading.userGrowth} 
            error={error.activity || error.userGrowth} 
          />
        </TabsContent>
        <TabsContent value="errors" className="space-y-4 mt-6">
          <ErrorCategoryReport 
            data={transformLanguageData(languageErrors)} 
            loading={loading.langErrors} 
            error={error.langErrors} 
          />
        </TabsContent>
        <TabsContent value="resolution" className="space-y-4 mt-6">
          <ResolutionTimeReport 
            data={transformResolutionData(resolutionTime)} 
            loading={loading.resolution} 
            error={error.resolution} 
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
