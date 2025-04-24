
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Clock, Calendar, Users } from "lucide-react";

export default function CoursesStudent() {
  // Mock data for demonstration
  const courses = [
    {
      id: 1,
      name: "Advanced Database Systems",
      code: "CS-501",
      instructor: "Dr. Rebecca Chen",
      progress: 65,
      schedule: "Mon, Wed 10:00-11:30 AM",
      students: 32,
      category: "Computer Science",
      color: "bg-student-purple-light",
    },
    {
      id: 2,
      name: "Machine Learning",
      code: "CS-520",
      instructor: "Prof. James Wilson",
      progress: 42,
      schedule: "Tue, Thu 1:00-2:30 PM",
      students: 28,
      category: "Artificial Intelligence",
      color: "bg-student-blue",
    },
    {
      id: 3,
      name: "UI/UX Design Principles",
      code: "DES-340",
      instructor: "Prof. Sophia Rivera",
      progress: 78,
      schedule: "Wed, Fri 3:00-4:30 PM",
      students: 25,
      category: "Design",
      color: "bg-student-pink",
    },
    {
      id: 4,
      name: "Web Application Architecture",
      code: "CS-431",
      instructor: "Dr. Michael Thompson",
      progress: 55,
      schedule: "Mon, Thu 2:00-3:30 PM",
      students: 30,
      category: "Web Development",
      color: "bg-student-yellow",
    },
    {
      id: 5,
      name: "Data Visualization",
      code: "DS-410",
      instructor: "Prof. Emma Clark",
      progress: 35,
      schedule: "Tue, Fri 11:00-12:30 PM",
      students: 22,
      category: "Data Science",
      color: "bg-student-green",
    },
    {
      id: 6,
      name: "Mobile App Development",
      code: "CS-450",
      instructor: "Dr. Robert Zhang",
      progress: 20,
      schedule: "Mon, Wed 3:00-4:30 PM",
      students: 26,
      category: "Mobile Development",
      color: "bg-student-orange",
    },
  ];

  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
        <div className="flex gap-2">
          <Button
            variant={view === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('grid')}
          >
            Grid
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('list')}
          >
            List
          </Button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="course-card overflow-hidden">
              <div className={`h-1 w-full ${course.color}`}></div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-semibold">
                    {course.name}
                  </CardTitle>
                  <Badge variant="outline">{course.code}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {course.instructor}
                </p>
              </CardHeader>
              <CardContent className="pb-2 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Course Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground truncate">
                      {course.schedule}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {course.students} students
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Course</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <Card key={course.id} className="course-card">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">
                      {course.name}{" "}
                      <Badge variant="outline" className="ml-2">
                        {course.code}
                      </Badge>
                    </h3>
                    <Badge className={course.color.replace('bg-', 'bg-opacity-20 text-')}>
                      {course.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {course.instructor}
                  </p>
                  <div className="flex items-center gap-4 text-sm mt-2">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {course.schedule}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {course.students} students
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:w-80">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  <Button size="sm">View Course</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
