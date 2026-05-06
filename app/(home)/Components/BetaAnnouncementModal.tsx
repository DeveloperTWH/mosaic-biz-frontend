"use client";

import { useEffect, useState } from "react";

export default function BetaAnnouncementModal() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="bg-blue-900 px-6 py-5 text-white sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em]">
            Important Update
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Mosaic Biz Hub Is Currently in Beta Testing
          </h2>
        </div>

        <div className="px-6 py-6 text-[#1F2937] sm:px-8 sm:py-8">
          <p className="text-base leading-7 sm:text-lg">
            We&apos;re live, but not yet open for business just yet.
          </p>
          <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
            Vendor onboarding and site features are being tested through May 15.
            Contact{" "}
            <a
              href="mailto:info@MosaicBizHub.Com"
              className="font-semibold text-[#0F766E] underline underline-offset-4"
            >
              info@MosaicBizHub.Com
            </a>{" "}
            to join the beta test group, and become a founding vendor.
          </p>
          <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
            Thank you for helping us build a stronger platform before our official
            launch.
          </p>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-blue-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
