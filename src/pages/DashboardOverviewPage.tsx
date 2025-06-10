import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import DataWidgetCard from '@/components/DataWidgetCard';
import InteractiveChartWrapper from '@/components/InteractiveChartWrapper';
import { Bell, DollarSign, Users, CreditCard, Activity, Menu, Package, ShoppingCart, LineChart as LineChartIconLucide, Settings, UserCircle, LogOut, ExternalLink } from 'lucide-react';

const navLinks = [
  { href: "/dashboard-overview", label: "Overview", icon: <Package className="h-5 w-5" /> },
  { href: "/orders", label: "Orders", icon: <ShoppingCart className="h-5 w-5" />, badge: "5" },
  { href: "/products", label: "Products", icon: <Package className="h-5 w-5" /> },
  { href: "/customers", label: "Customers", icon: <Users className="h-5 w-5" /> },
  { href: "/analytics", label: "Analytics", icon: <LineChartIconLucide className="h-5 w-5" /> },
];

const sampleSalesData = [
  { name: 'Jan', sales: 4000, revenue: 2400 },
  { name: 'Feb', sales: 3000, revenue: 1398 },
  { name: 'Mar', sales: 2000, revenue: 9800 },
  { name: 'Apr', sales: 2780, revenue: 3908 },
  { name: 'May', sales: 1890, revenue: 4800 },
  { name: 'Jun', sales: 2390, revenue: 3800 },
  { name: 'Jul', sales: 3490, revenue: 4300 },
];

const sampleDeviceData = [
    { name: 'Desktop', value: 65, fill: '#0088FE' },
    { name: 'Mobile', value: 25, fill: '#00C49F' },
    { name: 'Tablet', value: 10, fill: '#FFBB28' },
];

const DashboardOverviewPage = () => {
  console.log('DashboardOverviewPage loaded');
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path || (path === "/dashboard-overview" && location.pathname === "/");

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/dashboard-overview" className="flex items-center gap-2 font-semibold">
              <Package className="h-6 w-6 text-primary" />
              <span className="">Admin Dashboard</span>
            </Link>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Toggle notifications</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Notifications</h4>
                            <p className="text-sm text-muted-foreground">You have 3 unread messages.</p>
                        </div>
                        {/* Placeholder notifications */}
                        <div className="text-sm">New order #ORD004 received.</div>
                        <div className="text-sm">Product "Plush Toy Dragon" low stock.</div>
                    </div>
                </PopoverContent>
            </Popover>
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
            <h1 className="text-lg font-semibold">Dashboard Overview</h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="https://i.pravatar.cc/150?u=admin-dash" alt="Admin User" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
              <DropdownMenuItem><UserCircle className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem><LogOut className="mr-2 h-4 w-4" />Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <ScrollArea className="h-full">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              <DataWidgetCard title="Total Revenue" value="$45,231.89" description="+20.1% from last month" icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} trend="up" trendText="+20.1%" />
              <DataWidgetCard title="New Customers" value="+1340" description="+180.1% from last month" icon={<Users className="h-4 w-4 text-muted-foreground" />} trend="up" trendText="+180.1%" />
              <DataWidgetCard title="New Orders" value="5" description="From today's sales" icon={<CreditCard className="h-4 w-4 text-muted-foreground" />} trend="neutral" />
              <DataWidgetCard title="Active Now" value="+573" description="Users currently on site" icon={<Activity className="h-4 w-4 text-muted-foreground" />} trend="up" />
            </div>
            <div className="mt-6 grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
              <InteractiveChartWrapper
                title="Sales Overview"
                description="Monthly sales performance."
                data={sampleSalesData}
                chartType="line"
                dataKey="sales"
                categoryKey="name"
                className="xl:col-span-2"
              />
              <InteractiveChartWrapper
                title="Sales by Device"
                description="Breakdown of sales by device type."
                data={sampleDeviceData}
                chartType="pie"
                dataKey="value"
                categoryKey="name"
              />
            </div>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>A quick look at the latest happenings.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>Order #ORD005 placed by user@example.com.</li>
                  <li>New product "Super Drone X" added to catalog.</li>
                  <li>Customer "Jane Doe" updated her profile.</li>
                  <li>Analytics report for "Q1 Sales" generated.</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild>
                    <Link to="/orders">View All Orders <ExternalLink className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardFooter>
            </Card>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;