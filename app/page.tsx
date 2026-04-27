import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";

// Eagerly load the first visible section (above fold)
import StatsSection from "@/components/sections/StatsSection";

// Lazy load all below-fold sections — split their JS from the initial bundle
const AboutPreview = dynamic(() => import("@/components/sections/AboutPreview"), { ssr: true });
const AcademicsPreview = dynamic(() => import("@/components/sections/AcademicsPreview"), { ssr: true });
const GalleryPreview = dynamic(() => import("@/components/sections/GalleryPreview"), { ssr: true });
const TestimonialsSection = dynamic(() => import("@/components/sections/TestimonialsSection"), { ssr: true });
const DirectorMessage = dynamic(() => import("@/components/sections/DirectorMessage"), { ssr: true });
const SchoolAnthem = dynamic(() => import("@/components/sections/SchoolAnthem"), { ssr: true });
const EventsPreview = dynamic(() => import("@/components/sections/EventsPreview"), { ssr: true });
const CTASection = dynamic(() => import("@/components/sections/CTASection"), { ssr: true });

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