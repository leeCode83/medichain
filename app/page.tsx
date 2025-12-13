import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-background">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/assets/images/hero-bg.png"
              alt="Medichain Background"
              fill
              className="object-cover opacity-60 dark:opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>

          <div className="container mx-auto relative z-10 px-4 md:px-6 flex flex-col items-center text-center space-y-6">
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-5 duration-1000 ease-out">
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:to-blue-400 drop-shadow-sm">
                Secure Medicine Supply Chain
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Powered by Blockchain. Transparent, Immutable, and Trustworthy.
                Ensure the authenticity of every pill from factory to patient.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200 ease-out fill-mode-backwards">
              <Button size="lg" className="h-12 px-8 text-lg hover:scale-105 transition-transform">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg hover:bg-secondary/80 hover:scale-105 transition-transform">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Platform Features</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">
                Our features verify authenticity and ensure safety at every step of the supply chain.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Immutable Records", description: "Every transaction is recorded on the blockchain, ensuring that data cannot be altered or deleted." },
                { title: "Real-time Tracking", description: "Track the journey of standard batches and individual units from the factory to the pharmacy." },
                { title: "Anti-Counterfeit", description: "Unique NFT-based identification for medicine packs prevents fake drugs from entering the market." },
              ].map((feature, idx) => (
                <Card key={idx} className="bg-card/50 backdrop-blur border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* WORKFLOW SECTION */}
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
                <p className="text-muted-foreground md:text-lg">
                  Medichain assigns a unique digital identity (NFT) to every medicine batch produced. This identity follows the product through every handover securely.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-4 p-4 rounded-lg bg-secondary/20 border">
                    <div className="size-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">1</div>
                    <div>
                      <h4 className="font-semibold">Factory Production</h4>
                      <p className="text-sm text-muted-foreground">Factory mints NFTs representing new medicine batches.</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-4 p-4 rounded-lg bg-secondary/20 border">
                    <div className="size-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">2</div>
                    <div>
                      <h4 className="font-semibold">Doctor Prescription</h4>
                      <p className="text-sm text-muted-foreground">Doctor dispenses medicine and records the prescription on-chain.</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-4 p-4 rounded-lg bg-secondary/20 border">
                    <div className="size-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">3</div>
                    <div>
                      <h4 className="font-semibold">Patient Verification</h4>
                      <p className="text-sm text-muted-foreground">Patient verifies the authenticity and ownership of their medicine.</p>
                    </div>
                  </li>
                </ul>
              </div>
              {/* Visual Representation Placeholder */}
              <div className="relative h-[400px] bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl border flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <div className="inline-block p-4 rounded-full bg-background border shadow-lg animate-bounce">
                    📦
                  </div>
                  <div className="w-1 h-16 bg-border mx-auto" />
                  <div className="inline-block p-4 rounded-full bg-background border shadow-lg animate-pulse">
                    🏥
                  </div>
                  <div className="w-1 h-16 bg-border mx-auto" />
                  <div className="inline-block p-4 rounded-full bg-background border shadow-lg">
                    👤
                  </div>
                </div>
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-20 bg-muted/30">
          <div className="container max-w-3xl px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">Frequently Asked Questions</h2>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-4 bg-card shadow-sm">
                <AccordionTrigger className="hover:no-underline">What is Medichain?</AccordionTrigger>
                <AccordionContent>
                  Medichain is a decentralized application (DApp) that uses blockchain technology to track and verify pharmaceutical products, ensuring they are authentic and safe.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border rounded-lg px-4 bg-card shadow-sm">
                <AccordionTrigger className="hover:no-underline">How does it prevent counterfeit drugs?</AccordionTrigger>
                <AccordionContent>
                  By assigning a unique Digital Token (NFT) to each medicine unit at the point of manufacture, we create an unbreakable chain of custody that can be verified by anyone.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border rounded-lg px-4 bg-card shadow-sm">
                <AccordionTrigger className="hover:no-underline">Who can use the platform?</AccordionTrigger>
                <AccordionContent>
                  The platform is designed for Pharmaceutical Factories, Doctors, Pharmacists, and Patients. Each role has specific permissions managed by smart contracts.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border rounded-lg px-4 bg-card shadow-sm">
                <AccordionTrigger className="hover:no-underline">Is patient data secure?</AccordionTrigger>
                <AccordionContent>
                  Yes. While supply chain transactions are transparent, sensitive patient data is encrypted and access is strictly controlled through smart contract permissions, ensuring privacy regulatory compliance.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="border rounded-lg px-4 bg-card shadow-sm">
                <AccordionTrigger className="hover:no-underline">How do I get started?</AccordionTrigger>
                <AccordionContent>
                  If you are a healthcare provider or manufacturer, click "Get Started" to request access. Patients can verify medicines securely without an account by using the verification tool.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
