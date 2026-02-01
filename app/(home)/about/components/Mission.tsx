export default function Mission() {
  return (
    <section className="grid w-full gap-5 px-6 py-10 md:px-16 md:py-20 md:grid-cols-2 ">

        <div className="relative flex items-center justify-center w-full md:order-2">
        
        <div className="absolute top-[-18%] left-[30%] w-[110%] h-[95%] -z-10" />
        
        <img
          src="/about/mission.png"
          alt="Team"
          className="object-cover w-full max-w-xl shadow-md"
        />
      </div>
      {/* Text content */}
      <div className="py-10 md:pl-10 md:order-1">
        <h2 className="mb-2 text-3xl font-bold heading">Mission:</h2>
        <hr className="h-[2px] w-[120px] bg-green-900" />
        <hr className="h-[2px] w-[120px] bg-green-900 mt-[1px] mb-5" />
        <p className="text-sm leading-relaxed text-gray-700">
          Mosaic Biz Hub Aims To Maximize Minority-Owned And Women Businesses Through Economic Empowerment By Leveraging Mobile Technology And Creating A Geographical Commerce Tool To Connect Business Owners And Customers. The Platform Commits To Innovating How Customers Find And Connect With Minority-Owned And Women Businesses, Uplifting The Influences Of All People, Products, Brands, And Services To Support Growth, Advancement, And Liberation Through Unity. MBH Aims To Create An Ecosystem Where Businesses Thrive Through Authenticity, Empowerment, And Connectivity.
        </p>
        <p className="mt-10 text-sm leading-relaxed text-gray-700">
          By Listing Their Businesses On Mosaic Biz Hub Entrepreneurs Play A Vital Role In Promoting A. More Diverse And Inclusive Business Environment. Our Directory And Storefront Acts As A Catalyst For Economic Empowerment, Promoting Cultural Connections And Support Within Local Communities, While Also Amplifying The Presence Of Minority-Owned Companies Globally.
        </p>
      </div>
      
    </section>
  );
}
