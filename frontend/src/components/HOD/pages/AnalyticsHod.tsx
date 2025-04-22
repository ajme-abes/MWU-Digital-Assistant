import { useState } from "react";
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ArrowUpRight, CalendarRange, Download, TrendingUp } from "lucide-react";

// Mock data for demonstration
const courseActivityData = [
  { month: "Jan", submissions: 120, resources: 24, attendance: 89 },
  { month: "Feb", submissions: 132, resources: 29, attendance: 92 },
  { month: "Mar", submissions: 101, resources: 18, attendance: 85 },
  { month: "Apr", submissions: 134, resources: 31, attendance: 90 },
  { month: "May", submissions: 90, resources: 15, attendance: 79 },
  { month: "Jun", submissions: 125, resources: 26, attendance: 87 },
];

const teacherPerformanceData = [
  { name: "Dr. Johnson", rating: 4.8, submissions: 95, resources: 15 },
  { name: "Dr. Smith", rating: 4.5, submissions: 87, resources: 12 },
  { name: "Dr. Williams", rating: 4.7, submissions: 92, resources: 18 },
  { name: "Dr. Thompson", rating: 4.2, submissions: 78, resources: 9 },
  { name: "Dr. Davis", rating: 4.6, submissions: 89, resources: 14 },
];

const submissionRateData = [
  { course: "CS101", onTime: 85, late: 10, missing: 5 },
  { course: "CS202", onTime: 72, late: 18, missing: 10 },
  { course: "CS350", onTime: 78, late: 15, missing: 7 },
  { course: "CS401", onTime: 65, late: 20, missing: 15 },
  { course: "CS502", onTime: 82, late: 13, missing: 5 },
];

const resourceApprovalData = [
  { name: "Approved", value: 68, color: "#10B981" },
  { name: "Pending", value: 25, color: "#F59E0B" },
  { name: "Rejected", value: 7, color: "#EF4444" },
];

export default function AnalyticsHod() {
  const [timeRange, setTimeRange] = useState("6m");
  const [selectedTab, setSelectedTab] = useState("course");

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Department Analytics</h1>
        <p className="text-muted-foreground">
          Insights and statistics for the Computer Science department
        </p>
      </section>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-2">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="course">Course Activity</TabsTrigger>
            <TabsTrigger value="teachers">Teacher Performance</TabsTrigger>
            <TabsTrigger value="submissions">Submission Rates</TabsTrigger>
            <TabsTrigger value="resources">Resource Approvals</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <CalendarRange className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Wrap all tab content within a single Tabs component */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        {/* Course Activity Tab */}
        <TabsContent value="course" className="space-y-4 mt-0">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">702</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUpRight className="mr-1 h-3 w-3 text-success" />
                  <span className="text-success font-medium">12%</span>
                  <span className="ml-1">from last period</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Resource Uploads</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">143</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUpRight className="mr-1 h-3 w-3 text-success" />
                  <span className="text-success font-medium">8%</span>
                  <span className="ml-1">from last period</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUpRight className="mr-1 h-3 w-3 text-success" />
                  <span className="text-success font-medium">3%</span>
                  <span className="ml-1">from last period</span>
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Course Activity</CardTitle>
              <CardDescription>
                Submissions, resources, and attendance over time
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 p-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={courseActivityData}>
                    <defs>
                      <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2} />
                      </linearGradient>
                      <linearGradient id="colorResources" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2} />
                      </linearGradient>
                      <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ffc658" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="submissions" 
                      stroke="#8884d8" 
                      fillOpacity={1} 
                      fill="url(#colorSubmissions)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="resources" 
                      stroke="#82ca9d" 
                      fillOpacity={1} 
                      fill="url(#colorResources)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="attendance" 
                      stroke="#ffc658" 
                      fillOpacity={1} 
                      fill="url(#colorAttendance)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teacher Performance Tab */}
        <TabsContent value="teachers" className="space-y-4 mt-0">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Teacher Performance</CardTitle>
              <CardDescription>
                Rating, submission rates, and resource quality
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 p-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teacherPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="submissions" name="Submissions Reviewed" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="resources" name="Resources Created" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 p-3">
              <div className="grid grid-cols-5 w-full">
                {teacherPerformanceData.map((teacher, index) => (
                  <div key={index} className="flex flex-col items-center justify-center text-center p-2">
                    <div className="text-sm font-medium truncate max-w-full">{teacher.name}</div>
                    <div className="mt-1 flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="font-semibold">{teacher.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Submission Rates Tab */}
        <TabsContent value="submissions" className="space-y-4 mt-0">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="overflow-hidden md:col-span-2">
              <CardHeader>
                <CardTitle>Submission Rates by Course</CardTitle>
                <CardDescription>
                  On-time, late, and missing submission statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-96 p-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={submissionRateData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="course" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="onTime" name="On Time" stackId="a" fill="#10B981" />
                      <Bar dataKey="late" name="Late" stackId="a" fill="#F59E0B" />
                      <Bar dataKey="missing" name="Missing" stackId="a" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Resource Approvals Tab */}
        <TabsContent value="resources" className="space-y-4 mt-0">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Resource Approval Status</CardTitle>
                <CardDescription>
                  Distribution of resource approval statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={resourceApprovalData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {resourceApprovalData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center mt-4 space-x-4">
                  {resourceApprovalData.map((entry, index) => (
                    <div key={index} className="flex items-center">
                      <div 
                        className="w-3 h-3 mr-2 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="text-sm">{entry.name}: {entry.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Approval Timeline</CardTitle>
                <CardDescription>
                  Resource approval trend over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: "Jan", approved: 10, rejected: 2 },
                      { month: "Feb", approved: 15, rejected: 3 },
                      { month: "Mar", approved: 12, rejected: 1 },
                      { month: "Apr", approved: 18, rejected: 4 },
                      { month: "May", approved: 16, rejected: 2 },
                      { month: "Jun", approved: 22, rejected: 3 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="approved" 
                      name="Approved" 
                      stroke="#10B981" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rejected" 
                      name="Rejected" 
                      stroke="#EF4444" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
