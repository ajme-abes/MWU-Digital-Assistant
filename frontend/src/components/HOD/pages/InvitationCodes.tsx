
import { useState } from "react";
import { Check, Clock, Copy, FileText, Key, Plus, RefreshCcw, Search, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "../components/ui/calendar";

// Mock data for demonstration
const invitationCodesData = [
  {
    id: 1,
    code: "CS-STU-9A7B2C",
    role: "student",
    course: "Introduction to Computer Science",
    generatedDate: "2024-04-10",
    expiryDate: "2024-04-24",
    status: "active",
    usages: 0,
    maxUsages: 10,
  },
  {
    id: 2,
    code: "CS-TCH-3F8D1E",
    role: "teacher",
    course: "Data Structures",
    generatedDate: "2024-04-12",
    expiryDate: "2024-04-26",
    status: "active",
    usages: 2,
    maxUsages: 5,
  },
  {
    id: 3,
    code: "CS-STU-5K2L9M",
    role: "student",
    course: "Database Systems",
    generatedDate: "2024-03-20",
    expiryDate: "2024-04-03",
    status: "expired",
    usages: 15,
    maxUsages: 20,
  },
  {
    id: 4,
    code: "CS-STU-7P4Q6R",
    role: "student",
    course: "Algorithms",
    generatedDate: "2024-04-15",
    expiryDate: "2024-04-29",
    status: "active",
    usages: 3,
    maxUsages: 15,
  },
  {
    id: 5,
    code: "CS-TCH-2T3U8V",
    role: "teacher",
    course: "Machine Learning",
    generatedDate: "2024-04-05",
    expiryDate: "2024-04-19",
    status: "active",
    usages: 1,
    maxUsages: 3,
  },
];

export default function InvitationCodes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  // Filter codes based on search, role, and status
  const filteredCodes = invitationCodesData.filter((code) => {
    const matchesSearch = 
      code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.course.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = selectedRole ? code.role === selectedRole : true;
    const matchesStatus = selectedStatus ? code.status === selectedStatus : true;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    });
  };

  // Helper to render status badge with appropriate color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Invitation Codes</h1>
        <p className="text-muted-foreground">
          Generate and manage time-limited invitation codes for enrollment
        </p>
      </section>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Invitation Code Management</CardTitle>
            <CardDescription>Generate and track invitation codes</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Generate Code
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Generate Invitation Code</DialogTitle>
                <DialogDescription>
                  Create a new invitation code for enrollment
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(selectedDate) => selectedDate && setDate(selectedDate)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="usages">Max Usages</Label>
                    <Select defaultValue="10">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 use</SelectItem>
                        <SelectItem value="5">5 uses</SelectItem>
                        <SelectItem value="10">10 uses</SelectItem>
                        <SelectItem value="20">20 uses</SelectItem>
                        <SelectItem value="50">50 uses</SelectItem>
                        <SelectItem value="100">100 uses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Input id="note" placeholder="Add a note about this invitation code" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Generate Code</Button>
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
                placeholder="Search codes or courses..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select onValueChange={setSelectedRole} value={selectedRole || undefined}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
              
              <Select onValueChange={setSelectedStatus} value={selectedStatus || undefined}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedRole(null);
                  setSelectedStatus(null);
                }}
                className="whitespace-nowrap"
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-center">Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCodes.length > 0 ? (
                  filteredCodes.map((code) => (
                    <TableRow key={code.id}>
                      <TableCell className="font-mono font-medium flex items-center gap-2">
                        {code.code}
                        <Button
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 relative"
                          onClick={() => copyCode(code.code)}
                        >
                          {showCopiedMessage ? (
                            <Check className="h-3 w-3 text-success" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          <span className="sr-only">Copy code</span>
                        </Button>
                      </TableCell>
                      <TableCell className="capitalize">{code.role}</TableCell>
                      <TableCell>{code.course}</TableCell>
                      <TableCell>{new Date(code.generatedDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(code.expiryDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-center">{code.usages} / {code.maxUsages}</TableCell>
                      <TableCell>{getStatusBadge(code.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {code.status === "active" ? (
                            <>
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <RefreshCcw className="h-4 w-4" />
                                <span className="sr-only">Extend</span>
                              </Button>
                              <Button variant="outline" size="icon" className="h-8 w-8 text-destructive">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Revoke</span>
                              </Button>
                            </>
                          ) : (
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">Details</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No invitation codes found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Recently Used Codes</h2>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Timeline of recent invitation code usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <ol className="border-l border-muted">
                {[...Array(3)].map((_, i) => (
                  <li key={i} className="mb-6 ml-4">
                    <div className="absolute w-3 h-3 bg-primary rounded-full mt-1.5 -left-1.5 border border-background"></div>
                    <time className="mb-1 text-sm font-normal leading-none text-muted-foreground">
                      {format(new Date(2024, 3, 15 - i * 2), "MMMM dd, yyyy")}
                    </time>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mt-2">
                      Code {i === 0 ? "CS-STU-9A7B2C" : i === 1 ? "CS-TCH-3F8D1E" : "CS-STU-7P4Q6R"} Used
                    </h3>
                    <p className="mb-4 text-sm font-normal text-muted-foreground">
                      {i === 0 
                        ? "Student john.doe@university.edu enrolled in Introduction to Computer Science" 
                        : i === 1 
                        ? "Teacher dr.smith@university.edu joined Data Structures" 
                        : "Student jane.smith@university.edu enrolled in Algorithms"}
                    </p>
                    <Badge className="inline-flex items-center px-2.5 py-0.5 bg-muted text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" /> 
                      {i === 0 ? "3 hours ago" : i === 1 ? "1 day ago" : "2 days ago"}
                    </Badge>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Activity</Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
