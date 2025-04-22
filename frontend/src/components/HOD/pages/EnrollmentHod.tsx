import { useState } from "react";
import { Download, FileUp, MoreHorizontal, Plus, Search, Upload, UserPlus, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu";

// Mock data for invitations
const invitationsData = [
  {
    id: 1,
    email: "student1@university.edu",
    role: "student",
    course: "Introduction to Computer Science",
    issueDate: "2024-04-10",
    expiryDate: "2024-04-24",
    status: "pending",
  },
  {
    id: 2,
    email: "student2@university.edu",
    role: "student",
    course: "Data Structures",
    issueDate: "2024-04-12",
    expiryDate: "2024-04-26",
    status: "accepted",
  },
  {
    id: 3,
    email: "teacher1@university.edu",
    role: "teacher",
    course: "Algorithms",
    issueDate: "2024-04-08",
    expiryDate: "2024-04-22",
    status: "expired",
  },
  {
    id: 4,
    email: "student3@university.edu",
    role: "student",
    course: "Database Systems",
    issueDate: "2024-04-15",
    expiryDate: "2024-04-29",
    status: "pending",
  },
  {
    id: 5,
    email: "teacher2@university.edu",
    role: "teacher",
    course: "Machine Learning",
    issueDate: "2024-04-16",
    expiryDate: "2024-04-30",
    status: "pending",
  },
];

export default function EnrollmentHod() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("invitations");
  
  // Filter invitations based on search and role
  const filteredInvitations = invitationsData.filter((invitation) => {
    const matchesSearch = 
      invitation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invitation.course.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = selectedRole ? invitation.role === selectedRole : true;
    
    return matchesSearch && matchesRole;
  });

  // Helper to render status badge with appropriate color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      case "accepted":
        return <Badge className="bg-success text-success-foreground">Accepted</Badge>;
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Enrollment Management</h1>
        <p className="text-muted-foreground">
          Enroll students and teachers to the department and courses
        </p>
      </section>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="manual">Manual Enrollment</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
        </TabsList>
        
        {/* Invitations Tab */}
        <TabsContent value="invitations" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div>
                <CardTitle>Invitation Management</CardTitle>
                <CardDescription>Track and manage enrollment invitations</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="ml-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    New Invitation
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Create New Invitation</DialogTitle>
                    <DialogDescription>
                      Send an invitation link to enroll in a course
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-4">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" placeholder="user@university.edu" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="teacher">Teacher</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="course">Course</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cs101">CS101: Introduction to Computer Science</SelectItem>
                            <SelectItem value="cs202">CS202: Data Structures</SelectItem>
                            <SelectItem value="cs350">CS350: Operating Systems</SelectItem>
                            <SelectItem value="cs401">CS401: Machine Learning</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="expiry">Invitation Expiry (Days)</Label>
                      <Select defaultValue="14">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Custom Message (Optional)</Label>
                      <Input id="message" placeholder="Add a personal message..." />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Send Invitation</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by email or course..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Select onValueChange={setSelectedRole} value={selectedRole || undefined}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedRole(null)}
                    className="whitespace-nowrap"
                  >
                    Reset Filter
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Issued</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[80px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvitations.length > 0 ? (
                      filteredInvitations.map((invitation) => (
                        <TableRow key={invitation.id}>
                          <TableCell className="font-medium">{invitation.email}</TableCell>
                          <TableCell className="capitalize">{invitation.role}</TableCell>
                          <TableCell>{invitation.course}</TableCell>
                          <TableCell>{new Date(invitation.issueDate).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(invitation.expiryDate).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Resend Invitation</DropdownMenuItem>
                                <DropdownMenuItem>Copy Invite Link</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">Cancel Invitation</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No invitations found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Manual Enrollment Tab */}
        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Enrollment</CardTitle>
              <CardDescription>
                Add students and teachers directly to courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Enrollment Type</Label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <input type="radio" id="student-enroll" name="enroll-type" className="form-radio" title="Enroll Student" />
                        <Label htmlFor="student-enroll" className="font-normal">Enroll Student</Label>
                      </div>
                      <Card className="border-2 border-dashed flex flex-col items-center justify-center px-6 py-8 hover:border-primary/50 transition-colors cursor-pointer">
                        <div className="rounded-full bg-primary/10 p-3 mb-3">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-center space-y-1">
                          <h3 className="font-medium">Student Enrollment</h3>
                          <p className="text-sm text-muted-foreground">
                            Add students to specific courses
                          </p>
                        </div>
                      </Card>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <input type="radio" id="teacher-enroll" name="enroll-type" className="form-radio" title="Assign Teacher" />
                        <Label htmlFor="teacher-enroll" className="font-normal">Assign Teacher</Label>
                      </div>
                      <Card className="border-2 border-dashed flex flex-col items-center justify-center px-6 py-8 hover:border-primary/50 transition-colors cursor-pointer">
                        <div className="rounded-full bg-primary/10 p-3 mb-3">
                          <UserPlus className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-center space-y-1">
                          <h3 className="font-medium">Teacher Assignment</h3>
                          <p className="text-sm text-muted-foreground">
                            Assign teachers to lead courses
                          </p>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="user-email">Email Address</Label>
                      <Input id="user-email" placeholder="user@university.edu" />
                    </div>
                    <div>
                      <Label htmlFor="course-select">Select Course</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cs101">CS101: Introduction to Computer Science</SelectItem>
                          <SelectItem value="cs202">CS202: Data Structures</SelectItem>
                          <SelectItem value="cs350">CS350: Operating Systems</SelectItem>
                          <SelectItem value="cs401">CS401: Machine Learning</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="enroll-note">Enrollment Note (Optional)</Label>
                    <Input id="enroll-note" placeholder="Add any relevant notes..." />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Clear Form</Button>
              <Button>Enroll User</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Bulk Import Tab */}
        <TabsContent value="bulk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Enrollment</CardTitle>
              <CardDescription>
                Import multiple students or teachers using a CSV file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label>Import Type</Label>
                    <Select defaultValue="students">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="students">Students</SelectItem>
                        <SelectItem value="teachers">Teachers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label>Target Course</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cs101">CS101: Introduction to Computer Science</SelectItem>
                        <SelectItem value="cs202">CS202: Data Structures</SelectItem>
                        <SelectItem value="cs350">CS350: Operating Systems</SelectItem>
                        <SelectItem value="cs401">CS401: Machine Learning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">CSV File</Label>
                  <Card className="border-2 border-dashed p-8">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                      <div className="rounded-full bg-muted p-4">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Upload CSV File</h3>
                        <p className="text-sm text-muted-foreground">
                          Drag and drop your CSV file here, or click to browse
                        </p>
                      </div>
                      <Input id="csv-upload" type="file" accept=".csv" className="hidden" />
                      <Button variant="outline" className="w-full sm:w-auto">
                        <FileUp className="mr-2 h-4 w-4" />
                        Select File
                      </Button>
                    </div>
                  </Card>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="w-auto">
                    <Download className="mr-2 h-4 w-4" />
                    Download Template
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Need the CSV template? Download it here
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button>Import Users</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
