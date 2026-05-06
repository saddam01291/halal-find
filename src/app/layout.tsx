import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalNavbar } from "@/components/layout/ConditionalNavbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { AuthProvider } from "@/context/AuthContext";
import { LocationProvider } from "@/context/LocationContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://findhalalonly.com'),
  title: "Find Halal Restaurants Near You — Verified by the Community",
  description: "Find halal-certified restaurants, hotels and food near you. Verified by owners and confirmed by the community. 5,000+ trusted halal listings across India and beyond.",
  keywords: [
    "halal hotel near me",
    "halal place near me",
    "halal food near me",
    "halal restaurant near me",
    "find halal food",
    "halal biryani",
    "certified halal restaurants",
    "muslim friendly hotel"
  ],
  openGraph: {
    title: "Find Halal - Discover Halal Hotels, Places, Food & Restaurants Near You",
    description: "Discover the best Halal hotels, places, food, and restaurants near you. Instant lookup of location, reviews, and Halal status.",
    type: "website",
    siteName: "Find Halal",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Halal - Discover Halal Hotels, Places, Food & Restaurants Near You",
    description: "Discover the best Halal hotels, places, food, and restaurants near you.",
  },
  alternates: {
    canonical: '/',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link 
            rel="stylesheet" 
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
            integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
            crossOrigin="" 
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <LocationProvider>
            <ConditionalNavbar />
            <main className="min-h-screen">{children}</main>
            <ConditionalFooter />
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
