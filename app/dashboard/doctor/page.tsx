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
    Users,
    Loader2
} from "lucide-react"
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts"
import { toast } from "sonner"

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
import { useGetAllMedicines } from "@/hooks/useFactory"
import { useDispenseMedicine, useUploadDiagnosis, useDoctorPrescriptions, type DiagnosisData } from "@/hooks/useDoctor"

// Dummy Data for charts
const activityData = [
    { day: "Mon", patients: 12 },
    { day: "Tue", patients: 18 },
    { day: "Wed", patients: 15 },
    { day: "Thu", patients: 22 },
    { day: "Fri", patients: 20 },
    { day: "Sat", patients: 8 },
    { day: "Sun", patients: 5 },
]

export default function DoctorDashboard() {
    // Hooks
    const { medicines, isLoading: isLoadingMedicines } = useGetAllMedicines()
    const { dispenseMedicine, isPending: isDispensing } = useDispenseMedicine()
    const { uploadDiagnosis, isUploading } = useUploadDiagnosis()
    const { history, isLoadingHistory } = useDoctorPrescriptions()

    // Form State
    const [patientAddress, setPatientAddress] = useState("")
    const [patientName, setPatientName] = useState("")
    const [gender, setGender] = useState("")
    const [age, setAge] = useState("")
    const [diagnosis, setDiagnosis] = useState("")
    const [selectedMedicineId, setSelectedMedicineId] = useState("")
    const [quantity, setQuantity] = useState("1")

    const handleDispense = async () => {
        if (!patientAddress || !patientName || !diagnosis || !selectedMedicineId || !age || !gender) {
            toast.error("Please fill in all required fields")
            return
        }

        const selectedMed = medicines.find((m, idx) => idx.toString() === selectedMedicineId)
        if (!selectedMed) {
            toast.error("Invalid medicine selected")
            return
        }

        try {
            // 1. Prepare Metadata matching metadata.json structure
            const diagnosisData: DiagnosisData = {
                patientName,
                gender,
                age: parseInt(age),
                patientAddress,
                diagnosis,
                medicine: {
                    [selectedMed.name]: parseInt(quantity) // Using dynamic key for medicine name
                }
            }

            // 2. Upload to IPFS
            toast.info("Uploading diagnosis to IPFS...", { duration: 2000 })
            const ipfsUrl = await uploadDiagnosis(diagnosisData)

            if (!ipfsUrl) {
                // Error handling is done inside the hook (toast)
                return
            }

            // 3. Call Smart Contract
            toast.info("Confirming transaction...", { duration: 2000 })
            await dispenseMedicine(parseInt(selectedMedicineId), patientAddress, ipfsUrl)

            // Reset form on success (Optional: controlled by isSuccess in hook, but manual reset here is fine)
            setPatientAddress("")
            setPatientName("")
            setGender("")
            setAge("")
            setDiagnosis("")
            setSelectedMedicineId("")
            setQuantity("1")

        } catch (error) {
            console.error("Dispense flow error:", error)
            toast.error("Failed to process prescription")
        }
    }

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

                    {/* KPI Cards (Static for now) */}
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
                                            {/* Patient Info Section */}
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="patient-address">Patient Wallet Address</Label>
                                                    <Input
                                                        id="patient-address"
                                                        placeholder="0x..."
                                                        value={patientAddress}
                                                        onChange={(e) => setPatientAddress(e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="patient-name">Patient Name</Label>
                                                    <Input
                                                        id="patient-name"
                                                        placeholder="John Doe"
                                                        value={patientName}
                                                        onChange={(e) => setPatientName(e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="gender">Gender</Label>
                                                    <Select value={gender} onValueChange={setGender}>
                                                        <SelectTrigger id="gender">
                                                            <SelectValue placeholder="Select Gender" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Male">Male</SelectItem>
                                                            <SelectItem value="Female">Female</SelectItem>
                                                            <SelectItem value="Other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="age">Age</Label>
                                                    <Input
                                                        id="age"
                                                        type="number"
                                                        placeholder="30"
                                                        value={age}
                                                        onChange={(e) => setAge(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Medicine Selection */}
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label>Select Medicine</Label>
                                                    <Select value={selectedMedicineId} onValueChange={setSelectedMedicineId}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select medicine to dispense" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {medicines.map((med, idx) => (
                                                                <SelectItem key={idx} value={idx.toString()}>
                                                                    <div className="flex justify-between w-full items-center gap-2">
                                                                        <span>{med.name} ({med.activeIngredient})</span>
                                                                        <Badge variant="outline" className="ml-2 text-xs">
                                                                            MINTED: {med.totalBatchesMinted.toString()}
                                                                        </Badge>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="quantity">Quantity (Metadata Only)</Label>
                                                    <Input
                                                        id="quantity"
                                                        type="number"
                                                        placeholder="1"
                                                        value={quantity}
                                                        onChange={(e) => setQuantity(e.target.value)}
                                                    />
                                                    <p className="text-[10px] text-muted-foreground">
                                                        Note: Smart contract currently sends 1 unit token per transaction.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="diagnosis">Diagnosis & Notes</Label>
                                                <Textarea
                                                    id="diagnosis"
                                                    placeholder="Enter detailed diagnosis here. This will be encrypted and stored on IPFS."
                                                    className="min-h-[120px]"
                                                    value={diagnosis}
                                                    onChange={(e) => setDiagnosis(e.target.value)}
                                                />
                                            </div>

                                            <div className="flex items-center gap-2 p-3 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                                                <Stethoscope className="h-4 w-4" />
                                                <span>This action issues a new prescription and transfers ownership of the Medicine NFT.</span>
                                            </div>

                                            <Button
                                                className="w-full md:w-auto"
                                                onClick={handleDispense}
                                                disabled={isDispensing || isUploading || isLoadingMedicines}
                                            >
                                                {(isDispensing || isUploading) ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Pill className="mr-2 h-4 w-4" />
                                                )}
                                                {isUploading ? "Uploading Metadata..." : isDispensing ? "Dispensing..." : "Dispense Medicine"}
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
                                                        <TableHead>Tx Hash</TableHead>
                                                        <TableHead>Patient</TableHead>
                                                        <TableHead>Medicine</TableHead>
                                                        <TableHead className="hidden md:table-cell">Date</TableHead>
                                                        <TableHead className="text-right">Action</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {isLoadingHistory ? (
                                                        <TableRow>
                                                            <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <Loader2 className="h-4 w-4 animate-spin" /> Loading history...
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : history.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                                                No prescriptions found.
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        history.map((rx, idx) => (
                                                            <TableRow key={idx}>
                                                                <TableCell className="font-mono text-xs">{rx.transactionHash.substring(0, 10)}...</TableCell>
                                                                <TableCell>
                                                                    <div className="flex flex-col">
                                                                        <span className="font-medium text-xs">{rx.patient.substring(0, 6)}...{rx.patient.substring(rx.patient.length - 4)}</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {medicines[rx.medicineId]?.name || `Unknown ID: ${rx.medicineId}`}
                                                                </TableCell>
                                                                <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                                                                    {new Date(rx.timestamp * 1000).toLocaleString()}
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <Button size="sm" variant="ghost" asChild>
                                                                        <a href={`https://sepolia-blockscout.lisk.com/tx/${rx.transactionHash}`} target="_blank" rel="noopener noreferrer">View</a>
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
