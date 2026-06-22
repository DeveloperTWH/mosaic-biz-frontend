import Image from "next/image";

const FEATURE_ACCENTS = [
  "bg-brand-sky",
  "bg-brand-yellow",
  "bg-brand-orange",
  "bg-brand-muted",
] as const;

export default function WhyChooseUs() {
  const features = [
    {
      title: "Skilled professionals",
      desc: "Connect with experienced business owners who take pride in delivering quality products and services tailored to your needs.",
    },
    {
      title: "Trusted community",
      desc: "Join a growing network of verified minority-owned businesses committed to excellence, trust, and mutual success.",
    },
    {
      title: "Digital visibility",
      desc: "We help you stand out online with tools that boost your reach, attract customers, and grow your brand effortlessly.",
    },
    {
      title: "Support that matters",
      desc: "From setup to scaling, we're here with resources and guidance to help your business thrive in the digital economy.",
    },
  ];

  return (
    <section className="bg-surface-panel py-16 text-brand-navy">
      <div className="container-page mx-auto max-w-6xl text-center">
        <h2 className="font-poppins text-2xl font-semibold uppercase tracking-wide text-brand-navy sm:text-3xl md:text-4xl">
          Why choose us
        </h2>
        <div className="mx-auto mt-3 h-0.5 w-16 bg-brand-gold" />
        <p className="mx-auto mt-4 max-w-2xl font-montserrat text-sm leading-relaxed text-brand-muted">
          We champion diversity and empower growth. Mosaic Biz Hub is built to support minority-owned
          businesses with tools, visibility, and community — focused on representation, inclusion, and
          real impact.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item, idx) => (
            <div
              key={item.title}
              className="market-card-light flex flex-col items-center p-6 text-center"
            >
              <div
                className={`mb-5 flex h-[70px] w-[70px] items-center justify-center rounded-lg ${FEATURE_ACCENTS[idx]}`}
              >
                <Image
                  src="/WhyUs/Why.png"
                  alt=""
                  width={45}
                  height={45}
                  className="brightness-0 invert"
                />
              </div>

              <h3 className="market-card-light-title mb-2 text-base uppercase tracking-wide">
                {item.title}
              </h3>
              <div className="mx-auto mb-3 h-0.5 w-12 bg-brand-gold" />
              <p className="market-card-light-body text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
