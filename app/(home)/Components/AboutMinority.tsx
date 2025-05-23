export default function AboutMinority() {
  return (
    <section
      className="relative py-32"
    // style={{
    //   backgroundImage: "url('/Subtract.png')",
    //   backgroundRepeat: "no-repeat",
    //   backgroundPosition: "right center",
    //   backgroundSize: "contain",
    // }}
    >
      <img
        src="/Subtract.png"
        alt=""
        className="absolute right-0 bottom-0 h-auto max-h-[100vh] w-auto object-contain z-0"
        style={{ transform: "scaleX(1)" }} // no flip or flip as you want
      />

      <div className="flex flex-col md:flex-row items-center gap-16 w-4/5 mx-auto z-10 relative">
        <img
          src="/about.png"
          alt="Minority Owned"
          className="w-full md:w-1/2 object-cover"
        />
        <div className="md:w-[40%]">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 uppercase heading">
            About Minority Owned Business
          </h2>
          <hr className="h-[2px] w-[100px] bg-green-900" />
          <hr className="h-[2px] w-[100px] bg-green-900 mt-[1px]" />
          <p className="text-gray-700 mb-4 text-[13px] mt-5">
            Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Nullam
            Laoreet, Diam Sit Amet Porta Eleifend, Turpis Justo Maximus Eros,
            Rhoncus Ullamcorper Mi Tortor Et Libero. Maecenas Lacinia Lorem
            Ultrices Ligula Mollis Accumsan Dictum Ut Eros. Ut Varius A Nunc Vel
            Vestibulum. Cras Dignissim Consequat Sapien Et Viverra. Mauris A
            Ipsum Id Urna Interdum Pretium.
          </p>
          <p className="text-gray-700 mb-4 text-[13px] mt-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus minus
            quae laudantium, qui dignissimos, voluptate exercitationem labore
            distinctio, aperiam voluptas nostrum cumque accusamus vel et maiores
            molestiae soluta repellat quasi?
          </p>
          <button className="px-4 py-2 mt-5 bg-custom-orange text-white ">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
