import { BookOpen } from "lucide-react";

export default function VendorStoriesComingSoon() {
  return (
    <section className="bg-market-bg px-4 py-16 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-4xl text-center">
        <div className="market-teal-soft mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-market-teal">
          <BookOpen className="h-7 w-7" aria-hidden />
        </div>
        <h2 className="market-section-heading">Vendor Stories</h2>
        <div className="market-section-divider" />
        <p className="mx-auto mt-4 max-w-2xl font-montserrat text-sm text-market-muted sm:text-base">
          Real vendor success stories are coming soon. We are collecting approved highlights from
          verified businesses on Mosaic Biz Hub.
        </p>
        <p className="mt-6 inline-block rounded-full border border-market-teal/30 bg-market-teal-soft px-4 py-2 text-xs font-semibold uppercase tracking-wide text-market-teal">
          Coming soon
        </p>
      </div>
    </section>
  );
}
