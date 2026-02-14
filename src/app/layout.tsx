import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalNavbar } from "@/components/layout/ConditionalNavbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Find Halal - Discover Halal Food Near You",
  description: "Discover the best Halal restaurants and food near you. Verified by owners, trusted by community.",
  keywords: ["halal", "food", "restaurant", "halal food", "halal restaurant", "muslim food"],
  openGraph: {
    title: "Find Halal - Discover Halal Food Near You",
    description: "Discover the best Halal restaurants and food near you.",
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
