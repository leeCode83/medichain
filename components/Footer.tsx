export function Footer() {
    return (
        <footer className="border-t bg-muted/40">
            <div className="container mx-auto flex flex-col gap-8 py-12 px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                    <div className="space-y-4 max-w-xs">
                        <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="size-5 text-primary"
                                >
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                                    <path d="m9 12 2 2 4-4" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold tracking-tight">Medichain</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Secure, transparent, and decentralized pharmaceutical supply chain management powered by Blockchain technology.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
                        <div className="space-y-3">
                            <h4 className="font-semibold">Platform</h4>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">How it Works</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-semibold">Company</h4>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-semibold">Legal</h4>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} Medichain Inc. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        {/* Social Icons placeholders */}
                        <div className="size-8 bg-muted rounded-full animate-pulse" />
                        <div className="size-8 bg-muted rounded-full animate-pulse" />
                        <div className="size-8 bg-muted rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
        </footer>
    )
}
