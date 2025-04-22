import { useState } from "react";
import { BookOpen, FileCheck, Filter, MoreHorizontal, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

// Mock data for demonstration
const teachersData = [
  {
    id: 1,
    name: "Dr. Johnson",
    email: "johnson@university.edu",
    department: "Computer Science",
    courses: 3,
    resources: 12,
    experience: "5 years",
    specialty: "Algorithms",
    status: "active",
    profileImage: ""
  },
  {
    id: 2,
    name: "Dr. Smith",
    email: "smith@university.edu",
    department: "Computer Science",
    courses: 2,
    resources: 8,
    experience: "7 years",
    specialty: "Machine Learning",
    status: "active",
    profileImage: ""
  },
  {
    id: 3,
    name: "Dr. Williams",
    email: "williams@university.edu",
    department: "Computer Science",
    courses: 4,
    resources: 15,
    experience: "3 years",
    specialty: "Data Science",
    status: "active",
    profileImage: ""
  },
  {
    id: 4,
    name: "Dr. Thompson",
    email: "thompson@university.edu",
    department: "Computer Science",
    courses: 1,
    resources: 5,
    experience: "2 years",
    specialty: "Cybersecurity",
    status: "active",
    profileImage: ""
  },
  {
    id: 5,
    name: "Dr. Davis",
    email: "davis@university.edu",
    department: "Computer Science",
    courses: 2,
    resources: 9,
    experience: "6 years",
    specialty: "Database Systems",
    status: "active",
    profileImage: ""
  },
  {
    id: 6,
    name: "Dr. Wilson",
    email: "wilson@university.edu",
    department: "Computer Science",
    courses: 3,
    resources: 11,
    experience: "4 years",
    specialty: "Software Engineering",
    status: "active",
    profileImage: ""
  },
];

export default function Teachers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  // Filter teachers based on search query and specialty
  const filteredTeachers = teachersData.filter((teacher) => {
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty ? teacher.specialty === selectedSpecialty : true;
    
    return matchesSearch && matchesSpecialty;
  });

  // Get all unique specialties for filter
  const specialties = [...new Set(teachersData.map(teacher => teacher.specialty))];

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Faculty Members</h1>
        <p className="text-muted-foreground">
          View and manage teachers in the Computer Science department
        </p>
      </section>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search faculty members..."
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
                    Filter by Specialty
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <div className="space-y-4">
                    <h4 className="font-medium">Filter by Specialty</h4>
                    <div className="space-y-2">
                      <Select onValueChange={setSelectedSpecialty} value={selectedSpecialty || undefined}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialties.map((specialty) => (
                            <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedSpecialty(null)}
                      >
                        Reset
                      </Button>
                      <Button size="sm">Apply Filter</Button>
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
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead className="text-center">Courses</TableHead>
                  <TableHead className="text-center">Resources</TableHead>
                  <TableHead className="text-center">Experience</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={teacher.profileImage} alt={teacher.name} />
                          <AvatarFallback>{teacher.name.split(' ')[1][0]}{teacher.name.split(' ')[0][0]}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{teacher.name}</TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>{teacher.specialty}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-muted">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {teacher.courses}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-muted">
                          <FileCheck className="h-3 w-3 mr-1" />
                          {teacher.resources}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{teacher.experience}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>View Courses</DropdownMenuItem>
                            <DropdownMenuItem>View Resources</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Reassign Courses</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No faculty members found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
