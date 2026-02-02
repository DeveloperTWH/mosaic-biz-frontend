export default function PricingBar() {
  const plans = [
    {
      name: "Silver",
      description: "For small businesses starting their online presence",
      price: "$239.99",
      features: [
        "5 products",
        "3 services",
        "2 foods",
        "3 images",
        "1 video",
        "Community events",
        "Push notifications",
      ],
      missing: ["No analytics dashboard", "No AI recommendations"],
      buttonStyle: "bg-indigo-900 text-white",
    },
    {
      name: "Gold",
      description: "For growing businesses that need more visibility",
      price: "$479.99",
      recommended: true,
      features: [
        "10 products",
        "5 services",
        "5 foods",
        "10 images",
        "2 videos",
        "Marketing tools",
        "Featured placement",
        "Search priority",
        "AI recommendations",
      ],
      buttonStyle: "bg-yellow-500 text-white",
    },
    {
      name: "Platinum",
      description: "For Premium Brands And High-Visibility Businesses",
      price: "$959.99",
      features: [
        "20 products",
        "15 services",
        "10 foods",
        "10 images",
        "2 videos",
        "All Standard features + top-tier placement & visibility",
      ],
      buttonStyle: "bg-indigo-900 text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-6xl mx-auto text-center mb-14">
        <h1 className="text-3xl font-bold text-gray-900">
          FIND YOUR PERFECT PLAN
        </h1>
        <p className="text-gray-500 mt-2">
          Compare features and choose a tier that scales with you
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl bg-white p-8 shadow-sm border ${
              plan.recommended
                ? "border-yellow-400 shadow-lg"
                : "border-gray-200"
            }`}
          >
            {plan.recommended && (
              <div className="absolute top-0 right-0">
                <span className="bg-purple-600 text-white text-xs font-semibold px-4 py-1 rounded-bl-xl rounded-tr-xl">
                  RECOMMENDED
                </span>
              </div>
            )}

            <h2 className="text-xl font-bold text-indigo-900">
              {plan.name}
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              {plan.description}
            </p>

            <div className="mt-6">
              <span className="text-3xl font-bold text-indigo-900">
                {plan.price}
              </span>
              <span className="text-gray-500 text-sm"> /year</span>
            </div>

            <button
              className={`w-full mt-6 py-3 rounded-lg font-semibold transition hover:opacity-90 ${plan.buttonStyle}`}
            >
              Choose Plan
            </button>

            <ul className="mt-8 space-y-3 text-left">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="text-yellow-500">✔</span>
                  <span className="text-gray-700 text-sm">
                    {feature}
                  </span>
                </li>
              ))}

              {plan.missing?.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="text-red-500">✖</span>
                  <span className="text-gray-500 text-sm">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
