import { useState } from "react";
import { Course, coursesData } from "../../data/mockData";
import { CoursePanel } from "./CoursePanel";
import { Progress } from "../ui/progress";
import { cn } from "../../lib/utils"
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedCard } from "./AnimatedCard";
import { AddCourseDialog } from "../../components/courses/AddCourseDialog";
import "./CoursePanel.css";

export function CoursesList() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <div className="mt-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex items-center justify-between mb-4"
      >
        <h2 className="text-xl font-semibold">My Courses</h2>
        <AddCourseDialog />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {coursesData.map((course, index) => (
          <AnimatedCard key={course.id} delay={index + 5}>
            <div
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md",
                selectedCourse?.id === course.id 
                  ? "ring-2 ring-primary ring-offset-2" 
                  : "hover:border-primary/50"
              )}
              onClick={() => setSelectedCourse(course)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium">{course.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {course.code} • {course.section} • {course.semester}
                  </p>
                </div>
                <div 
                  className="h-6 w-6 rounded-full course-color-dot"
                  data-color={course.color}
                ></div>
              </div>
              
              <div className="flex items-center gap-2 text-sm mb-2">
                <span>Course Progress</span>
                <span className="ml-auto">{course.progress}%</span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: (index * 0.1) + 0.6, duration: 0.5 }}
              >
                <Progress value={course.progress} className="h-2" />
              </motion.div>
              
              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <span>{course.students} Students</span>
                {course.pendingGrading > 0 && (
                  <span className="text-amber-600">
                    {course.pendingGrading} need grading
                  </span>
                )}
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <CoursePanel 
              course={selectedCourse} 
              onClose={() => setSelectedCourse(null)} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
