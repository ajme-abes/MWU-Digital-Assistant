
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import {
  FileText,
  FileVideo,
  Download,
  Eye,
  Filter,
  Search,
  Book,
} from "lucide-react";

export default function StudyMaterials() {
  // Mock data for demonstration
  const materials = [
    {
      id: 1,
      name: "Database Normalization Guide",
      course: "Advanced Database Systems",
      type: "pdf",
      size: "2.4 MB",
      uploadedDate: "April 10, 2025",
      downloadCount: 28,
    },
    {
      id: 2,
      name: "Neural Network Tutorial Video",
      course: "Machine Learning",
      type: "video",
      size: "145 MB",
      uploadedDate: "April 12, 2025",
      downloadCount: 32,
    },
    {
      id: 3,
      name: "UI Design Patterns",
      course: "UI/UX Design Principles",
      type: "pdf",
      size: "5.6 MB",
      uploadedDate: "April 8, 2025",
      downloadCount: 41,
    },
    {
      id: 4,
      name: "RESTful API Documentation",
      course: "Web Application Architecture",
      type: "doc",
      size: "1.2 MB",
      uploadedDate: "April 15, 2025",
      downloadCount: 19,
    },
    {
      id: 5,
      name: "Data Visualization Best Practices",
      course: "Data Visualization",
      type: "pdf",
      size: "4.3 MB",
      uploadedDate: "April 5, 2025",
      downloadCount: 23,
    },
    {
      id: 6,
      name: "Lecture: Database Indexing",
      course: "Advanced Database Systems",
      type: "video",
      size: "120 MB",
      uploadedDate: "April 18, 2025",
      downloadCount: 15,
    },
    {
      id: 7,
      name: "Mobile UI Component Guidelines",
      course: "UI/UX Design Principles",
      type: "pdf",
      size: "3.8 MB",
      uploadedDate: "April 14, 2025",
      downloadCount: 22,
    },
    {
      id: 8,
      name: "Machine Learning Project Requirements",
      course: "Machine Learning",
      type: "doc",
      size: "0.9 MB",
      uploadedDate: "April 20, 2025",
      downloadCount: 27,
    }
  ];

  const courses = [...new Set(materials.map(m => m.course))];
  const types = [...new Set(materials.map(m => m.type))];

  const [courseFilter, setCourseFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredMaterials = materials.filter(material => {
    // Filter by course
    if (courseFilter !== "all" && material.course !== courseFilter) {
      return false;
    }
    
    // Filter by type
    if (typeFilter !== "all" && material.type !== typeFilter) {
      return false;
    }
    
    // Filter by search
    if (search && 
        !material.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case "video":
        return <FileVideo className="h-5 w-5 text-blue-500" />;
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "doc":
        return <FileText className="h-5 w-5 text-indigo-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "video":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">{type}</Badge>;
      case "pdf":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">{type}</Badge>;
      case "doc":
        return <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">{type}</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Study Materials</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Materials</CardTitle>
          <CardDescription>Access your study materials, lecture notes, and resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="md:w-[200px]">
                <div className="flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  <SelectValue placeholder="Filter by course" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map(course => (
                  <SelectItem key={course} value={course}>{course}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="md:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>{type.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.length > 0 ? (
                  filteredMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="flex items-center gap-2">
                        {getFileIcon(material.type)}
                        <span>{material.name}</span>
                      </TableCell>
                      <TableCell>{material.course}</TableCell>
                      <TableCell>{getTypeBadge(material.type)}</TableCell>
                      <TableCell>{material.size}</TableCell>
                      <TableCell>{material.uploadedDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Preview</span>
                          </Button>
                          <Button size="sm">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No study materials found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-muted-foreground text-center">
            Showing {filteredMaterials.length} of {materials.length} materials
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
