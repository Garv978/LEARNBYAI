import Features from "../components/Features";
import Feedback from "../components/Feedback";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import PricingSection from "../components/PricingSection";
import React from "react";

const Home = () => {
  return (
    <>
      <Navbar />

      <section id="home" className="scroll-mt-24">
        <HeroSection />
      </section>

      <section id="features" className="scroll-mt-24">
        <Features />
      </section>

      <section id="pricing" className="scroll-mt-24">
        <PricingSection />
      </section>

      <section id="contact" className="scroll-mt-24">
        <Feedback />
      </section>
      <section id="footer" className="scroll-mt-24">
        <Footer />
      </section>
    </>
  );
};

export default Home;
