import type { Metadata } from "next";
import "./globals.css";
import { Poppins, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

// Self-hosted via next/font — zero render-blocking, optimised subset
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Pathfinder College — Samonda, Ibadan | Raising Future Leaders",
    template: "%s | Pathfinder College Ibadan",
  },
  description:
    "Pathfinder College is a premier secondary school in Samonda, Ibadan, Nigeria, offering world-class education grounded in faith, excellence, and discipline. Admissions now open for 2025/2026.",
  keywords: [
    "Pathfinder College",
    "secondary school Ibadan",
    "best school Samonda",
    "school admissions Ibadan",
    "WAEC school Nigeria",
    "faith-based school Oyo State",
    "JSS SSS Ibadan",
    "School",
    "JSS 1 SS1",
    "BEST SCHOOL",
  ],
  authors: [{ name: "Pathfinder College" }],
  creator: "Pathfinder College",
  publisher: "Pathfinder College",
  formatDetection: { email: false, address: false, telephone: false },
  metadataBase: new URL("https://pathfindercollege.edu.ng"),
  openGraph: {
    title: "Pathfinder College — Raising Future Leaders",
    description:
      "A premier faith-based secondary school in Samonda, Ibadan. Academic excellence, character formation & holistic development.",
    url: "https://pathfindercollege.edu.ng",
    siteName: "Pathfinder College",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: "/imgi_19_slider-b.jpg",
        width: 1200,
        height: 630,
        alt: "Pathfinder College",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pathfinder College Ibadan",
    description:
      "Raising future leaders through excellence, discipline and Godly values.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favico.png" />
      </head>
      <body className="antialiased">
        <Navbar />
        <PageWrapper>{children}</PageWrapper>
        <Footer />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
