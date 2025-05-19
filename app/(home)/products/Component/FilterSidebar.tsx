type Props = {
    filters: any;
    setFilters: (filters: any) => void;
  };
  
  export default function FilterSidebar({ filters, setFilters }: Props) {
    return (
      <aside className="w-1/4 border p-4 rounded space-y-4">
        <div>
          <label className="font-semibold block mb-1">Gender</label>
          <select
            value={filters.gender}
            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">All</option>
            <option value="Male">Men</option>
            <option value="Female">Women</option>
          </select>
        </div>
  
        <div>
          <label className="font-semibold block mb-1">Brand</label>
          <input
            type="text"
            value={filters.brand}
            onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Search brand"
          />
        </div>
  
        <div>
          <label className="font-semibold block mb-1">Size</label>
          <select
            value={filters.size}
            onChange={(e) => setFilters({ ...filters, size: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">All</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
          </select>
        </div>
  
        <div>
          <label className="font-semibold block mb-1">Color</label>
          <select
            value={filters.color}
            onChange={(e) => setFilters({ ...filters, color: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">All</option>
            <option value="Red">Red</option>
            <option value="Blue">Blue</option>
            <option value="Black">Black</option>
          </select>
        </div>
  
        <div>
          <label className="font-semibold block mb-1">Price</label>
          <input
            type="range"
            min="0"
            max="1000"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
          />
          <span className="block mt-1 text-sm">Up to ${filters.maxPrice}</span>
        </div>
      </aside>
    );
  }
  