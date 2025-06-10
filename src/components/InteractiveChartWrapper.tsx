import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  PieChart,
  Line,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts'; // Assuming recharts is used

// Define basic types for chart data, can be expanded
interface ChartDataItem {
  name: string;
  value: number;
  [key: string]: any; // Allow other properties for multi-series charts
}

interface InteractiveChartWrapperProps {
  title?: string;
  description?: string;
  data: ChartDataItem[];
  chartType: 'line' | 'bar' | 'pie';
  dataKey: string; // Key for the main value in data items
  categoryKey?: string; // Key for category labels (XAxis for line/bar, name for Pie)
  colors?: string[]; // Optional custom colors for pie/bar charts
  aspectRatio?: number;
  className?: string;
}

const DEFAULT_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82Ca9D'];

const InteractiveChartWrapper: React.FC<InteractiveChartWrapperProps> = ({
  title,
  description,
  data,
  chartType,
  dataKey,
  categoryKey = 'name', // Default to 'name' for XAxis/Pie labels
  colors = DEFAULT_COLORS,
  aspectRatio = 16 / 9,
  className,
}) => {
  console.log(`Rendering InteractiveChartWrapper: ${title || chartType}`);

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={categoryKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke={colors[0]} activeDot={{ r: 8 }} />
            {/* Add more <Line /> components for multi-line charts if needed */}
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={categoryKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill={colors[0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
            {/* Add more <Bar /> components for grouped/stacked bar charts */}
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={Math.min(120, Math.max(80, Math.min(window.innerWidth, window.innerHeight) / 5))} // Dynamic radius
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={categoryKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      default:
        return <p>Unsupported chart type</p>;
    }
  };

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" aspect={aspectRatio}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default InteractiveChartWrapper;