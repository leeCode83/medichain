"use client"

import { useState } from "react"
import {
    BarChart3,
    Box,
    Factory,
    History,
    Package,
    PackagePlus,
    Plus,
    Search,
    AlertTriangle,
    CheckCircle2,
    Loader2
} from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

// Dummy Data
const medicineStats = [
    { name: "Paracetamol", value: 1250, color: "#3b82f6" },
    { name: "Amoxicillin", value: 850, color: "#10b981" },
    { name: "Ibuprofen", value: 620, color: "#f59e0b" },
    { name: "Omeprazole", value: 340, color: "#8b5cf6" },
    { name: "Cetirizine", value: 180, color: "#ef4444" },
]

const recentBatches = [
    {
        id: "BATCH-2023-001",
        medicine: "Paracetamol 500mg",
        quantity: 5000,
        date: "2023-12-10",
        status: "Completed",
        hash: "0x7f...3a2b"
    },
    {
        id: "BATCH-2023-002",
        medicine: "Amoxicillin 250mg",
        quantity: 2000,
        date: "2023-12-11",
        status: "Processing",
        hash: "0x8a...4b1c"
    },
    {
        id: "BATCH-2023-003",
        medicine: "Ibuprofen 400mg",
        quantity: 3000,
        date: "2023-12-12",
        status: "Pending",
        hash: "-"
    },
]

const initialMedicinesList = [
    { id: 1, name: "Paracetamol", sku: "MED-001", stock: 1250, minStock: 500, status: "In Stock" },
    { id: 2, name: "Amoxicillin", sku: "MED-002", stock: 850, minStock: 200, status: "In Stock" },
    { id: 3, name: "Ibuprofen", sku: "MED-003", stock: 620, minStock: 300, status: "In Stock" },
    { id: 4, name: "Omeprazole", sku: "MED-004", stock: 340, minStock: 100, status: "In Stock" },
    { id: 5, name: "Cetirizine", sku: "MED-005", stock: 180, minStock: 200, status: "Low Stock" },
]

