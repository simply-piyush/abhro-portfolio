"use client";

import React from "react";
import { Instagram, Linkedin, Github } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
  onClose?: () => void;
}

const LINKS = [
  { label: "Home", href: "#hero", id: "hero" },
  { label: "About", href: "#about", id: "about" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onLinkClick,
  onClose,
}) => {
  return (
    <>
      {/* Backdrop overlay for focus and tap-to-close */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`md:hidden fixed inset-0 -top-5 bg-black/30 backdrop-blur-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] -z-10 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Dropdown Card */}
      <div
        role="dialog"
        aria-label="Mobile Navigation Menu"
        aria-hidden={!isOpen}
        className={`md:hidden absolute top-full mt-3 left-4 right-4 bg-white/95 backdrop-blur-2xl border border-portfolio-border rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)] flex flex-col gap-4 origin-top transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-[0.96] -translate-y-3 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col gap-1.5">
          {LINKS.map((link, idx) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => onLinkClick(e, link.id)}
              className="group flex items-center justify-between font-anton text-2xl tracking-wide text-neutral-900 hover:text-brand px-3.5 py-2.5 rounded-2xl hover:bg-brand/5 active:scale-[0.98] transition-all duration-200 ease-out"
            >
              <span>{link.label}</span>
              <span className="text-xs font-mono text-neutral-400 group-hover:text-brand group-hover:translate-x-0.5 transition-all">
                0{idx + 1}
              </span>
            </a>
          ))}
        </nav>

        {/* Social Icons row in mobile menu */}
        <div className="flex items-center gap-3 pt-3.5 border-t border-neutral-200/80">
          <a
            href="https://www.instagram.com/_abhro___?rpxt=MWF0cml0dmRiMXcwbQ=="
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Profile"
            className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-800 bg-neutral-100 hover:text-white hover:bg-brand active:scale-95 transition-all duration-200"
          >
            <Instagram size={19} />
          </a>
          <a
            href="https://www.linkedin.com/in/abhro-saha-9b7241431?utm_source=share_via&utm_content=profile&utm_medium=member_android"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-800 bg-neutral-100 hover:text-white hover:bg-brand active:scale-95 transition-all duration-200"
          >
            <Linkedin size={19} />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-800 bg-neutral-100 hover:text-white hover:bg-brand active:scale-95 transition-all duration-200"
          >
            <Github size={19} />
          </a>
        </div>
      </div>
    </>
  );
};
