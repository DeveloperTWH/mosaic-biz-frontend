import { MoveRight, UserRoundCog } from "lucide-react";
import Link from "next/link";

export default function BookServices() {
    const services = [
        { title: "SERVICE ONE", bgColor: "bg-custom-blue" },
        { title: "SERVICE TWO", bgColor: "bg-custom-yellow" },
        { title: "SERVICE THREE", bgColor: "bg-custom-orange" },
    ];

    return (
        <section className="relative bg-black text-white pt-12 overflow-hidden min-h-[100vh] md:pb-24 pb-5">
            {/* Background Image Positioned at Bottom */}
            <div className="absolute inset-x-0 bottom-0 z-0">
                <img
                    src="/hserv-background.png"
                    alt="Background"
                    className="w-full object-contain"
                />
            </div>

            <div className="w-[90%] mx-auto relative z-10">
                <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 heading" style={{ color: "white" }}>
                    BOOK YOUR SERVICES
                </h2>
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
                            <Link href="/your-service-page" className="inline-flex items-center gap-1 mt-4 text-white hover:underline text-[12px]">
                                Read More <MoveRight className="ml-1" size={14} />
                            </Link>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-8 mb-10">
                    <button className="px-10 py-2 mt-5 bg-custom-orange text-white">View All Services</button>
                </div>
            </div>
        </section>
    );
}
