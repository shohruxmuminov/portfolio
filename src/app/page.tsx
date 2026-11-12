import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Work from "@/components/Work";
import About from "@/components/About";
import FocusAreas from "@/components/FocusAreas";
import Toolkit from "@/components/Toolkit";
import Process from "@/components/Process";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Marquee />
        <Work />
        <About />
        <FocusAreas />
        <Toolkit />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
