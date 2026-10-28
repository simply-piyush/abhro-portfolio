"use client";

import React from "react";

interface NavLinksProps {
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

const LINKS = [
  { label: "Home", href: "#hero", id: "hero" },
  { label: "About", href: "#about", id: "about" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export const NavLinks: React.FC<NavLinksProps> = ({ onLinkClick }) => {
  return (
    <ul className="hidden md:flex items-center gap-7 list-none m-0 p-0">
      {LINKS.map((link) => (
        <li key={link.id}>
          <a
            href={link.href}
            onClick={(e) => onLinkClick(e, link.id)}
            className="font-anton text-[22px] tracking-wide text-black hover:text-brand transition-colors relative group"
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full" />
          </a>
        </li>
      ))}
    </ul>
  );
};
