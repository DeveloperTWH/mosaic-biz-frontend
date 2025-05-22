import Image from "next/image";

export default function CommunityDevelopment() {
  return (
    <section className="w-full px-6 md:px-16 py-16 text-center">
      {/* Heading */}
      <h2 className="text-3xl font-bold mb-4 heading">COMMUNITY DEVELOPMENT:</h2>
      <hr className="h-[2px] w-[120px] bg-green-900 mx-auto" />
      <hr className="h-[2px] w-[120px] bg-green-900 mt-[1px] mb-10 mx-auto" />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Card 1 */}
        <div className="p-8 bg-gray-100 rounded-2xl shadow-md flex flex-col items-center text-center">
          <Image
            src="/about/icon1.png"
            alt="Underserved communities"
            width={60}
            height={60}
            className="mb-10"
          />
          <p className="text-base font-medium text-gray-700">
            Minority businesses often operate in underserved communities and provide much-needed goods and services.
          </p>
        </div>

        {/* Card 2 - Highlighted */}
        <div className="p-8 bg-orange-400 text-white rounded-2xl shadow-lg flex flex-col items-center text-center">
          <Image
            src="/about/shuttle 1.png"
            alt="Local economy support"
            width={50}
            height={50}
            className="mb-10"
          />
          <p className="text-base font-semibold">
            Supporting these businesses can help boost the local economy and create jobs in the area.
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-8 bg-gray-100 rounded-2xl shadow-md flex flex-col items-center text-center">
          <Image
            src="/about/sociology 1.png"
            alt="Social impact"
            width={60}
            height={60}
            className="mb-10"
          />
          <p className="text-base font-medium text-gray-700">
            Working with women and minority-owned businesses demonstrates a commitment to social impact and corporate responsibility.
          </p>
        </div>
      </div>
    </section>
  );
}
