
import { teacherData } from "../../data/mockData";
import { motion } from "framer-motion";
import { AnimatedCard } from "./AnimatedCard";

export function WelcomeBanner() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  // Determine greeting based on time of day
  const hour = today.getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 17) {
    greeting = "Good afternoon";
  } else if (hour >= 17) {
    greeting = "Good evening";
  }

  return (
    <AnimatedCard>
      <div className="relative bg-gradient-to-r from-primary/80 to-primary rounded-2xl p-6 md:p-8 overflow-hidden text-white mb-6">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="relative z-10">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-sm text-white/80"
          >
            {formattedDate}
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl md:text-3xl font-semibold mt-2"
          >
            {greeting}, {teacherData.name.split(' ')[0]}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/90 mt-1"
          >
            {teacherData.title}, {teacherData.department}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 md:flex gap-6"
          >
            <p className="text-sm bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg inline-block">
              Today's classes: <span className="font-semibold">3</span>
            </p>
            <p className="text-sm bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg inline-block mt-2 md:mt-0">
              Pending grading: <span className="font-semibold">42</span>
            </p>
          </motion.div>
        </div>
      </div>
    </AnimatedCard>
  );
}
