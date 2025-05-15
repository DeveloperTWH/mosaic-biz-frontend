export default function HowWeWork() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center gap-6 w-screen my-12">
      <div className="w-4/5 flex">
        <div className="md:w-1/2 p-10 flex items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-2 uppercase heading">How We Work</h2>
          <hr className="h-[2px] w-[100px] bg-black mt-5" />
          <hr className="h-[2px] w-[100px] mt-[1px] mb-5 bg-black" />
          <div className="text-[13px] mb-10 mt-8">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem perferendis facere, atque praesentium minus labore magnam nemo molestiae ratione velit tempore reiciendis, nisi consectetur ipsum placeat? Pariatur fugit, cupiditate voluptate, dolorum quibusdam necessitatibus est repellendus quas eligendi vero consequatur. Accusantium fuga aliquid modi, non laboriosam maiores sapiente nemo. Facilis, obcaecati?
            </p>
            <p className="mt-8">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Soluta eum consequatur nulla possimus optio nesciunt vitae enim nihil deleniti asperiores!</p>
          </div>
          <button className="px-7 py-2 bg-custom-orange text-white">Read More</button>
          </div>
          
        </div>
        <img src="/HowWeWork/2149006867 1.png" alt="How We Work" className="w-full md:w-1/2 object-cover" />
      </div>

    </section>
  );
}