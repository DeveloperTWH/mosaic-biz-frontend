import { useState } from "react";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

type Section = {
  title: string;
  items?: string[];
  type?: "price";
};

type FilterAccordionProps = {
  setCategoryFilter: (category: string) => void;
};

const sections: Section[] = [
  {
    title: "Select Category",
    items: ["Restaurants", "Grocery", "Others"]
  },
  {
    title: "Select Sub - Category",
    items: ["American",
"African",
"Latin American",
"Middle Eastern",
"Indian",
"Asian",
"European",
"Casual Dining"]
  },
  {
    title: "Select Badge",
    items: ["Gold", "Silver", "Bronze"],
  },
  // {
  //   title: "Price",
  //   type: "price",
  // },
];

const MIN = 0;
const MAX = 1000;

function valuetext(value: number) {
  return `${value}°C`;
}

const FilterAccordion:  React.FC<FilterAccordionProps>  = ( {setCategoryFilter}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 700]);

  const [value, setValue] = useState<number[]>([20, 37]);

  const handleChange = (event: Event, newValue: number[]) => {
    setValue(newValue);
  };

  const toggleSection = (index: number): void => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

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
                    : `${section.items!.length * 44}px`
                  : "0px",
              }}
            >
              {section.type === "price" ? (
                <div className="price-section">
                 <Box sx={{ width: 260}}>
                  <Slider
                    getAriaLabel={() => 'Temperature range'}
                    value={value}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    getAriaValueText={valuetext}
                    style={{color : "#C7A040"}}
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
             {section.items!.map((item) => (
  <li key={item}>
    <button onClick={() => setCategoryFilter(item)}>
      {item}
    </button>
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
