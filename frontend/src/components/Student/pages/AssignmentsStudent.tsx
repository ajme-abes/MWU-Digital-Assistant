
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
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
import { Clock, FileUp, Eye} from "lucide-react";
import { cn } from "../lib/utils";

export default function AssignmentsStudent() {
  // Mock data for demonstration
  const assignments = [
    {
      id: 1,
      title: "Database Normalization",
      course: "Advanced Database Systems",
      dueDate: "April 25, 2025",
      status: "pending",
      grade: null,
    },
    {
      id: 2,
      title: "Neural Network Implementation",
      course: "Machine Learning",
      dueDate: "April 29, 2025",
      status: "submitted",
      submittedDate: "April 21, 2025",
      grade: null,
    },
    {
      id: 3,
      title: "Responsive Design Project",
      course: "UI/UX Design Principles",
      dueDate: "April 15, 2025",
      status: "graded",
      submittedDate: "April 14, 2025",
      grade: 92,
      feedback: "Excellent work on the responsive components!",
    },
    {
      id: 4,
      title: "REST API Development",
      course: "Web Application Architecture",
      dueDate: "April 18, 2025",
      status: "graded",
      submittedDate: "April 16, 2025",
      grade: 88,
      feedback: "Good implementation, but missing error handling in some endpoints.",
    },
    {
      id: 5,
      title: "Data Visualization Dashboard",
      course: "Data Visualization",
      dueDate: "May 2, 2025",
      status: "pending",
      grade: null,
    },
  ];

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredAssignments = assignments.filter(assignment => {
    // Filter by status
    if (filter !== "all" && assignment.status !== filter) {
      return false;
    }
    
    // Filter by search
    if (search && 
        !(assignment.title.toLowerCase().includes(search.toLowerCase()) || 
          assignment.course.toLowerCase().includes(search.toLowerCase()))) {
      return false;
    }
    
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>;
      case "submitted":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Submitted</Badge>;
      case "graded":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Graded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>All Assignments</CardTitle>
          <CardDescription>View and manage your course assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder="Search assignments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:max-w-sm"
            />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="sm:max-w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignments</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="graded">Graded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Assignment</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{assignment.title}</TableCell>
                      <TableCell>{assignment.course}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span
                            className={cn(
                              assignment.status === "pending" &&
                                new Date(assignment.dueDate) < new Date() &&
                                "text-destructive"
                            )}
                          >
                            {assignment.dueDate}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {assignment.status === "pending" && (
                            <Button size="sm" className="gap-1">
                              <FileUp className="h-4 w-4" />
                              <span className="hidden sm:inline">Submit</span>
                            </Button>
                          )}
                          {assignment.status === "submitted" && (
                            <Button size="sm" variant="outline" className="gap-1">
                              <Eye className="h-4 w-4" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                          )}
                          {assignment.status === "graded" && (
                            <Button size="sm" variant="outline" className="gap-1">
                              <Eye className="h-4 w-4" />
                              <span className="hidden sm:inline">Feedback</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No assignments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {filteredAssignments.some(a => a.status === "graded") && (
        <Card>
          <CardHeader>
            <CardTitle>Graded Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAssignments
                .filter(a => a.status === "graded")
                .map(assignment => (
                  <div key={`feedback-${assignment.id}`} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{assignment.title}</h3>
                        <p className="text-sm text-muted-foreground">{assignment.course}</p>
                      </div>
                      <div className="flex items-center space-x-1 text-2xl font-bold">
                        <span className={assignment.grade && assignment.grade >= 90 ? "text-green-600" : ""}>{assignment.grade}</span>
                        <span className="text-muted-foreground text-base">/100</span>
                      </div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md text-sm">
                      <p className="font-medium mb-1">Instructor Feedback:</p>
                      <p>{assignment.feedback}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
