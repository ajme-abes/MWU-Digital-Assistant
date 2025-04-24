import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function GradesStudent() {
  const [term, setTerm] = useState("current");

  // Mock data for demonstration
  const grades = {
    current: [
      {
        course: "Advanced Database Systems",
        code: "CS-501",
        credits: 3,
        assignments: 92,
        midterm: 88,
        final: null,
        overall: 90,
        grade: "A-",
      },
      {
        course: "Machine Learning",
        code: "CS-520",
        credits: 4,
        assignments: 85,
        midterm: 78,
        final: null,
        overall: 82,
        grade: "B",
      },
      {
        course: "UI/UX Design Principles",
        code: "DES-340",
        credits: 3,
        assignments: 95,
        midterm: 91,
        final: null,
        overall: 93,
        grade: "A",
      },
      {
        course: "Web Application Architecture",
        code: "CS-431",
        credits: 3,
        assignments: 88,
        midterm: 85,
        final: null,
        overall: 87,
        grade: "B+",
      },
      {
        course: "Data Visualization",
        code: "DS-410",
        credits: 3,
        assignments: 90,
        midterm: null,
        final: null,
        overall: 90,
        grade: "A-",
      },
    ],
    previous: [
      {
        course: "Introduction to Algorithms",
        code: "CS-310",
        credits: 4,
        assignments: 86,
        midterm: 78,
        final: 82,
        overall: 82,
        grade: "B",
      },
      {
        course: "Operating Systems",
        code: "CS-420",
        credits: 3,
        assignments: 92,
        midterm: 88,
        final: 95,
        overall: 92,
        grade: "A-",
      },
      {
        course: "Computer Networks",
        code: "CS-440",
        credits: 3,
        assignments: 85,
        midterm: 80,
        final: 87,
        overall: 84,
        grade: "B",
      },
      {
        course: "Software Engineering",
        code: "CS-400",
        credits: 3,
        assignments: 94,
        midterm: 96,
        final: 92,
        overall: 94,
        grade: "A",
      },
    ],
  };

  const chartData = [
    ...grades.previous.map(course => ({
      name: course.code,
      grade: course.overall,
      term: 'Previous',
    })),
    ...grades.current.map(course => ({
      name: course.code,
      grade: course.overall,
      term: 'Current',
    })),
  ];

  const calculateGPA = (courseList: Array<{
    course: string;
    code: string;
    credits: number;
    assignments: number;
    midterm: number | null;
    final: number | null;
    overall: number;
    grade: string;
  }>) => {
    const totalCredits = courseList.reduce((sum, course) => sum + course.credits, 0);
    const gradePoints = courseList.reduce((sum, course) => {
      const gradeValue = 
        course.grade === 'A' ? 4.0 :
        course.grade === 'A-' ? 3.7 :
        course.grade === 'B+' ? 3.3 :
        course.grade === 'B' ? 3.0 :
        course.grade === 'B-' ? 2.7 :
        course.grade === 'C+' ? 2.3 :
        course.grade === 'C' ? 2.0 :
        course.grade === 'C-' ? 1.7 :
        course.grade === 'D+' ? 1.3 :
        course.grade === 'D' ? 1.0 : 0;
      
      return sum + (gradeValue * course.credits);
    }, 0);
    
    return (gradePoints / totalCredits).toFixed(2);
  };

  const currentGPA = calculateGPA(grades.current);
  const previousGPA = calculateGPA(grades.previous);
  const overallGPA = calculateGPA([...grades.current, ...grades.previous]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">My Grades</h1>
        <Select value={term} onValueChange={setTerm}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Term" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Term</SelectItem>
            <SelectItem value="previous">Previous Term</SelectItem>
            <SelectItem value="all">All Terms</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              {currentGPA}
            </CardTitle>
            <CardDescription>Current Term GPA</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              {previousGPA}
            </CardTitle>
            <CardDescription>Previous Term GPA</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              {overallGPA}
            </CardTitle>
            <CardDescription>Cumulative GPA</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grade Breakdown</CardTitle>
          <CardDescription>
            {term === "current" 
              ? "Current term grades" 
              : term === "previous"
                ? "Previous term grades"
                : "All terms grades"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">Course</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead className="text-right">Assignments</TableHead>
                  <TableHead className="text-right">Midterm</TableHead>
                  <TableHead className="text-right">Final</TableHead>
                  <TableHead className="text-right">Overall</TableHead>
                  <TableHead className="text-right">Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(term === "all" 
                  ? [...grades.current, ...grades.previous]
                  : term === "current" 
                    ? grades.current
                    : grades.previous
                ).map((course) => (
                  <TableRow key={course.code}>
                    <TableCell className="font-medium">{course.course}</TableCell>
                    <TableCell>{course.code}</TableCell>
                    <TableCell className="text-right">{course.assignments}</TableCell>
                    <TableCell className="text-right">{course.midterm || "N/A"}</TableCell>
                    <TableCell className="text-right">{course.final || "N/A"}</TableCell>
                    <TableCell className="text-right">{course.overall}</TableCell>
                    <TableCell className="text-right font-medium">{course.grade}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Grade Trends</CardTitle>
          <CardDescription>Grade progress across terms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[60, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="grade"
                  name="Grade"
                  stroke="#9b87f5"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
