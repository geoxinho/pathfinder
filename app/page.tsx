import Hero from "@/components/sections/Hero";
import StatsSection from "@/components/sections/StatsSection";
import AboutPreview from "@/components/sections/AboutPreview";
import AcademicsPreview from "@/components/sections/AcademicsPreview";
import GalleryPreview from "@/components/sections/GalleryPreview";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import DirectorMessage from "@/components/sections/DirectorMessage";
import SchoolAnthem from "@/components/sections/SchoolAnthem";
import EventsPreview from "@/components/sections/EventsPreview";
import CTASection from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsSection />
      <AboutPreview />
      <AcademicsPreview />
      <GalleryPreview />
      <TestimonialsSection />
      <DirectorMessage />
      <SchoolAnthem />
      <EventsPreview />
      <CTASection />
    </>
  );
}