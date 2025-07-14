// components/filters/CheckboxGroup.tsx
interface CheckboxGroupProps {
  options: string[];
}

const CheckboxGroup = ({ options }: CheckboxGroupProps) => {
  return (
    <div className="space-y-1.5">
      {options.map((option, index) => (
        <label key={index} className="flex items-center text-sm text-gray-700">
          <input
            type="checkbox"
            className="mr-2 h-4 w-4 text-black border-gray-300"
            name={option}
            value={option}
          />
          {option}
        </label>
      ))}
    </div>
  );
};

export default CheckboxGroup;
