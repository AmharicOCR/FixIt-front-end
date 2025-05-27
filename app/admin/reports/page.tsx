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
    let yPos = 15; // Initial Y position for content
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;

    // Helper function to add image to PDF and manage yPosition
    const addImageToPdf = async (canvas: HTMLCanvasElement, sectionTitle: string) => {
      const imgData = canvas.toDataURL('image/png');
      const imgProps = doc.getImageProperties(imgData);
      let imgHeight = (imgProps.height * contentWidth) / imgProps.width;

      // Check if new page is needed for the image
      if (yPos + imgHeight > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
        // Optionally re-add section title if it continues on a new page
        doc.setFontSize(18);
        doc.text(`${sectionTitle} (Continued)`, margin, yPos);
        yPos += 8;
      }
      
      doc.addImage(imgData, 'PNG', margin, yPos, contentWidth, imgHeight);
      yPos += imgHeight + 10; // Add some padding after the image
    };


    doc.setFontSize(22);
    doc.text("Complete Report", pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // 1. Capture Summary Cards (ensure the container has id="summary-cards-container")
    const summaryContainer = document.getElementById('summary-cards-container');
    if (summaryContainer) {
      if (yPos + 20 > pageHeight - margin) { doc.addPage(); yPos = margin; }
      doc.setFontSize(18);
      doc.text("Platform Summary", margin, yPos);
      yPos += 8;

      try {
        const canvas = await html2canvas(summaryContainer, { 
            scale: 2, 
            useCORS: true, 
            backgroundColor: '#ffffff', // Ensures non-transparent background
            logging: false 
        });
        await addImageToPdf(canvas, "Platform Summary");
      } catch (e) {
        console.error("Error capturing summary cards:", e);
        if (yPos + 10 > pageHeight - margin) { doc.addPage(); yPos = margin; }
        doc.setTextColor(255,0,0);
        doc.text("Could not capture summary cards.", margin, yPos);
        doc.setTextColor(0,0,0);
        yPos += 10;
      }
    } else {
      console.warn("Summary cards container (id='summary-cards-container') not found.");
    }

    // 2. Capture Tabs
    const tabDefinitions = [
      { value: 'overview', title: 'Overview Report' },
      { value: 'users', title: 'User Activity Report' },
      { value: 'errors', title: 'Error Categories Report' },
      { value: 'resolution', title: 'Resolution Time Report' },
    ];

    const tablistElement = document.querySelector('[role="tablist"]');
    if (!tablistElement) {
        console.error("Tablist element not found. Cannot export tab reports.");
        if (yPos + 10 > pageHeight - margin) { doc.addPage(); yPos = margin; }
        doc.setTextColor(255,0,0);
        doc.text("Error: Tab navigation not found.", margin, yPos);
        doc.setTextColor(0,0,0);
        yPos += 10;
    } else {
        const originalActiveTrigger = tablistElement.querySelector<HTMLButtonElement>('[role="tab"][data-state="active"]');

        for (const tabDef of tabDefinitions) {
            if (yPos + 25 > pageHeight - margin) { // Check space for title + some content
                doc.addPage();
                yPos = margin;
            }

            const trigger = tablistElement.querySelector<HTMLButtonElement>(`[role="tab"][value="${tabDef.value}"]`);
            
            if (!trigger) {
                console.warn(`Trigger for tab ${tabDef.value} not found.`);
                doc.setFontSize(12);
                doc.setTextColor(255, 0, 0);
                doc.text(`Tab trigger for "${tabDef.title}" not found. Skipping.`, margin, yPos);
                doc.setTextColor(0,0,0);
                yPos += 10;
                continue;
            }

            trigger.click();
            // Wait for tab content to be visible and rendered. Adjust delay if necessary.
            await new Promise(resolve => setTimeout(resolve, 700)); 

            const contentPanelId = trigger.getAttribute('aria-controls');
            let contentElement: HTMLElement | null = null;
            if (contentPanelId) {
                contentElement = document.getElementById(contentPanelId);
            }
            if (!contentElement) { // Fallback selectors
                contentElement = document.querySelector<HTMLElement>(`div[role="tabpanel"][data-state="active"]`);
            }
            if (!contentElement && trigger.id) {
                contentElement = document.querySelector<HTMLElement>(`div[role="tabpanel"][aria-labelledby="${trigger.id}"]`);
            }
            
            doc.setFontSize(18);
            doc.text(tabDef.title, margin, yPos);
            yPos += 8;

            if (contentElement) {
                contentElement.scrollTop = 0; // Ensure top of content is captured

                try {
                    const canvas = await html2canvas(contentElement, {
                        scale: 2,
                        useCORS: true,
                        logging: false,
                        backgroundColor: '#ffffff',
                        height: contentElement.scrollHeight, // Capture full scrollable height
                        width: contentElement.scrollWidth,   // Capture full scrollable width
                        windowHeight: contentElement.scrollHeight,
                        windowWidth: contentElement.scrollWidth,
                    });
                    await addImageToPdf(canvas, tabDef.title);
                } catch (e) {
                    console.error(`Error capturing tab content for ${tabDef.title}:`, e);
                    if (yPos + 10 > pageHeight - margin) { doc.addPage(); yPos = margin; }
                    doc.setTextColor(255,0,0);
                    doc.text(`Could not capture content for ${tabDef.title}.`, margin, yPos);
                    doc.setTextColor(0,0,0);
                    yPos += 10;
                }
            } else {
                console.warn(`Content element for tab ${tabDef.value} not found after activation.`);
                if (yPos + 10 > pageHeight - margin) { doc.addPage(); yPos = margin; }
                doc.setTextColor(255,0,0);
                doc.text(`Content for "${tabDef.title}" was not found.`, margin, yPos);
                doc.setTextColor(0,0,0);
                yPos += 10;
            }
        }

        // Restore the originally active tab
        if (originalActiveTrigger) {
            originalActiveTrigger.click();
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    doc.save('All_Reports.pdf');
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
