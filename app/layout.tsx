import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Clipboard - Liquid Design Tech Aesthetic",
  description:
    "A beautiful clipboard application with Apple's liquid design language and tech sky blue aesthetics. Features tag categorization, rich text support, and seamless user experience.",
  keywords: "clipboard, copy paste, liquid design, tech aesthetic, productivity tool",
  authors: [{ name: "Clipboard App" }],
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
