import Link from "next/link";

export default function AboutMinority() {
  return (
    <section
      className="relative py-32"
    // style={{
    //   backgroundImage: "url('/Subtract.png')",
    //   backgroundRepeat: "no-repeat",
    //   backgroundPosition: "right center",
    //   backgroundSize: "contain",
    // }}
    >
      <img
        src="/Subtract.png"
        alt=""
        className="absolute right-0 bottom-0 h-auto max-h-[100vh] w-auto object-contain z-0"
        style={{ transform: "scaleX(1)" }} // no flip or flip as you want
      />

      <div className="relative z-10 flex flex-col items-center w-4/5 gap-16 mx-auto md:flex-row">
        <img
          src="/about (2).png"
          alt="Minority Owned"
          className="object-cover w-full md:w-1/2"
        />
        <div className="md:w-[40%]">
          <h2 className="market-section-heading mb-4 text-2xl uppercase sm:text-3xl md:text-4xl">
            About Minority Owned Business
          </h2>
          <div className="market-section-divider md:mx-0" />
          <p className="mb-4 mt-5 text-[13px] text-market-text/85">
            Minority-owned businesses are the backbone of diverse, resilient communities. Mosaic Biz Hub is here to amplify their voices by providing a platform that showcases products, services, and stories. From food and fashion to tech and wellness, we empower business owners to thrive in the digital marketplace.
          </p>
          <p className="mb-4 mt-5 text-[13px] text-market-text/85">
            We believe every entrepreneur deserves visibility and access to opportunity. By listing your business, you join a growing network focused on growth, collaboration, and lasting success — all in one place.
          </p>
          <Link href="/about" className="px-4 py-3 mt-5 text-white bg-custom-orange ">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
