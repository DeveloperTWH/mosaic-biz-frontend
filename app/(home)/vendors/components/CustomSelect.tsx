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
        className="market-input flex w-full cursor-pointer items-center justify-between gap-2 text-left"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={category ? 'text-market-text' : 'text-market-muted'}>
          {category || 'Select Category'}
        </span>

        <div className="flex shrink-0 items-center gap-2">
          {category && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                setCategory('');
                setOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  setCategory('');
                  setOpen(false);
                }
              }}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs text-market-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50"
              aria-label="Clear selection"
            >
              ×
            </span>
          )}

          <svg
            className="h-4 w-4 text-market-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <ul
          className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-white/15 bg-market-elevated shadow-market-card"
          role="listbox"
        >
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                setCategory(option);
                setOpen(false);
              }}
              className="cursor-pointer px-4 py-3 text-sm text-market-text transition-colors hover:bg-white/5 focus-visible:bg-white/5"
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
