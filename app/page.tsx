"use client";

import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import DiscoverySection from "@/components/DiscoverySection";
import FeaturedSection from "@/components/FeaturedSection";
import WorldsSection from "@/components/WorldsSection";
import CollectionsSection from "@/components/CollectionsSection";
import AudioPlayer from "@/components/AudioPlayer";
import LayerSystem from "@/components/LayerSystem";
import Footer from "@/components/Footer";
import MobileDock from "@/components/MobileDock";
import type { Experience } from "@/lib/mock-data";

export default function Home() {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  return (
    <>
      <Header />

      <main id="top" className="pb-24 md:pb-20">
        <HeroSection />

        {/* Divider glow */}
        <div className="h-px bg-gradient-to-l from-transparent via-[oklch(0.79_0.115_88/25%)] to-transparent" />

        <DiscoverySection />

        <div className="h-px bg-gradient-to-l from-transparent via-[oklch(0.79_0.115_88/15%)] to-transparent" />

        <FeaturedSection onOpenExperience={setSelectedExperience} />

        <div className="h-px bg-gradient-to-l from-transparent via-[oklch(0.79_0.115_88/15%)] to-transparent" />

        <WorldsSection />

        <div className="h-px bg-gradient-to-l from-transparent via-[oklch(0.79_0.115_88/15%)] to-transparent" />

        <CollectionsSection />

        <Footer />
      </main>

      <AudioPlayer />
      <MobileDock />

      {/* Layer System (modal overlay) */}
      <LayerSystem
        experience={selectedExperience}
        onClose={() => setSelectedExperience(null)}
      />
    </>
  );
}
