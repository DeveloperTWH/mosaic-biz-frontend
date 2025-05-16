// components/filters/FilterSidebar.tsx
import FilterSection from "./FilterSection";
import PriceRangeSlider from "./PriceRangeSlider";
import CheckboxGroup from "./CheckboxGroup";

const FilterSidebar = () => {
  return (
    <aside className="w-full md:w-64 bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-gray-800">
      <FilterSection title="CATEGORY">
        <CheckboxGroup options={["Top Wear", "Shirt", "T-Shirt"]} />
      </FilterSection>

      <FilterSection title="GENDER">
        <CheckboxGroup options={["Men", "Women", "Unisex"]} />
      </FilterSection>

      <FilterSection title="PRICE">
        <PriceRangeSlider min={0} max={700} />
      </FilterSection>

      <FilterSection title="BRAND">
        <CheckboxGroup options={["Allen Solly", "U.S. POLO ASSN.", "Peter England", "Levi's", "More..."]} />
      </FilterSection>

      <FilterSection title="SIZE">
        <CheckboxGroup options={["L", "M", "S", "XL", "XS", "2XL"]} />
      </FilterSection>

      <FilterSection title="CUSTOMER RATINGS">
        <CheckboxGroup options={["4★ & Above", "3★ & Above"]} />
      </FilterSection>

      <FilterSection title="COLOR">
        <CheckboxGroup options={["Beige", "Black", "Blue", "Brown", "Cream", "Dark Blue"]} />
      </FilterSection>

      <FilterSection title="NEW ARRIVALS">
        <CheckboxGroup options={["Last 30 Days", "Last 90 Days"]} />
      </FilterSection>

      <FilterSection title="OCCASION">
        <CheckboxGroup options={["Beach Wear", "Casual", "Formal", "Party", "Sports"]} />
      </FilterSection>

      <FilterSection title="AVAILABILITY">
        <CheckboxGroup options={["In Stock", "Out of Stock"]} />
      </FilterSection>
    </aside>
  );
};

export default FilterSidebar;
