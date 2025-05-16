import Image from "next/image";

export default function WhyChooseUs() {
    const features = [
        { title: "SKILLED PROFESSIONALS", desc: "Lorem Ipsum Dolor Sit Amet Dolo Tadipisicing Elitsed Eiusmod Temporond Enim Minim Veniam Quis Notru", color: "#16A1C0" },
        { title: "SKILLED PROFESSIONALS", desc: "Lorem Ipsum Dolor Sit Amet Dolo Tadipisicing Elitsed Eiusmod Temporond Enim Minim Veniam Quis Notru", color: "#F9AE53" },
        { title: "SKILLED PROFESSIONALS", desc: "Lorem Ipsum Dolor Sit Amet Dolo Tadipisicing Elitsed Eiusmod Temporond Enim Minim Veniam Quis Notru", color: "#CE5F44" },
        { title: "SKILLED PROFESSIONALS", desc: "Lorem Ipsum Dolor Sit Amet Dolo Tadipisicing Elitsed Eiusmod Temporond Enim Minim Veniam Quis Notru", color: "grey" },
    ];

    return (
        <section className="bg-[#F5F5F5] py-16">
            <div className="w-4/5 mx-auto text-center">
                <h2 className="text-3xl font-semibold mb-2 heading">WHY CHOOSE US</h2>
                <hr className="h-[2px] w-[100px] mx-auto bg-green-900" />
                <hr className="h-[2px] w-[100px] mx-auto mt-[1px] mb-8 bg-green-900" />
                <p className="text-[12px] text-gray-600 max-w-xl mx-auto mb-12">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit, optio eveniet consectetur ut cupiditate dignissimos, distinctio illo reiciendis nulla nemo libero doloribus repudiandae. Placeat, quia.
                </p>

                <div className="grid md:grid-cols-4 gap-8">
                    {features.map((item, idx) => (
                        <div key={idx} className="bg-white shadow p-6 rounded hover:shadow-lg transition-all">
                            <div className="flex justify-center items-center mb-6">
                                <div style={{ "backgroundColor": item.color }} className="w-[70px] flex justify-center items-center h-[70px]">
                                    <img src="/WhyUs/Why.png" alt="Why Us Image" width={45} height={45} className="filter brightness-0 invert" />
                                </div>
                            </div>

                            <h3
                                style={{ fontFamily: "Roboto Slab", fontWeight: "700" }}
                                className="text-xl font-semibold mb-1"
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
