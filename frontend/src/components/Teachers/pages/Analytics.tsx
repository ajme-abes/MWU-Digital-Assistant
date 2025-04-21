import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Download, Filter } from "lucide-react";

// Mock data for charts
const attendanceData = [
  { name: "Week 1", CS101: 95, CS201: 88, CS301: 92 },
  { name: "Week 2", CS101: 88, CS201: 92, CS301: 89 },
  { name: "Week 3", CS101: 92, CS201: 85, CS301: 94 },
  { name: "Week 4", CS101: 90, CS201: 88, CS301: 91 },
  { name: "Week 5", CS101: 86, CS201: 90, CS301: 87 },
  { name: "Week 6", CS101: 94, CS201: 92, CS301: 90 },
  { name: "Week 7", CS101: 91, CS201: 88, CS301: 93 },
  { name: "Week 8", CS101: 89, CS201: 91, CS301: 88 },
];

const gradesDistribution = [
  { name: "A", CS101: 25, CS201: 18, CS301: 22 },
  { name: "B", CS101: 35, CS201: 28, CS301: 30 },
  { name: "C", CS101: 20, CS201: 25, CS301: 18 },
  { name: "D", CS101: 12, CS201: 15, CS301: 10 },
  { name: "F", CS101: 8, CS201: 14, CS301: 5 },
];

const completionRateData = [
  { name: "Assignment 1", completed: 90, incomplete: 10 },
  { name: "Assignment 2", completed: 85, incomplete: 15 },
  { name: "Assignment 3", completed: 78, incomplete: 22 },
  { name: "Assignment 4", completed: 92, incomplete: 8 },
  { name: "Assignment 5", completed: 80, incomplete: 20 },
];

const studentEngagementData = [
  { name: "Very Active", value: 35 },
  { name: "Active", value: 45 },
  { name: "Occasionally", value: 15 },
  { name: "Rarely", value: 5 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

export default function Analytics() {
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("semester");

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold">Course Analytics</h1>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="CS101">CS101: Intro to Programming</SelectItem>
              <SelectItem value="CS201">CS201: Data Structures</SelectItem>
              <SelectItem value="CS301">CS301: Algorithms</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="semester">Current Semester</SelectItem>
              <SelectItem value="year">Academic Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Attendance</CardTitle>
            <CardDescription>Overall attendance rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold">89%</span>
                <Badge variant="outline" className="ml-2">+2%</Badge>
              </div>
              <div className="text-right">
                <span className="text-sm text-muted-foreground">Courses average</span>
                <div className="text-sm font-medium">Target: 85%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Assignment Completion</CardTitle>
            <CardDescription>Submission rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold">86%</span>
                <Badge variant="outline" className="ml-2 bg-red-50 text-red-600 border-red-200">-4%</Badge>
              </div>
              <div className="text-right">
                <span className="text-sm text-muted-foreground">Current period</span>
                <div className="text-sm font-medium">Target: 90%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Grade</CardTitle>
            <CardDescription>Student performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold">B+</span>
                <Badge variant="outline" className="ml-2">+0.2</Badge>
              </div>
              <div className="text-right">
                <span className="text-sm text-muted-foreground">GPA: 3.3</span>
                <div className="text-sm font-medium">Target: B</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trends</CardTitle>
                <CardDescription>Weekly attendance rates across courses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[60, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="CS101" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="CS201" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="CS301" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Distribution of grades across courses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gradesDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="CS101" fill="#8884d8" />
                    <Bar dataKey="CS201" fill="#82ca9d" />
                    <Bar dataKey="CS301" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Assignment Completion</CardTitle>
                <CardDescription>Completion rate by assignment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={completionRateData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="incomplete" stackId="a" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Student Engagement</CardTitle>
                <CardDescription>Overall student participation levels</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={studentEngagementData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {studentEngagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Attendance Analysis</CardTitle>
              <CardDescription>Weekly attendance patterns for all courses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[60, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="CS101" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="CS201" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="CS301" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="grades">
          <Card>
            <CardHeader>
              <CardTitle>Comprehensive Grade Analysis</CardTitle>
              <CardDescription>Grade distribution and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={gradesDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="CS101" fill="#8884d8" />
                  <Bar dataKey="CS201" fill="#82ca9d" />
                  <Bar dataKey="CS301" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Engagement Levels</CardTitle>
                <CardDescription>Participation breakdown by activity level</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={studentEngagementData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {studentEngagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Assignment Completion</CardTitle>
                <CardDescription>Submission rates by assignment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={completionRateData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="incomplete" stackId="a" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>
            Key observations and recommendations based on the analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-amber-50 border-amber-200 text-amber-900">
              <h3 className="font-medium mb-1">Attendance Declining in CS201</h3>
              <p className="text-sm">
                There's a noticeable downward trend in attendance for CS201 in the past 3 weeks. 
                Consider reviewing teaching methods or reaching out to students for feedback.
              </p>
            </div>
            
            <div className="p-4 border rounded-md bg-green-50 border-green-200 text-green-900">
              <h3 className="font-medium mb-1">Improved Grade Distribution in CS301</h3>
              <p className="text-sm">
                The grade distribution in CS301 has improved compared to last semester, with 
                more students achieving B grades or higher. The new study materials seem effective.
              </p>
            </div>
            
            <div className="p-4 border rounded-md bg-blue-50 border-blue-200 text-blue-900">
              <h3 className="font-medium mb-1">Assignment 3 Has Low Completion Rate</h3>
              <p className="text-sm">
                Assignment 3 has the lowest completion rate at 78%. Consider reviewing its 
                difficulty level or providing additional resources to help students.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
