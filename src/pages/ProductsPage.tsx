import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import FilterableSortableDataTable from '@/components/FilterableSortableDataTable';
import { toast } from "sonner";
import { Menu, Package, ShoppingCart, Users, LineChart as LineChartIconLucide, Settings, UserCircle, LogOut, MoreHorizontal, PlusCircle, Edit, Trash2 } from 'lucide-react';

const navLinks = [
  { href: "/dashboard-overview", label: "Overview", icon: <Package className="h-5 w-5" /> },
  { href: "/orders", label: "Orders", icon: <ShoppingCart className="h-5 w-5" />, badge: "5" },
  { href: "/products", label: "Products", icon: <Package className="h-5 w-5" /> },
  { href: "/customers", label: "Customers", icon: <Users className="h-5 w-5" /> },
  { href: "/analytics", label: "Analytics", icon: <LineChartIconLucide className="h-5 w-5" /> },
];

type ProductStatus = 'Published' | 'Draft' | 'Archived';
type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  imageUrl?: string;
  description?: string;
};

const sampleProducts: Product[] = [
  { id: "PROD001", name: "Plush Toy Dragon", sku: "PTD-001", category: "Toys", price: 29.99, stock: 150, status: "Published", imageUrl: "https://placehold.co/64x64/3498db/white?text=Toy1", description: "A friendly plush dragon." },
  { id: "PROD002", name: "Wooden Block Set", sku: "WBS-002", category: "Educational", price: 45.00, stock: 80, status: "Published", imageUrl: "https://placehold.co/64x64/2ecc71/white?text=Toy2", description: "Colorful wooden blocks for creative play." },
  { id: "PROD003", name: "RC Car Extreme", sku: "RCC-003", category: "Vehicles", price: 79.50, stock: 0, status: "Draft", imageUrl: "https://placehold.co/64x64/e74c3c/white?text=Toy3", description: "Fast remote-controlled car." },
];

const productFormSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  sku: z.string().min(1, "SKU is required"),
  category: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  description: z.string().max(500, "Description too long").optional(),
  status: z.enum(['Published', 'Draft', 'Archived']),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});
type ProductFormData = z.infer<typeof productFormSchema>;

const ProductsPage = () => {
  console.log('ProductsPage loaded');
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  // This would typically be fetched or managed via global state
  const [productsData, setProductsData] = useState<Product[]>(sampleProducts);


  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "", sku: "", category: "", price: 0, stock: 0, description: "", status: "Draft", imageUrl: ""
    }
  });

  useEffect(() => {
    if (editingProduct) {
      form.reset({
        name: editingProduct.name,
        sku: editingProduct.sku,
        category: editingProduct.category,
        price: editingProduct.price,
        stock: editingProduct.stock,
        description: editingProduct.description || "",
        status: editingProduct.status,
        imageUrl: editingProduct.imageUrl || "",
      });
    } else {
      form.reset({ name: "", sku: "", category: "", price: 0, stock: 0, description: "", status: "Draft", imageUrl: "" });
    }
  }, [editingProduct, form, isProductDialogOpen]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsProductDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductDialogOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    // API call to delete product
    console.log("Deleting product", productId);
    setProductsData(prev => prev.filter(p => p.id !== productId));
    toast.success(`Product ${productId} deleted.`);
  };

  function onSubmit(data: ProductFormData) {
    console.log("Product form submitted:", data);
    if (editingProduct) {
      // API call to update product
      setProductsData(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...data, id: editingProduct.id } : p));
      toast.success(`Product "${data.name}" updated.`);
    } else {
      // API call to create new product
      const newProduct = { ...data, id: `PROD${String(Date.now()).slice(-3)}` }; // Simple ID generation
      setProductsData(prev => [newProduct, ...prev]);
      toast.success(`Product "${data.name}" created.`);
    }
    setIsProductDialogOpen(false);
  }
  
  const productColumns: ColumnDef<Product>[] = [
    { 
      accessorKey: "imageUrl", 
      header: "Image",
      cell: ({ row }) => <img src={row.original.imageUrl || 'https://placehold.co/40x40/E0E0E0/757575?text=P'} alt={row.original.name} className="h-10 w-10 object-cover rounded" />
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "sku", header: "SKU" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "price", header: "Price", cell: ({ row }) => `$${row.original.price.toFixed(2)}`},
    { 
      accessorKey: "stock", 
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.original.stock;
        return <Badge variant={stock > 20 ? "default" : (stock > 0 ? "secondary" : "destructive")}>{stock > 0 ? `${stock} in stock` : "Out of stock"}</Badge>;
      }
    },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => <Badge variant={row.original.status === 'Published' ? "default" : (row.original.status === 'Draft' ? "outline" : "secondary")}>{row.original.status}</Badge>
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;
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
              <DropdownMenuItem onClick={() => handleEditProduct(product)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
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
             <h1 className="text-lg font-semibold">Product Catalog</h1>
          </div>
          <Button onClick={handleAddProduct} size="sm">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="https://i.pravatar.cc/150?u=admin-products" alt="Admin User" />
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
            <FilterableSortableDataTable columns={productColumns} data={productsData} globalFilterPlaceholder="Search products by name, SKU, category..." />
          </ScrollArea>
        </main>
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {editingProduct ? "Update the details of this product." : "Fill in the details for the new product."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Product Name</FormLabel><FormControl><Input placeholder="e.g. Super Toy Car" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="sku" render={({ field }) => (
                    <FormItem><FormLabel>SKU</FormLabel><FormControl><Input placeholder="e.g. TOY-CAR-001" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="e.g. Toys, Educational" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="stock" render={({ field }) => (
                    <FormItem><FormLabel>Stock Quantity</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </div>
              <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the product..." {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="imageUrl" render={({ field }) => (
                  <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://example.com/image.png" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel>Status</FormLabel>
                        <FormDescription>Is this product published, a draft, or archived?</FormDescription>
                    </div>
                    <FormControl>
                        <select {...field} className="p-2 border rounded-md bg-background">
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                            <option value="Archived">Archived</option>
                        </select>
                    </FormControl>
                </FormItem>
              )}/>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingProduct ? "Save Changes" : "Create Product"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPage;