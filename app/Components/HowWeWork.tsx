export default function HowWeWork() {
  return (
    <section className="flex flex-col md:flex-row items-center gap-6 w-[95%] mx-auto my-12">
      <div className="md:w-1/2">
        <h2 className="text-3xl font-semibold mb-4">How We Work</h2>
        <p className="text-gray-700 mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
        <button className="px-4 py-2 bg-orange-500 text-white rounded">Explore More</button>
      </div>
      <img src="/work-image.jpg" alt="How We Work" className="w-full md:w-1/2 object-cover" />
    </section>
  );
}