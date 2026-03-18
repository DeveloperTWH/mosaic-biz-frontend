  "use client";
  import React from "react";
  import { X } from "lucide-react";

  interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "terms" | "privacy" | "directory" | "refund";
  }

  export default function TermsModal({ isOpen, onClose, type }: TermsModalProps) {
    if (!isOpen) return null;

    const titles = {
      terms: "Terms and Conditions of Service",
      privacy: "Privacy Policy",
      directory: "Mosaic Biz Hub Directory Policy",
      refund: "Refund Policy"
    };

    const content = {
      privacy: (
        <div className="space-y-6 text-gray-700">
          <p className="text-sm">
            <span className="font-semibold">Mosaic Biz Hub</span> (“we,” “our,” or “us”) is committed to protecting your privacy and ensuring a safe online experience. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. By accessing or using Mosaic Biz Hub, you agree to the terms of this Privacy Policy.
          </p>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Information We Collect</h3>
            <p className="text-sm">We collect information to provide better services, tailor our offerings, and maintain a secure platform. The categories of information we collect include:</p>
            <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
              <li><span className="font-medium">Personal Information:</span> name, email address, phone number, business name, and profile details you provide when registering or contacting us.</li>
              <li><span className="font-medium">Financial and Payment Data:</span> billing address, credit card or payment account details, and transaction history when you purchase premium services.</li>
              <li><span className="font-medium">Usage Data:</span> pages visited, features used, keyboard and mouse activity, IP address, browser type, and device identifiers collected automatically.</li>
              <li><span className="font-medium">Communications Data:</span> support inquiries, feedback, survey responses, and marketing preferences.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">How We Use Your Information</h3>
            <p className="text-sm">Your information powers our platform and helps us deliver relevant experiences:</p>
            <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
              <li>To operate, maintain, and improve Mosaic Biz Hub features and services.</li>
              <li>To process transactions, send confirmations, and manage billing.</li>
              <li>To communicate updates, newsletters, and promotional materials based on your preferences.</li>
              <li>To analyze usage trends, perform research, and enhance security measures.</li>
              <li>To detect, prevent, and address technical issues or fraudulent activity.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Cookies and Tracking Technologies</h3>
            <p className="text-sm">We and our third-party partners use cookies and similar technologies to collect usage data and improve user experience:</p>
            <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
              <li><span className="font-medium">Session Cookies:</span> enable core functionality and keep you logged in.</li>
              <li><span className="font-medium">Preference Cookies:</span> remember your language and appearance settings.</li>
              <li><span className="font-medium">Analytics and Performance Cookies:</span> gather usage statistics to optimize site performance.</li>
              <li><span className="font-medium">Advertising Cookies:</span> deliver relevant ads on and off our platform.</li>
            </ul>
            <p className="text-sm mt-2">You can manage cookie preferences through your browser settings or via our cookie notice banner.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Sharing Your Information</h3>
            <p className="text-sm">We do not sell or rent your personal information to third parties. We may share information in the following circumstances:</p>
            <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
              <li><span className="font-medium">With Service Providers:</span> trusted partners who perform services on our behalf (e.g., payment processors, hosting providers).</li>
              <li><span className="font-medium">For Legal Purposes:</span> to comply with legal obligations, enforce our terms, or protect rights, property, or safety.</li>
              <li><span className="font-medium">With Your Consent:</span> when you explicitly agree to share your data with other businesses or marketing partners.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Data Retention</h3>
            <p className="text-sm">We retain your information as long as necessary to fulfill the purposes described in this policy or as required by law. When data is no longer needed, we securely delete or anonymize it.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Data Security</h3>
            <p className="text-sm">We implement administrative, technical, and physical safeguards to protect your information against unauthorized access, disclosure, alteration, or destruction. While no system is completely secure, we regularly review and update our security practices.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Your Rights</h3>
            <p className="text-sm">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
              <li>Access, correct, or delete your personal information.</li>
              <li>Opt out of marketing communications.</li>
              <li>Restrict or object to certain processing activities.</li>
              <li>Receive a copy of your information in a portable format.</li>
              <li>Lodge a complaint with a supervisory authority.</li>
            </ul>
            <p className="text-sm mt-2">To exercise any rights, please contact us using the details below.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Third-Party Links and Services</h3>
            <p className="text-sm">Our platform may contain links to external websites or integrate with third-party services. We are not responsible for their privacy practices and encourage you to review their policies before providing any information.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Children's Privacy</h3>
            <p className="text-sm">Mosaic Biz Hub is not intended for children under 16. We do not knowingly collect personal information from users under this age. If we learn that we have collected data from a child under 16, we will take steps to delete it promptly.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Changes to This Privacy Policy</h3>
            <p className="text-sm">We may update this policy to reflect changes in our practices or legal requirements. When we make material changes, we will post the updated policy with a new effective date and notify you via email or prominent notice on our site.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
           <p className="text-sm">
  If you have questions or requests regarding this Privacy Policy, please contact:<br />
  Mosaic Biz Hub Support<br />
  Email: <a href="mailto:Info@mosaicbizhub.com" className="text-[#c9a227]">Info@mosaicbizhub.com</a>
</p>
            <p className="text-sm mt-2 italic">We value your trust and are committed to protecting your privacy.</p>
          </div>
        </div>
      ),

      directory: (
        <div className="space-y-6 text-gray-700">
          <div className="bg-[#1e3a5f] text-white p-3 rounded-md mb-2">
            <p className="text-sm font-medium">Empowering Entrepreneurs, Building Community</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">1. Eligibility for Directory Listing</h3>
            <p className="text-sm">To ensure fairness, transparency, and quality, businesses must meet the following criteria before joining the Mosaic Biz Hub directory:</p>
            <p className="text-sm font-medium mt-2">Business Qualification:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Minority-Owned business, requires at least 51% ownership</li>
              <li>Legal business registration</li>
              <li>Professional product/service photos and descriptions</li>
              <li>Compliance with all relevant local and international regulations</li>
            </ul>
            <p className="text-sm font-medium mt-2">Content Guidelines:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>All listings must be accurate, truthful, and non-deceptive</li>
              <li>Mosaic Biz Hub reserves the right to remove any business or listing that violates these standards</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">2. Business Evaluation Process</h3>
            <p className="text-sm">We maintain a thorough evaluation to uphold our directory's integrity:</p>
            <p className="text-sm font-medium mt-2">Evaluation Wait Time:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Standard approval period is 30 days</li>
              <li>You'll receive a decision within this time frame unless we notify you of delays</li>
            </ul>
            <p className="text-sm font-medium mt-2">Evaluation Criteria:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Business originality and market relevance</li>
              <li>Quality of products or services</li>
              <li>Consistency of business presence and integrity</li>
            </ul>
            <p className="text-sm font-medium mt-2">Start Date Selection:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Applicants choose a desired directory start date during application</li>
              <li>We recommend selecting a date at least 30 days from your application</li>
            </ul>
            <p className="text-sm font-medium mt-2">Feedback and Reapplication:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>If your business isn't approved, you'll receive constructive feedback</li>
              <li>You may adjust your listing and reapply (no more than once per evaluation cycle)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">3. Directory Listing and Visibility</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><span className="font-medium">Official Induction:</span> Your business is published in the directory and searchable by users. All relevant details become accessible to potential customers.</li>
              <li><span className="font-medium">Business Profile Customization:</span> We tailor your profile using the information provided in your application. Custom content must adhere to our eligibility and content guidelines.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">4. Refund Policy</h3>
            <p className="text-sm">We protect applicants against delays and denials:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><span className="font-medium">Extended Wait Time:</span> If evaluation exceeds 30 days past your chosen start date, you're eligible for a full refund of your first month's subscription (excluding setup fee).</li>
              <li><span className="font-medium">Declined Applicants:</span> If your application is denied and you selected a start date less than 30 days from your application, you'll receive a full refund of both the setup and monthly fees.</li>
              <li><span className="font-medium">Early Start Date Applicants:</span> Applicants who set a start date at least 30 days from application receive refunds only if approval delays exceed the 30-day evaluation window.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">5. Business Responsibilities</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><span className="font-medium">Accurate Information:</span> Ensure all listing details are current and truthful.</li>
              <li><span className="font-medium">Regular Updates:</span> Notify us of any changes to products, services, pricing, or website links. Outdated information may lead to removal from the directory.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">6. Service Availability During Wait Time</h3>
            <p className="text-sm">While awaiting approval, you retain full access to other platform features:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Monthly business grant lists</li>
              <li>Exclusive group access and marketing tools</li>
              <li>Social media content planner, business entreaty, blog content, and more</li>
            </ul>
            <p className="text-sm mt-2">Leverage available tools to build your business visibility before official listing.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">7. Business Maintenance and Removal</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><span className="font-medium">Inactive Businesses:</span> Businesses inactive for more than six consecutive months may be flagged for removal. Applicants receive notice and an opportunity to reactivate.</li>
              <li><span className="font-medium">Policy Violations:</span> Fraud, misrepresentation, or harmful content leads to immediate removal without refund. Applicants are notified of the action and provided an explanation.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">8. Cancellations</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><span className="font-medium">How to Cancel:</span> Log in at www.mosaicbizhub.com → Profile → My Subscriptions → Cancel</li>
              <li><span className="font-medium">Service Disputes:</span> Submit a dispute if you believe contracted services weren't delivered. Valid claims may result in refunds or service adjustments.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">9. Communication with Applicants</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><span className="font-medium">Regular Updates:</span> Status notifications throughout evaluation and listing processes.</li>
              <li><span className="font-medium">Support Access:</span> Dedicated customer support for any questions about your directory listing or plan features.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">10. Prohibited Items Policy</h3>
            <p className="text-sm">To honor our values and community standards, the following are strictly prohibited:</p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <ul className="list-disc pl-5 space-y-1">
                <li>Pornographic material</li>
                <li>Occult or witchcraft items</li>
                <li>Idols or related products</li>
                <li>Blasphemous or offensive content</li>
                <li>Violent or graphic media</li>
                <li>Illegal substances</li>
                <li>Profanity</li>
              </ul>
              <ul className="list-disc pl-5 space-y-1">
                <li>Immodest or suggestive clothing</li>
                <li>Gambling-related products</li>
                <li>Sexual exploitation materials</li>
                <li>Hate-filled or divisive content</li>
                <li>Tarot cards, astrology products</li>
                <li>Crystals for spiritual use</li>
                <li>Chakra-related items</li>
              </ul>
            </div>
            <p className="text-sm mt-2">We reject any products or services that promote practices contrary to our community values.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">11. Payment Methods</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Credit / Debit Cards</li>
              <li>PayPal</li>
            </ul>
            <p className="text-sm mt-4 italic">Thank you for partnering with Mosaic Biz Hub. Together, we empower entrepreneurs to thrive—Empowering Entrepreneurs, Building Community.</p>
          </div>
        </div>
      ),

      refund: (
        <div className="space-y-6 text-gray-700">
          <div className="bg-gray-50 p-3 rounded-md mb-2">
            <p className="text-sm">
              <span className="font-semibold">Mosaic Biz Hub, LLC</span> - Temporary Refund Policy Draft
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">OVERVIEW</h3>
            <p className="text-sm">This is a temporary refund policy placeholder for the business profile flow. It can be replaced with the final approved policy content later.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">ELIGIBILITY</h3>
            <p className="text-sm">Refund requests may be reviewed for orders that arrive damaged, defective, incomplete, or materially different from the item or service description.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">REQUEST WINDOW</h3>
            <p className="text-sm">Customers should submit refund or return requests within 48 hours of delivery or service completion unless a different window is stated on the vendor profile.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">REVIEW PROCESS</h3>
            <p className="text-sm">Vendors should acknowledge refund requests within 48 hours and provide a resolution, update, or next step within 7 business days.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">NON-REFUNDABLE ITEMS</h3>
            <p className="text-sm">Unless otherwise required by law, custom orders, completed services, gift cards, sale items, and personal care items may be excluded from refunds.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">CONTACT</h3>
            <p className="text-sm">
              Questions about this refund policy can be sent to{" "}
              <a
                href="mailto:info@mosaicbizhub.com"
                className="text-[#c9a227] hover:underline"
              >
                info@mosaicbizhub.com
              </a>
            </p>
          </div>
        </div>
      ),

      terms: (
        <div className="space-y-6 text-gray-700">
          <div className="bg-gray-50 p-3 rounded-md mb-2">
            <p className="text-sm">
              <span className="font-semibold">Mosaic Biz Hub, LLC</span> – Last Updated: February 17, 2026
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">INTRODUCTION</h3>
            <p className="text-sm">Mosaic Biz Hub is a digital platform designed to foster inclusive, trust-centered commerce between vendors and customers, underpinned by transparency, compliance, and user empowerment.</p>
            <p className="text-sm mt-2">This website is owned and operated by Mosaic Biz Hub, LLC, a Virginia Limited Liability Company. Throughout this website references to "Company", "We", "Us", and "Platform" refer to Mosaic Biz Hub. References to "Customer" refer to any person or entity accessing the Platform. References to "Vendor", "You", and "Your" refer to any person or entity authorized to sell products or services on the Platform. By enrolling as a Vendor and listing Your products and/or services on the Platform, You agree to be legally bound by the Terms and Conditions of Service outlined herein, to include any terms incorporated by reference by MosaicBizHub.Com.</p>
            <p className="text-sm mt-2">You should review these Terms and Conditions of Service frequently. Company reserves the right to revise these Terms and Conditions of Service in any way at any time without prior notice. Vendor is responsible for periodically reviewing this page for the most current version of these Terms and Conditions of Service.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">COMMUNITY STANDARD</h3>
            <p className="text-sm">Platform is committed to language and practices that foster an accessible, inclusive community for users of all backgrounds and abilities. Vendors and Customers are entitled to Platform experiences free of discriminatory or exclusionary content, and Platform conducts ongoing audits to update standards in tandem with evolving DEI law and guidance. All Vendors must conduct themselves with respect and refrain from harassment, discrimination, or abusive conduct. Violations may result in suspension or termination of Platform privileges.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">VENDOR ACCOUNTS</h3>
            <p className="text-sm">To become an authorized Vendor, an authorized representative of the business entity must complete Company's onboarding process which includes providing accurate and complete business identification information (e.g., full legal name, EIN, state registration information, business license, insurance, website, etc.) and undergoing a background verification check for the business entity and owner(s). Vendors must provide accurate information about the business entity and owner(s) when setting up accounts. Providing false or misleading information or impersonating another person or entity is expressly prohibited and will result in immediate deactivation or termination of any associated account. If any of Vendor's registration information changes during or after the onboarding process, Vendor must provide the updated information to Company within thirty (30) calendar days of the change. Failure to provide and maintain accurate registration information may result in account suspension or termination.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">VENDOR QUALIFICATION</h3>
            <p className="text-sm">Vendor approval is contingent upon successfully completing Company's onboarding process; meeting Company standard for business operations and product/service quality as outlined in X and incorporated by reference; accepting and adhering to Company's DEI and accessibility guidelines, as outlined in X and incorporated by reference; and payment of required Vendor fees.</p>
            <p className="text-sm mt-2">Customers and Vendors are responsible for the activity and conduct associated with their respective accounts. Company reserves the right to deactivate or terminate any account that violates these Terms and Conditions of Service at any time without refund.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">VENDOR PAYMENTS TO COMPANY</h3>
            <p className="text-sm">Vendors will be charged fees for using the Platform based on Vendor's account selection. Vendor will also be required to pay fees associated with undergoing the business and owner background checks, profile set-up fee, product/service listing fee, advertising/promotional fee, and Platform product and features. Company's Fee Schedule is incorporated by reference. All fees are paid electronically via a stored credit/debit card or electronic funds transfer account information.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">VENDOR PROFILES AND LISTINGS</h3>
            <p className="text-sm">Vendor's Platform profile(s) must include the listings approved by Company. Vendor must ensure each product or service listed on the Platform must have (1) an accurate description of the product or service; (2) accurate product labels, ingredients, and warnings; (3) original photographs or videos (no stock photos or videos); (4) pricing in U.S. dollars; (5) delivery timeline; and (6) relevant warranty and/or return terms. Vendor's profile must also include the Vendor's contact information for Customer use; order modification, cancelation, return/exchange/refund, order processing timeline(s), and shipping policies. Vendor is solely responsible for the accuracy of this information. Vendor represents and warrants that all Your product and/or service listings comply with all applicable federal, state, and local laws. Vendor is solely responsible for monitoring and revising listings to ensure compliance with current laws. Company assumes no responsibility for accuracy, labeling, or content of Vendor listings. Company reserves the right to remove any listings that are misleading or otherwise noncompliant with these Terms and Conditions of Service.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">VENDOR PERFORMANCE, METRICS, AND BADGES</h3>
            <p className="text-sm">To maintain an active account on the Platform, Vendors must provide excellent customer service and maintain trust within the Platform community. Vendors must meet or exceed the following performance metrics. These metrics may be periodically reviewed and updated based on Platform benchmarks and market standards. Repeat failures to meet or exceed this performance metrics may result in account suspension or termination.</p>
            <p className="text-sm mt-2">The Platform's Badge System issues digital badges denoting achievements and performance milestones. Vendors may earn badges based on performance metrics, referrals, and other engagement activities on the Platform as described in the Platform's Badge System logic. Vendors are encouraged to display their badges.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">VENDOR PRIVACY AND DATA PROCESSING</h3>
            <p className="text-sm">Company's Privacy Policy, incorporated herein, outlines how Customer personal data is collected, processed, and shared. Vendor acknowledges and agrees to handle and process Customer data in accordance with Company's Privacy Policy.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">VENDOR PROHIBITED ACTIVITIES</h3>
            <p className="text-sm">Vendor is expressly prohibited from using the Platform or its contents for any unlawful purpose; to violate any law, regulation, or ordinance; to solicit others to participate or conduct any unlawful act; to defraud Company or any Customer; infringe upon or violate any intellectual property rights of any person or entity; to abuse, defame, discriminate (based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability), harass, harm, intimidate, or insult any Platform users; submit false, inaccurate, or misleading information; to reproduce, duplicate, copy, or exploit any information on this Platform or of any service or product offered; to transmit any worms, viruses, or destructive code of any type while using this Platform; or to engage in any immoral or obscene conduct. Engaging in any prohibited uses is a breach of these Terms and Conditions of Service and Company may immediately terminate services and/or inactivate any Vendor account for engaging in these prohibited uses.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">COMPANY, VENDOR, AND CUSTOMER RELATIONSHIP</h3>
            <p className="text-sm">These Terms and Conditions of Service do not create an agency, employment, franchisee, partnership, or joint venture relationship. Company and is not an agent of Vendor or Customer and cannot enter into any agreements or contracts, create any obligations with third parties or otherwise bind the party unless express written consent is provided.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">CUSTOMER ORDERS AND PURCHASES</h3>
            <p className="text-sm">Purchases initiated on the Platform will be directed to the Vendor's website to complete the purchase. Customer is solely responsible for ensuring the accuracy of the information submitted. Company is not liable for any inaccuracies included in any Customer order or purchase. Vendors must have websites with appropriate features and functions to properly and securely obtain and process Customer purchases, including, but not limited to, accurately calculating and collecting relevant shipping and sales tax. The Platform does not process or retain purchase data. Vendor is solely responsible for remitting any sales taxes to the appropriate governing body.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">CUSTOMER ORDER MODIFICATIONS/CANCELATIONS</h3>
            <p className="text-sm">Vendor's profile must include Vendor's order modification and cancelation policies and procedures. Customer is solely responsible for ensuring all purchase modifications or cancelations are sent to Vendor before fulfilment. If Vendor modifies or cancels Customer's purchase, Vendor must notify Customer using the contact information (email address, phone number, mailing address) provided in the purchase immediately and provide refunds as may be necessary and/or requested.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">SHIPPING</h3>
            <p className="text-sm">Customer is solely responsible for ensuring the accuracy of the shipping information submitted. Customers must confirm the shipping address prior to submitting their order to Vendor. Company or Vendor will not be liable for orders delivered to the wrong shipping address due to Customer error. If an order is returned to Vendor due to incorrect shipping information, Vendor may charge a reshipping fee to have the order resent. Company or Vendor will not be obligated to provide returns, exchanges, or refunds for orders delivered to the wrong address due to Customer error. Vendor's profile must include information on order processing and shipping.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">RETURNS OR REFUND POLICY</h3>
            <p className="text-sm">Vendors must conspicuously display their return/refund policy on their Platform profile. Any Vendor who does not have or does not conspicuously display their return/refund policy must adhere and comply with the Platform's Refund Policy, as referenced herein. Customer is solely responsible for reviewing and inspecting their order immediately upon receipt. If Customer's order is incomplete, products are damaged, defective, or include incorrect items, Customer must contact Vendor within forty-eight (48) hours of receiving order. Vendor's profile must include contact information for customer use. Vendor must acknowledge Customer's refund/return request within forty-eight (48) hours and process the request as outlined in Vendor's Return Policy or within seven (7) business days. To be eligible for a return or refund, the products shall be in the same condition they were received, unused, with tags, and in the original packaging. Vendor may request a receipt or other proof of purchase from Customer.</p>
            <p className="text-sm mt-2">Vendor's profile must note any listing that are not eligible for returns or refunds, such as:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Service purchases</li>
              <li>Custom products</li>
              <li>Personal care items</li>
              <li>Sale items</li>
              <li>Gift cards</li>
              <li>Incorrect shipping address purchases</li>
            </ul>
            <p className="text-sm mt-2">Approved refund requests should be issued to the original form of payment within seven (7) business days.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">DISPUTE ESCALATION</h3>
            <p className="text-sm">Customers and Vendors are encouraged to resolve disputes in good faith via the Platform's messaging and support channels. Customers are encouraged to contact Company if they are unsatisfied with a Vendor's resolution of Customer's refund or return request. Customers may escalate their request to Platform support for review in accordance with the Platform's Dispute Resolution process, incorporated herein. Vendor must engage in good faith with Company to resolve escalated disputes.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">SUSPENSION, TERMINATION, AND REMEDIES</h3>
            <p className="text-sm">Company may suspend or terminate any Vendor's account for (1) breach of these Terms and Condition of Service; (2) severe (as determined by Company) or repeat performance failures; (3) failure to maintain compliance with relevant laws and regulations; (4) any conduct (as determined by Company) that is harmful to Company's integrity or inclusive climate. Company may provide Vendor written notice of a cause to suspend or terminate Vendor's account and a proposed remedy. Company may allow Vendor up to ten (10) business days to remedy the cause to suspend or terminate Vendor's account. Vendor's suspension or termination does not relieve Vendor of any payment obligations or accrued liabilities.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">RIGHT TO REFUSE SERVICE</h3>
            <p className="text-sm">Company reserves the right to limit or refuse service to anyone for any reason at any time.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">NO GUARANTEE AND DISCLAIMER OF WARRANTY</h3>
            <p className="text-sm">The Company does not guarantee, warrant, or represent any particular result from the use of the information on this website or of the products or services offered. The information provided on the Platform is for general information only, and You should not rely upon or use this information as the sole basis for making any personal, business or financial decisions. Use and reliance on the information provided on this Platform and of the products or services offered by the Company is at Your own risk. All of the Company's products and services are provided 'as is' and 'as available' for Your use, without any representation, warranties, or conditions of any kind, either express or implied, including all implied warranties or conditions of merchantability, merchantable quality, fitness for a particular purpose, durability, title, and non-infringement. You acknowledge and agree that your use of the information on this website and the products and services offered by the Company is at your sole risk.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">LIMITATION OF LIABILITY</h3>
            <p className="text-sm">Vendor acknowledges and agrees that the Company, it's owners, directors, officers, employees, affiliates, agents, contractors, suppliers, service providers, or licensors are not and will not be liable or responsible for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages for any reason whatsoever to Vendor while accessing this Platform or engaging in any transaction with the Company, or Your voluntary use of any products or services. With full knowledge and acceptance of the risks associated with accessing the Platform, engaging in any transaction, or using any product or service, Vendor hereby agrees to release, discharge, and hold harmless Company's owners, directors, officers, employees, affiliates, agents, contractors, suppliers, service providers, or licensors from any and all claims, demands, actions, or causes of action arising out of or relating to any loss, damage, or injury, including death, that may be sustained whether caused by the negligence of the Company or otherwise. Vendor acknowledges and agrees that this clause shall be binding on all Your heirs, assigns, and legal representatives.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">CLASS ACTION WAIVER</h3>
            <p className="text-sm">Vendor acknowledges and agrees that claims may only be pursued on an individual basis and not on a class, representative, or collective basis.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">INDEMNIFICATION</h3>
            <p className="text-sm">Vendor acknowledges and agrees to hereby release, discharge, and hold harmless Company, its owners, directors, officers, employees, affiliates, agents, contractors, suppliers, service providers, or licensors from any and all claims, demands, actions, or causes of action arising out of or relating to any loss, damage, or injury, including death, of a third party that may be sustained whether caused by the negligence of Company or otherwise. Vendor acknowledges and agrees that this clause shall be binding on all Your heirs, assigns, and legal representatives.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">DISPUTE RESOLUTION</h3>
            <p className="text-sm">Should any dispute arise to enforce these Terms and Conditions of Service; the parties agree to resolve the dispute using a third-party mediator or arbitrator as determined by Company. The successful or prevailing party or parties shall be entitled to recover reasonable attorneys' fees and other costs incurred in the action or proceeding, in addition to any other relief to which it or they may be entitled.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">SEVERABILITY</h3>
            <p className="text-sm">If any of the provisions of these Terms and Condition of Service are determined to be invalid under applicable law, they are, to that extent, deemed omitted. The invalidity of any portion of these Terms and Conditions of Service shall not render any other portion invalid.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">MODIFICATION OR TERMINATION</h3>
            <p className="text-sm">Company reserves the right to modify or terminate these Terms and Conditions of Service at any time without prior notice.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">COMPLETE TERMS</h3>
            <p className="text-sm">These Terms and Conditions of Service, to include any terms incorporated by reference by hyperlink, shall be the full and complete terms of accessing this Platform and engaging in any transaction with the Company.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">GOVERNING LAW</h3>
            <p className="text-sm">These Terms and Conditions of Service shall be construed, interpreted, and applied in accordance with the laws of the Commonwealth of Virginia.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">CONTACT INFORMATION</h3>
            <p className="text-sm">
              Questions about these Terms and Conditions of Service should be sent to the Company at{" "}
              <a
                href="mailto:info@mosaicbizhub.com"
                className="text-[#c9a227] hover:underline"
              >
                info@mosaicbizhub.com
              </a>
            </p>
          </div>
        </div>
      )
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{titles[type]}</h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {content[type]}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-md transition-colors bg-[#1e3a5f] text-white hover:bg-[#152a45]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
