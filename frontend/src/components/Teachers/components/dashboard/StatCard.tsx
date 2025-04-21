
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { cn } from "../../lib/utils"

import { motion } from "framer-motion";
import { AnimatedCard } from "./AnimatedCard";

type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  index?: number;
};

export function StatCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  className,
  index = 0
}: StatCardProps) {
  return (
    <AnimatedCard delay={index + 1}>
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (index + 1) * 0.1 + 0.2, duration: 0.3 }}
            className="text-2xl font-bold"
          >
            {value}
          </motion.div>
          {description && (
            <CardDescription className="text-xs mt-1">
              {description}
            </CardDescription>
          )}
          {trend && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index + 1) * 0.1 + 0.3, duration: 0.3 }}
              className={cn(
                "text-xs mt-2",
                trend.isPositive ? "text-emerald-500" : "text-rose-500"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last week
            </motion.p>
          )}
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}
