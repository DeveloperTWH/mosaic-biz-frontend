export default function AboutContent() {
  return (
    <section className="w-full px-6 md:px-16 md:py-20 py-10 grid md:grid-cols-2 gap-5 ">

      <div className="relative w-full flex justify-center items-center md:order-2">

        <div className="absolute top-[-18%] left-[30%] w-[110%] h-[95%] bg-sky-400 -z-10" />

        <img
          src="/about/about 1.png"
          alt="Team"
          className="shadow-md w-full max-w-xl object-cover"
        />
      </div>
      {/* Text content */}
      <div className="py-10 md:pl-10 md:order-1">
        <h2 className="text-3xl mb-2 font-bold heading">ABOUT US</h2>
        <hr className="h-[2px] w-[120px] bg-green-900" />
        <hr className="h-[2px] w-[120px] bg-green-900 mt-[1px] mb-5" />
        <p className="text-sm text-gray-700 leading-relaxed">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sunt sit autem commodi, nihil necessitatibus quidem rem culpa! Dignissimos provident, error sapiente voluptatibus repellat nulla delectus inventore deleniti ratione consequatur, at doloribus! Accusantium natus, impedit commodi facilis omnis quibusdam nostrum libero nam quos possimus porro recusandae dignissimos fugit ea at repellendus?
        </p>
        <p className="text-sm text-gray-700 leading-relaxed mt-10">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias ducimus minima dolores id libero eligendi vero doloribus minus deserunt, dolore quis sunt nulla nihil excepturi maiores sed possimus vel impedit placeat accusantium nobis optio eius quam. Iure quisquam voluptatem necessitatibus perferendis ab aspernatur, aliquam, debitis iste quis ea, illo sapiente?
        </p>
      </div>

    </section>
  );
}
