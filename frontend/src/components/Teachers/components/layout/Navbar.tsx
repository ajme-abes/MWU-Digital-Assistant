import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Menu, Sun, Moon } from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";
import { useTheme } from "../../context/ThemeContext";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../../components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { teacherData } from "../../data/mockData";
import { useToast } from "../../hooks/use-toast";

export function Navbar() {
  const { toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const { toast } = useToast();

  const notifications = [
    {
      id: 1,
      title: "New Assignment Submission",
      message: "John Doe has submitted Assignment 2",
      time: "10 minutes ago",
      read: false
    },
    {
      id: 2,
      title: "Grading Reminder",
      message: "You have 5 assignments pending review",
      time: "2 hours ago",
      read: false
    },
    {
      id: 3,
      title: "Course Update",
      message: "CS101 syllabus has been updated",
      time: "Yesterday",
      read: false
    },
    {
      id: 4,
      title: "System Notification",
      message: "Platform maintenance scheduled for Sunday",
      time: "2 days ago",
      read: true
    }
  ];

  const handleNotificationRead = (id: number) => {
    setUnreadNotifications(prev => Math.max(0, prev - 1));
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    });
  };

  const handleMarkAllRead = () => {
    setUnreadNotifications(0);
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read.",
    });
  };

  const handleProfileAction = (action: string) => {
    switch(action) {
      case "profile":
        navigate("/profile");
        break;
      case "settings":
        navigate("/profile?tab=settings");
        break;
      case "logout":
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
        // In a real app, you would handle logout here
        break;
      default:
        break;
    }
  };

  return (
    <header className="h-16 px-4 border-b flex items-center justify-between bg-background">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/" className="font-semibold text-lg text-primary flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-primary"
            >
              <path 
                d="M12 4L4 8L12 12L20 8L12 4Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M4 16L12 20L20 16" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M4 12L12 16L20 12" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          CampusTeach
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Notifications</h3>
                {unreadNotifications > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                    Mark all as read
                  </Button>
                )}
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-3 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}
                    onClick={() => handleNotificationRead(notification.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm font-medium ${!notification.read ? 'text-primary' : ''}`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications
                </div>
              )}
            </div>
            <div className="p-2 border-t">
              <Button variant="ghost" size="sm" className="w-full">
                View all notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={teacherData.avatar} alt={teacherData.name} />
                <AvatarFallback>{teacherData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm font-normal">{teacherData.name}</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleProfileAction("profile")}>
              <Link to="/profile" className="flex items-center w-full">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleProfileAction("settings")}>
              <Link to="/profile?tab=settings" className="flex items-center w-full">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleProfileAction("logout")}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
