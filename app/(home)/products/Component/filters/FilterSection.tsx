// components/filters/FilterSection.tsx
import { ReactNode } from "react";

interface FilterSectionProps {
  title: string;
  children?: ReactNode;
}

const FilterSection = ({ title, children }: FilterSectionProps) => {
  return (
    <div className="mb-5 border-b border-gray-200 pb-3">
      <h4 className="font-semibold text-xs text-gray-500 tracking-wide uppercase mb-2">
        {title}
      </h4>
      <div>{children}</div>
    </div>
  );
};

export default FilterSection;
