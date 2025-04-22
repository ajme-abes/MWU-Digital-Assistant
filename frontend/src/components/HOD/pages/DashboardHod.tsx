
import { Activity, BookOpen, Calendar, ChevronRight, Clock, FileCheck, User, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";

// Mock data for demonstration
const activityData = [
  { month: "Jan", students: 40, teachers: 24 },
  { month: "Feb", students: 30, teachers: 13 },
  { month: "Mar", students: 20, teachers: 8 },
  { month: "Apr", students: 27, teachers: 10 },
  { month: "May", students: 18, teachers: 7 },
  { month: "Jun", students: 23, teachers: 11 },
];

const recentActivities = [
  {
    id: 1,
    type: "resource",
    title: "Intro to Neural Networks",
    course: "AI Fundamentals",
    user: "Dr. Smith",
    time: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    type: "course",
    title: "Advanced Algorithms",
    user: "Dr. Johnson",
    time: "1 day ago",
    status: "approved",
  },
  {
    id: 3,
    type: "enrollment",
    title: "New students enrolled",
    course: "Data Structures",
    count: 15,
    time: "2 days ago",
  },
];

export default function DashboardHod() {
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Welcome, Dr. Harris</h1>
        <p className="text-muted-foreground">
          Head of Computer Science Department
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">
              +2 courses this semester
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              5 resources, 2 courses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Department Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">187</div>
            <p className="text-xs text-muted-foreground">
              24 teachers, 163 students
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">19</div>
            <p className="text-xs text-muted-foreground">
              Deadline this week: 8
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Department Activity</CardTitle>
            <CardDescription>Student and teacher activity over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="students" name="Students" fill="#4359a7" />
                <Bar dataKey="teachers" name="Teachers" fill="#9ab7de" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-2 md:col-span-1">
          <CardHeader className="flex flex-row items-center">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from the department</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="rounded-full p-2 bg-muted">
                    {activity.type === "resource" && <FileCheck className="h-4 w-4" />}
                    {activity.type === "course" && <BookOpen className="h-4 w-4" />}
                    {activity.type === "enrollment" && <Users className="h-4 w-4" />}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">{activity.title}</p>
                      {activity.status && (
                        <Badge className={`ml-2 ${activity.status === "pending" ? "bg-warning text-warning-foreground" : "bg-success text-success-foreground"}`}>
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                    {activity.course && (
                      <p className="text-xs text-muted-foreground">in {activity.course}</p>
                    )}
                    <div className="flex items-center pt-1 text-xs text-muted-foreground">
                      {activity.count ? (
                        <span>{activity.count} students</span>
                      ) : (
                        <span>By {activity.user}</span>
                      )}
                      <span className="ml-auto flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              Load More
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
