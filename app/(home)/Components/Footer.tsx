"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-screen bg-market-header pt-16 text-market-text">
      <div className="mx-auto w-[90%] max-w-6xl">
        <div className="mb-12">
          <Image src="/Footer/footer-logo.png" alt="Mosaic Biz Hub Logo" width={400} height={120} />
        </div>

        <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <h4 className="mb-4 font-poppins text-lg font-semibold text-market-gold">Shop</h4>
            <ul className="space-y-2 text-sm font-montserrat">
              <li><Link href="/products" className="text-market-muted hover:text-market-gold">Products</Link></li>
              <li><Link href="/services" className="text-market-muted hover:text-market-gold">Services</Link></li>
              <li><Link href="/foods" className="text-market-muted hover:text-market-gold">Foods</Link></li>
              <li><Link href="/search" className="text-market-muted hover:text-market-gold">Search marketplace</Link></li>
              <li><Link href="/vendors" className="text-market-muted hover:text-market-gold">Browse vendors</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-poppins text-lg font-semibold text-market-gold">For vendors</h4>
            <ul className="space-y-2 text-sm font-montserrat">
              <li><Link href="/become-a-vendor" className="text-market-muted hover:text-market-gold">Become a vendor</Link></li>
              <li><Link href="/signup?type=vendor" className="text-market-muted hover:text-market-gold">Vendor signup</Link></li>
              <li><Link href="/login?type=vendor" className="text-market-muted hover:text-market-gold">Vendor login</Link></li>
              <li><Link href="/vendor/trustbadge" className="text-market-muted hover:text-market-gold">Trust badges – vendor</Link></li>
              <li><Link href="/vendor/terms" className="text-market-muted hover:text-market-gold">Vendor terms</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-poppins text-lg font-semibold text-market-gold">Support</h4>
            <ul className="space-y-2 text-sm font-montserrat">
              <li><Link href="/about" className="text-market-muted hover:text-market-gold">About us</Link></li>
              <li><Link href="/contact" className="text-market-muted hover:text-market-gold">Contact</Link></li>
              <li><Link href="/faq" className="text-market-muted hover:text-market-gold">FAQs</Link></li>
              <li><Link href="/how-to-use-this-app" className="text-market-muted hover:text-market-gold">How to use this app</Link></li>
              <li><Link href="/login?type=customer" className="text-market-muted hover:text-market-gold">Consumer login</Link></li>
              <li><Link href="/privacy" className="text-market-muted hover:text-market-gold">Privacy policy</Link></li>
              <li><Link href="/terms" className="text-market-muted hover:text-market-gold">Terms</Link></li>
              <li><Link href="/refund-return" className="text-market-muted hover:text-market-gold">Refunds & returns</Link></li>
              <li><Link href="/dispute" className="text-market-muted hover:text-market-gold">Dispute resolution</Link></li>
              <li><Link href="/consumer/trustbadge" className="text-market-muted hover:text-market-gold">Trust badges – consumer</Link></li>
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
