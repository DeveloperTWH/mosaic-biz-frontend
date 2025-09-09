type Subcategory = { _id: string; name: string; slug: string };

type Filters = {
  brand: string;
  minPrice: number;
  maxPrice: number;
  subcategory?: string;   // we'll render this control
  minorityType?: string;
  size?: string;
  color?: string;         // kept optional (no UI control rendered)
};

type Props = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  subcategories: Subcategory[];   // ✅ provide from parent
};

export default function FilterSidebar({ filters, setFilters, subcategories }: Props) {
  return (
    <aside className="w-full space-y-4 bg-white sm:w-1/2 md:w-1/3 lg:w-1/4">
      <div className="w-full p-4 border rounded">

        {/* Brand */}
        <div>
          <label className="block mb-1 font-semibold">Brand</label>
          <input
            type="text"
            value={filters.brand}
            onChange={(e) => setFilters((f) => ({ ...f, brand: e.target.value }))}
            className="w-full p-2 border rounded"
            placeholder="Search brand"
          />
        </div>

        {/* Size */}
        {subcategories.length != 0 &&
          <div>
            <label className="block mb-1 font-semibold">Subcategory</label>
            <select
              value={filters.subcategory ?? ""}
              onChange={(e) => setFilters((f) => ({ ...f, subcategory: e.target.value }))}
              className="w-full p-2 border rounded"
            >
              <option value="">All</option>
              {subcategories.map((s) => (
                <option key={s._id} value={s.slug}>{s.name}</option>
              ))}
            </select>
          </div>
        }

        {/* Size */}
        <div>
          <label className="block mb-1 font-semibold">Size</label>
          <select
            value={filters.size ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, size: e.target.value }))}
            className="w-full p-2 border rounded"
          >
            <option value="">All</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
          </select>
        </div>

        {/* Price (max only as in your UI) */}
        <div>
          <label className="block mb-1 font-semibold">Price</label>
          <input
            type="range"
            min={0}
            max={1000}
            value={filters.maxPrice}
            onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))}
            className="w-full"
          />
          <span className="block mt-1 text-sm">Up to ${filters.maxPrice}</span>
        </div>
      </div>
    </aside>
  );
}
