"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Info, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

// Medicine Data
const medicines = [
    {
        id: 1,
        name: "Paracetamol",
        dosage: "500mg",
        type: "Pain Reliever",
        description: "Effective for treating mild to moderate pain and fever.",
        image: "/assets/medicines/paracetamol.png",
        manufacturer: "PharmaCare Inc."
    },
    {
        id: 2,
        name: "Amoxicillin",
        dosage: "250mg",
        type: "Antibiotic",
        description: "Used to treat a variety of bacterial infections.",
        image: "/assets/medicines/amoxicillin.png",
        manufacturer: "BioHealth Ltd."
    },
    {
        id: 3,
        name: "Ibuprofen",
        dosage: "400mg",
        type: "Anti-inflammatory",
        description: "Reduces fever and treats pain or inflammation.",
        image: "/assets/medicines/ibuprofen.png",
        manufacturer: "MediCorp"
    },
    {
        id: 4,
        name: "Omeprazole",
        dosage: "20mg",
        type: "Acid Reflux",
        description: "Treats gastroesophageal reflux disease (GERD).",
        image: "/assets/medicines/omeprazole.png",
        manufacturer: "Gastrolife"
    },
    {
        id: 5,
        name: "Ciprofloxacin",
        dosage: "500mg",
        type: "Antibiotic",
        description: "Broad-spectrum antibiotic for bacterial infections.",
        image: "/assets/medicines/ciprofloxacin.png",
        manufacturer: "Aurobindo Pharma"
    },
    {
        id: 6,
        name: "Metformin",
        dosage: "500mg",
        type: "Antidiabetic",
        description: "First-line medication for the treatment of type 2 diabetes.",
        image: "/assets/medicines/metformin.png",
        manufacturer: "DiabetesCare"
    },
    {
        id: 7,
        name: "Amlodipine",
        dosage: "10mg",
        type: "Hypertension",
        description: "Calcium channel blocker used to treat high blood pressure.",
        image: "/assets/medicines/amlodipine.png",
        manufacturer: "CardioLux"
    },
    {
        id: 8,
        name: "Simvastatin",
        dosage: "20mg",
        type: "Cholesterol",
        description: "Used to control high cholesterol and triglyceride levels.",
        image: "/assets/medicines/simvastatin.png",
        manufacturer: "Aura Pharma"
    }
]

export default function MedicineListPage() {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredMedicines = medicines.filter(med =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.type.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <Navbar />
            <div className="flex flex-col sm:gap-4 sm:py-4">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 container mx-auto">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 my-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Medicine Catalog</h1>
                            <p className="text-muted-foreground mt-1">
                                Browse our list of blockchain-verified pharmaceutical products.
                            </p>
                        </div>
                        <div className="relative w-full md:w-[300px]">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search medicines..."
                                className="pl-8 bg-background"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Medicine Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredMedicines.map((med) => (
                            <Card key={med.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="relative h-48 w-full bg-white p-4 flex items-center justify-center border-b">
                                    <div className="relative h-full w-full">
                                        <Image
                                            src={med.image}
                                            alt={med.name}
                                            fill
                                            className="object-contain" // Use contain to see the whole box
                                        />
                                    </div>
                                    <Badge variant="secondary" className="absolute top-2 right-2 bg-green-50 text-green-700 border-green-200">
                                        <ShieldCheck className="h-3 w-3 mr-1" />
                                        Verified
                                    </Badge>
                                </div>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl">{med.name}</CardTitle>
                                        <span className="font-mono text-sm font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                            {med.dosage}
                                        </span>
                                    </div>
                                    <CardDescription>{med.type}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                                        {med.description}
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Link href={`/medicines/${med.id}`} className="w-full">
                                        <Button className="w-full gap-2 group">
                                            <Info className="h-4 w-4 group-hover:text-white" />
                                            View Details
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredMedicines.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Search className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium">No medicines found</h3>
                            <p className="text-muted-foreground mt-2 max-w-sm">
                                We couldn't find any medicines matching "{searchTerm}". Please try a different search term.
                            </p>
                        </div>
                    )}

                </main>
            </div>
            <Footer />
        </div>
    )
}
