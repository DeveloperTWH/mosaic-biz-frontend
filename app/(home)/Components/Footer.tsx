"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 footer-background w-screen">
      <div className="w-[80%] mx-auto">
        <div className="mb-24 mt-2">
          <Image src="/Footer/footer-logo.png" alt="Mosaic Biz Hub Logo" width={500} height={150} />
        </div>

        {/* Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-14 mb-12">
          {/* Column 1 - GET TO KNOW US */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">GET TO KNOW US</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-custom-yellow">About Us</Link></li>
              <li><Link href="#" className="text-custom-yellow">Contact Us</Link></li>
              <li><Link href="#" className="text-custom-yellow">FAQs</Link></li>
              <li><Link href="#" className="text-custom-yellow">Blogs</Link></li>
            </ul>
          </div>

          {/* Column 2 - LET'S HELP YOU */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">LET'S HELP YOU</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-custom-yellow">Shop</Link></li>
              <li><Link href="#" className="text-custom-yellow">My Account</Link></li>
              <li><Link href="#" className="text-custom-yellow">Wishlist</Link></li>
              <li><Link href="#" className="text-custom-yellow">Request A Quote</Link></li>
            </ul>
          </div>

          {/* Column 3 - EXPLORE */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">EXPLORE</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-custom-yellow">Order</Link></li>
              <li><Link href="#" className="text-custom-yellow">Shipping And Delivery</Link></li>
              <li><Link href="#" className="text-custom-yellow">Return And Exchange Policy</Link></li>
              <li><Link href="#" className="text-custom-yellow">Privacy Policy</Link></li>
              <li><Link href="#" className="text-custom-yellow">Terms Of Services</Link></li>
            </ul>
          </div>

          {/* Column 4 - DISCOVER */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">DISCOVER</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-custom-yellow">Shop</Link></li>
              <li><Link href="#" className="text-custom-yellow">My Account</Link></li>
              <li><Link href="#" className="text-custom-yellow">Wishlist</Link></li>
              <li><Link href="#" className="text-custom-yellow">Request A Quote</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}

      </div>
      <div className="border-t border-custom-yellow pt-4 pb-4 text-lg text-custom-yellow">
        <div className="w-[80%] mx-auto">
          Copyright 2025. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
