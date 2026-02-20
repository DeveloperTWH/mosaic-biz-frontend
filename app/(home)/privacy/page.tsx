import React from "react";
import Link from 'next/link';

const Privacy = () => {
  return (
    <div className="max-w-[900px] mx-auto p-8 font-sans leading-relaxed">
      <h1 className="mb-2 text-3xl font-bold">Privacy Policy</h1>
      <p className="text-gray-500 mb-8 text-sm">Last updated: January 2026</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <p className="text-gray-700">
          Mosaic Biz Hub ("we", "our", or "us") is committed to protecting your
          privacy. This Privacy Policy explains how we collect, use, disclose,
          and safeguard your information when you use our website and
          application located at <strong className="font-semibold">app.mosaicbizhub.com</strong>.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
        <p className="text-gray-700 mb-2">We may collect the following types of information:</p>
        <ul className="pl-5 list-disc text-gray-700">
          <li className="mb-1">
            <span className="font-semibold">Personal Information:</span> Name, email address, phone
            number, business details, and account credentials.
          </li>
          <li className="mb-1">
            <span className="font-semibold">Business Information:</span> Business name, category,
            services, products, verification details, and profile content.
          </li>
          <li className="mb-1">
            <span className="font-semibold">Usage Data:</span> Pages visited, features used, search
            activity, device type, IP address, and browser information.
          </li>
          <li className="mb-1">
            <span className="font-semibold">Payment Information:</span> Processed securely through
            third-party payment providers. We do not store full payment details.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
        <p className="text-gray-700 mb-2">Your information is used to:</p>
        <ul className="pl-5 list-disc text-gray-700">
          <li className="mb-1">Create and manage user and vendor accounts</li>
          <li className="mb-1">Verify businesses and listings</li>
          <li className="mb-1">Provide marketplace features and services</li>
          <li className="mb-1">Improve platform functionality and user experience</li>
          <li className="mb-1">Send service updates, notifications, and support messages</li>
          <li className="mb-1">Maintain platform security and prevent fraud</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Sharing Your Information</h2>
        <p className="text-gray-700 mb-2">
          We do not sell your personal data. We may share information only in the
          following circumstances:
        </p>
        <ul className="pl-5 list-disc text-gray-700">
          <li className="mb-1">With trusted service providers that support platform operations</li>
          <li className="mb-1">With other users when you publish business listings or services</li>
          <li className="mb-1">To comply with legal obligations or law enforcement requests</li>
          <li className="mb-1">To protect the rights, safety, and integrity of Mosaic Biz Hub</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Cookies & Tracking Technologies</h2>
        <p className="text-gray-700">
          We use cookies and similar technologies to enhance your experience,
          analyze usage, and remember preferences. You may disable cookies
          through your browser settings, but some features may not function
          properly.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Data Security</h2>
        <p className="text-gray-700">
          We implement appropriate technical and organizational security
          measures to protect your information. However, no electronic storage
          or transmission is 100% secure.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Your Privacy Rights</h2>
        <p className="text-gray-700">
          Depending on your location, you may have the right to access, correct,
          delete, or restrict the use of your personal information. You can
          manage your account information directly in the app or contact us for
          assistance.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Third-Party Links</h2>
        <p className="text-gray-700">
          Our platform may contain links to third-party websites or services.
          We are not responsible for their privacy practices or content.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">9. Children’s Privacy</h2>
        <p className="text-gray-700">
          Mosaic Biz Hub is not intended for children under the age of 13. We do
          not knowingly collect personal data from children.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">10. Changes to This Policy</h2>
        <p className="text-gray-700">
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with an updated revision date.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">11. Contact Us</h2>
        <p className="text-gray-700">
          If you have any questions about this Privacy Policy or our data
          practices, please contact us through the Mosaic Biz Hub platform.
        </p>
      </section>

      {/* Expand Your Reach Section - Full Width with Increased Height */}
      <div className="relative left-1/2 right-1/2 w-screen ml-[-50vw] mr-[-50vw] mt-12 mb-8">
        <div 
          className="w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/contact/becomeVendor.png')" }}
        >
          <div className="bg-[#3333339E] py-24 px-8 text-center text-white">
            <div className="max-w-[900px] mx-auto">
              <h2 className="text-white text-3xl font-bold mb-2">EXPAND YOUR REACH -</h2>
              <h2 className="text-white text-3xl font-bold mb-4">LIST YOUR BUSINESS ON OUR PLATFORM!</h2>
              
              <hr className="h-[2px] w-[180px] bg-white border-none mx-auto my-4" />
              <hr className="h-[2px] w-[180px] bg-white border-none mx-auto mb-8" />
              
              <p className="text-white text-lg leading-relaxed max-w-[700px] mx-auto mb-10 opacity-95">
                Take your business to new heights by listing it on Mosaic Biz Hub. 
                Connect with customers who value minority-owned brands, showcase your 
                unique products and services, and grow your presence in the digital 
                marketplace. Join a community dedicated to supporting your success 
                every step of the way.
              </p>
              
              <Link 
                href="/become-a-vendor" 
                className="inline-block px-10 py-4 bg-transparent border-2 border-white text-white font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-gray-800"
              >
                Become A Vendor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;