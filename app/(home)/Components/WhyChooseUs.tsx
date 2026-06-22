import Image from "next/image";

export default function WhyChooseUs() {
    const features = [
        { title: "SKILLED PROFESSIONALS", desc: "Connect with experienced business owners who take pride in delivering quality products and services tailored to your needs.", color: "#16A1C0" },
        { title: "TRUSTED COMMUNITY", desc: "Join a growing network of verified minority-owned businesses committed to excellence, trust, and mutual success.", color: "#F9AE53" },
        { title: "DIGITAL VISIBILITY", desc: "We help you stand out online with tools that boost your reach, attract customers, and grow your brand effortlessly.", color: "#CE5F44" },
        { title: "SUPPORT THAT MATTERS", desc: "From setup to scaling, we’re here with resources and guidance to help your business thrive in the digital economy.", color: "grey" },
    ];

    return (
        <section className="bg-[#F5F5F5] py-16 text-brand-navy">
            <div className="w-4/5 mx-auto text-center">
                <h2 className="mb-2 text-2xl font-semibold sm:text-3xl md:text-4xl heading">WHY CHOOSE US</h2>
                <hr className="h-[2px] w-[100px] mx-auto bg-green-900" />
                <hr className="h-[2px] w-[100px] mx-auto mt-[1px] mb-8 bg-green-900" />
                <p className="text-[12px] text-gray-600 mx-auto">
                    We champion diversity and empower growth. Mosaic Biz Hub is built to support minority-owned businesses with tools, visibility, and community. Unlike generic platforms, we focus on representation, inclusion, and real impact.
                </p>
                <p className="text-[12px] text-gray-600 mx-auto mb-12">
                    Choose us because your business deserves to be seen — and supported.
                </p>

                <div className="grid gap-8 md:grid-cols-4">
                    {features.map((item, idx) => (
                        <div key={idx} className="p-6 transition-all bg-white rounded shadow hover:shadow-lg">
                            <div className="flex items-center justify-center mb-6">
                                <div style={{ "backgroundColor": item.color }} className="w-[70px] flex justify-center items-center h-[70px]">
                                    <img src="/WhyUs/Why.png" alt="Why Us Image" width={45} height={45} className="filter brightness-0 invert" />
                                </div>
                            </div>

                            <h3
                                style={{ fontFamily: "Roboto Slab", fontWeight: "700" }}
                                className="mb-1 text-xl font-semibold"
                            >
                                {item.title}
                            </h3>
                            
                <hr className="h-[2px] w-[50px] mx-auto bg-custom-yellow mb-3" />
                            <p className="text-gray-600 text-[12px] leading-5">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
