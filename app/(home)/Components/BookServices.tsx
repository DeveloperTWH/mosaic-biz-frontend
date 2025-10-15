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
          className="object-contain w-full"
        />
      </div>

      <div className="w-[90%] mx-auto relative z-10">
        <h2
          className="mb-2 text-2xl font-semibold text-center sm:text-3xl md:text-4xl heading"
          style={{ color: "white" }}
        >
          BOOK YOUR SERVICES
        </h2>
        <hr className="h-[2px] w-[100px] mx-auto" />
        <hr className="h-[2px] w-[100px] mx-auto mt-[1px] mb-5" />
        <div className="mx-auto w-1/2 text-[13px] text-center mb-10">
          <p>
            Discover skilled professionals in your community. From expert care to reliable solutions, find and book the services you need — all in just a few clicks. Support local. Book with confidence.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-[95%] mx-auto">
          {services.map((service, i) => (
            <div
              key={i}
              className={`px-10 py-10 text-center text-white rounded ${service.bgColor}`}
            >
              <div>
                <UserRoundCog className="w-16 h-16 mx-auto mb-10" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{service.title}</h3>
              <p className="text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elitsed
                eiusmod tempor enim minim veniam quis notru exercit ation Lorem
                ipsum dolor sit amet.
              </p>
              <Link
                href="/your-service-page"
                className="inline-flex items-center gap-1 mt-4 text-white hover:underline text-[12px]"
              >
                Read More <MoveRight className="ml-1" size={14} />
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-8 mb-10 text-center">
          <Link
            href="/services"
            className="inline-block px-10 py-2 mt-5 text-white bg-custom-orange"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
