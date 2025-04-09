"use client"
import "@/app/globals.css";

import HeroSection from "@/components/HeroSection";
import HomeProducts from "@/components/HomeProducts";


export default function Home() {
  return (
    <div>
      <HeroSection/>
      <HomeProducts/>
    </div>
  );
}
