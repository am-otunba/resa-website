import SiteHeader from "@/components/site-header";
import WaitlistHero from "@/components/waitlist/waitlist-hero";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#edf2f4]">
      <div className="rental-background" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1280px] flex-col px-6 pt-10 sm:px-8 lg:px-10">
        <SiteHeader />
        <WaitlistHero />
      </div>
    </main>
  );
}