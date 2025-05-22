export default function HowWeWork() {
  return (
    <section className="flex flex-col items-center justify-center w-full my-12 px-4 sm:px-6 lg:px-12">
      <div className="md:w-4/5 max-w-7xl flex flex-col-reverse md:flex-row items-center gap-10">
        
        {/* Text Content */}
        <div className="w-full md:w-1/2">
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold mb-3 uppercase heading text-center md:text-left">
              How We Work
            </h2>
            <div className="flex flex-col items-center md:items-start mb-6">
              <hr className="h-[2px] w-[100px] bg-black" />
              <hr className="h-[2px] w-[100px] mt-[1px] bg-black" />
            </div>

            <div className="text-sm text-gray-700 space-y-6 mb-8 text-justify md:text-left">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem
                perferendis facere, atque praesentium minus labore magnam nemo molestiae ratione
                velit tempore reiciendis, nisi consectetur ipsum placeat? Pariatur fugit,
                cupiditate voluptate, dolorum quibusdam necessitatibus est repellendus quas
                eligendi vero consequatur. Accusantium fuga aliquid modi, non laboriosam maiores
                sapiente nemo. Facilis, obcaecati?
              </p>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Soluta eum consequatur
                nulla possimus optio nesciunt vitae enim nihil deleniti asperiores!
              </p>
            </div>

            <div className="flex justify-center md:justify-start">
              <button className="px-7 py-2 bg-custom-orange text-white shadow hover:bg-orange-600 transition duration-300">
                Read More
              </button>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="w-full md:w-1/2">
          <img
            src="/HowWeWork/2149006867 1.png"
            alt="How We Work"
            className="w-full h-auto object-cover rounded"
          />
        </div>
      </div>
    </section>
  );
}
