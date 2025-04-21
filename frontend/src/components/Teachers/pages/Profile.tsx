import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { Camera, Edit, Save } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Switch } from "../components/ui/switch";
import { teacherData } from "../data/mockData";
import { toast } from "../hooks/use-toast";

export default function Profile() {
  const [profileImage, setProfileImage] = useState(teacherData.avatar);
  const [isEditing, setIsEditing] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState({
    name: teacherData.name,
    email: teacherData.email,
    department: "Computer Science",
    title: "Associate Professor",
    phone: "+1 (555) 123-4567",
    office: "Building A, Room 301",
    officeHours: "Mon, Wed 2-4pm",
    bio: "Experienced educator with 10+ years teaching computer science and software engineering. Research interests include machine learning, distributed systems, and computer science education."
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
          toast({
            title: "Profile image updated",
            description: "Your profile image has been updated successfully.",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTeacherProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your personal information and photo</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative mb-6 group">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={profileImage} alt={teacherProfile.name} />
                <AvatarFallback className="text-2xl">
                  {teacherProfile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0">
                <Label htmlFor="picture" className="cursor-pointer">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <Camera className="h-4 w-4" />
                  </div>
                </Label>
                <Input 
                  id="picture" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                />
              </div>
            </div>
            
            <div className="space-y-1 text-center mb-4">
              <h3 className="font-medium text-lg">{teacherProfile.name}</h3>
              <p className="text-muted-foreground">{teacherProfile.title}</p>
              <Badge variant="secondary" className="mt-1">
                {teacherProfile.department}
              </Badge>
            </div>

            <div className="w-full space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Email</span>
                <span>{teacherProfile.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Phone</span>
                <span>{teacherProfile.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Office</span>
                <span>{teacherProfile.office}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Office Hours</span>
                <span>{teacherProfile.officeHours}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Profile Details</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal information and bio
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={teacherProfile.name} 
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        value={teacherProfile.email} 
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input 
                        id="title" 
                        name="title" 
                        value={teacherProfile.title} 
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input 
                        id="department" 
                        name="department" 
                        value={teacherProfile.department} 
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={teacherProfile.phone} 
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="office">Office</Label>
                      <Input 
                        id="office" 
                        name="office" 
                        value={teacherProfile.office} 
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="officeHours">Office Hours</Label>
                    <Input 
                      id="officeHours" 
                      name="officeHours" 
                      value={teacherProfile.officeHours} 
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      name="bio" 
                      rows={5} 
                      value={teacherProfile.bio} 
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="resize-none"
                    />
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  {isEditing && (
                    <Button onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch id="two-factor" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about your account activity
                        </p>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Public Profile</h4>
                        <p className="text-sm text-muted-foreground">
                          Make your profile visible to students and colleagues
                        </p>
                      </div>
                      <Switch id="public-profile" defaultChecked />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Control which notifications you receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Assignment Submissions</h4>
                        <p className="text-sm text-muted-foreground">
                          Get notified when students submit assignments
                        </p>
                      </div>
                      <Switch id="assignment-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Course Messages</h4>
                        <p className="text-sm text-muted-foreground">
                          Get notified about new messages in your courses
                        </p>
                      </div>
                      <Switch id="message-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">System Announcements</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive system-wide announcements and updates
                        </p>
                      </div>
                      <Switch id="system-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Deadline Reminders</h4>
                        <p className="text-sm text-muted-foreground">
                          Get reminders about upcoming assignment deadlines
                        </p>
                      </div>
                      <Switch id="deadline-reminders" defaultChecked />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="outline">
                    Disable All
                  </Button>
                  <Button>
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
