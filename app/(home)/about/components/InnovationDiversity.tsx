import { CheckCircle } from "lucide-react";

export default function InnovationDiversity() {
  return (
    <section className="w-full py-10 md:py-20">
      <div className="container-page mx-auto grid w-full max-w-7xl gap-5 md:grid-cols-2">
        <div className="relative flex w-full items-center justify-center">
          <img
            src="/about/inovation.png"
            alt="Innovation and diversity"
            className="w-full max-w-xl object-cover shadow-md"
          />
        </div>
        <div className="py-10 md:px-10">
          <h2 className="market-section-heading mb-2 text-3xl">INNOVATION AND DIVERSITY:</h2>
          <div className="market-section-divider !mx-0 !mt-2 !mb-5 !w-28" />
          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="min-w-[20px] shrink-0 text-market-teal" size={20} aria-hidden />
              <p className="market-page-prose-muted text-base font-medium">
                Minority and women entrepreneurs bring unique perspectives and experiences to their businesses, leading to innovation and revitalization of industries.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="min-w-[20px] shrink-0 text-market-teal" size={20} aria-hidden />
              <p className="market-page-prose-muted text-base font-medium">
                Women and minority-owned businesses reflect the diversity of the U.S., contributing to a more inclusive and competitive marketplace.
              </p>
            </div>
          </div>
          <p className="market-page-prose-muted mt-5">
            "The Road To America's Economic Prosperity Runs Through Our Minority Business Communities," "We Must Continue To Ensure That Minority-Owned Business And The Entrepreneurs Behind Them Have The Tools, Resources, And Support They Need To Not Just Take Part In But Drive The Economic Success Of This Country." Deputy Commerce Secretary Don Graves.
          </p>
        </div>
      </div>
    </section>
  );
}
