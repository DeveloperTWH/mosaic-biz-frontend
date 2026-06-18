export default function AboutContent() {
  return (
    <section className="w-full py-10 md:py-20">
      <div className="container-page mx-auto grid w-full max-w-7xl gap-5 md:grid-cols-2">
        <div className="relative flex w-full items-center justify-center overflow-hidden md:order-2">
          <img
            src="/about/aboutUsSection.png"
            alt="Team"
            className="w-full max-w-xl object-cover shadow-md"
          />
        </div>
        <div className="py-10 md:order-1 md:pl-10">
          <h2 className="market-section-heading mb-2 text-3xl">About Us</h2>
          <div className="market-section-divider !mx-0 !mt-2 !w-28" />
          <p className="market-page-prose-muted mt-4">
            Mosaic Biz Hub was found with a single vision: to empower minority-owned businesses and provide them with success in the digital age. We think every business has a story—and every story should be heard.
          </p>
          <p className="market-page-prose-muted mt-5">
            Started by Bryan Harris, Mosaic Biz Hub aims to bridge the gap. Minority entrepreneurs fought to get noticed, had fewer opportunities, and were hindered by obstacles that prevented them from achieving their full potential. We wanted to make that happen.
          </p>
          <p className="market-page-prose-muted mt-5">
            Now, Mosaic Biz Hub is more than a platform—it's an ecosystem. A place where businesses can reach out to customers, express their culture, and develop with the support they should have.
          </p>
          <p className="market-page-prose-muted mt-5">
            So, what sets us apart? We don't merely list businesses. We highlight their voices, their traditions, and the impact they make in their communities. Our platform brings together restaurants, services, products, and more—all under one digital roof that is proud to celebrate diversity.
          </p>
        </div>
      </div>
    </section>
  );
}
