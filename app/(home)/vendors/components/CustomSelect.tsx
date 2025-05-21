'use client';
import { useState } from 'react';

interface CustomSelectProps {
  category: string;
  setCategory: (value: string) => void;
}

const options = ['Fashion', 'Electronics', 'Beauty', 'Home', 'Footwear'];

export default function CustomSelect({ category, setCategory }: CustomSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      <button
  type="button"
  onClick={() => setOpen(!open)}
  className="border p-2 w-full flex justify-between items-center rounded cursor-pointer relative"
  aria-haspopup="listbox"
  aria-expanded={open}
>
  <span>{category || 'Select Category'}</span>

  <div className="flex items-center gap-2">
    {category && (
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation(); // prevent dropdown toggle
          setCategory('');
          setOpen(false);
        }}
        onKeyDown={(e) => e.key === 'Enter' && setCategory('')}
        className="bg-gray-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-xs cursor-pointer"
        aria-label="Clear selection"
      >
        ×
      </span>
    )}
    
    {/* ▼ Dropdown Icon */}
    <svg
      className="w-4 h-4 text-gray-600"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</button>


      {open && (
        <ul className="absolute z-10 w-full bg-white border mt-1 rounded shadow-md max-h-48 overflow-y-auto">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                setCategory(option);
                setOpen(false);
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              role="option"
              aria-selected={category === option}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
