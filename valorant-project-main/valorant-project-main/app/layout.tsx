import type React from "react"
import type { Metadata } from "next"
import { Rajdhani, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { AuthProvider } from "@/lib/AuthContext"
import { OnboardingGuard } from "@/components/OnboardingGuard"

const rajdhani = Rajdhani({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "FIFTH.gg - Never queue as four again",
  description: "Find your perfect fifth for Valorant competitive matches",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${rajdhani.variable} ${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <OnboardingGuard>
            <Navigation />
            {children}
            <footer className="border-t border-border/30 py-8 mt-16">
              <div className="container mx-auto px-4">
                <p className="text-sm text-muted-foreground text-center mb-3">FIFTH.gg is not affiliated with Riot Games</p>
                <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                  <a href="#" className="hover:text-valorant-red transition-colors">
                    Privacy
                  </a>
                  <span>|</span>
                  <a href="#" className="hover:text-valorant-red transition-colors">
                    Terms
                  </a>
                  <span>|</span>
                  <a href="#" className="hover:text-valorant-red transition-colors">
                    Contact
                  </a>
                </div>
              </div>
            </footer>
          </OnboardingGuard>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
