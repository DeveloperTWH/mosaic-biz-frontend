"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  HOME_LINK,
  SHOP_LINKS,
  BECOME_VENDOR_LINK,
  LEARN_LINKS,
} from "./navConfig";
import { useHomeClick } from "./useHomeNavigation";

type DropdownProps = {
  label: string;
  links: { label: string; href: string }[];
  widthClass?: string;
};

function NavDropdown({ label, links, widthClass = "w-48" }: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        aria-expanded={open}
        className="market-nav-link flex items-center whitespace-nowrap font-medium uppercase text-market-muted transition-colors hover:text-market-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-market-header"
      >
        {label}{" "}
        <ChevronDown
          className={`ml-1 h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div
          className={`absolute left-0 z-50 mt-2 ${widthClass} rounded-lg border border-white/10 bg-market-elevated py-2 shadow-market-card`}
          onMouseLeave={() => setOpen(false)}
        >
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="market-dropdown-link">
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DesktopNav() {
  const onHomeClick = useHomeClick();

  return (
    <nav
      className="hidden flex-1 items-center justify-center gap-4 text-[11px] font-medium tracking-wide lg:flex xl:gap-6 xl:text-xs"
      aria-label="Main navigation"
    >
      <Link
        href={HOME_LINK.href}
        onClick={onHomeClick}
        className="market-nav-link whitespace-nowrap font-medium uppercase text-market-muted transition-colors hover:text-market-gold"
      >
        {HOME_LINK.label}
      </Link>

      <NavDropdown label="SHOP" links={SHOP_LINKS} />

      <Link
        href={BECOME_VENDOR_LINK.href}
        className="market-nav-link whitespace-nowrap font-medium uppercase text-market-text transition-colors hover:text-market-gold"
      >
        BECOME A VENDOR
      </Link>

      <NavDropdown label="LEARN" links={LEARN_LINKS} />
    </nav>
  );
}
