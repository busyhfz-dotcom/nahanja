"use client";

import { useCallback, useEffect, useState } from "react";
import AudioPlayer from "@/components/AudioPlayer";
import CollectionsSection from "@/components/CollectionsSection";
import DiscoverySection from "@/components/DiscoverySection";
import EntranceGate from "@/components/EntranceGate";
import FeaturedSection from "@/components/FeaturedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LayerSystem from "@/components/LayerSystem";
import MobileDock from "@/components/MobileDock";
import WorldsSection from "@/components/WorldsSection";
import { findContent, type MoodId } from "@/lib/mock-data";
import { parseLayerSearch, type LayerSelection } from "@/lib/layers";

function updateLayerUrl(selection: LayerSelection | null, mode: "push" | "replace") {
  const url = new URL(window.location.href);
  if (selection) {
    url.searchParams.set("layer", selection.kind);
    url.searchParams.set("slug", selection.slug);
  } else {
    url.searchParams.delete("layer");
    url.searchParams.delete("slug");
  }
  const destination = `${url.pathname}${url.search}${url.hash}`;
  window.history[mode === "push" ? "pushState" : "replaceState"]({ nahanjaLayer: selection }, "", destination);
}

export default function HomeExperience() {
  const [entered, setEntered] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodId>("calm");
  const [selection, setSelection] = useState<LayerSelection | null>(null);

  useEffect(() => {
    const syncLayer = () => {
      const params = new URLSearchParams(window.location.search);
      const directLayer = parseLayerSearch(window.location.search);
      const query = params.get("q");
      const searchResult = query ? findContent(query)[0] : null;
      setSelection(directLayer ?? (searchResult ? { kind: "experience", slug: searchResult.slug } : null));
    };
    syncLayer();
    window.addEventListener("popstate", syncLayer);
    return () => window.removeEventListener("popstate", syncLayer);
  }, []);

  const openLayer = useCallback((next: LayerSelection) => {
    setSelection(next);
    updateLayerUrl(next, "push");
  }, []);

  const closeLayer = useCallback(() => {
    setSelection(null);
    updateLayerUrl(null, "replace");
  }, []);

  return (
    <>
      {!entered && <EntranceGate onEnter={() => setEntered(true)} />}
      <div className="site-shell" aria-hidden={!entered}>
        <Header onOpenLayer={openLayer} />
        <main id="top" className="pb-32 md:pb-28">
          <HeroSection onOpenLayer={openLayer} />
          <div className="ink-rule" />
          <DiscoverySection selectedMood={selectedMood} onSelectMood={setSelectedMood} onOpenLayer={openLayer} />
          <div className="ink-rule" />
          <FeaturedSection selectedMood={selectedMood} onOpenLayer={openLayer} />
          <WorldsSection onOpenLayer={openLayer} />
          <CollectionsSection onOpenLayer={openLayer} />
          <Footer />
        </main>
        <AudioPlayer />
        <MobileDock />
      </div>
      {entered && <LayerSystem selection={selection} onClose={closeLayer} onNavigate={openLayer} />}
    </>
  );
}
