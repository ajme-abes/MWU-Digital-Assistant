import { useState } from "react";
import { Course, assignmentsData, resourcesData, studentsData } from "../../data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  FileText,
  Upload,
  Users,
  X,
  FileCheck,
  BookOpen,
  GraduationCap,
  FilePlus
} from "lucide-react";
import { cn } from "../../lib/utils"
import "./CoursePanel.css";

interface CoursePanelProps {
  course: Course;
  onClose: () => void;
}

export function CoursePanel({ course, onClose }: CoursePanelProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const courseAssignments = assignmentsData.filter(
    (assignment) => assignment.courseId === course.id
  );
  
  const courseResources = resourcesData.filter(
    (resource) => resource.courseId === course.id
  );

  // For demo purposes, we'll just take a subset of students for each course
  const courseStudents = studentsData.slice(0, course.students > 40 ? 8 : 6);

  const resourceTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "video":
        return <FileText className="h-4 w-4" />;
      case "link":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-card border rounded-lg overflow-hidden transition-all mt-6">
      <div className="bg-muted px-4 py-3 flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full course-color-dot"
            style={{"--course-color": course.color} as React.CSSProperties}
          ></div>
          {course.code}: {course.name}
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="px-4 pt-2 border-b bg-muted/40">
          <TabsList className="bg-transparent h-10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background">
              <BookOpen className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-background">
              <Users className="h-4 w-4 mr-2" />
              Students
            </TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-background">
              <FilePlus className="h-4 w-4 mr-2" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-background">
              <Upload className="h-4 w-4 mr-2" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="grading" className="data-[state=active]:bg-background">
              <FileCheck className="h-4 w-4 mr-2" />
              Grading
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Course Information</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-muted-foreground">Course Code:</p>
                    <p className="font-medium">{course.code}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Section:</p>
                    <p className="font-medium">{course.section}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Semester:</p>
                    <p className="font-medium">{course.semester}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Enrolled:</p>
                    <p className="font-medium">{course.students} students</p>
                  </div>
                </div>
                <p className="text-muted-foreground mt-4">Description:</p>
                <p>{course.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Stats & Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Course Completion</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-muted/50 p-3 rounded-md">
                      <GraduationCap className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-xs text-muted-foreground">Assignments</p>
                      <p className="font-semibold">{courseAssignments.length}</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md">
                      <FileText className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-xs text-muted-foreground">Resources</p>
                      <p className="font-semibold">{courseResources.length}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                {courseAssignments.length > 0 ? (
                  <div className="space-y-3">
                    {courseAssignments.slice(0, 3).map((assignment) => (
                      <div key={assignment.id} className="flex items-center p-2 rounded-md hover:bg-muted">
                        <div className="mr-3 h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{assignment.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {assignment.submissionsCount}/{assignment.totalStudents}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No upcoming deadlines for this course.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <FilePlus className="h-4 w-4 mr-2" />
                    Create Assignment
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Resource
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Students
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="p-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Enrolled Students</CardTitle>
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
              <CardDescription>Total of {course.students} students enrolled</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {courseStudents.map((student) => (
                    <div key={student.id} className="flex items-center p-2 rounded-md hover:bg-muted">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <Badge variant={student.submissions > 7 ? "default" : "outline"} className="ml-2">
                          {student.submissions} submissions
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Assignments</h3>
            <Button>
              <FilePlus className="h-4 w-4 mr-2" />
              Create New Assignment
            </Button>
          </div>

          {courseAssignments.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {courseAssignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <div className="mr-3 h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{assignment.title}</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="outline">
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </Badge>
                          <Badge variant="outline" className={cn(
                            assignment.status === 'active' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                            assignment.status === 'upcoming' ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" :
                            "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300"
                          )}>
                            {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="mt-3 flex items-center text-sm text-muted-foreground">
                          <p>Submissions: {assignment.submissionsCount}/{assignment.totalStudents}</p>
                          <div className="ml-auto flex items-center gap-2">
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm">View</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <FilePlus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-lg mb-1">No Assignments Yet</h3>
                <p className="text-muted-foreground mb-4">Create your first assignment for this course</p>
                <Button>
                  <FilePlus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resources" className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Course Resources</h3>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Resource
            </Button>
          </div>

          {courseResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courseResources.map((resource) => (
                <Card key={resource.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <div className="mr-3 h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                        {resourceTypeIcon(resource.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{resource.title}</h4>
                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                          <Badge variant="outline" className="mr-2">
                            {resource.type.toUpperCase()}
                          </Badge>
                          <p>
                            Uploaded: {new Date(resource.uploadDate).toLocaleDateString()}
                          </p>
                          {resource.size && (
                            <p className="ml-2">{resource.size}</p>
                          )}
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button variant="outline" size="sm">
                            View Resource
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-lg mb-1">No Resources Yet</h3>
                <p className="text-muted-foreground mb-4">Upload materials for students</p>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Resource
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="grading" className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>Submissions Waiting for Grading</CardTitle>
              <CardDescription>
                {course.pendingGrading > 0 
                  ? `${course.pendingGrading} submissions need your attention` 
                  : "All submissions have been graded!"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {course.pendingGrading > 0 ? (
                <div className="space-y-4">
                  {courseAssignments.map((assignment) => {
                    // Only show assignments with pending submissions
                    const pendingSubmissions = assignment.totalStudents - assignment.submissionsCount;
                    if (pendingSubmissions <= 0) return null;
                    
                    return (
                      <div key={assignment.id} className="p-3 border rounded-md">
                        <div className="flex items-center">
                          <div className="mr-3 h-9 w-9 rounded-md bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-300">
                            <FileCheck className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{assignment.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {assignment.submissionsCount} submissions received
                            </p>
                          </div>
                          <Button size="sm">
                            Grade Now
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                    <FileCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-medium text-lg mb-1">All Caught Up!</h3>
                  <p className="text-muted-foreground">
                    You have no pending submissions to grade for this course.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
