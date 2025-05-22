import { CheckCircle } from "lucide-react";

export default function InnovationDiversity() {
    return (
        <section className="w-full px-6 md:px-16 md:py-20 py-10 grid md:grid-cols-2 gap-5 ">

            <div className="relative w-full flex justify-center items-center">

                <div className="absolute top-[-18%] right-[30%] w-[110%] h-[95%] bg-sky-400 -z-10" />

                <img
                    src="/about/about 1.png"
                    alt="Team"
                    className="shadow-md w-full max-w-xl object-cover"
                />
            </div>
            {/* Text content */}
            <div className="py-10 md:px-10">
                <h2 className="text-3xl font-bold heading mb-2">INNOVATION AND DIVERSITY:</h2>
                <hr className="h-[2px] w-[120px] bg-green-900" />
                <hr className="h-[2px] w-[120px] bg-green-900 mt-[1px] mb-5" />
                <div className="mt-8 space-y-4 text-gray-700">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-700 min-w-[20px]" size={20} />
                        <p className="text-base font-medium">
                            Minority and women entrepreneurs bring unique perspectives and experiences to their businesses, leading to innovation and revitalization of industries.
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-700 min-w-[20px]" size={20} />
                        <p className="text-base font-medium">
                            Women and minority-owned businesses reflect the diversity of the U.S., contributing to a more inclusive and competitive marketplace.
                        </p>
                    </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mt-5">
                    "The Road To America's Economic Prosperity Runs Through Our Minority Business Communities," "We Must Continue To Ensure That Minority-Owned Business And The Entrepreneurs Behind Them Have The Tools, Resources, And Support They Need To Not Just Take Part In But Drive The Economic Success Of This Country." Deputy Commerce Secretary Don Graves.
                </p>
            </div>

        </section>
    );
}
