import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// import WhatsAppFloat from "@/components/WhatsAppFloat";
import PageWrapper from "@/components/PageWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
    <html lang="en">
      <head>
        <link rel="icon" href="/favico.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script async src="https://js.paystack.co/v1/inline.js" />
      </head>
      <body className="antialiased">
        <Navbar />
        <PageWrapper>{children}</PageWrapper>
        <Footer />
        {/* <WhatsAppFloat /> */}
        <SpeedInsights />
      </body>
    </html>
  );
}
