import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalNavbar } from "@/components/layout/ConditionalNavbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { AuthProvider } from "@/context/AuthContext";
import { LocationProvider } from "@/context/LocationContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Find Halal | Halal Restaurants Near Me | Verified Halal Food",
  description: "Find trusted Halal restaurants and food near you instantly. Verified by owners and community reviews. The most accurate Halal food guide.",
  keywords: [
    "halal restaurants near me",
    "halal food near me",
    "find halal food",
    "halal biryani kolkata",
    "certified halal restaurants",
    "muslim friendly food"
  ],
  openGraph: {
    title: "Find Halal - Discover Halal Food Near You",
    description: "Discover the best Halal restaurants and food near you. Instant lookup of location, reviews, and Halal status.",
    type: "website",
  },
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
