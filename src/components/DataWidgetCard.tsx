import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils'; // For conditional class names
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'; // Example trend icons

interface DataWidgetCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendText?: string;
  footerText?: string;
  className?: string;
}

const TrendIcon = ({ trend }: { trend?: 'up' | 'down' | 'neutral' }) => {
  if (trend === 'up') return <ArrowUp className="h-4 w-4 text-green-500" />;
  if (trend === 'down') return <ArrowDown className="h-4 w-4 text-red-500" />;
  if (trend === 'neutral') return <Minus className="h-4 w-4 text-gray-500" />;
  return null;
};

const DataWidgetCard: React.FC<DataWidgetCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  trendText,
  footerText,
  className,
}) => {
  console.log("Rendering DataWidgetCard:", title);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && trendText && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <TrendIcon trend={trend} />
            <span className={cn(
              "ml-1",
              trend === 'up' && "text-green-500",
              trend === 'down' && "text-red-500",
            )}>
              {trendText}
            </span>
          </div>
        )}
      </CardContent>
      {footerText && (
        <CardFooter className="text-xs text-muted-foreground pt-2">
          <p>{footerText}</p>
        </CardFooter>
      )}
    </Card>
  );
};

export default DataWidgetCard;