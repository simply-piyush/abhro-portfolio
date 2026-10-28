"use client";

import React from "react";
import { Instagram, Linkedin, Github } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

const LINKS = [
  { label: "Home", href: "#hero", id: "hero" },
  { label: "About", href: "#about", id: "about" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onLinkClick }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden pointer-events-auto absolute top-full mt-3 left-4 right-4 bg-white/95 backdrop-blur-2xl border border-portfolio-border rounded-2xl p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
      <nav className="flex flex-col gap-2">
        {LINKS.map((link) => (
          <a
            key={link.id}
            href={link.href}
            onClick={(e) => onLinkClick(e, link.id)}
            className="font-anton text-2xl text-black hover:text-brand p-2.5 rounded-xl hover:bg-brand/5 transition-colors"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Social Icons row in mobile menu */}
      <div className="flex items-center gap-4 pt-4 border-t border-neutral-200">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram Profile"
          className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-800 bg-neutral-100 hover:text-brand hover:bg-brand/10 transition-colors"
        >
          <Instagram size={20} />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn Profile"
          className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-800 bg-neutral-100 hover:text-brand hover:bg-brand/10 transition-colors"
        >
          <Linkedin size={20} />
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Profile"
          className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-800 bg-neutral-100 hover:text-brand hover:bg-brand/10 transition-colors"
        >
          <Github size={20} />
        </a>
      </div>
    </div>
  );
};
