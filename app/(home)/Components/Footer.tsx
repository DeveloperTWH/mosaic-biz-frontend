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
            <h4 className="text-lg font-semibold mb-4 text-white font-poppins">GET TO KNOW US</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-custom-yellow font-montserrat">About Us</Link></li>
              <li><Link href="/contact" className="text-custom-yellow font-montserrat">Contact Us</Link></li>
              <li><Link href="/faq" className="text-custom-yellow font-montserrat">FAQs</Link></li>
              {/* <li><Link href="#" className="text-custom-yellow font-montserrat">Blogs</Link></li> */}
            </ul>
          </div>

           <div>
            <h4 className="text-lg font-semibold mb-4 text-white font-poppins">FOR VENDORS </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/signup?type=vendor" className="text-custom-yellow font-montserrat">Become a Vendor </Link></li>
              <li><Link href="/vendor/trustbadge" className="text-custom-yellow font-montserrat">Trust Badges – Vendor </Link></li>
              <li><Link href="/vender/terms" className="text-custom-yellow font-montserrat">Terms and Conditions – Vendor </Link></li>
              <li><Link href="#" className="text-custom-yellow font-montserrat">Vendor Login</Link></li>
            </ul>
          </div>


          {/* Column 3 - EXPLORE */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white font-poppins">FOR CONSUMERS </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-custom-yellow font-montserrat">How to Use this App </Link></li>
              <li><Link href="#" className="text-custom-yellow font-montserrat">Trust Badges – Consumer </Link></li>
              <li><Link href="#" className="text-custom-yellow font-montserrat">Terms and Conditions – Consumer </Link></li>
              <li><Link href="#" className="text-custom-yellow font-montserrat">Consumer Login </Link></li>
            </ul>
          </div>

          {/* Column 4 - DISCOVER */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white font-poppins">IMPORTANT LINKS </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-custom-yellow font-montserrat">Products</Link></li>
              <li><Link href="#" className="text-custom-yellow font-montserrat">Services </Link></li>
              <li><Link href="#" className="text-custom-yellow font-montserrat">Foods </Link></li>
              <li><Link href="/privacy" className="text-custom-yellow font-montserrat">Privacy Policy </Link></li>
              <li><Link href="#" className="text-custom-yellow font-montserrat">Refunds and Returns </Link></li>
                <li><Link href="#" className="text-custom-yellow font-montserrat">Dispute Resolution Process </Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}

      </div>
      <div className="border-t border-custom-yellow pt-4 pb-4 text-lg text-custom-yellow">
        <div className="w-[80%] mx-auto font-montserrat">
          Copyright 2025. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
