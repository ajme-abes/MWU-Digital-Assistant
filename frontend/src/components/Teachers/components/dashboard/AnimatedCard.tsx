import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  motionProps?: Omit<HTMLMotionProps<"div">, "children" | "className">;
}

export function AnimatedCard({ 
  children, 
  delay = 0, 
  className,
  motionProps,
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: delay * 0.1,
        ease: "easeOut"
      }}
      className={cn("", className)}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
