
import { Check, File, FileText, Filter,  Image, MoreHorizontal, Search, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { useState } from "react";

// Mock data for demonstration
const resourcesData = [
  {
    id: 1,
    name: "Introduction to Neural Networks",
    type: "pdf",
    course: "AI Fundamentals",
    uploader: "Dr. Smith",
    uploadDate: "2024-04-10",
    status: "pending",
  },
  {
    id: 2,
    name: "Data Structures Lecture Notes",
    type: "doc",
    course: "Data Structures",
    uploader: "Dr. Johnson",
    uploadDate: "2024-04-12",
    status: "pending",
  },
  {
    id: 3,
    name: "Algorithm Visualization Examples",
    type: "image",
    course: "Algorithms",
    uploader: "Dr. Williams",
    uploadDate: "2024-04-15",
    status: "approved",
  },
  {
    id: 4,
    name: "Database Schema Examples",
    type: "pdf",
    course: "Database Systems",
    uploader: "Dr. Davis",
    uploadDate: "2024-04-08",
    status: "rejected",
  },
  {
    id: 5,
    name: "Computer Architecture Slides",
    type: "ppt",
    course: "Computer Architecture",
    uploader: "Dr. Thompson",
    uploadDate: "2024-04-14",
    status: "pending",
  },
  {
    id: 6,
    name: "Software Engineering Project Guidelines",
    type: "doc",
    course: "Software Engineering",
    uploader: "Dr. Wilson",
    uploadDate: "2024-04-11",
    status: "approved",
  },
];

export default function ResourcesHod() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Filter resources based on search query, status, and type
  const filteredResources = resourcesData.filter((resource) => {
    const matchesSearch = 
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      resource.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.uploader.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus ? resource.status === selectedStatus : true;
    const matchesType = selectedType ? resource.type === selectedType : true;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "doc":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "image":
        return <Image className="h-5 w-5 text-green-500" />;
      case "ppt":
        return <File className="h-5 w-5 text-orange-500" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      case "approved":
        return <Badge className="bg-success text-success-foreground">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Dialog state for approve/reject confirmation
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [selectedResource, setSelectedResource] = useState<typeof resourcesData[0] | null>(null);

  const handleAction = (resource: typeof resourcesData[0], action: "approve" | "reject") => {
    setSelectedResource(resource);
    setActionType(action);
    setIsActionDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Approve Resources</h1>
        <p className="text-muted-foreground">
          Review and approve resources uploaded by teachers
        </p>
      </section>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search resources..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <div className="space-y-4">
                    <h4 className="font-medium">Filter Resources</h4>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select onValueChange={setSelectedStatus} value={selectedStatus || undefined}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">File Type</label>
                      <Select onValueChange={setSelectedType} value={selectedType || undefined}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="doc">DOC</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="ppt">Presentation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedStatus(null);
                          setSelectedType(null);
                        }}
                      >
                        Reset
                      </Button>
                      <Button size="sm">Apply Filters</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Type</TableHead>
                  <TableHead>Resource Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Uploader</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell>{getResourceIcon(resource.type)}</TableCell>
                      <TableCell className="font-medium">{resource.name}</TableCell>
                      <TableCell>{resource.course}</TableCell>
                      <TableCell>{resource.uploader}</TableCell>
                      <TableCell>{new Date(resource.uploadDate).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(resource.status)}</TableCell>
                      <TableCell className="text-right">
                        {resource.status === "pending" ? (
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 text-success"
                              onClick={() => handleAction(resource, "approve")}
                            >
                              <Check className="h-4 w-4" />
                              <span className="sr-only">Approve</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleAction(resource, "reject")}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Reject</span>
                            </Button>
                          </div>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Download Resource</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                {resource.status === "approved" ? "Revoke Approval" : "Mark as Pending"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No resources found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Approval/Rejection Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve Resource" : "Reject Resource"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "Are you sure you want to approve this resource? It will be available to students."
                : "Are you sure you want to reject this resource? You can provide feedback to the uploader."}
            </DialogDescription>
          </DialogHeader>
          
          {selectedResource && (
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-3">
                {getResourceIcon(selectedResource.type)}
                <div>
                  <h3 className="font-medium">{selectedResource.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Uploaded by {selectedResource.uploader} for {selectedResource.course}
                  </p>
                </div>
              </div>
              
              {actionType === "reject" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rejection Reason (Optional)</label>
                  <Input placeholder="Provide feedback to the uploader" />
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant={actionType === "approve" ? "default" : "destructive"}
              onClick={() => {
                // Handle the action here
                setIsActionDialogOpen(false);
              }}
            >
              {actionType === "approve" ? (
                <>
                  <Check className="h-4 w-4 mr-1" /> Approve
                </>
              ) : (
                <>
                  <X className="h-4 w-4 mr-1" /> Reject
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
