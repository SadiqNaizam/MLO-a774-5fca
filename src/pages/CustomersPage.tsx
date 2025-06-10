import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import FilterableSortableDataTable from '@/components/FilterableSortableDataTable';
import { toast } from "sonner";
import { Menu, Package, ShoppingCart, Users, LineChart as LineChartIconLucide, Settings, UserCircle, LogOut, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';

const navLinks = [
  { href: "/dashboard-overview", label: "Overview", icon: <Package className="h-5 w-5" /> },
  { href: "/orders", label: "Orders", icon: <ShoppingCart className="h-5 w-5" />, badge: "5" },
  { href: "/products", label: "Products", icon: <Package className="h-5 w-5" /> },
  { href: "/customers", label: "Customers", icon: <Users className="h-5 w-5" /> },
  { href: "/analytics", label: "Analytics", icon: <LineChartIconLucide className="h-5 w-5" /> },
];

type Customer = {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  totalOrders: number;
  lifetimeValue: number;
  avatarUrl?: string;
  lastSeen?: string;
};

const sampleCustomers: Customer[] = [
  { id: "CUST001", name: "Alice Wonderland", email: "alice@example.com", registrationDate: "2023-01-10", totalOrders: 5, lifetimeValue: 560.00, avatarUrl: "https://i.pravatar.cc/150?u=alice", lastSeen: "2 days ago" },
  { id: "CUST002", name: "Bob The Builder", email: "bob@example.com", registrationDate: "2023-02-20", totalOrders: 2, lifetimeValue: 150.75, avatarUrl: "https://i.pravatar.cc/150?u=bob", lastSeen: "5 hours ago" },
  { id: "CUST003", name: "Charlie Brown", email: "charlie@example.com", registrationDate: "2023-03-05", totalOrders: 8, lifetimeValue: 1200.20, avatarUrl: "https://i.pravatar.cc/150?u=charlie", lastSeen: "1 week ago" },
  { id: "CUST004", name: "Diana Prince", email: "diana@example.com", registrationDate: "2023-04-12", totalOrders: 12, lifetimeValue: 2100.50, avatarUrl: "https://i.pravatar.cc/150?u=diana", lastSeen: "Online" },
];

const CustomersPage = () => {
  console.log('CustomersPage loaded');
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [isViewCustomerDialogOpen, setIsViewCustomerDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewCustomerDialogOpen(true);
  };

  const customerColumns: ColumnDef<Customer>[] = [
    { 
      accessorKey: "avatarUrl", 
      header: "",
      cell: ({ row }) => (
        <Avatar className="h-9 w-9">
          <AvatarImage src={row.original.avatarUrl} alt={row.original.name} />
          <AvatarFallback>{row.original.name.substring(0,2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "registrationDate", header: "Registered" },
    { accessorKey: "totalOrders", header: "Total Orders", cell: ({row}) => <div className="text-center">{row.original.totalOrders}</div> },
    { accessorKey: "lifetimeValue", header: "Lifetime Value", cell: ({row}) => `$${row.original.lifetimeValue.toFixed(2)}` },
    { accessorKey: "lastSeen", header: "Last Seen" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleViewCustomer(customer)}><Eye className="mr-2 h-4 w-4" />View Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info(`Editing customer ${customer.id} (Not Implemented)`)}><Edit className="mr-2 h-4 w-4" />Edit Customer</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.error(`Deleting customer ${customer.id} (Not Implemented)`)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete Customer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

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
             <h1 className="text-lg font-semibold">Customer Management</h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="https://i.pravatar.cc/150?u=admin-customers" alt="Admin User" />
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
            <FilterableSortableDataTable columns={customerColumns} data={sampleCustomers} globalFilterPlaceholder="Search customers by name, email..." />
          </ScrollArea>
        </main>
      </div>

      {/* View Customer Details Dialog */}
      <Dialog open={isViewCustomerDialogOpen} onOpenChange={setIsViewCustomerDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Customer Profile: {selectedCustomer?.name}</DialogTitle>
            <DialogDescription>Details for {selectedCustomer?.email}</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="py-4 space-y-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedCustomer.avatarUrl} alt={selectedCustomer.name} />
                    <AvatarFallback>{selectedCustomer.name.substring(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <p><strong>ID:</strong> {selectedCustomer.id}</p>
                    <p><strong>Registered:</strong> {selectedCustomer.registrationDate}</p>
                </div>
              </div>
              <p><strong>Total Orders:</strong> {selectedCustomer.totalOrders}</p>
              <p><strong>Lifetime Value:</strong> ${selectedCustomer.lifetimeValue.toFixed(2)}</p>
              <p><strong>Last Seen:</strong> {selectedCustomer.lastSeen}</p>
              {/* Placeholder for order history or other details */}
              <p className="text-sm text-muted-foreground mt-2">Further details like order history can be displayed here.</p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewCustomerDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomersPage;