// components/filters/PriceRangeSlider.tsx
interface PriceRangeSliderProps {
  min: number;
  max: number;
}

const PriceRangeSlider = ({ min, max }: PriceRangeSliderProps) => {
  return (
    <div className="space-y-2">
      <input
        type="range"
        min={min}
        max={max}
        className="w-full accent-black"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>${min}</span>
        <span>${max}</span>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
