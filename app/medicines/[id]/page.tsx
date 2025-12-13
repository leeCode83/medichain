"use client"

import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import {
    ArrowLeft,
    Box,
    CheckCircle,
    ChevronRight,
    ExternalLink,
    FileText,
    Globe,
    History,
    ShieldCheck,
    Truck
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

// Data (Duplicated for demo simplicity)
const medicines = [
    { id: 1, name: "Paracetamol", dosage: "500mg", type: "Pain Reliever", description: "Effective for treating mild to moderate pain and fever.", image: "/assets/medicines/paracetamol.png", manufacturer: "PharmaCare Inc.", contract: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", batches: 12 },
    { id: 2, name: "Amoxicillin", dosage: "250mg", type: "Antibiotic", description: "Used to treat a variety of bacterial infections.", image: "/assets/medicines/amoxicillin.png", manufacturer: "BioHealth Ltd.", contract: "0x1234567890abcdef1234567890abcdef12345678", batches: 8 },
    { id: 3, name: "Ibuprofen", dosage: "400mg", type: "Anti-inflammatory", description: "Reduces fever and treats pain or inflammation.", image: "/assets/medicines/ibuprofen.png", manufacturer: "MediCorp", contract: "0xabcdef1234567890abcdef1234567890abcdef12", batches: 15 },
    { id: 4, name: "Omeprazole", dosage: "20mg", type: "Acid Reflux", description: "Treats gastroesophageal reflux disease (GERD).", image: "/assets/medicines/omeprazole.png", manufacturer: "Gastrolife", contract: "0x9876543210fedcba9876543210fedcba98765432", batches: 5 },
    { id: 5, name: "Ciprofloxacin", dosage: "500mg", type: "Antibiotic", description: "Broad-spectrum antibiotic for bacterial infections.", image: "/assets/medicines/ciprofloxacin.png", manufacturer: "Aurobindo Pharma", contract: "0x4321fedcba09876543210987654321fedcba0987", batches: 9 },
    { id: 6, name: "Metformin", dosage: "500mg", type: "Antidiabetic", description: "First-line medication for the treatment of type 2 diabetes.", image: "/assets/medicines/metformin.png", manufacturer: "DiabetesCare", contract: "0x567890abcdef1234567890abcdef123456789012", batches: 20 },
    { id: 7, name: "Amlodipine", dosage: "10mg", type: "Hypertension", description: "Calcium channel blocker used to treat high blood pressure.", image: "/assets/medicines/amlodipine.png", manufacturer: "CardioLux", contract: "0x0987654321fedcba0987654321fedcba09876543", batches: 11 },
    { id: 8, name: "Simvastatin", dosage: "20mg", type: "Cholesterol", description: "Used to control high cholesterol and triglyceride levels.", image: "/assets/medicines/simvastatin.png", manufacturer: "Aura Pharma", contract: "0x11223344556677889900aabbccddeeff11223344", batches: 14 },
]

// Mock Batch Data
const recentBatches = [
    { id: "BATCH-2023-001", date: "2023-12-01", quantity: 5000, status: "Distributed" },
    { id: "BATCH-2023-002", date: "2023-12-05", quantity: 3500, status: "In Transit" },
    { id: "BATCH-2023-003", date: "2023-12-10", quantity: 6000, status: "Manufacturing" },
]

export default function MedicineDetailPage() {
    const params = useParams()
    // Handle case where params.id is undefined (e.g. during static build or initial hydration)
    const idStr = Array.isArray(params.id) ? params.id[0] : params.id
    const medId = idStr ? parseInt(idStr) : 0

    const medicine = medicines.find(m => m.id === medId)

    if (!medicine) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">Medicine not found</h1>
                <Link href="/medicines" className="mt-4">
                    <Button>Back to Catalog</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <Navbar />
            <div className="flex flex-col sm:gap-4 sm:py-4">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 container mx-auto">

                    {/* Breadcrumb / Back Navigation */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground my-4">
                        <Link href="/medicines" className="hover:text-primary flex items-center gap-1">
                            <ArrowLeft className="h-4 w-4" />
                            Catalog
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-foreground">{medicine.name}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column: Image & Quick Stats */}
                        <div className="space-y-6">
                            <Card className="overflow-hidden border-2">
                                <div className="relative h-[300px] sm:h-[400px] w-full bg-white p-8 flex items-center justify-center">
                                    <Image
                                        src={medicine.image}
                                        alt={medicine.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Blockchain Verification</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="h-5 w-5" />
                                            <span className="font-medium">Authenticity Verified</span>
                                        </div>
                                    </div>

                                    <div className="grid gap-1">
                                        <span className="text-xs text-muted-foreground uppercase font-semibold">Contract Address</span>
                                        <code className="text-xs bg-muted p-2 rounded break-all font-mono">
                                            {medicine.contract}
                                        </code>
                                    </div>

                                    <Link href={`https://eth-sepolia.blockscout.com/address/${medicine.contract}`} target="_blank" className="w-full block">
                                        <Button variant="outline" className="w-full gap-2 border-primary text-primary hover:bg-primary/5">
                                            <Box className="h-4 w-4" />
                                            View on Blockscout
                                            <ExternalLink className="h-3 w-3 ml-auto" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Details & Tabs */}
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-2">{medicine.name}</h1>
                                <div className="flex items-center gap-3 mb-4">
                                    <Badge variant="secondary" className="text-lg px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
                                        {medicine.dosage}
                                    </Badge>
                                    <span className="text-muted-foreground">•</span>
                                    <span className="text-lg font-medium text-muted-foreground">{medicine.type}</span>
                                </div>
                                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                                    {medicine.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-white dark:bg-card rounded-xl border shadow-sm">
                                    <span className="text-sm text-muted-foreground block mb-1">Manufacturer</span>
                                    <span className="font-semibold">{medicine.manufacturer}</span>
                                </div>
                                <div className="p-4 bg-white dark:bg-card rounded-xl border shadow-sm">
                                    <span className="text-sm text-muted-foreground block mb-1">Stock Level</span>
                                    <span className="font-semibold text-green-600">High Availability</span>
                                </div>
                                <div className="p-4 bg-white dark:bg-card rounded-xl border shadow-sm">
                                    <span className="text-sm text-muted-foreground block mb-1">Total Batches</span>
                                    <span className="font-semibold">{medicine.batches}</span>
                                </div>
                                <div className="p-4 bg-white dark:bg-card rounded-xl border shadow-sm">
                                    <span className="text-sm text-muted-foreground block mb-1">Origin</span>
                                    <span className="font-semibold flex items-center gap-1">
                                        <Globe className="h-3 w-3" />
                                        Global
                                    </span>
                                </div>
                            </div>

                            <Tabs defaultValue="batches" className="w-full">
                                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                                    <TabsTrigger
                                        value="batches"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                                    >
                                        Batch History
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="ingredients"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                                    >
                                        Active Ingredients
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="supply"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                                    >
                                        Supply Chain
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="batches" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Recent Production Batches</CardTitle>
                                            <CardDescription>Immutable records of creation and distribution.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Batch ID</TableHead>
                                                        <TableHead>Production Date</TableHead>
                                                        <TableHead>Quantity</TableHead>
                                                        <TableHead>Status</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {recentBatches.map(batch => (
                                                        <TableRow key={batch.id}>
                                                            <TableCell className="font-medium font-mono">
                                                                {batch.id}
                                                            </TableCell>
                                                            <TableCell>{batch.date}</TableCell>
                                                            <TableCell>{batch.quantity} Units</TableCell>
                                                            <TableCell>
                                                                <Badge variant={batch.status === "Distributed" ? "default" : "secondary"}>
                                                                    {batch.status}
                                                                </Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="ingredients" className="mt-6">
                                    <Card>
                                        <CardContent className="pt-6">
                                            <h3 className="font-semibold mb-2">Composition</h3>
                                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                                <li>Active Ingredient: {medicine.name} ({medicine.dosage})</li>
                                                <li>Microcrystalline Cellulose</li>
                                                <li>Magnesium Stearate</li>
                                                <li>Hypromellose</li>
                                                <li>Titanium Dioxide</li>
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="supply" className="mt-6">
                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="relative border-l-2 border-muted pl-6 space-y-6">
                                                <div className="relative">
                                                    <span className="absolute -left-[31px] bg-background border-2 border-primary rounded-full h-4 w-4 top-1" />
                                                    <h4 className="font-semibold">Retail Pharmacy</h4>
                                                    <span className="text-sm text-muted-foreground">Current Location</span>
                                                </div>
                                                <div className="relative">
                                                    <span className="absolute -left-[31px] bg-background border-2 border-muted rounded-full h-4 w-4 top-1" />
                                                    <h4 className="font-semibold">Regional Distributor</h4>
                                                    <span className="text-sm text-muted-foreground text-opacity-50">Transit Point • 2 days ago</span>
                                                </div>
                                                <div className="relative">
                                                    <span className="absolute -left-[31px] bg-background border-2 border-muted rounded-full h-4 w-4 top-1" />
                                                    <h4 className="font-semibold">Manufacturing Plant</h4>
                                                    <span className="text-sm text-muted-foreground text-opacity-50">Created • 5 days ago</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                </main>
            </div>
            <Footer />
        </div>
    )
}
