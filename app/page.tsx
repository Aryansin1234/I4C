"use client";

import { useState } from "react";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import LoadingScreen from "@/components/sections/LoadingScreen";
import AIOrb from "@/components/ui-custom/AIOrb";
import CustomCursor from "@/components/ui-custom/CustomCursor";
import Navigation from "@/components/sections/Navigation";
import HeroSection from "@/components/sections/HeroSection";
import OverviewSection from "@/components/sections/OverviewSection";
import TimelineSection from "@/components/sections/TimelineSection";
import ProblemsSection from "@/components/sections/ProblemsSection";
import PartnersSection from "@/components/sections/PartnersSection";
import PrizesSection from "@/components/sections/PrizesSection";
import CriteriaSection from "@/components/sections/CriteriaSection";
import LearningsSection from "@/components/sections/LearningsSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/sections/Footer";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  const handleLoaded = () => {
    setLoaded(true);
    // Signal ScrollTrigger to refresh after the DOM becomes visible
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("app-loaded"));
    }, 50);
  };

  return (
    <>
      {/* Loading screen — always mounted until complete, then hidden */}
      <div style={{ display: loaded ? "none" : "block" }}>
        <LoadingScreen onComplete={handleLoaded} />
      </div>

      {/* Main app — always in DOM, stable tree, never conditionally mounted */}
      <div style={{ display: loaded ? "block" : "none" }}>
        <SmoothScrollProvider>
          <CustomCursor />
          <AIOrb />
          <Navigation />
          <main>
            <HeroSection />
            <OverviewSection />
            <TimelineSection />
            <ProblemsSection />
            <PartnersSection />
            <PrizesSection />
            <CriteriaSection />
            <LearningsSection />
            <CTASection />
          </main>
          <Footer />
        </SmoothScrollProvider>
      </div>
    </>
  );
}
