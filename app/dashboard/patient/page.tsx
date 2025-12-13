"use client"

import { useState } from "react"
import {
    Activity,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    Pill,
    QrCode,
    Search,
    ShieldCheck,
    User
} from "lucide-react"
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

// Dummy Data
const healthData = [
    { month: "Jan", visits: 1 },
    { month: "Feb", visits: 0 },
    { month: "Mar", visits: 2 },
    { month: "Apr", visits: 1 },
    { month: "May", visits: 0 },
    { month: "Jun", visits: 1 },
]

const myMedicines = [
    {
        id: "NFT-1024",
        name: "Paracetamol 500mg",
        batch: "BATCH-2023-001",
        expiry: "12/2026",
        image: "💊", // Placeholder for actual image
        verified: true,
        acquired: "2023-12-12"
    },
    {
        id: "NFT-1025",
        name: "Amoxicillin 250mg",
        batch: "BATCH-2023-002",
        expiry: "06/2025",
        image: "🍶",
        verified: true,
        acquired: "2023-11-20"
    },
    {
        id: "NFT-1099",
        name: "Vitamin C 1000mg",
        batch: "BATCH-2023-005",
        expiry: "01/2027",
        image: "🍊",
        verified: true,
        acquired: "2023-10-05"
    },
]

const prescriptionHistory = [
    {
        id: "RX-2023-089",
        doctor: "Dr. Sarah Wilson",
        hospital: "Central General",
        diagnosis: "Common Cold",
        medicine: "Paracetamol 500mg",
        date: "2023-12-12",
        status: "Dispensed"
    },
    {
        id: "RX-2023-055",
        doctor: "Dr. James House",
        hospital: "Princeton Plainsboro",
        diagnosis: "Bacterial Infection",
        medicine: "Amoxicillin 250mg",
        date: "2023-11-20",
        status: "Dispensed"
    },
]

export default function PatientDashboard() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <Navbar />
            <div className="flex flex-col sm:gap-4 sm:py-4">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 container mx-auto">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 px-3 py-1 bg-background rounded-full border shadow-sm">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm font-medium">Wallet Connected</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">My Medicines (NFTs)</CardTitle>
                                <Pill className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{myMedicines.length}</div>
                                <p className="text-xs text-muted-foreground">Digital assets in wallet</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{prescriptionHistory.length}</div>
                                <p className="text-xs text-muted-foreground">Total medical records</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Last Visit</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">12 Dec</div>
                                <p className="text-xs text-muted-foreground">Dr. Sarah Wilson</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Health Score</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">98%</div>
                                <p className="text-xs text-muted-foreground">Based on activity</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:gap-8 lg:grid-cols-3">

                        {/* Main Content Area - Left 2/3 */}
                        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">

                            <Tabs defaultValue="medicines" className="w-full">
                                <div className="flex items-center">
                                    <TabsList>
                                        <TabsTrigger value="medicines">My Medicines</TabsTrigger>
                                        <TabsTrigger value="history">Prescription History</TabsTrigger>
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

                                <TabsContent value="medicines" className="mt-4">
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {myMedicines.map((med) => (
                                            <Card key={med.id} className="overflow-hidden border-2 hover:border-primary/50 transition-colors">
                                                <div className="h-24 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-4xl">
                                                    {med.image}
                                                </div>
                                                <CardHeader className="pb-2">
                                                    <div className="flex justify-between items-start">
                                                        <CardTitle className="text-lg">{med.name}</CardTitle>
                                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                                                            <ShieldCheck className="h-3 w-3" />
                                                            Verified
                                                        </Badge>
                                                    </div>
                                                    <CardDescription className="font-mono text-xs">{med.id}</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div className="flex flex-col">
                                                            <span className="text-muted-foreground text-xs">Batch No.</span>
                                                            <span className="font-medium">{med.batch}</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-muted-foreground text-xs">Expiry</span>
                                                            <span className="font-medium">{med.expiry}</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="bg-muted/50 p-3">
                                                    <Button variant="ghost" size="sm" className="w-full text-xs gap-2">
                                                        <QrCode className="h-3.5 w-3.5" />
                                                        View Blockchain Proof
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        ))}

                                        {/* Empty State / Add New Placeholder */}
                                        <Card className="flex flex-col items-center justify-center h-[280px] border-dashed bg-muted/20">
                                            <div className="text-muted-foreground text-center p-6">
                                                <Pill className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                                <h3 className="font-medium">No more medicines</h3>
                                                <p className="text-sm mt-1">Dispense records will appear here automatically.</p>
                                            </div>
                                        </Card>
                                    </div>
                                </TabsContent>

                                <TabsContent value="history" className="mt-4">
                                    <Card x-chunk="dashboard-05-chunk-3">
                                        <CardHeader className="px-7">
                                            <CardTitle>Medical History</CardTitle>
                                            <CardDescription>Your complete record of doctor visits, diagnoses, and prescriptions.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Date</TableHead>
                                                        <TableHead>Doctor / Hospital</TableHead>
                                                        <TableHead>Diagnosis</TableHead>
                                                        <TableHead>Prescription</TableHead>
                                                        <TableHead className="text-right">Status</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {prescriptionHistory.map((rx) => (
                                                        <TableRow key={rx.id}>
                                                            <TableCell className="font-medium">{rx.date}</TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium truncate">{rx.doctor}</span>
                                                                    <span className="text-xs text-muted-foreground">{rx.hospital}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{rx.diagnosis}</TableCell>
                                                            <TableCell>
                                                                <Badge variant="secondary">{rx.medicine}</Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex items-center justify-end gap-2 text-green-600">
                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                    <span className="text-sm font-medium">{rx.status}</span>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                            </Tabs>
                        </div>

                        {/* Sidebar / Right Column - 1/3 */}
                        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">

                            {/* Profile Card */}
                            <Card>
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <Avatar className="h-14 w-14">
                                        <AvatarImage src="/avatars/02.png" alt="Avatar" />
                                        <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>
                                    <div className="grid gap-1">
                                        <CardTitle>John Doe</CardTitle>
                                        <CardDescription>Hash: 0x71...9A23</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-2 text-sm bg-muted/50 p-3 rounded-lg">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Blood Type</span>
                                            <span className="font-medium">O+</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Height</span>
                                            <span className="font-medium">178 cm</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Weight</span>
                                            <span className="font-medium">75 kg</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Health Timeline Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Health Activity</CardTitle>
                                    <CardDescription>Doctor visits over the last 6 months</CardDescription>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <div className="h-[200px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={healthData}>
                                                <XAxis
                                                    dataKey="month"
                                                    stroke="#888888"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <YAxis
                                                    stroke="#888888"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickFormatter={(value: any) => `${value}`}
                                                    allowDecimals={false}
                                                />
                                                <RechartsTooltip
                                                    cursor={{ stroke: 'var(--primary)', strokeWidth: 1 }}
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="visits"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    dot={{ r: 4 }}
                                                    className="stroke-primary"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-primary/5 border-primary/20">
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium text-primary">Did you know?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-muted-foreground">
                                        Your medical history is stored permanently on the blockchain. You can share your "Medical ID" with any doctor instantly without paperwork.
                                    </p>
                                </CardContent>
                            </Card>

                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    )
}
