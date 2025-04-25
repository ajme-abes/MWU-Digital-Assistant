
import { Calendar, FileText, Upload, Users } from "lucide-react";
import { StatCard } from "../components/dashboard/StatCard";
import { WelcomeBanner } from "../components/dashboard/WelcomeBanner";
import { CoursesList } from "../components/dashboard/CoursesList";
import { dashboardStats } from "../data/mockData";
import { motion } from "framer-motion";

export default function TeacherDashboard() {
  return (
    <div className="container mx-auto max-w-7xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mb-8"
      >
        <div className="bg-primary/5 p-6 rounded-xl flex flex-col items-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-primary"
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
          <h1 className="text-2xl font-bold text-center">CampusTeach</h1>
          <p className="text-muted-foreground text-center mt-1">Your Teaching Command Center</p>
        </div>
      </motion.div>
      
      <WelcomeBanner />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={dashboardStats.totalStudents}
          description="Across all courses"
          icon={<Users className="h-4 w-4" />}
          trend={{ value: 5.2, isPositive: true }}
          index={0}
        />
        <StatCard
          title="Upcoming Deadlines"
          value={dashboardStats.upcomingDeadlines}
          description="Next 7 days"
          icon={<Calendar className="h-4 w-4" />}
          trend={{ value: 2.0, isPositive: true }}
          index={1}
        />
        <StatCard
          title="Pending Grading"
          value={dashboardStats.pendingGrading}
          description="Assignments to review"
          icon={<FileText className="h-4 w-4" />}
          trend={{ value: 8.4, isPositive: false }}
          index={2}
        />
        <StatCard
          title="Materials Uploaded"
          value={dashboardStats.uploadedMaterials}
          description="Total resources"
          icon={<Upload className="h-4 w-4" />}
          trend={{ value: 12.2, isPositive: true }}
          index={3}
        />
      </div>
      
      <CoursesList />
    </div>
  );
}
