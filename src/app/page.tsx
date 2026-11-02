import { Navbar } from "@/components/Navbar/Navbar";
import { Hero } from "@/components/Hero/Hero";
import { About } from "@/components/About/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects/Projects";
import { Artworks } from "@/components/Artworks";
import { Contact } from "@/components/Contact/Contact";
import { DitheredFooter } from "@/components/Footer";
import { Instagram, Linkedin, Github } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-portfolio-bg flex flex-col overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Artworks />
      <Contact />
      <DitheredFooter
        brand="ABHRO"
        brandHref="#hero"
        accent="#DB4726"
        socials={[
          {
            label: "Instagram",
            href: "https://www.instagram.com/_abhro___?rpxt=MWF0cml0dmRiMXcwbQ==",
            icon: <Instagram size={17} strokeWidth={1.8} />,
          },
          {
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/abhro-saha-9b7241431?utm_source=share_via&utm_content=profile&utm_medium=member_android",
            icon: <Linkedin size={17} strokeWidth={1.8} />,
          },
          {
            label: "GitHub",
            href: "https://github.com",
            icon: <Github size={17} strokeWidth={1.8} />,
          },
        ]}
        copyright={`© ${new Date().getFullYear()} Abhro Saha. All rights reserved.`}
      />
    </main>
  );
}

