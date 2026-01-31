import { useState } from "react";

type Section = {
  title: string;
  items: string[];
};

const sections: Section[] = [
  {
    title: "Select Category",
    items: ["Category 1", "Category 2", "Category 3"],
  },
  {
    title: "Select Sub - Category",
    items: ["Sub 1", "Sub 2", "Sub 3"],
  },
  {
    title: "Select Badge",
    items: ["Gold", "Silver", "Bronze"],
  },
];

const FilterAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
                  ? `${section.items.length * 44}px`
                  : "0px",
              }}
            >
              <ul>
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FilterAccordion;
