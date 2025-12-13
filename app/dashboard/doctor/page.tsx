"use client"

import { useState } from "react"
import {
    Activity,
    CalendarDays,
    Check,
    Clock,
    FileText,
    History,
    Pill,
    Search,
    Stethoscope,
    User,
    Users
} from "lucide-react"
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
const activityData = [
    { day: "Mon", patients: 12 },
    { day: "Tue", patients: 18 },
    { day: "Wed", patients: 15 },
    { day: "Thu", patients: 22 },
    { day: "Fri", patients: 20 },
    { day: "Sat", patients: 8 },
    { day: "Sun", patients: 5 },
]

const recentPrescriptions = [
    {
        id: "RX-2023-089",
        patient: "0x1234...5678",
        patientName: "Alice Smith",
        medicine: "Paracetamol 500mg",
        date: "2023-12-12 14:30",
        status: "Completed",
        hash: "0xabc...def"
    },
    {
        id: "RX-2023-088",
        patient: "0x8765...4321",
        patientName: "Bob Jones",
        medicine: "Amoxicillin 250mg",
        date: "2023-12-12 11:15",
        status: "Completed",
        hash: "0x123...456"
    },
    {
        id: "RX-2023-087",
        patient: "0x9876...5432",
        patientName: "Charlie Brown",
        medicine: "Ibuprofen 400mg",
        date: "2023-12-11 16:45",
        status: "Completed",
        hash: "0x456...789"
    },
]

const medicinesList = [
    { id: "1", name: "Paracetamol 500mg", stock: 1250 },
    { id: "2", name: "Amoxicillin 250mg", stock: 850 },
    { id: "3", name: "Ibuprofen 400mg", stock: 620 },
    { id: "4", name: "Omeprazole 20mg", stock: 340 },
    { id: "5", name: "Cetirizine 10mg", stock: 180 },
]

export default function DoctorDashboard() {
    const [selectedMedicine, setSelectedMedicine] = useState("")

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <Navbar />
            <div className="flex flex-col sm:gap-4 sm:py-4">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 container mx-auto">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
                        <div className="flex items-center gap-2">
                            <Button size="sm" className="h-8 gap-1" variant="outline">
                                <CalendarDays className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Schedule
                                </span>
                            </Button>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Prescriptions</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">1,234</div>
                                <p className="text-xs text-muted-foreground">+12% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Patients Treated</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">543</div>
                                <p className="text-xs text-muted-foreground">Unique wallet addresses</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">7</div>
                                <p className="text-xs text-muted-foreground">Requires attention</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg. Wait Time</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">12m</div>
                                <p className="text-xs text-muted-foreground">Per consultation</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:gap-8 lg:grid-cols-3">

                        {/* Main Content Area - Left 2/3 */}
                        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">

                            <Tabs defaultValue="dispense" className="w-full">
                                <div className="flex items-center">
                                    <TabsList>
                                        <TabsTrigger value="dispense">Dispense Medicine</TabsTrigger>
                                        <TabsTrigger value="history">Prescription History</TabsTrigger>
                                        <TabsTrigger value="patients">My Patients</TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="dispense" className="mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Dispense Medicine & Create Prescription</CardTitle>
                                            <CardDescription>
                                                Diagnose patient, prescribe medicine, and record transaction on the blockchain.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="patient-address">Patient Wallet Address</Label>
                                                    <Input id="patient-address" placeholder="0x..." />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="patient-name">Patient Name (Optional)</Label>
                                                    <Input id="patient-name" placeholder="John Doe" />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Select Medicine</Label>
                                                <Select value={selectedMedicine} onValueChange={setSelectedMedicine}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select medicine to dispense" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {medicinesList.map((med) => (
                                                            <SelectItem key={med.id} value={med.id}>
                                                                <div className="flex justify-between w-full items-center gap-2">
                                                                    <span>{med.name}</span>
                                                                    <Badge variant="secondary" className="ml-2 text-xs">Stock: {med.stock}</Badge>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="diagnosis">Diagnosis & Notes</Label>
                                                <Textarea
                                                    id="diagnosis"
                                                    placeholder="Enter detailed diagnosis here. This will be hashed and stored on IPFS."
                                                    className="min-h-[120px]"
                                                />
                                            </div>

                                            <div className="flex items-center gap-2 p-3 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                                                <Stethoscope className="h-4 w-4" />
                                                <span>This action effectively transfers ownership of the Medicine NFT from the contract to the patient.</span>
                                            </div>

                                            <Button className="w-full md:w-auto">
                                                <Pill className="mr-2 h-4 w-4" />
                                                Dispense Medicine
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="history" className="mt-4">
                                    <Card x-chunk="dashboard-05-chunk-3">
                                        <CardHeader className="px-7">
                                            <CardTitle>Recent Prescriptions</CardTitle>
                                            <CardDescription>History of dispensed medicines and diagnoses.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>ID</TableHead>
                                                        <TableHead>Patient</TableHead>
                                                        <TableHead>Medicine</TableHead>
                                                        <TableHead className="hidden md:table-cell">Date</TableHead>
                                                        <TableHead className="text-right">Action</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {recentPrescriptions.map((rx) => (
                                                        <TableRow key={rx.id}>
                                                            <TableCell className="font-medium">{rx.id}</TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">{rx.patientName}</span>
                                                                    <span className="text-xs text-muted-foreground hidden sm:inline">{rx.patient}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{rx.medicine}</TableCell>
                                                            <TableCell className="hidden md:table-cell">{rx.date}</TableCell>
                                                            <TableCell className="text-right">
                                                                <Button size="sm" variant="ghost">View</Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="patients" className="mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>My Patients</CardTitle>
                                            <CardDescription>List of patients you have treated.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center justify-center p-8 text-muted-foreground">
                                                Patient list feature coming soon...
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                            </Tabs>
                        </div>

                        {/* Sidebar / Right Column - 1/3 */}
                        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">

                            {/* Activity Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Weekly Activity</CardTitle>
                                    <CardDescription>Number of patients treated per day</CardDescription>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <div className="h-[250px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={activityData}>
                                                <XAxis
                                                    dataKey="day"
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
                                                />
                                                <RechartsTooltip
                                                    cursor={{ fill: 'transparent' }}
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                />
                                                <Bar
                                                    dataKey="patients"
                                                    fill="currentColor"
                                                    radius={[4, 4, 0, 0]}
                                                    className="fill-primary"
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Profile Card */}
                            <Card>
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <Avatar className="h-14 w-14">
                                        <AvatarImage src="/avatars/01.png" alt="Avatar" />
                                        <AvatarFallback>DR</AvatarFallback>
                                    </Avatar>
                                    <div className="grid gap-1">
                                        <CardTitle>Dr. Sarah Wilson</CardTitle>
                                        <CardDescription>Cardiologist</CardDescription>
                                        <Badge variant="outline" className="w-fit bg-green-50 text-green-700 border-green-200">Active License</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-2 text-sm">
                                        <div className="flex justify-between py-1 border-b">
                                            <span className="text-muted-foreground">ID</span>
                                            <span className="font-medium">DOC-8839</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b">
                                            <span className="text-muted-foreground">Hospital</span>
                                            <span className="font-medium">Central General</span>
                                        </div>
                                        <div className="flex justify-between py-1 pt-2">
                                            <span className="text-muted-foreground">Total Dispensed</span>
                                            <span className="font-medium">892 Units</span>
                                        </div>
                                    </div>
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
