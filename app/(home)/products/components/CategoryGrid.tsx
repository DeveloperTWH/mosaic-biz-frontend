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
    <section className="px-6 mx-auto max-w-7xl">
      <h2 className="mt-6 mb-6 text-xl font-bold text-center md:text-2xl heading">Browse by Category</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products/${cat.slug}`}
            className="p-4 text-center transition border rounded hover:shadow"
          >
            <div className="mb-2 text-3xl">{cat.icon}</div>
            <div className="text-sm font-medium md:text-base">{cat.name}</div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
