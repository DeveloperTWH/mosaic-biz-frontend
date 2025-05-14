import { UserRoundCog } from "lucide-react";

export default function BookServices() {
    const services = [
        { title: "SERVICE ONE", bgColor: "bg-sky-500" },
        { title: "SERVICE TWO", bgColor: "bg-yellow-500" },
        { title: "SERVICE THREE", bgColor: "bg-orange-700" },
    ];

    return (
        <section className="relative bg-black text-white pt-12">
            <div className="w-[90%] mx-auto relative z-10">
                <h2 className="text-center text-3xl font-semibold mb-2">BOOK YOUR SERVICES</h2>
                <hr className="h-[2px] w-[100px] mx-auto" />
                <hr className="h-[2px] w-[100px] mx-auto mt-[1px] mb-5" />
                <div className="mx-auto w-1/2 text-[13px] text-center mb-10">
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elitsed eiusmod tempor enim minim veniam
                        quis notru exercit ation Lorem ipsum dolor sit amet. Veniam quis notru exercit.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-[95%] mx-auto">
                    {services.map((service, i) => (
                        <div
                            key={i}
                            className={`px-10 py-10 text-center text-white rounded ${service.bgColor}`}
                        >
                            <div>
                                <UserRoundCog className="mx-auto mb-10 w-16 h-16" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                            <p className="text-sm">
                                Lorem ipsum dolor sit amet consectetur adipisicing elitsed eiusmod tempor enim minim
                                veniam quis notru exercit ation Lorem ipsum dolor sit amet.
                            </p>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <button className="px-10 py-2 mt-5 bg-orange-500 text-white">View All Services</button>
                </div>
            </div>

            {/* Triangle White Area */}
            <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none z-0">
                <div
                    className="absolute bottom-0 left-0 w-full h-full"
                    style={{
                        clipPath: " polygon(25% 100%, 20% 91%, 0% 100%)",
                        WebkitClipPath: " polygon(25% 100%, 20% 91%, 0% 100%)",
                        backgroundColor: "white",
                    }}
                />
            </div>

            {/* Clipped image */}
            <img
                src="/Group 42.png"
                alt="clip path"
                className="w-full h-auto relative z-10"
                style={{
                    clipPath:
                        "polygon(20% 58%, 100% 0px, 100% 100%, 25% 100%, 20% 58%, 0px 100%, 0px 0px)",
                    WebkitClipPath:
                        "polygon(20% 58%, 100% 0px, 100% 100%, 25% 100%, 20% 58%, 0px 100%, 0px 0px)",
                }}
            />
        </section>
    );
}
