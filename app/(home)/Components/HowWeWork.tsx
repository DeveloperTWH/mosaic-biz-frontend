import Link from "next/link";

export default function HowWeWork() {
  return (
    <section className="flex flex-col items-center justify-center w-full px-4 my-12 sm:px-6 lg:px-12">
      <div className="flex flex-col-reverse items-center gap-10 md:w-4/5 max-w-7xl md:flex-row">
        
        {/* Text Content */}
        <div className="w-full md:w-1/2">
          <div>
            <h2 className="market-section-heading mb-3 text-center uppercase md:text-left">
              How We Work
            </h2>
            <div className="market-section-divider md:mx-0" />

            <div className="mb-8 space-y-6 text-justify text-sm text-market-text/85 md:text-left">
              <p>
                At Mosaic Biz Hub, we make it easy for minority-owned businesses to connect with customers and grow. Our platform allows you to list your products or services, reach new audiences, and build your brand with confidence. Whether you're selling food, offering services, or promoting events, we give you the tools to shine in the digital space.
              </p>
              <p>
                Joining is simple. Create a profile, showcase what makes your business unique, and start connecting with a supportive, engaged community ready to support and celebrate your success.
              </p>
            </div>

            <div className="flex justify-center md:justify-start">
              <Link href={"/about"} className="py-2 text-white transition duration-300 shadow px-7 bg-custom-orange hover:bg-orange-600">
                Read More
              </Link>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="w-full md:w-1/2">
          <img
            src="/HowWeWork/2149006867 1.png"
            alt="How We Work"
            className="object-cover w-full h-auto rounded"
          />
        </div>
      </div>
    </section>
  );
}
