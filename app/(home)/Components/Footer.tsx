"use client";

import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { FOOTER_LEGAL_LINKS } from "./nav/navConfig";
import { useHomeClick } from "./nav/useHomeNavigation";

export default function Footer() {
  const onLogoClick = useHomeClick();

  return (
    <footer className="w-full bg-market-header pt-16 text-market-text">
      <div className="mx-auto w-[90%] max-w-6xl">
        <div className="mb-12">
          <Link href="/" onClick={onLogoClick} className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-market-header">
            <BrandLogo variant="footer" />
          </Link>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="mb-4 font-poppins text-lg font-semibold text-market-gold">Shop</h4>
            <ul className="space-y-1 text-sm font-montserrat sm:space-y-2">
              <li><Link href="/products" className="market-footer-link">Products</Link></li>
              <li><Link href="/services" className="market-footer-link">Services</Link></li>
              <li><Link href="/foods" className="market-footer-link">Foods</Link></li>
              <li><Link href="/search" className="market-footer-link">Search marketplace</Link></li>
              <li><Link href="/vendors" className="market-footer-link">Browse vendors</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-poppins text-lg font-semibold text-market-gold">For vendors</h4>
            <ul className="space-y-1 text-sm font-montserrat sm:space-y-2">
              <li><Link href="/become-a-vendor" className="market-footer-link">Become a vendor</Link></li>
              <li><Link href="/refer-a-vendor" className="market-footer-link">Refer a vendor</Link></li>
              <li><Link href="/signup?type=vendor" className="market-footer-link">Vendor signup</Link></li>
              <li><Link href="/login?type=vendor" className="market-footer-link">Vendor login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-poppins text-lg font-semibold text-market-gold">Support</h4>
            <ul className="space-y-1 text-sm font-montserrat sm:space-y-2">
              <li><Link href="/about" className="market-footer-link">About us</Link></li>
              <li><Link href="/contact" className="market-footer-link">Contact</Link></li>
              <li><Link href="/faq" className="market-footer-link">FAQs</Link></li>
              <li><Link href="/how-to-use-this-app" className="market-footer-link">How to use this app</Link></li>
              <li><Link href="/login?type=customer" className="market-footer-link">Consumer login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-poppins text-lg font-semibold text-market-gold">Legal</h4>
            <ul className="space-y-1 text-sm font-montserrat sm:space-y-2">
              {FOOTER_LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="market-footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4">
        <div className="mx-auto w-[90%] max-w-6xl font-montserrat text-sm text-market-muted">
          Copyright {new Date().getFullYear()}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
