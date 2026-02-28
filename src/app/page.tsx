"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  const [contactSubmitted, setContactSubmitted] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <ContactForm
          onSubmitted={() => setContactSubmitted(true)}
          submitted={contactSubmitted}
        />
      </main>
      <Footer />
    </div>
  );
}