export default function FactoryDashboard() {
    const [medicinesList, setMedicinesList] = useState(initialMedicinesList)

    // New Production State
    const [isNewProductionOpen, setIsNewProductionOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [newMedName, setNewMedName] = useState("")
    const [newMedIngredient, setNewMedIngredient] = useState("")
    const [newMedSku, setNewMedSku] = useState("")

    // Restock State
    const [isRestockOpen, setIsRestockOpen] = useState(false)
    const [isRestocking, setIsRestocking] = useState(false)
    const [selectedMedicine, setSelectedMedicine] = useState<typeof medicinesList[0] | null>(null)
    const [restockBatchId, setRestockBatchId] = useState("")
    const [restockQuantity, setRestockQuantity] = useState("")

    const getTotalStock = () => medicineStats.reduce((acc, curr) => acc + curr.value, 0)
    const getLowStockCount = () => medicinesList.filter(m => m.stock < m.minStock).length

    const handleCreateMedicine = async () => {
        if (!newMedName || !newMedIngredient || !newMedSku) {
            toast.error("Please fill in all fields")
            return
        }

        setIsCreating(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        const newMedicine = {
            id: medicinesList.length + 1,
            name: newMedName,
            sku: newMedSku,
            stock: 0,
            minStock: 100, // Default
            status: "Out of Stock"
        }

        setMedicinesList([...medicinesList, newMedicine])
        setIsCreating(false)
        setIsNewProductionOpen(false)
        setNewMedName("")
        setNewMedIngredient("")
        setNewMedSku("")

        toast.success("New Medicine Type Created", {
            description: `${newMedName} has been registered successfully.`
        })
    }

    const openRestockModal = (medicine: typeof medicinesList[0]) => {
        setSelectedMedicine(medicine)
        setRestockBatchId(`BATCH-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`) // Auto-generate suggestion
        setRestockQuantity("")
        setIsRestockOpen(true)
    }

    const handleRestock = async () => {
        if (!selectedMedicine || !restockBatchId || !restockQuantity) {
            toast.error("Please fill in all details")
            return
        }

        setIsRestocking(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        const quantity = parseInt(restockQuantity)

        setMedicinesList(prev => prev.map(med => {
            if (med.id === selectedMedicine.id) {
                const newStock = med.stock + quantity
                return {
                    ...med,
                    stock: newStock,
                    status: newStock > med.minStock ? "In Stock" : med.status
                }
            }
            return med
        }))

        setIsRestocking(false)
        setIsRestockOpen(false)

        toast.success("Restock Successful", {
            description: `Added ${quantity} units to ${selectedMedicine.name}.`
        })
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <Navbar />
            <div className="flex flex-col sm:gap-4 sm:py-4">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 container mx-auto">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight">Factory Dashboard</h1>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-8 gap-1">
                                <History className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    History Log
                                </span>
                            </Button>

                            <Dialog open={isNewProductionOpen} onOpenChange={setIsNewProductionOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="h-8 gap-1">
                                        <Plus className="h-3.5 w-3.5" />
                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                            New Production
                                        </span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Register New Medicine Type</DialogTitle>
                                        <DialogDescription>
                                            Add a new medicine definition to the smart contract. Initial stock will be 0.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Medicine Name</Label>
                                            <Input
                                                id="name"
                                                placeholder="e.g. Paracetamol 500mg"
                                                value={newMedName}
                                                onChange={(e) => setNewMedName(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="ingredient">Active Ingredient</Label>
                                            <Input
                                                id="ingredient"
                                                placeholder="e.g. Acetaminophen"
                                                value={newMedIngredient}
                                                onChange={(e) => setNewMedIngredient(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="sku">SKU / Code</Label>
                                            <Input
                                                id="sku"
                                                placeholder="MED-XXX"
                                                value={newMedSku}
                                                onChange={(e) => setNewMedSku(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsNewProductionOpen(false)}>Cancel</Button>
                                        <Button onClick={handleCreateMedicine} disabled={isCreating}>
                                            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Create Medicine
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Medicines</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{medicinesList.length}</div>
                                <p className="text-xs text-muted-foreground">Types of medicines registered</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
                                <Box className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{getTotalStock().toLocaleString('en-US')}</div>
                                <p className="text-xs text-muted-foreground">Units available in warehouse</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
                                <Factory className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">3</div>
                                <p className="text-xs text-muted-foreground">Currently in production</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{getLowStockCount()}</div>
                                <p className="text-xs text-muted-foreground">Medicines below minimum level</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:gap-8 lg:grid-cols-3">

                        {/* Main Content Area - Left 2/3 */}
                        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">

                            <Tabs defaultValue="inventory" className="w-full">
                                <div className="flex items-center">
                                    <TabsList>
                                        <TabsTrigger value="inventory">Inventory</TabsTrigger>
                                        <TabsTrigger value="batches">Batches</TabsTrigger>
                                        <TabsTrigger value="register">Register Medicine</TabsTrigger>
                                        <TabsTrigger value="restock">Restock</TabsTrigger>
                                    </TabsList>
                                    <div className="ml-auto flex items-center gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="search"
                                                placeholder="Search medicines..."
                                                className="h-9 w-[200px] rounded-lg bg-background pl-8 md:w-[300px]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <TabsContent value="inventory" className="mt-4">
                                    <Card x-chunk="dashboard-05-chunk-3">
                                        <CardHeader className="px-7">
                                            <CardTitle>Medicine Inventory</CardTitle>
                                            <CardDescription>
                                                List of all registered medicines and their current stock levels.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Medicine Name</TableHead>
                                                        <TableHead className="hidden sm:table-cell">SKU</TableHead>
                                                        <TableHead className="hidden sm:table-cell">Status</TableHead>
                                                        <TableHead className="text-right">Stock</TableHead>
                                                        <TableHead className="text-right">Action</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {medicinesList.map((medicine) => (
                                                        <TableRow key={medicine.id}>
                                                            <TableCell>
                                                                <div className="font-medium">{medicine.name}</div>
                                                            </TableCell>
                                                            <TableCell className="hidden sm:table-cell">{medicine.sku}</TableCell>
                                                            <TableCell className="hidden sm:table-cell">
                                                                <Badge variant={medicine.status.includes("Out") ? "destructive" : medicine.status === "Low Stock" ? "destructive" : "secondary"}>
                                                                    {medicine.status}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right">{medicine.stock}</TableCell>
                                                            <TableCell className="text-right">
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => openRestockModal(medicine)}
                                                                >
                                                                    Restock
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="batches" className="mt-4">
                                    <Card x-chunk="dashboard-05-chunk-3">
                                        <CardHeader className="px-7">
                                            <CardTitle>Recent Production Batches</CardTitle>
                                            <CardDescription>History of recent manufacturing batches.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Batch ID</TableHead>
                                                        <TableHead>Medicine</TableHead>
                                                        <TableHead className="hidden md:table-cell">Date</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead className="text-right">Quantity</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {recentBatches.map((batch) => (
                                                        <TableRow key={batch.id}>
                                                            <TableCell className="font-medium">{batch.id}</TableCell>
                                                            <TableCell>{batch.medicine}</TableCell>
                                                            <TableCell className="hidden md:table-cell">{batch.date}</TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline">{batch.status}</Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right">{batch.quantity}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="register" className="mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Register New Medicine</CardTitle>
                                            <CardDescription>
                                                Add a new medicine type to the blockchain registry.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="med-name">Medicine Name</Label>
                                                <Input id="med-name" placeholder="e.g. Paracetamol 500mg" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="active-ingredient">Active Ingredient</Label>
                                                <Input id="active-ingredient" placeholder="e.g. Acetaminophen" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="sku">SKU / Code</Label>
                                                <Input id="sku" placeholder="MED-XXX" />
                                            </div>
                                            <Button className="w-full sm:w-auto">Register Medicine</Button>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="restock" className="mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Restock Medicine (Minting)</CardTitle>
                                            <CardDescription>
                                                Produce new units of existing medicine. This will mint new NFTs.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="select-med">Select Medicine</Label>
                                                <select
                                                    id="select-med"
                                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <option value="">Select a medicine...</option>
                                                    {medicinesList.map(m => (
                                                        <option key={m.id} value={m.id}>{m.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="batch-id">Batch ID</Label>
                                                <Input id="batch-id" placeholder="Auto-generated or Manual Input" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="quantity">Quantity (Units)</Label>
                                                <Input id="quantity" type="number" placeholder="100" />
                                            </div>
                                            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded text-sm text-muted-foreground">
                                                <CheckCircle2 className="h-4 w-4" />
                                                <span>This action will mint new NFTs to the contract warehouse.</span>
                                            </div>
                                            <Button className="w-full sm:w-auto">Mint & Restock</Button>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                            </Tabs>
                        </div>

                        {/* Sidebar / Right Column - 1/3 */}
                        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">

                            {/* Distribution Chart */}
                            <Card className="overflow-hidden">
                                <CardHeader>
                                    <CardTitle>Stock Distribution</CardTitle>
                                    <CardDescription>
                                        Current stock levels by medicine type
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={medicineStats}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {medicineStats.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip
                                                    formatter={(value: any, name: any) => [`${value} Units`, name]}
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                />
                                                <Legend verticalAlign="bottom" height={36} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Activity / Notifications */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Notifications</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <div className="flex items-start gap-4 text-sm">
                                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                                            <PackagePlus className="h-4 w-4" />
                                        </div>
                                        <div className="grid gap-1">
                                            <p className="font-medium">New Batch Created</p>
                                            <p className="text-muted-foreground">Batch #2023-002 for Amoxicillin initiated.</p>
                                            <p className="text-xs text-muted-foreground">2 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 text-sm">
                                        <div className="rounded-full bg-destructive/10 p-2 text-destructive">
                                            <AlertTriangle className="h-4 w-4" />
                                        </div>
                                        <div className="grid gap-1">
                                            <p className="font-medium">Low Stock Alert</p>
                                            <p className="text-muted-foreground">Cetirizine stock is below minimum threshold (200).</p>
                                            <p className="text-xs text-muted-foreground">5 hours ago</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                        </div>
                    </div>

                    {/* Restock Dialog - Placed here to span document if needed, but safe inside main container too */}
                    <Dialog open={isRestockOpen} onOpenChange={setIsRestockOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Restock {selectedMedicine?.name}</DialogTitle>
                                <DialogDescription>
                                    Create a new batch of medicines to increase stock levels.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="restock-batch">Batch ID</Label>
                                    <Input
                                        id="restock-batch"
                                        value={restockBatchId}
                                        onChange={(e) => setRestockBatchId(e.target.value)}
                                        placeholder="BATCH-YYYY-001"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="restock-qty">Quantity</Label>
                                    <Input
                                        id="restock-qty"
                                        type="number"
                                        value={restockQuantity}
                                        onChange={(e) => setRestockQuantity(e.target.value)}
                                        placeholder="100"
                                    />
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    <p>Current Stock: <span className="font-medium text-foreground">{selectedMedicine?.stock}</span></p>
                                    {restockQuantity && (
                                        <p>New Stock: <span className="font-medium text-green-600">{selectedMedicine ? selectedMedicine.stock + parseInt(restockQuantity || '0') : 0}</span></p>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsRestockOpen(false)}>Cancel</Button>
                                <Button onClick={handleRestock} disabled={isRestocking}>
                                    {isRestocking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Restock
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                </main>
            </div>
            <Footer />
        </div>
    )
}
