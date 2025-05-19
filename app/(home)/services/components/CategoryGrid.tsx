import Link from "next/link";

const categories = [
  { name: "Home Care Service", slug: "home-care-service", icon: "🏠" },
  { name: "Fashion", slug: "fashion", icon: "👗" },
  { name: "Skin & Beauty Treatment", slug: "skincare-service", icon: "💆" },
  { name: "Pet Care", slug: "pet-care", icon: "🐶" },
  { name: "Professional Services", slug: "professional", icon: "📋" },
  { name: "Automotive", slug: "automotive", icon: "🚗" },
  { name: "Tour & Travel", slug: "tour-travel", icon: "✈️" },
  { name: "Construction", slug: "construction", icon: "🏗️" },
  { name: "Finance Services", slug: "finance", icon: "💰" },
  { name: "More", slug: "more", icon: "➕" }, // Added icon
];

const CategoryGrid = () => {
  return (
    <section className="px-6 max-w-7xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-6 heading">Browse Service by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/services/${cat.slug}`}
            className="border p-4 rounded text-center hover:shadow transition"
          >
            <div className="text-3xl mb-2">{cat.icon}</div>
            <div className="text-sm md:text-base font-medium">{cat.name}</div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
