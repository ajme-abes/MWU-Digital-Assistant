import { BookOpen, FileCheck, GraduationCap, User } from "lucide-react";
import { useState } from "react";
import { BellRing, Check, ChevronRight, Mail, Save, UserRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";

export default function Settings() {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Mock user data
  const userData = {
    name: "Dr. Harris",
    email: "harris@university.edu",
    department: "Computer Science",
    title: "Head of Department",
    phone: "+1 (555) 123-4567",
    bio: "Professor of Computer Science with over 15 years of experience in academia. Research interests include artificial intelligence, machine learning, and data mining.",
    notifications: {
      resourceApproval: true,
      courseCreation: true,
      studentEnrollment: false,
      teacherAssignment: true,
      systemUpdates: true,
      emailDigest: false,
    },
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and department settings
        </p>
      </section>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="department">Department</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile photo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="h-28 w-28">
                    <AvatarImage src={profileImage || ""} alt="Profile photo" />
                    <AvatarFallback className="text-2xl">HD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="w-full">
                    Change Photo
                  </Button>
                </div>
                
                <div className="flex-1 grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={userData.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" defaultValue={userData.email} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input id="title" defaultValue={userData.title} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue={userData.phone} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      defaultValue={userData.bio}
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Account Security</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline">
                    Change Password
                  </Button>
                  <Button variant="outline">
                    Enable Two-Factor Authentication
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-md bg-primary/10 p-2">
                      <FileCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <Label htmlFor="resource-approval" className="text-base">Resource Approval Requests</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when teachers upload resources for approval
                      </p>
                    </div>
                  </div>
                  <Switch id="resource-approval" checked={userData.notifications.resourceApproval} />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-md bg-primary/10 p-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <Label htmlFor="course-creation" className="text-base">Course Creation</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts when new courses are created in your department
                      </p>
                    </div>
                  </div>
                  <Switch id="course-creation" checked={userData.notifications.courseCreation} />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-md bg-primary/10 p-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <Label htmlFor="student-enrollment" className="text-base">Student Enrollment</Label>
                      <p className="text-sm text-muted-foreground">
                        Get updates when students enroll in department courses
                      </p>
                    </div>
                  </div>
                  <Switch id="student-enrollment" checked={userData.notifications.studentEnrollment} />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-md bg-primary/10 p-2">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <Label htmlFor="teacher-assignment" className="text-base">Teacher Assignment</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when teachers are assigned to courses
                      </p>
                    </div>
                  </div>
                  <Switch id="teacher-assignment" checked={userData.notifications.teacherAssignment} />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-md bg-primary/10 p-2">
                      <BellRing className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <Label htmlFor="system-updates" className="text-base">System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about system maintenance and updates
                      </p>
                    </div>
                  </div>
                  <Switch id="system-updates" checked={userData.notifications.systemUpdates} />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-md bg-primary/10 p-2">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <Label htmlFor="email-digest" className="text-base">Email Digest</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a weekly summary of department activity
                      </p>
                    </div>
                  </div>
                  <Switch id="email-digest" checked={userData.notifications.emailDigest} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Default</Button>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Department Settings */}
        <TabsContent value="department" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Settings</CardTitle>
              <CardDescription>
                Configure Computer Science department settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dept-name">Department Name</Label>
                  <Input id="dept-name" defaultValue="Computer Science" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dept-code">Department Code</Label>
                  <Input id="dept-code" defaultValue="CS" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="academic-year">Current Academic Year</Label>
                  <Select defaultValue="2023-2024">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2022-2023">2022-2023</SelectItem>
                      <SelectItem value="2023-2024">2023-2024</SelectItem>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Department Policies</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="auto-approval" className="cursor-pointer">
                      Auto-approve resources from senior faculty
                    </Label>
                    <Switch id="auto-approval" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve resources uploaded by faculty members with 5+ years experience
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="open-enrollment" className="cursor-pointer">
                      Open enrollment period
                    </Label>
                    <Switch id="open-enrollment" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Allow students to enroll in courses for the upcoming semester
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="teacher-resources" className="cursor-pointer">
                      Teachers can view other course resources
                    </Label>
                    <Switch id="teacher-resources" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Allow teachers to view resources from other courses in the department
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Department Settings
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Access administrative tools and configurations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-between">
                <span>Department Access Control</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <span>Course Template Management</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <span>Data Export and Backup</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <span>System Integration Settings</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
