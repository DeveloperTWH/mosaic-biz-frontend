import React from 'react';
import { Percent, DollarSign } from 'lucide-react';
import { Discount } from '../types';

interface Props {
  discount: Discount;
  onUpdate: (field: keyof Discount, value: any) => void;
}

export default function Discounts({ discount, onUpdate }: Props) {
  const isPercentage = discount.discountType === "percentage";

  return (
    <div className="bg-white border border-gray-200 rounded-md p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4">
        Additional Discounts (Optional)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Discount Type */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Discount Type
          </label>
          <select
            value={discount.discountType}
            onChange={(e) => onUpdate('discountType', e.target.value)}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227] bg-white"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
        </div>

        {/* Discount Value */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
            {isPercentage ? <Percent size={14} /> : <DollarSign size={14} />}
            Value ({isPercentage ? "%" : "$"})
          </label>

          <input
            type="number"
            value={discount.discountValue}
            onChange={(e) => onUpdate('discountValue', parseFloat(e.target.value))}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
            step="0.01"
            min="0"
            placeholder={isPercentage ? "0 %" : "$0.00"}
          />
        </div>

        {/* Cart Value */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Min. Cart Value ($)
          </label>
          <input
            type="number"
            value={discount.costValue}
            onChange={(e) => onUpdate('costValue', parseFloat(e.target.value))}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
            step="0.01"
            min="0"
            placeholder="$0"
          />
        </div>

      </div>
    </div>
  );
}



// import React from 'react';
// import { Percent, DollarSign } from 'lucide-react';
// import { Discount } from '../types';

// interface Props {
//   discount: Discount;
//   onUpdate: (field: keyof Discount, value: any) => void;
// }

// export default function Discounts({ discount, onUpdate }: Props) {
//   return (
//     <div className="bg-white border border-gray-200 rounded-md p-5">
//       <h2 className="text-base font-semibold text-gray-900 mb-4">Additional Discounts (Optional)</h2>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div>
//           <label className="block text-xs font-medium text-gray-600 mb-1">
//             Discount Type
//           </label>
//           <select
//             value={discount.discountType}
//             onChange={(e) => onUpdate('discountType', e.target.value)}
//             className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227] bg-white"
//           >
//             <option value="percentage">Percentage</option>
//             <option value="fixed">Fixed</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-xs font-medium text-gray-600 mb-1">
//             Value (%)
//           </label>
//           <input
//             type="number"
//             value={discount.discountValue}
//             onChange={(e) => onUpdate('discountValue', parseFloat(e.target.value))}
//             className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
//             step="0.01"
//             min="0"
//             placeholder="0.00"
//           />
//         </div>

//         <div>
//           <label className="block text-xs font-medium text-gray-600 mb-1">
//              Cart Value ($)
//           </label>
//           <input
//             type="number"
//             value={discount.costValue}
//             onChange={(e) => onUpdate('costValue', parseFloat(e.target.value))}
//             className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
//             step="0.01"
//             min="0"
//             placeholder="0"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }