import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalNavbar } from "@/components/layout/ConditionalNavbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { AuthProvider } from "@/context/AuthContext";

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
      <body className={inter.className}>
        <AuthProvider>
          <ConditionalNavbar />
          <main className="min-h-screen">{children}</main>
          <ConditionalFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
