// src/components/Layout.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientsideLayout ({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Add all auth routes that should exclude Navbar/Footer
  const isAuthRoute = ["/signin", "/signup"].includes(pathname || "");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      {!isAuthRoute && <Navbar />}
      
      {/* Main content grows to fill the available space */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      {!isAuthRoute && <Footer />}
    </div>
  );
}