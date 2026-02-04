import { useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

interface FilterAccordionProps {
  onFilterChange?: (category: string, subCategory: string) => void;
}

type Section = {
  title: string;
  items?: string[];
  type?: "price";
};

const categorySubcategories = {
  "Fashion & Apparel": [
    "Men’s Clothing and Footwear",
    "Women’s Clothing and Footwear",
    "Kids & Baby Clothing and Footwear",
    "Bags, Jewellery & Accessories",
  ],
  "Beauty & Personal Care": [
    "Skincare Products",
    "Haircare Products",
    "Makeup & Cosmetics",
    "Grooming Products",
  ],
  "Home & Living": [
    "Home Décor & Art",
    "Bedding & Furnishings",
    "Kitchenware & Dining",
    "Storage & Organization",
    "Candles & Home Fragrance",
  ],
  "Health & Wellness Products": [
    "Vitamins & Supplements",
    "Herbal & Holistic Products",
    "Medical & Mobility Aids",
  ],
  "Handmade & Artisan Goods": [
    "Handcrafted Home Items",
    "Handmade Jewellery",
    "Art & Paintings",
    "Custom & Personalized Products",
    "Cultural & Heritage Crafts",
  ],
  "Baby, Kids & Family Products": [
    "Baby Essentials",
    "Toys & Games",
    "Educational Products",
    "Kids Room Products",
  ],
  "Tech, Gadgets & Accessories": [
    "Mobile & Computer Accessories",
    "Smart Home Devices",
    "Audio & Wearables",
  ],
  "Stationery, Gifts & Collectibles": [
    "Journals & Planners",
    "Corporate & Custom Gifts",
    "Collectibles & Memorabilia",
  ],
  "Automotive & Utility Products": [
    "Car Accessories",
    "Tools & Equipment",
    "Safety & Emergency Gear",
    "Travel & Utility Accessories",
  ],
  "Digital Products & Downloads": [
    "Online Courses & Workshops",
    "E-books & Guides",
    "Software & Productivity Tools",
  ],
};

function valuetext(value: number) {
  return `${value}°C`;
}

const FilterAccordion: React.FC<FilterAccordionProps> = ({ onFilterChange }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 700]);
  const [value, setValue] = useState<number[]>([20, 37]);

  const handleChange = (_event: Event, newValue: number[]) => {
    setValue(newValue);
  };

  const toggleSection = (index: number): void => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const sections: Section[] = [
    {
      title: "Products",
      items: Object.keys(categorySubcategories),
    },
    {
      title: "Sub Categories",
      items: selectedCategory
        ? categorySubcategories[
            selectedCategory as keyof typeof categorySubcategories
          ]
        : [],
    },
    {
      title: "Select Badge",
      items: ["Gold", "Silver", "Bronze"],
    },
    {
      title: "Price",
      type: "price",
    },
  ];

  return (
    <div className="filter-panel">
      <div className="filter-header">Filter</div>

      {sections.map((section, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={index}>
            <button
              type="button"
              className={`accordion-btn ${isOpen ? "active" : ""}`}
              onClick={() => toggleSection(index)}
            >
              {section.title}
            </button>

            <div
              className="accordion-content"
              style={{
                maxHeight: isOpen
                  ? section.type === "price"
                    ? "170px"
                    : `${section.items?.length! * 44}px`
                  : "0px",
              }}
            >
              {section.type === "price" ? (
                <div className="price-section">
                  <Box sx={{ width: 260 }}>
                    <Slider
                      getAriaLabel={() => "Temperature range"}
                      value={value}
                      onChange={handleChange}
                      valueLabelDisplay="auto"
                      getAriaValueText={valuetext}
                      style={{ color: "#C7A040" }}
                    />
                  </Box>

                  <div className="price-inputs justify-space">
                    <input
                      type="number"
                      value={priceRange[0]}
                      placeholder="Min"
                      onChange={(e) =>
                        setPriceRange([
                          Number(e.target.value),
                          priceRange[1],
                        ])
                      }
                    />
                    <span className="ml-10">to</span>
                    <input
                      className="ml-10"
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([
                          priceRange[0],
                          Number(e.target.value),
                        ])
                      }
                    />
                  </div>
                </div>
              ) : (
                <ul>
                  {section.items?.map((item, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        if (section.title === "Products") {
                          setSelectedCategory(item);
                          setSelectedSubCategory(null);
                          setOpenIndex(1);
                          console.log('Category clicked:', item);
                          onFilterChange?.(item, "");
                        }

                        if (section.title === "Sub Categories") {
                          setSelectedSubCategory(item);
                          console.log('Subcategory clicked:', item);
                          onFilterChange?.(selectedCategory || "", item);
                        }
                      }}
                      style={{
                        cursor:
                          section.title === "Products" ||
                          section.title === "Sub Categories"
                            ? "pointer"
                            : "default",
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FilterAccordion;
