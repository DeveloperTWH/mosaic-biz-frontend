import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Category, SubCategory, CategoryResponse, SubCategoryResponse } from "@/types/Category";
import { PUBLIC_BADGE_FILTER_OPTIONS } from "../../Components/publicSearch";

interface FilterAccordionProps {
  onFilterChange?: (category: string, subCategory: string) => void;
  selectedCategory?: Category | null;
  onCategoryChange?: (category: Category) => void;
  onCategorySelect?: (categoryId: string) => void;
  onSubcategorySelect?: (subcategoryId: string) => void;
  onBadgeSelect?: (badge: string) => void;
  onPriceChange?: (min: number, max: number) => void;
}

type Section = {
  title: string;
  items?: string[];
  type?: "price";
};

function valuetext(value: number) {
  return `${value}`;
}

const FilterAccordion: React.FC<FilterAccordionProps> = ({
  onFilterChange,
  selectedCategory: externalSelectedCategory,
  onCategoryChange,
  onCategorySelect,
  onSubcategorySelect,
  onBadgeSelect,
  onPriceChange
}) => {

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 700]);
  const [value, setValue] = useState<number[]>([20, 37]);

  useEffect(() => {
    if (externalSelectedCategory && externalSelectedCategory !== selectedCategory) {
      setSelectedCategory(externalSelectedCategory);
      setSelectedSubCategory(null);
      setOpenIndex(1);
      fetchSubcategories(externalSelectedCategory._id);
    }
  }, [externalSelectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/products`);
        const data: CategoryResponse = await response.json();
        setCategories(data?.data?.productCategories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const fetchSubcategories = async (categoryId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/subcategories/${categoryId}`);
      const data: SubCategoryResponse = await response.json();
      setSubcategories(data?.data || []);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      setSubcategories([]);
    }
  };

  const handleChange = (_event: Event, newValue: number | number[]) => {
    const values = Array.isArray(newValue) ? newValue : [newValue, newValue];
    setValue(values);
    setPriceRange([values[0], values[1]]);
    onPriceChange?.(values[0], values[1]);
  };

  const toggleSection = (index: number): void => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // Fixed: Added type assertion to handle totalProducts
  const sections: Section[] = [
    {
      title: "Categories",
      items: categories.map(cat => `${cat.name} (${(cat as any).totalProducts || 0})`),
    },
    {
      title: "Sub Categories",
      items: subcategories.map(sub => `${sub.name} (${(sub as any).totalProducts || 0})`),
    },
    {
      title: "Select Badge",
      items: PUBLIC_BADGE_FILTER_OPTIONS.map((option) => option.label),
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
              style={{
                fontFamily:
                  section.title === "Categories" ||
                  section.title === "Sub Categories" ||
                  section.title === "Select Badge" ||
                  section.title === "Price"
                    ? "Montserrat, sans-serif"
                    : "inherit",
                fontWeight:
                  section.title === "Categories" ||
                  section.title === "Sub Categories" ||
                  section.title === "Select Badge" ||
                  section.title === "Price"
                    ? 600
                    : 400,
                fontSize:
                  section.title === "Categories" ||
                  section.title === "Sub Categories"
                    ? "15px"
                    : section.title === "Select Badge" || section.title === "Price"
                    ? "16px"
                    : "inherit",
                fontStyle: "normal",
              }}
            >
              {section.title}
            </button>

            <div
              className="accordion-content"
              style={{
                maxHeight: isOpen
                  ? section.type === "price"
                    ? "170px"
                    : "300px" // Fixed height with scroll
                  : "0px",
                overflowY: isOpen ? "auto" : "hidden" // Add scroll when open
              }}
            >
              {section.type === "price" ? (
                <div className="price-section">
                  <Box sx={{ width: "100%" }}>
                    <Slider
                      value={value}
                      onChange={handleChange}
                      valueLabelDisplay="auto"
                      getAriaValueText={valuetext}
                      min={0}
                      max={1000}
                      sx={{ color: "#E2B84B" }}
                    />
                  </Box>

                  <div className="price-inputs justify-between">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => {
                        const newRange: [number, number] = [Number(e.target.value), priceRange[1]];
                        setPriceRange(newRange);
                        onPriceChange?.(newRange[0], newRange[1]);
                      }}
                    />
                    <span>to</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const newRange: [number, number] = [priceRange[0], Number(e.target.value)];
                        setPriceRange(newRange);
                        onPriceChange?.(newRange[0], newRange[1]);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <ul style={{ margin: 0, padding: "8px 0" }}>
                  {section.items?.map((item, i) => {

                    // Extract the base name without the count for comparison
                    const itemBaseName = item.split(' (')[0];
                    
                    const isSelected =
                      section.title === "Categories"
                        ? selectedCategory?.name === itemBaseName
                        : section.title === "Sub Categories"
                        ? selectedSubCategory === itemBaseName
                        : section.title === "Select Badge"
                        ? selectedBadge === item
                        : false;

                    return (
                      <li
                        key={i}
                        className={isSelected ? "filter-item-selected" : undefined}
                        onClick={() => {

                          if (section.title === "Categories") {
                            const category = categories.find(cat => cat.name === itemBaseName);
                            if (category) {
                              setSelectedCategory(category);
                              setSelectedSubCategory(null);
                              setOpenIndex(1);
                              fetchSubcategories(category._id);
                              onCategorySelect?.(category._id);
                              onFilterChange?.(category.name, "");
                            }
                          }

                          if (section.title === "Sub Categories") {
                            const subcategory = subcategories.find(sub => sub.name === itemBaseName);
                            if (subcategory) {
                              setSelectedSubCategory(subcategory.name);
                              onSubcategorySelect?.(subcategory._id);
                              onFilterChange?.(selectedCategory?.name || "", subcategory.name);
                            }
                          }

                          if (section.title === "Select Badge") {
                            setSelectedBadge(item);
                            const badgeOption = PUBLIC_BADGE_FILTER_OPTIONS.find((option) => option.label === item);
                            onBadgeSelect?.(badgeOption?.value ?? item.toLowerCase());
                          }
                        }}
                        style={{
                          cursor:
                            section.title === "Categories" ||
                            section.title === "Sub Categories" ||
                            section.title === "Select Badge"
                              ? "pointer"
                              : "default",
                          fontFamily:
                            section.title === "Categories" ||
                            section.title === "Sub Categories" ||
                            section.title === "Select Badge"
                              ? "Montserrat, sans-serif"
                              : "inherit",
                          fontSize:
                            section.title === "Categories" ||
                            section.title === "Sub Categories"
                              ? "15px"
                              : section.title === "Select Badge"
                              ? "14px"
                              : "inherit",
                          fontStyle: "normal",
                          ...(section.title === "Categories" ||
                          section.title === "Sub Categories" ||
                          section.title === "Select Badge"
                            ? { fontWeight: 500 }
                            : {}),
                          listStyle: "none",
                        }}
                      >
                        {item}
                      </li>
                    );
                  })}
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
