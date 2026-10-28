"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Instagram, Linkedin, Github } from "lucide-react";
import { NavLinks } from "./NavLinks";
import { MobileMenu } from "./MobileMenu";

interface NavbarProps {
  onNavClick?: (targetId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileOpen(false);
    if (onNavClick) {
      onNavClick(id);
    } else {
      if (id === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const el = document.getElementById(id);
      if (el) {
        const isMobile = window.innerWidth < 768;
        // Offset for floating navbar + breathing space
        const topOffset = isMobile ? 100 : 85;
        const elementTop = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: Math.max(0, elementTop - topOffset),
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <header className="fixed top-5 left-0 w-full flex justify-center items-center z-50 px-4 pointer-events-none transition-all duration-300">
      <nav
        id="main-nav"
        aria-label="Main Navigation"
        className={`pointer-events-auto w-full max-w-[810px] h-[55px] rounded-[28px] border border-portfolio-border transition-all duration-300 flex items-center justify-between px-6 sm:px-8 ${
          scrolled
            ? "bg-white/85 shadow-[0_12px_40px_rgba(0,0,0,0.12)] -translate-y-0.5 backdrop-blur-xl"
            : "bg-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.07)] backdrop-blur-md"
        }`}
      >
        {/* Left: Brand Logo */}
        <Link
          href="#hero"
          onClick={(e) => handleLinkClick(e, "hero")}
          aria-label="Abhro Saha Home"
          className="flex items-center hover:scale-105 transition-transform"
        >
          <span className="font-narina text-brand text-2xl sm:text-[26px] tracking-tight leading-none select-none">
            ABHRO SAHA
          </span>
        </Link>

        {/* Center: Desktop Nav Links */}
        <NavLinks onLinkClick={handleLinkClick} />

        {/* Right: Desktop Social Links */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://www.instagram.com/_abhro___?rpxt=MWF0cml0dmRiMXcwbQ=="
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Profile"
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-800 hover:text-brand hover:bg-brand/10 hover:-translate-y-0.5 transition-all"
          >
            <Instagram size={19} strokeWidth={1.8} />
          </a>
          <a
            href="https://www.linkedin.com/in/abhro-saha-9b7241431?utm_source=share_via&utm_content=profile&utm_medium=member_android"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-800 hover:text-brand hover:bg-brand/10 hover:-translate-y-0.5 transition-all"
          >
            <Linkedin size={19} strokeWidth={1.8} />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-800 hover:text-brand hover:bg-brand/10 hover:-translate-y-0.5 transition-all"
          >
            <Github size={19} strokeWidth={1.8} />
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          className="md:hidden relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 active:scale-90 transition-transform duration-200"
        >
          <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
          <div className="w-5 h-5 relative flex items-center justify-center">
            <span
              className={`absolute left-0 w-5 h-[2px] bg-neutral-900 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${
                mobileOpen
                  ? "top-[9px] rotate-45 bg-brand"
                  : "top-[3px]"
              }`}
            />
            <span
              className={`absolute top-[9px] left-0 w-5 h-[2px] bg-neutral-900 rounded-full transition-all duration-200 ease-out ${
                mobileOpen
                  ? "opacity-0 scale-x-0"
                  : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 w-5 h-[2px] bg-neutral-900 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${
                mobileOpen
                  ? "top-[9px] -rotate-45 bg-brand"
                  : "top-[15px]"
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      <MobileMenu
        isOpen={mobileOpen}
        onLinkClick={handleLinkClick}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  );
};
