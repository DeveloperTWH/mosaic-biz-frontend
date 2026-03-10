import React, { useState } from 'react';
import { X, Package, DollarSign, Upload, Loader } from 'lucide-react';
import { Variant } from '../types';
import { toast } from 'react-toastify';

interface Props {
  variants: Variant[];
  hasVariants: boolean;
  onUpdate: (index: number, field: keyof Variant, value: any) => void;
  onUpdateAllShipping: (
    field: 'standardShipping' | 'overnightShipping' | 'localShipping',
    value: number
  ) => void;
  onRemove: (index: number) => void;
  onImageUpload?: (file: File, variantIndex: number) => Promise<string>;
}

export default function VariantsTable({
  variants,
  hasVariants,
  onUpdate,
  onUpdateAllShipping,
  onRemove,
  onImageUpload,
}: Props) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  if (variants.length === 0) return null;

  const firstVariant = variants[0];

  // Detect which attributes exist
  const hasAttribute1 = variants.some(
    (v) => v.attribute1Name?.trim() !== '' || v.attribute1Value?.trim() !== ''
  );
  const hasAttribute2 = variants.some(
    (v) => v.attribute2Name?.trim() !== '' || v.attribute2Value?.trim() !== ''
  );

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    variantIndex: number
  ) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;

    try {
      setUploadingIndex(variantIndex);
      const imageUrl = await onImageUpload(file, variantIndex);

      const currentImages = variants[variantIndex].images || [];
      onUpdate(variantIndex, 'images', [...currentImages, imageUrl]);

      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingIndex(null);
      e.target.value = '';
    }
  };

  const removeVariantImage = (variantIndex: number, imageIndex: number) => {
    const currentImages = variants[variantIndex].images || [];
    const updatedImages = currentImages.filter((_, i) => i !== imageIndex);
    onUpdate(variantIndex, 'images', updatedImages);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-[#c9a227]" />
        <h2 className="text-lg font-semibold text-gray-900">Variant Combinations</h2>
        <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
          {variants.length} variants
        </span>
      </div>

      {hasVariants && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Bulk Update Shipping</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['standardShipping', 'overnightShipping', 'localShipping'] as const).map(
              (field) => (
                <div key={field}>
                  <label className="block text-xs text-gray-500 mb-1">
                    {field.replace('Shipping', '')}
                  </label>
                  <input
                    type="number"
                    value={firstVariant[field]}
                    onChange={(e) =>
                      onUpdateAllShipping(field, parseFloat(e.target.value))
                    }
                    className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                    step="0.01"
                    min="0"
                  />
                </div>
              )
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-2 text-left">Images</th>
              <th className="py-3 px-2 text-left">SKU</th>

              {hasAttribute1 && (
                <>
                  <th className="py-3 px-2 text-left">Attribute Name</th>
                  <th className="py-3 px-2 text-left">Attribute Value</th>
                </>
              )}

              {hasAttribute2 && (
                <>
                  <th className="py-3 px-2 text-left">Attribute Name</th>
                  <th className="py-3 px-2 text-left">Attribute Value</th>
                </>
              )}

              <th className="py-3 px-2 text-left">Old Price</th>
              <th className="py-3 px-2 text-left">New Price</th>
              <th className="py-3 px-2 text-left">Availability</th>
              <th className="py-3 px-2 text-left">Standard shippiing</th>
              <th className="py-3 px-2 text-left">Overnigh shippingt</th>
              <th className="py-3 px-2 text-left">Local shipping</th>
              <th className="py-3 px-2 text-left"></th>
            </tr>
          </thead>

          <tbody>
            {variants.map((variant, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                {/* Images */}
                <td className="py-2 px-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-1">
                      {(variant.images || []).map((img, imgIndex) => (
                        <div key={imgIndex} className="relative group">
                          <img
                            src={img}
                            alt="variant"
                            className="w-10 h-10 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => removeVariantImage(index, imgIndex)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {onImageUpload && (variant.images || []).length < 1 && (
                      <div>
                        <input
                          type="file"
                          id={`variant-image-${index}`}
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, index)}
                          className="hidden"
                          disabled={uploadingIndex === index}
                        />
                        <label
                          htmlFor={`variant-image-${index}`}
                          className="flex items-center justify-center gap-1 px-2 py-1 text-xs border rounded cursor-pointer"
                        >
                          {uploadingIndex === index ? (
                            <>
                              <Loader className="w-3 h-3 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-3 h-3" />
                              Upload Image
                            </>
                          )}
                        </label>
                      </div>
                    )}
                  </div>
                </td>

                {/* SKU */}
                <td className="py-2 px-2">
                  <input
                    type="text"
                    value={variant.sku}
                    onChange={(e) => onUpdate(index, 'sku', e.target.value)}
                    className="w-28 px-2 py-1 border rounded text-xs"
                  />
                </td>

                {/* Attribute1 */}
                {hasAttribute1 && (
                  <>
                    <td className="py-2 px-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {variant.attribute1Name}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {variant.attribute1Value}
                      </span>
                    </td>
                  </>
                )}

                {/* Attribute2 */}
                {hasAttribute2 && (
                  <>
                    <td className="py-2 px-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {variant.attribute2Name}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {variant.attribute2Value}
                      </span>
                    </td>
                  </>
                )}

                {/* Price */}
                <td className="py-2 px-2">
                  <div className="relative w-20">
                    <DollarSign className="absolute left-1 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) =>
                        onUpdate(index, 'price', parseFloat(e.target.value))
                      }
                      className="w-full pl-5 pr-1 py-1 border rounded text-sm"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </td>

                {/* Sale Price */}
                <td className="py-2 px-2">
                  <div className="relative w-24">
                    <DollarSign className="absolute left-1 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <input
                      type="number"
                      value={variant.salePrice ?? ''}
                      onChange={(e) =>
                        onUpdate(
                          index,
                          'salePrice',
                          e.target.value === '' ? undefined : parseFloat(e.target.value)
                        )
                      }
                      className="w-full pl-5 pr-1 py-1 border rounded text-sm"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </td>

                {/* Stock */}
                <td className="py-2 px-2">
                  <input
                    type="number"
                    value={variant.stock}
                    onChange={(e) =>
                      onUpdate(index, 'stock', parseInt(e.target.value))
                    }
                    className="w-16 px-2 py-1 border rounded text-sm"
                  />
                </td>

                {/* Shipping */}
                {(['standardShipping', 'overnightShipping', 'localShipping'] as const).map(
                  (field) => (
                    <td key={field} className="py-2 px-2">
                      <input
                        type="number"
                        value={variant[field]}
                        onChange={(e) =>
                          onUpdate(index, field, parseFloat(e.target.value))
                        }
                        className="w-16 px-2 py-1 border rounded text-sm"
                        step="0.01"
                        min="0"
                      />
                    </td>
                  )
                )}

                {/* Remove */}
                <td className="py-2 px-2">
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="p-1 hover:bg-red-100 rounded"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}



// import React, { useState } from 'react';
// import { X, Package, DollarSign, Image, Upload, Loader } from 'lucide-react';
// import { Variant } from '../types';
// import { toast } from 'react-toastify';

// interface Props {
//   variants: Variant[];
//   onUpdate: (index: number, field: keyof Variant, value: any) => void;
//   onUpdateAllShipping: (field: 'standardShipping' | 'overnightShipping' | 'localShipping', value: number) => void;
//   onRemove: (index: number) => void;
//   onImageUpload?: (file: File, variantIndex: number) => Promise<string>;
// }

// export default function VariantsTable({
//   variants,
//   onUpdate,
//   onUpdateAllShipping,
//   onRemove,
//   onImageUpload,
// }: Props) {
  
//   const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

//   if (variants.length === 0) {
//     return null;
//   }

//   const firstVariant = variants[0];

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, variantIndex: number) => {
//     const file = e.target.files?.[0];
//     if (!file || !onImageUpload) return;

//     try {
//       setUploadingIndex(variantIndex);
//       const imageUrl = await onImageUpload(file, variantIndex);
      
//       // Get current images array or initialize empty array
//       const currentImages = variants[variantIndex].images || [];
      
//       // Update variant with new image URL
//       onUpdate(variantIndex, 'images', [...currentImages, imageUrl]);
      
//       toast.success('Image uploaded successfully!');
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       toast.error('Failed to upload image');
//     } finally {
//       setUploadingIndex(null);
//       // Clear the input
//       e.target.value = '';
//     }
//   };

//   const removeVariantImage = (variantIndex: number, imageIndex: number) => {
//     const currentImages = variants[variantIndex].images || [];
//     const updatedImages = currentImages.filter((_, i) => i !== imageIndex);
//     onUpdate(variantIndex, 'images', updatedImages);
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm p-6">
//       <div className="flex items-center gap-2 mb-4">
//         <Package className="w-5 h-5 text-[#c9a227]" />
//         <h2 className="text-lg font-semibold text-gray-900">Variant Combinations</h2>
//         <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
//           {variants.length} variants
//         </span>
//       </div>

//       {/* Bulk Shipping Update */}
//       <div className="mb-4 p-4 bg-gray-50 rounded-lg">
//         <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
//           <Package className="w-4 h-4 text-[#c9a227]" />
//           Bulk Update Shipping
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-xs text-gray-500 mb-1">Standard Shipping</label>
//             <input
//               type="number"
//               value={firstVariant.standardShipping}
//               onChange={(e) => onUpdateAllShipping('standardShipping', parseFloat(e.target.value))}
//               className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
//               step="0.01"
//               min="0"
//             />
//           </div>
//           <div>
//             <label className="block text-xs text-gray-500 mb-1">Overnight Shipping</label>
//             <input
//               type="number"
//               value={firstVariant.overnightShipping}
//               onChange={(e) => onUpdateAllShipping('overnightShipping', parseFloat(e.target.value))}
//               className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
//               step="0.01"
//               min="0"
//             />
//           </div>
//           <div>
//             <label className="block text-xs text-gray-500 mb-1">Local Shipping</label>
//             <input
//               type="number"
//               value={firstVariant.localShipping}
//               onChange={(e) => onUpdateAllShipping('localShipping', parseFloat(e.target.value))}
//               className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
//               step="0.01"
//               min="0"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="border-b border-gray-200">
//               <th className="text-left py-3 px-2 font-medium text-gray-600">Images</th>
//               <th className="text-left py-3 px-2 font-medium text-gray-600">SKU</th>
//               <th className="text-left py-3 px-2 font-medium text-gray-600">Attribute1 Name</th>
//               <th className="text-left py-3 px-2 font-medium text-gray-600">Attribute1 Value</th>
//               <th className="text-left py-3 px-2 font-medium text-gray-600">Attribute2 Name</th>
//               <th className="text-left py-3 px-2 font-medium text-gray-600">Attribute2 Value</th>
//               <th className="text-left py-3 px-2 font-medium text-gray-600">Price</th>
//               <th className="text-left py-3 px-2 font-medium text-gray-600">Stock</th>
//               <th className="text-left py-3 px-2 font-medium text-gray-600">Availability</th>
//               <th className="text-left py-3 px-2 font-medium text-gray-600">Standard</th>
//               <th className="text-left py-3 px-2 font-medium text-gray-600">Overnight</th>
//               <th className="text-left py-3 px-2 font-medium text-gray-600">Local</th>
//               <th className="text-left py-3 px-2 font-medium text-gray-600"></th>
//             </tr>
//           </thead>
//           <tbody>
//             {variants.map((variant, index) => (
//               <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
//                 <td className="py-2 px-2">
//                   <div className="flex flex-col gap-2">
//                     {/* Image preview */}
//                     <div className="flex flex-wrap gap-1">
//                       {(variant.images || []).map((img, imgIndex) => (
//                         <div key={imgIndex} className="relative group">
//                           <img 
//                             src={img} 
//                             alt={`Variant ${index + 1} - ${imgIndex + 1}`}
//                             className="w-10 h-10 object-cover rounded border border-gray-200"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => removeVariantImage(index, imgIndex)}
//                             className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
//                             title="Remove image"
//                           >
//                             <X className="w-3 h-3" />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
                    
//                     {/* Upload button */}
//                     {onImageUpload && (
//                       <div className="relative">
//                         <input
//                           type="file"
//                           id={`variant-image-${index}`}
//                           accept="image/*"
//                           onChange={(e) => handleImageUpload(e, index)}
//                           className="hidden"
//                           disabled={uploadingIndex === index}
//                         />
//                         <label
//                           htmlFor={`variant-image-${index}`}
//                           className={`flex items-center justify-center gap-1 px-2 py-1 text-xs border border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition-colors ${
//                             uploadingIndex === index ? 'opacity-50 cursor-not-allowed' : ''
//                           }`}
//                         >
//                           {uploadingIndex === index ? (
//                             <>
//                               <Loader className="w-3 h-3 animate-spin" />
//                               Uploading...
//                             </>
//                           ) : (
//                             <>
//                               <Upload className="w-3 h-3" />
//                               Upload Image
//                             </>
//                           )}
//                         </label>
//                       </div>
//                     )}
//                   </div>
//                 </td>
//                 <td className="py-2 px-2">
//                   <input
//                     type="text"
//                     value={variant.sku}
//                     onChange={(e) => onUpdate(index, 'sku', e.target.value)}
//                     className="w-28 px-2 py-1 border border-gray-300 rounded-md text-xs font-mono"
//                   />
//                 </td>
//                 <td className="py-2 px-2">
//                   <span className="text-xs bg-gray-100 px-2 py-1 rounded">
//                     {variant.attribute1Name}
//                   </span>
//                 </td>
//                 <td className="py-2 px-2">
//                   <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
//                     {variant.attribute1Value}
//                   </span>
//                 </td>
//                 <td className="py-2 px-2">
//                   <span className="text-xs bg-gray-100 px-2 py-1 rounded">
//                     {variant.attribute2Name}
//                   </span>
//                 </td>
//                 <td className="py-2 px-2">
//                   <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
//                     {variant.attribute2Value}
//                   </span>
//                 </td>
//                 <td className="py-2 px-2">
//                   <div className="relative w-20">
//                     <DollarSign className="absolute left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
//                     <input
//                       type="number"
//                       value={variant.price}
//                       onChange={(e) => onUpdate(index, 'price', parseFloat(e.target.value))}
//                       className="w-full pl-5 pr-1 py-1 border border-gray-300 rounded-md text-sm"
//                       step="0.01"
//                       min="0"
//                     />
//                   </div>
//                 </td>
//                 <td className="py-2 px-2">
//                   <input
//                     type="number"
//                     value={variant.stock}
//                     onChange={(e) => onUpdate(index, 'stock', parseInt(e.target.value))}
//                     className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
//                     min="0"
//                   />
//                 </td>
//                 <td className="py-2 px-2">
//                   <input
//                     type="number"
//                     value={variant.availability}
//                     onChange={(e) => onUpdate(index, 'availability', parseInt(e.target.value))}
//                     className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
//                     min="0"
//                   />
//                 </td>
//                 <td className="py-2 px-2">
//                   <input
//                     type="number"
//                     value={variant.standardShipping}
//                     onChange={(e) => onUpdate(index, 'standardShipping', parseFloat(e.target.value))}
//                     className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
//                     step="0.01"
//                     min="0"
//                   />
//                 </td>
//                 <td className="py-2 px-2">
//                   <input
//                     type="number"
//                     value={variant.overnightShipping}
//                     onChange={(e) => onUpdate(index, 'overnightShipping', parseFloat(e.target.value))}
//                     className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
//                     step="0.01"
//                     min="0"
//                   />
//                 </td>
//                 <td className="py-2 px-2">
//                   <input
//                     type="number"
//                     value={variant.localShipping}
//                     onChange={(e) => onUpdate(index, 'localShipping', parseFloat(e.target.value))}
//                     className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
//                     step="0.01"
//                     min="0"
//                   />
//                 </td>
//                 <td className="py-2 px-2">
//                   <button
//                     type="button"
//                     onClick={() => onRemove(index)}
//                     className="p-1 hover:bg-red-100 rounded transition-colors"
//                   >
//                     <X className="w-4 h-4 text-red-500" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Add toast notifications */}
//       <style jsx>{`
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//         .animate-spin {
//           animation: spin 1s linear infinite;
//         }
//       `}</style>
//     </div>
//   );
// }

