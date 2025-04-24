
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { BookOpen, FileCheck, FileCheck2, Calendar, Clock } from "lucide-react";
import { Progress } from "../components/ui/progress";
import { cn } from "../lib/utils";

export default function DashboardStudent() {
  // Mock data for demonstration
  const studentInfo = {
    name: "John Smith",
    department: "Computer Science",
  };
  
  const stats = [
    {
      title: "Active Courses",
      value: "5",
      icon: BookOpen,
      color: "bg-student-blue",
    },
    {
      title: "Pending Assignments",
      value: "3",
      icon: FileCheck,
      color: "bg-student-yellow",
    },
    {
      title: "Completed",
      value: "12",
      icon: FileCheck2,
      color: "bg-student-green",
    },
    {
      title: "GPA",
      value: "3.8",
      subtitle: "of 4.0",
      color: "bg-student-purple-light",
    },
  ];
  
  const deadlines = [
    {
      title: "Data Mining Project",
      course: "Advanced Data Analysis",
      due: "April 25, 2025",
      progress: 25,
      type: "assignment",
    },
    {
      title: "Midterm Exam",
      course: "Algorithms & Data Structures",
      due: "April 28, 2025",
      type: "exam",
    },
    {
      title: "UI/UX Design Portfolio",
      course: "Human-Computer Interaction",
      due: "May 2, 2025",
      progress: 60,
      type: "assignment",
    },
  ];

  const motivationalQuotes = [
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "The only way to do great work is to love what you do.",
    "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    "The beautiful thing about learning is that nobody can take it away from you.",
  ];

  // Get random quote
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {studentInfo.name}!</h1>
        <p className="text-muted-foreground">{studentInfo.department} Department</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="stat-card">
            <CardHeader className={cn("p-4 rounded-t-lg", stat.color)}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon && <stat.icon className="h-4 w-4" />}
              </div>
            </CardHeader>
            <CardContent className="p-4 flex items-baseline">
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.subtitle && (
                <div className="ml-2 text-xs text-muted-foreground">
                  {stat.subtitle}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-student-purple" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {deadlines.map((deadline) => (
              <div key={deadline.title} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{deadline.title}</div>
                    <div className="text-sm text-muted-foreground">{deadline.course}</div>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-3 w-3" />
                    <span>{deadline.due}</span>
                  </div>
                </div>
                {deadline.progress !== undefined && (
                  <Progress value={deadline.progress} className="h-2" />
                )}
                <div className="flex justify-end">
                  <div className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    deadline.type === "exam" 
                      ? "bg-student-yellow/30 text-amber-700" 
                      : "bg-student-purple-light/50 text-student-purple-dark"
                  )}>
                    {deadline.type === "exam" ? "Exam" : "Assignment"}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Motivation</CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="italic border-l-4 pl-4 border-student-purple">
              "{randomQuote}"
            </blockquote>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
