export default function Mission() {
  return (
    <section className="w-full py-10 md:py-20">
      <div className="container-page mx-auto grid w-full max-w-7xl gap-5 md:grid-cols-2">
        <div className="relative flex w-full items-center justify-center md:order-2">
          <img
            src="/about/mission.png"
            alt="Mission"
            className="w-full max-w-xl object-cover shadow-md"
          />
        </div>
        <div className="py-10 md:order-1 md:pl-10">
          <h2 className="market-section-heading mb-2 text-3xl">Mission:</h2>
          <div className="market-section-divider !mx-0 !mt-2 !mb-5 !w-28" />
          <p className="market-page-prose">
            Mosaic Biz Hub Aims To Maximize Minority-Owned And Women Businesses Through Economic Empowerment By Leveraging Mobile Technology And Creating A Geographical Commerce Tool To Connect Business Owners And Customers. The Platform Commits To Innovating How Customers Find And Connect With Minority-Owned And Women Businesses, Uplifting The Influences Of All People, Products, Brands, And Services To Support Growth, Advancement, And Liberation Through Unity. MBH Aims To Create An Ecosystem Where Businesses Thrive Through Authenticity, Empowerment, And Connectivity.
          </p>
          <p className="market-page-prose mt-10">
            By Listing Their Businesses On Mosaic Biz Hub Entrepreneurs Play A Vital Role In Promoting A. More Diverse And Inclusive Business Environment. Our Directory And Storefront Acts As A Catalyst For Economic Empowerment, Promoting Cultural Connections And Support Within Local Communities, While Also Amplifying The Presence Of Minority-Owned Companies Globally.
          </p>
        </div>
      </div>
    </section>
  );
}
