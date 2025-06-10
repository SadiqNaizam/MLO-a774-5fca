import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import InteractiveChartWrapper from '@/components/InteractiveChartWrapper';
import { toast } from "sonner";
import { Menu, Package, ShoppingCart, Users, LineChart as LineChartIconLucide, Settings, UserCircle, LogOut, CalendarDays, Download } from 'lucide-react';
import { DateRange } from "react-day-picker"
import { addDays, format } from "date-fns"

const navLinks = [
  { href: "/dashboard-overview", label: "Overview", icon: <Package className="h-5 w-5" /> },
  { href: "/orders", label: "Orders", icon: <ShoppingCart className="h-5 w-5" />, badge: "5" },
  { href: "/products", label: "Products", icon: <Package className="h-5 w-5" /> },
  { href: "/customers", label: "Customers", icon: <Users className="h-5 w-5" /> },
  { href: "/analytics", label: "Analytics", icon: <LineChartIconLucide className="h-5 w-5" /> },
];

const sampleMonthlySales = [
  { name: 'Jan', sales: 4200, profit: 2100 }, { name: 'Feb', sales: 3100, profit: 1500 },
  { name: 'Mar', sales: 5000, profit: 2800 }, { name: 'Apr', sales: 4500, profit: 2200 },
  { name: 'May', sales: 6200, profit: 3500 }, { name: 'Jun', sales: 5800, profit: 3100 },
];
const sampleProductPerformance = [
  { name: 'Plush Dragon', sales: 120, revenue: 3598.80 }, { name: 'Block Set', sales: 95, revenue: 4275.00 },
  { name: 'RC Car', sales: 70, revenue: 5565.00 }, { name: 'Art Kit', sales: 150, revenue: 6750.00 },
];
const sampleTrafficSources = [
  { name: 'Organic Search', value: 45, fill: '#0088FE' }, { name: 'Direct', value: 25, fill: '#00C49F' },
  { name: 'Referral', value: 15, fill: '#FFBB28' }, { name: 'Social Media', value: 15, fill: '#FF8042' },
];

const AnalyticsPage = () => {
  console.log('AnalyticsPage loaded');
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [reportType, setReportType] = useState("monthly_sales");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const handleExportReport = () => {
    toast.info("Exporting report... (Not Implemented)");
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        {/* Sidebar */}
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/dashboard-overview" className="flex items-center gap-2 font-semibold">
              <Package className="h-6 w-6 text-primary" />
              <span className="">Admin Dashboard</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive(link.href) ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
                >
                  {link.icon}
                  {link.label}
                  {link.badge && <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">{link.badge}</Badge>}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link to="/dashboard-overview" className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <Package className="h-6 w-6 text-primary" />
                  <span className="sr-only">Admin Dashboard</span>
                </Link>
                {navLinks.map(link => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${isActive(link.href) ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
                  >
                    {link.icon}
                    {link.label}
                    {link.badge && <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">{link.badge}</Badge>}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
             <h1 className="text-lg font-semibold">Analytics & Reports</h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="https://i.pravatar.cc/150?u=admin-analytics" alt="Admin User" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
              <DropdownMenuItem><LogOut className="mr-2 h-4 w-4" />Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <ScrollArea className="h-full">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly_sales">Monthly Sales</SelectItem>
                  <SelectItem value="product_performance">Product Performance</SelectItem>
                  <SelectItem value="traffic_sources">Traffic Sources</SelectItem>
                  <SelectItem value="customer_segments">Customer Segments</SelectItem>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-[280px] justify-start text-left font-normal"
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <Button onClick={handleExportReport}><Download className="mr-2 h-4 w-4"/> Export Report</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <InteractiveChartWrapper
                title="Monthly Sales & Profit"
                description="Sales and profit trends over the selected period."
                data={sampleMonthlySales}
                chartType="bar"
                dataKey="sales" // Can be expanded to show multiple series (e.g., profit)
                categoryKey="name"
                className="lg:col-span-2"
              />
              <InteractiveChartWrapper
                title="Traffic Sources"
                description="Website traffic distribution."
                data={sampleTrafficSources}
                chartType="pie"
                dataKey="value"
                categoryKey="name"
              />
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>Products with the highest sales volume in the selected period.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead className="text-right">Units Sold</TableHead>
                      <TableHead className="text-right">Total Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleProductPerformance.map((product) => (
                      <TableRow key={product.name}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="text-right">{product.sales}</TableCell>
                        <TableCell className="text-right">${product.revenue.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            {/* Placeholder for more reports/cards */}
            <Card className="mt-6">
                <CardHeader><CardTitle>Customer Segmentation (Placeholder)</CardTitle></CardHeader>
                <CardContent><p>Detailed customer segment analysis will be shown here based on selected criteria.</p></CardContent>
            </Card>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;