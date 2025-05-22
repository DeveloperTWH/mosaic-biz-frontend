export default function EconomicImpact() {
  return (
    <section className="bg-yellow-400 w-full py-10 px-6 md:px-16">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img src="/about/Frame.png" alt="Economic Impact" className="md:w-[50%]" />
        </div>

        {/* Text Section */}
        <div className="w-full md:w-1/2 py-10">
          <h2 className="text-3xl font-bold heading">ECONOMIC IMPACT</h2>
          <ul className="list-disc pl-5 mt-4 space-y-3 text-base md:text-lg font-semibold text-gray-800">
            <li>
              Minority Businesses Contribute Billions Of Dollars In Revenue Annually.
            </li>
            <li>
              They Are Significant Drivers Of Employment And Job Creation, Particularly In Local Communities.
            </li>
            <li>
              Supporting Minority Businesses Strengthens The Overall Economic Landscape And Contributes To Long-Term Competitiveness.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
