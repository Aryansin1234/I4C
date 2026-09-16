"use client";

import { useState, useEffect } from "react";
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

  return (
    <>
      {/* Loading screen — unmounts itself after onComplete */}
      {!loaded && (
        <LoadingScreen onComplete={() => setLoaded(true)} />
      )}

      {/* Main app — always in the DOM once loaded, stable tree */}
      {loaded && (
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
      )}
    </>
  );
}
