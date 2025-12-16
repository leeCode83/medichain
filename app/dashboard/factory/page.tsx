"use client"

import { useState, useMemo } from "react"
import {
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
import { useCreateMedicine, useGetAllMedicines, useRestockMedicine, useRestockHistory } from "@/hooks/useFactory"

export default function FactoryDashboard() {
    // Real Data from Blockchain
    const { medicines, isLoading: isLoadingMedicines } = useGetAllMedicines()
    const { history: restockHistory, isLoading: isLoadingHistory } = useRestockHistory()

    const totalStock = useMemo(() => {
        return medicines.reduce((acc, curr) => acc + BigInt(curr.totalBatchesMinted), BigInt(0))
    }, [medicines])

    // Hooks
    const { createMedicine, isPending: isCreating } = useCreateMedicine()
    const { restockMedicine, isPending: isRestocking } = useRestockMedicine()

    // New Production State
    const [isNewProductionOpen, setIsNewProductionOpen] = useState(false)
    const [newMedName, setNewMedName] = useState("")
    const [newMedIngredient, setNewMedIngredient] = useState("")

    // Restock State
    const [isRestockOpen, setIsRestockOpen] = useState(false)
    // const [isRestocking, setIsRestocking] = useState(false) // Replaced by hook

    const [selectedMedicine, setSelectedMedicine] = useState<any | null>(null)
    const [restockBatchId, setRestockBatchId] = useState("")
    const [restockQuantity, setRestockQuantity] = useState("")

    const handleCreateMedicine = async () => {
        if (!newMedName || !newMedIngredient) {
            toast.error("Please fill in all fields")
            return
        }

        await createMedicine(newMedName, newMedIngredient)

        // Reset form (Ideally this happens after confirmation, but for UX we can close pending success or wait)
        // For now, we'll keep it simple as the hook handles notifications.
        setNewMedName("")
        setNewMedIngredient("")
        setIsNewProductionOpen(false)
    }

    const openRestockModal = (medicine: any) => {
        setSelectedMedicine(medicine)
        setRestockBatchId(`BATCH-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`) // Auto-generate suggestion
        setRestockQuantity("")
        setIsRestockOpen(true)
    }

    const handleRestock = async () => {
        if (!selectedMedicine || !restockQuantity) {
            toast.error("Please fill in quantity")
            return
        }

        const qty = parseInt(restockQuantity)
        if (isNaN(qty) || qty <= 0) {
            toast.error("Invalid quantity")
            return
        }

        // Find index of selected medicine to use as ID
        const medicineId = medicines.findIndex(m => m.name === selectedMedicine.name && m.activeIngredient === selectedMedicine.activeIngredient)

        if (medicineId === -1) {
            toast.error("Medicine not found in registry")
            return
        }

        await restockMedicine(medicineId, qty)

        setIsRestockOpen(false)
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

                    {/* KPI Cards (Placeholder for real data) */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Medicines</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{medicines.length}</div>
                                <p className="text-xs text-muted-foreground">Types of medicines registered</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
                                <Box className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalStock.toString()}</div>
                                <p className="text-xs text-muted-foreground">Units available in warehouse</p>
                            </CardContent>
                        </Card>
                        {/* More KPIs can be added back when data is available */}
                    </div>

                    <div className="grid gap-4 md:gap-8 lg:grid-cols-3">

                        {/* Main Content Area - Full Width for now */}
                        <div className="grid auto-rows-max items-start gap-4 lg:col-span-3 lg:gap-8">

                            <Tabs defaultValue="inventory" className="w-full">
                                <div className="flex items-center">
                                    <TabsList>
                                        <TabsTrigger value="inventory">Inventory</TabsTrigger>
                                        <TabsTrigger value="batches">Batches</TabsTrigger>
                                    </TabsList>
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
                                                        <TableHead className="hidden sm:table-cell">Active Ingredient</TableHead>
                                                        <TableHead className="hidden sm:table-cell">Total Produced</TableHead>
                                                        <TableHead className="text-right">Action</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {isLoadingMedicines ? (
                                                        <TableRow>
                                                            <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <Loader2 className="h-4 w-4 animate-spin" /> Loading data...
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : medicines.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                                                                No medicines found. Connect wallet or register new medicine to start.
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        medicines.map((medicine, idx) => (
                                                            <TableRow key={idx}>
                                                                <TableCell>
                                                                    <div className="font-medium">{medicine.name}</div>
                                                                </TableCell>
                                                                <TableCell className="hidden sm:table-cell">{medicine.activeIngredient}</TableCell>
                                                                <TableCell className="hidden sm:table-cell">
                                                                    <Badge variant="secondary">
                                                                        {medicine.totalBatchesMinted.toString()} Batches
                                                                    </Badge>
                                                                </TableCell>
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
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="batches" className="mt-4">
                                    <Card x-chunk="dashboard-05-chunk-4">
                                        <CardHeader className="px-7">
                                            <CardTitle>Batch History</CardTitle>
                                            <CardDescription>
                                                History of all medicine restock transactions on the blockchain.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Tx Hash</TableHead>
                                                        <TableHead>Block</TableHead>
                                                        <TableHead>Medicine Name</TableHead>
                                                        <TableHead className="text-right">Quantity Minted</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {isLoadingHistory ? (
                                                        <TableRow>
                                                            <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <Loader2 className="h-4 w-4 animate-spin" /> Loading history...
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : restockHistory.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                                                                No restock history found.
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        restockHistory.map((log, idx) => (
                                                            <TableRow key={idx}>
                                                                <TableCell className="font-mono text-xs">
                                                                    {log.transactionHash.substring(0, 10)}...
                                                                </TableCell>
                                                                <TableCell>{log.blockNumber.toString()}</TableCell>
                                                                <TableCell>
                                                                    <div className="font-medium">
                                                                        {medicines[log.medicineId]?.name || `Unknown ID: ${log.medicineId}`}
                                                                    </div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        {medicines[log.medicineId]?.activeIngredient}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <Badge variant="outline">
                                                                        +{log.quantity}
                                                                    </Badge>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                            </Tabs>
                        </div>
                    </div>

                    {/* Restock Dialog - Placeholder */}
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
                                    <Label htmlFor="restock-qty">Quantity</Label>
                                    <Input
                                        id="restock-qty"
                                        type="number"
                                        value={restockQuantity}
                                        onChange={(e) => setRestockQuantity(e.target.value)}
                                        placeholder="100"
                                    />
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
