"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { OpeningScreen } from "@/components/sections/OpeningScreen";
import { HeroSection } from "@/components/sections/HeroSection";
import { CountdownSection } from "@/components/sections/CountdownSection";
import { EventDetailsSection } from "@/components/sections/EventDetailsSection";
import { StorySection } from "@/components/sections/StorySection";
import { RsvpSection } from "@/components/sections/RsvpSection";
// import { GiftSection } from "@/components/sections/GiftSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { FloatingNavigation } from "@/components/FloatingNavigation";
import { MusicPlayer } from "@/components/MusicPlayer";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LoadingState } from "@/components/ui/LoadingState";

const GallerySection = dynamic(
  () =>
    import("@/components/sections/GallerySection").then(
      (m) => m.GallerySection
    ),
  { loading: () => <LoadingState message="Loading gallery..." className="py-24" /> }
);

const GuestbookSection = dynamic(
  () =>
    import("@/components/sections/GuestbookSection").then(
      (m) => m.GuestbookSection
    ),
  { loading: () => <LoadingState message="Loading guestbook..." className="py-24" /> }
);

function useGuestNameFromUrl(): string {
  if (typeof window === "undefined") return "Invited guests";
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("to") ?? params.get("name") ?? "";
  if (!raw) return "Invited guests";
  const decoded = decodeURIComponent(raw).trim().slice(0, 80);
  return decoded || "Invited guests";
}

export default function WeddingPage() {
  const [opened, setOpened] = useState(false);
  const guestName = useGuestNameFromUrl();

  return (
    <>
      {!opened && (
        <OpeningScreen guestName={guestName} onOpen={() => setOpened(true)} />
      )}

      {opened && (
        <>
          <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
            <MusicPlayer />
            <ThemeToggle />
          </div>

          <FloatingNavigation />

          <main id="main-content" tabIndex={-1}>
            <HeroSection />
            <CountdownSection />
            <EventDetailsSection />
            <Suspense
              fallback={
                <LoadingState message="Loading gallery..." className="py-24" />
              }
            >
              <GallerySection />
            </Suspense>
            <StorySection />
            <RsvpSection />
            <Suspense
              fallback={
                <LoadingState
                  message="Loading guestbook..."
                  className="py-24"
                />
              }
            >
              <GuestbookSection />
            </Suspense>
            {/* <GiftSection /> */}
            <FooterSection />
          </main>
        </>
      )}
    </>
  );
}
