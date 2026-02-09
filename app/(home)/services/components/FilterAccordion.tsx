import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Category, SubCategory, ServiceCategoryResponse, SubCategoryResponse } from "@/types/Category";

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
  return `${value}°C`;
}

const FilterAccordion: React.FC<FilterAccordionProps> = ({ onFilterChange, selectedCategory: externalSelectedCategory, onCategoryChange, onCategorySelect, onSubcategorySelect, onBadgeSelect, onPriceChange }) => {
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/services`);
        const data: ServiceCategoryResponse = await response.json();
        setCategories(data.data.serviceCategories);
      } catch (err) {
        console.error('Error fetching service categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const fetchSubcategories = async (categoryId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/services/subcategories/${categoryId}`);
      const data: SubCategoryResponse = await response.json();
      setSubcategories(data.data);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
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

  const sections: Section[] = [
    {
      title: "Categories",
      items: categories.map(cat => cat.name),
    },
    {
      title: "Sub Categories",
      items: subcategories.map(sub => sub.name),
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
                      getAriaLabel={() => "Price range"}
                      value={value}
                      onChange={handleChange}
                      valueLabelDisplay="auto"
                      getAriaValueText={valuetext}
                      min={0}
                      max={1000}
                      style={{ color: "#C7A040" }}
                    />
                  </Box>

                  <div className="price-inputs justify-space">
                    <input
                      type="number"
                      value={priceRange[0]}
                      placeholder="Min"
                      onChange={(e) => {
                        const newRange: [number, number] = [Number(e.target.value), priceRange[1]];
                        setPriceRange(newRange);
                        onPriceChange?.(newRange[0], newRange[1]);
                      }}
                    />
                    <span className="ml-10">to</span>
                    <input
                      className="ml-10"
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
                <ul>
                  {section.items?.map((item, i) => {
                    const isSelected = section.title === "Categories" 
                      ? selectedCategory?.name === item
                      : section.title === "Sub Categories"
                      ? selectedSubCategory === item
                      : section.title === "Select Badge"
                      ? selectedBadge === item
                      : false;
                    
                    return (
                    <li
                      key={i}
                      onClick={() => {
                        if (section.title === "Categories") {
                          const category = categories.find(cat => cat.name === item);
                          if (category) {
                            setSelectedCategory(category);
                            setSelectedSubCategory(null);
                            setOpenIndex(1);
                            fetchSubcategories(category._id);
                            onCategorySelect?.(category._id);
                            onFilterChange?.(item, "");
                          }
                        }

                        if (section.title === "Sub Categories") {
                          const subcategory = subcategories.find(sub => sub.name === item);
                          setSelectedSubCategory(item);
                          if (subcategory) {
                            onSubcategorySelect?.(subcategory._id);
                          }
                          onFilterChange?.(selectedCategory?.name || "", item);
                        }

                        if (section.title === "Select Badge") {
                          setSelectedBadge(item);
                          onBadgeSelect?.(item.toLowerCase());
                        }
                      }}
                      style={{
                        cursor:
                          section.title === "Categories" ||
                          section.title === "Sub Categories"
                            ? "pointer"
                            : "default",
                        backgroundColor: isSelected ? "#C7A040" : "transparent",
                        color: isSelected ? "white" : "inherit",
                        fontWeight: isSelected ? "bold" : "normal",
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