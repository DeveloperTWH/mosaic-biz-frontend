export default function AboutContent() {
  return (
    <section className="grid w-full gap-5 px-6 py-10 md:px-16 md:py-20 md:grid-cols-2 ">

      <div className="relative flex items-center justify-center w-full md:order-2">

        <div className="absolute top-[-18%] left-[30%] w-[110%] h-[95%]  -z-10" />

        <img
          src="/about/aboutUsSection.png"
          alt="Team"
          className="object-cover w-full max-w-xl shadow-md"
        />
      </div>
      {/* Text content */}
      <div className="py-10 md:pl-10 md:order-1">
        <h2 className="mb-2 text-3xl font-bold heading">ABOUT US</h2>
        <hr className="h-[2px] w-[120px] bg-green-900" />
        <hr className="h-[2px] w-[120px] bg-green-900 mt-[1px] mb-5" />
        <p className="text-sm leading-relaxed text-gray-700">
          Mosaic Biz Hub was found with a single vision: to empower minority-owned businesses and provide them with success in the digital age. We think every business has a story—and every story should be heard.
        </p>
        <p className="mt-5 text-sm leading-relaxed text-gray-700">
          Started by Bryan Harris, Mosaic Biz Hub aims to bridge the gap. Minority entrepreneurs fought to get noticed, had fewer opportunities, and were hindered by obstacles that prevented them from achieving their full potential. We wanted to make that happen. 
        </p>
        <p className="mt-5 text-sm leading-relaxed text-gray-700">
          Now, Mosaic Biz Hub is more than a platform—it's an ecosystem. A place where businesses can reach out to customers, express their culture, and develop with the support they should have. 
        </p>
        <p className="mt-5 text-sm leading-relaxed text-gray-700">
          So, what sets us apart? We don't merely list businesses. We highlight their voices, their traditions, and the impact they make in their communities. Our platform brings together restaurants, services, products, and more—all under one digital roof that is proud to celebrate diversity. 

        </p>
      </div>

    </section>
  );
}
