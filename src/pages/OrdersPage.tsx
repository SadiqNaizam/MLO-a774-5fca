import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import FilterableSortableDataTable from '@/components/FilterableSortableDataTable';
import { toast } from "sonner";
import { Menu, Package, ShoppingCart, Users, LineChart as LineChartIconLucide, Settings, UserCircle, LogOut, MoreHorizontal, PlusCircle, Eye, Edit } from 'lucide-react';

const navLinks = [
  { href: "/dashboard-overview", label: "Overview", icon: <Package className="h-5 w-5" /> },
  { href: "/orders", label: "Orders", icon: <ShoppingCart className="h-5 w-5" />, badge: "5" },
  { href: "/products", label: "Products", icon: <Package className="h-5 w-5" /> },
  { href: "/customers", label: "Customers", icon: <Users className="h-5 w-5" /> },
  { href: "/analytics", label: "Analytics", icon: <LineChartIconLucide className="h-5 w-5" /> },
];

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: { itemName: string; quantity: number; price: number }[];
};

const sampleOrders: Order[] = [
  { id: "ORD001", customerName: "Alice Wonderland", customerEmail: "alice@example.com", date: "2024-07-15", status: "Delivered", total: 120.50, items: [{ itemName: 'Toy Car', quantity: 1, price: 20.50 }, { itemName: 'Doll', quantity: 2, price: 50.00 }] },
  { id: "ORD002", customerName: "Bob The Builder", customerEmail: "bob@example.com", date: "2024-07-18", status: "Processing", total: 75.00, items: [{ itemName: 'Building Blocks', quantity: 1, price: 75.00 }] },
  { id: "ORD003", customerName: "Charlie Brown", customerEmail: "charlie@example.com", date: "2024-07-19", status: "Pending", total: 30.00, items: [{ itemName: 'Kite', quantity: 1, price: 30.00 }] },
  { id: "ORD004", customerName: "Diana Prince", customerEmail: "diana@example.com", date: "2024-07-20", status: "Shipped", total: 250.99, items: [{ itemName: 'Action Figure Set', quantity: 1, price: 250.99 }] },
  { id: "ORD005", customerName: "Edward Scissorhands", customerEmail: "edward@example.com", date: "2024-07-21", status: "Cancelled", total: 45.00, items: [{ itemName: 'Art Kit', quantity: 1, price: 45.00 }] },
];

const OrdersPage = () => {
  console.log('OrdersPage loaded');
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [isViewOrderDialogOpen, setIsViewOrderDialogOpen] = useState(false);
  const [isEditStatusDialogOpen, setIsEditStatusDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentOrderStatus, setCurrentOrderStatus] = useState<OrderStatus | undefined>(undefined);
  
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewOrderDialogOpen(true);
  };

  const handleEditStatus = (order: Order) => {
    setSelectedOrder(order);
    setCurrentOrderStatus(order.status);
    setIsEditStatusDialogOpen(true);
  };
  
  const handleSaveStatus = () => {
    if (selectedOrder && currentOrderStatus) {
      // API call to update status would go here
      console.log(`Updating order ${selectedOrder.id} to status ${currentOrderStatus}`);
      // For demo, update local state (if managing data locally, which we aren't directly here)
      const updatedOrders = sampleOrders.map(o => o.id === selectedOrder.id ? {...o, status: currentOrderStatus} : o);
      // In a real app, you'd refetch or update a global state
      toast.success(`Order ${selectedOrder.id} status updated to ${currentOrderStatus}.`);
      setIsEditStatusDialogOpen(false);
      setSelectedOrder(null);
    }
  };

  const orderColumns: ColumnDef<Order>[] = [
    { accessorKey: "id", header: "Order ID" },
    { accessorKey: "customerName", header: "Customer" },
    { accessorKey: "date", header: "Date" },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        let variant: "default" | "secondary" | "destructive" | "outline" = "default";
        if (status === "Processing") variant = "secondary";
        else if (status === "Pending") variant = "outline";
        else if (status === "Cancelled" || status === "Refunded") variant = "destructive";
        return <Badge variant={variant}>{status}</Badge>;
      }
    },
    { 
      accessorKey: "total", 
      header: "Total",
      cell: ({ row }) => `$${row.original.total.toFixed(2)}`
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const order = row.original;
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
              <DropdownMenuItem onClick={() => handleViewOrder(order)}><Eye className="mr-2 h-4 w-4" />View Details</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditStatus(order)}><Edit className="mr-2 h-4 w-4" />Update Status</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        {/* Sidebar structure identical to DashboardOverviewPage */}
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
             <h1 className="text-lg font-semibold">Manage Orders</h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="https://i.pravatar.cc/150?u=admin-orders" alt="Admin User" />
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
            <div className="flex justify-end mb-4">
                {/* <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Order</Button> */}
                 {/* Add order functionality can be added if needed */}
            </div>
            <FilterableSortableDataTable columns={orderColumns} data={sampleOrders} globalFilterPlaceholder="Search orders by ID, customer, email..." />
          </ScrollArea>
        </main>
      </div>

      {/* View Order Details Dialog */}
      <Dialog open={isViewOrderDialogOpen} onOpenChange={setIsViewOrderDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details: {selectedOrder?.id}</DialogTitle>
            <DialogDescription>Customer: {selectedOrder?.customerName} ({selectedOrder?.customerEmail})</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="py-4 space-y-2">
              <p><strong>Date:</strong> {selectedOrder.date}</p>
              <p><strong>Status:</strong> <Badge variant={selectedOrder.status === "Processing" ? "secondary" : (selectedOrder.status === "Pending" ? "outline" : (selectedOrder.status === "Cancelled" || selectedOrder.status === "Refunded" ? "destructive" : "default"))}>{selectedOrder.status}</Badge></p>
              <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
              <div><strong>Items:</strong>
                <ul className="list-disc pl-5">
                  {selectedOrder.items.map((item, idx) => (
                    <li key={idx}>{item.itemName} (x{item.quantity}) - ${item.price.toFixed(2)} each</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewOrderDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Order Status Dialog */}
      <Dialog open={isEditStatusDialogOpen} onOpenChange={setIsEditStatusDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Status for Order: {selectedOrder?.id}</DialogTitle>
            <DialogDescription>Select the new status for this order.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={currentOrderStatus} onValueChange={(value: OrderStatus) => setCurrentOrderStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'] as OrderStatus[]).map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditStatusDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveStatus}>Save Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;