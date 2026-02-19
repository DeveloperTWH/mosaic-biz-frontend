// import React, { useState, useEffect } from 'react';
// import { X, Save, Loader, Edit2, Trash2, Eye, Upload, Image as ImageIcon, Plus, Package } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { Product, ProductVariant } from '../types';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// interface Props {
//   product: Product;
//   onClose: () => void;
//   onSave: () => void;
// }

// interface VariantFormData {
//   _id: string;
//   attributes: Record<string, string>;
//   sku: string;
//   price: number;
//   salePrice?: number;
//   stock: number;
//   images: string[];
//   isPublished: boolean;
// }

// interface NewVariantData {
//   attributes: Record<string, string>;
//   price: number;
//   salePrice?: number;
//   stock: number;
//   images: string[];
//   sku?: string;
// }

// export default function EditProductModal({ product, onClose, onSave }: Props) {
//   const [loading, setLoading] = useState(false);
//   const [variantLoading, setVariantLoading] = useState<string | null>(null);
//   const [uploading, setUploading] = useState<Record<string, boolean>>({});
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [showNewVariantForm, setShowNewVariantForm] = useState(false);
//   const [newVariant, setNewVariant] = useState<NewVariantData>({
//     attributes: {},
//     price: 0,
//     stock: 0,
//     images: []
//   });
  
//   // Product form state
//   const [productForm, setProductForm] = useState({
//     title: '',
//     description: '',
//     categoryId: '',
//     subcategoryId: '',
//     attributes: [] as { name: string; values: string[] }[],
//     shipping: {
//       standard: 0,
//       overnight: 0,
//       local: 0
//     },
//     coverImage: '',
//     galleryImages: [] as string[],
//     metaFields: [] as { key: string; value: string }[],
//     discount: {
//       type: 'percentage' as 'percentage' | 'fixed',
//       amount: 0,
//       minCartValue: 0
//     },
//     isPublished: true
//   });

//   // Variants state
//   const [variants, setVariants] = useState<VariantFormData[]>([]);
//   const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
//   const [editForm, setEditForm] = useState<VariantFormData | null>(null);

//   // New attribute state
//   const [showNewAttributeForm, setShowNewAttributeForm] = useState(false);
//   const [newAttribute, setNewAttribute] = useState({ name: '', values: '' });

//   // Initialize form with product data
//   useEffect(() => {
//     if (product) {
//       setProductForm({
//         title: product.title || '',
//         description: product.description || '',
//         categoryId: product.categoryId?._id || '',
//         subcategoryId: product.subcategoryId?._id || '',
//         attributes: product.attributes || [],
//         shipping: product.shipping || { standard: 0, overnight: 0, local: 0 },
//         coverImage: product.coverImage || '',
//         galleryImages: product.galleryImages || [],
//         metaFields: product.metaFields?.map(m => ({ key: m.key, value: m.value })) || [],
//         discount: product.discount ? {
//           type: product.discount.type as 'percentage' | 'fixed',
//           amount: product.discount.amount,
//           minCartValue: product.discount.minCartValue
//         } : {
//           type: 'percentage',
//           amount: 0,
//           minCartValue: 0
//         },
//         isPublished: product.isPublished
//       });

//       if (product.variants) {
//         setVariants(product.variants.map(v => {
//           // Safe price parsing
//           let price = 0;
//           if (v.price !== undefined && v.price !== null) {
//             if (typeof v.price === 'object') {
//               price = parseFloat(JSON.parse(JSON.stringify(v.price)));
//             } else {
//               price = Number(v.price);
//             }
//           }

//           let salePrice = undefined;
//           if (v.salePrice !== undefined && v.salePrice !== null) {
//             if (typeof v.salePrice === 'object') {
//               salePrice = parseFloat(JSON.parse(JSON.stringify(v.salePrice)));
//             } else {
//               salePrice = Number(v.salePrice);
//             }
//           }

//           return {
//             _id: v._id,
//             attributes: v.attributes,
//             sku: v.sku,
//             price: isNaN(price) ? 0 : price,
//             salePrice: salePrice !== undefined && !isNaN(salePrice) ? salePrice : undefined,
//             stock: v.stock || 0,
//             images: v.images || [],
//             isPublished: v.isPublished
//           };
//         }));
//       }
//     }
//   }, [product]);

//   // File upload function
//   const handleFileUpload = async (type: 'cover' | 'gallery' | 'variant', file: File, variantIndex?: number): Promise<string> => {
//     try {
//       const uploadKey = type === 'variant' ? `variant-${variantIndex}` : type;
//       setUploading(prev => ({ ...prev, [uploadKey]: true }));

//       const documentType = type === 'cover' ? 'product-cover' : 
//                           type === 'gallery' ? 'product-gallery' : 'product-variant';
      
//       const response = await fetch(
//         `${API_BASE_URL}/api/product/upload-url?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}&documentType=${documentType}`,
//         {
//           method: 'GET',
//           credentials: 'include',
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to get upload URL');
//       }

//       const { uploadUrl, fileUrl } = await response.json();

//       await fetch(uploadUrl, {
//         method: 'PUT',
//         headers: { 'Content-Type': file.type },
//         body: file,
//       });

//       toast.success('File uploaded successfully!');
//       return fileUrl;

//     } catch (error: any) {
//       console.error('Upload error:', error);
//       toast.error(`Upload failed: ${error.message}`);
//       throw error;
//     } finally {
//       const uploadKey = type === 'variant' ? `variant-${variantIndex}` : type;
//       setUploading(prev => ({ ...prev, [uploadKey]: false }));
//     }
//   };

//   const handleProductSubmit = async () => {
//     try {
//       setLoading(true);
      
//       const response = await fetch(
//         `${API_BASE_URL}/api/product/${product._id}`,
//         {
//           method: 'PUT',
//           credentials: 'include',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(productForm)
//         }
//       );

//       const data = await response.json();
//       if (data.success || data.message) {
//         toast.success(data.message || 'Product updated successfully');
//         onSave();
//         onClose();
//       } else {
//         toast.error(data.error || 'Failed to update product');
//       }
//     } catch (error: any) {
//       console.error('Error updating product:', error);
//       toast.error(error.message || 'Error updating product');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVariantUpdate = async (variantId: string, updatedData: any) => {
//     try {
//       setVariantLoading(variantId);
      
//       const response = await fetch(
//         `${API_BASE_URL}/api/product/update-variant/${product._id}/${variantId}`,
//         {
//           method: 'PUT',
//           credentials: 'include',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(updatedData)
//         }
//       );

//       const data = await response.json();
//       if (data.success) {
//         toast.success('Variant updated successfully');
        
//         setVariants(variants.map(v => 
//           v._id === variantId ? { ...v, ...updatedData } : v
//         ));
//         setEditingVariantId(null);
//         setEditForm(null);
//       } else {
//         toast.error(data.error || 'Failed to update variant');
//       }
//     } catch (error: any) {
//       console.error('Error updating variant:', error);
//       toast.error(error.message || 'Error updating variant');
//     } finally {
//       setVariantLoading(null);
//     }
//   };

//   const handleAddNewVariant = async () => {
//     try {
//       setLoading(true);
      
//       // Generate a temporary ID for the UI
//       const tempId = `temp-${Date.now()}`;
      
//       // Add to local state first for immediate UI update
//       const newVariantWithId: VariantFormData = {
//         _id: tempId,
//         attributes: newVariant.attributes,
//         sku: newVariant.sku || `VAR-${Date.now()}`,
//         price: newVariant.price,
//         salePrice: newVariant.salePrice,
//         stock: newVariant.stock,
//         images: newVariant.images,
//         isPublished: true
//       };
      
//       setVariants([...variants, newVariantWithId]);
//       setShowNewVariantForm(false);
//       setNewVariant({ attributes: {}, price: 0, stock: 0, images: [] });
      
//       toast.success('New variant added (will be saved when you click Save Changes)');
      
//     } catch (error: any) {
//       console.error('Error adding variant:', error);
//       toast.error(error.message || 'Error adding variant');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddNewAttribute = () => {
//     if (!newAttribute.name || !newAttribute.values) {
//       toast.error('Please fill in both name and values');
//       return;
//     }

//     const valuesArray = newAttribute.values.split(',').map(v => v.trim()).filter(v => v);
    
//     setProductForm({
//       ...productForm,
//       attributes: [...productForm.attributes, { 
//         name: newAttribute.name, 
//         values: valuesArray 
//       }]
//     });
    
//     setShowNewAttributeForm(false);
//     setNewAttribute({ name: '', values: '' });
//     toast.success('New attribute added');
//   };

//   const startEditing = (variant: VariantFormData) => {
//     setEditingVariantId(variant._id);
//     setEditForm({ ...variant });
//   };

//   const cancelEditing = () => {
//     setEditingVariantId(null);
//     setEditForm(null);
//   };

//   const removeGalleryImage = (index: number) => {
//     const newGallery = [...productForm.galleryImages];
//     newGallery.splice(index, 1);
//     setProductForm({ ...productForm, galleryImages: newGallery });
//   };

//   const removeVariantImage = (variantId: string, imageIndex: number) => {
//     setVariants(variants.map(v => {
//       if (v._id === variantId) {
//         const newImages = [...v.images];
//         newImages.splice(imageIndex, 1);
//         return { ...v, images: newImages };
//       }
//       return v;
//     }));
//   };

//   const getStockStatus = (stock: number) => {
//     if (stock === 0) return { label: 'Out of Stock', className: 'bg-red-100 text-red-600' };
//     if (stock < 10) return { label: 'Low Stock', className: 'bg-yellow-100 text-yellow-600' };
//     return { label: 'Available', className: 'bg-green-100 text-green-600' };
//   };

//   const formatPrice = (price: number | undefined): string => {
//     if (price === undefined || price === null) return '0.00';
//     return price.toFixed(2);
//   };

//   const getVariantAttributes = (variant: VariantFormData) => {
//     const entries = Object.entries(variant.attributes || {});
//     return {
//       firstAttr: entries[0]?.[0] || '',
//       firstValue: entries[0]?.[1] || '-',
//       secondAttr: entries[1]?.[0] || '',
//       secondValue: entries[1]?.[1] || '-'
//     };
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        
//         {/* Header */}
//         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
//           <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6 space-y-6">
          
//           {/* ===== IMAGE GALLERY SECTION ===== */}
//           <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//             <h3 className="text-sm font-medium text-gray-700 mb-3">Product Images</h3>
            
//             {/* Cover Image */}
//             <div className="mb-4">
//               <label className="block text-xs text-gray-500 mb-2">Cover Image</label>
//               <div className="flex items-center gap-4">
//                 {productForm.coverImage ? (
//                   <div className="relative w-32 h-32 group">
//                     <img
//                       src={productForm.coverImage}
//                       alt="Cover"
//                       className="w-full h-full object-cover rounded-lg border-2 border-[#c9a227] cursor-pointer"
//                       onClick={() => setSelectedImage(productForm.coverImage)}
//                     />
//                     <button
//                       onClick={() => setProductForm({ ...productForm, coverImage: '' })}
//                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
//                     >
//                       <X className="w-3 h-3" />
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
//                     <ImageIcon className="w-8 h-8 text-gray-400" />
//                   </div>
//                 )}
//                 <input
//                   type="file"
//                   id="cover-upload"
//                   className="hidden"
//                   accept="image/*"
//                   onChange={async (e) => {
//                     const file = e.target.files?.[0];
//                     if (file) {
//                       try {
//                         const url = await handleFileUpload('cover', file);
//                         setProductForm({ ...productForm, coverImage: url });
//                       } catch (error) {
//                         // Error handled in upload function
//                       }
//                     }
//                   }}
//                 />
//                 <label
//                   htmlFor="cover-upload"
//                   className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300 cursor-pointer flex items-center gap-1"
//                 >
//                   <Upload className="w-3 h-3" />
//                   {uploading['cover'] ? 'Uploading...' : 'Upload Cover'}
//                 </label>
//               </div>
//             </div>

//             {/* Gallery Images */}
//             <div>
//               <label className="block text-xs text-gray-500 mb-2">Gallery Images</label>
//               <div className="flex flex-wrap gap-3">
//                 {productForm.galleryImages.map((img, index) => (
//                   <div key={index} className="relative w-20 h-20 group">
//                     <img
//                       src={img}
//                       alt={`Gallery ${index + 1}`}
//                       className="w-full h-full object-cover rounded-lg border border-gray-200 cursor-pointer"
//                       onClick={() => setSelectedImage(img)}
//                     />
//                     <button
//                       onClick={() => removeGalleryImage(index)}
//                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
//                     >
//                       <X className="w-3 h-3" />
//                     </button>
//                   </div>
//                 ))}
                
//                 <input
//                   type="file"
//                   id="gallery-upload"
//                   className="hidden"
//                   accept="image/*"
//                   multiple
//                   onChange={async (e) => {
//                     const files = e.target.files;
//                     if (files) {
//                       for (let i = 0; i < files.length; i++) {
//                         try {
//                           const url = await handleFileUpload('gallery', files[i]);
//                           setProductForm({
//                             ...productForm,
//                             galleryImages: [...productForm.galleryImages, url]
//                           });
//                         } catch (error) {
//                           // Error handled in upload function
//                         }
//                       }
//                     }
//                   }}
//                 />
//                 <label
//                   htmlFor="gallery-upload"
//                   className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-[#c9a227] transition-colors cursor-pointer"
//                 >
//                   <Upload className="w-5 h-5 text-gray-400" />
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* Product Title & Basic Info */}
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Product Title
//               </label>
//               <input
//                 type="text"
//                 value={productForm.title}
//                 onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Category
//                 </label>
//                 <p className="text-base text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
//                   {product.categoryId?.name || '-'}
//                 </p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Sub Category
//                 </label>
//                 <p className="text-base text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
//                   {product.subcategoryId?.name || '-'}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Product ID, Stock, Status */}
//           <div className="grid grid-cols-3 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Product ID
//               </label>
//               <p className="text-base font-mono text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
//                 #SKU {product._id.slice(-4)}
//               </p>
//             </div>
//             {/* <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Total Stock
//               </label>
//               <p className="text-base font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
//                 {product.totalStock || 0}
//               </p>
//             </div> */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Status
//               </label>
//               <select
//                 value={productForm.isPublished ? 'published' : 'draft'}
//                 onChange={(e) => setProductForm({ ...productForm, isPublished: e.target.value === 'published' })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
//               >
//                 <option value="published">Published</option>
//                 <option value="draft">Draft</option>
//               </select>
//             </div>
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Description
//             </label>
//             <textarea
//               value={productForm.description}
//               onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
//               rows={4}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
//             />
//           </div>

//           {/* Attribute Values */}
//           <div>
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="text-sm font-medium text-gray-700">Attribute Values</h3>
//               <button
//                 onClick={() => setShowNewAttributeForm(true)}
//                 className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 flex items-center gap-1"
//               >
//                 <Plus className="w-3 h-3" />
//                 Add Attribute
//               </button>
//             </div>

//             {showNewAttributeForm && (
//               <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
//                 <h4 className="text-xs font-medium text-gray-700 mb-3">New Attribute</h4>
//                 <div className="space-y-3">
//                   <input
//                     type="text"
//                     placeholder="Attribute Name (e.g., Size, Color)"
//                     value={newAttribute.name}
//                     onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Values (comma separated, e.g., Small, Medium, Large)"
//                     value={newAttribute.values}
//                     onChange={(e) => setNewAttribute({ ...newAttribute, values: e.target.value })}
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
//                   />
//                   <div className="flex justify-end gap-2">
//                     <button
//                       onClick={() => setShowNewAttributeForm(false)}
//                       className="px-3 py-1 border border-gray-300 text-gray-700 text-xs rounded-md hover:bg-gray-100"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleAddNewAttribute}
//                       className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
//                     >
//                       Add
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {productForm.attributes.length > 0 && (
//               <div className="space-y-3">
//                 {productForm.attributes.map((attr, idx) => (
//                   <div key={idx} className="flex items-start gap-4 bg-gray-50 p-3 rounded-lg">
//                     <span className="text-sm font-medium text-gray-700 min-w-24 pt-2">{attr.name}:</span>
//                     <div className="flex-1">
//                       <input
//                         type="text"
//                         value={attr.values.join(', ')}
//                         onChange={(e) => {
//                           const newValues = e.target.value.split(',').map(v => v.trim()).filter(v => v);
//                           const newAttributes = [...productForm.attributes];
//                           newAttributes[idx].values = newValues;
//                           setProductForm({ ...productForm, attributes: newAttributes });
//                         }}
//                         className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
//                         placeholder="Enter values separated by commas"
//                       />
//                     </div>
//                     <button
//                       onClick={() => {
//                         const newAttributes = productForm.attributes.filter((_, i) => i !== idx);
//                         setProductForm({ ...productForm, attributes: newAttributes });
//                       }}
//                       className="p-1 hover:bg-red-100 rounded"
//                     >
//                       <Trash2 className="w-4 h-4 text-red-500" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Product Variants Table */}
//           {variants.length > 0 && (
//             <div className="mt-6">
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="text-sm font-medium text-gray-700">Product Variants</h3>
//                 <button
//                   onClick={() => setShowNewVariantForm(true)}
//                   className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 flex items-center gap-1"
//                 >
//                   <Package className="w-3 h-3" />
//                   Add Variant
//                 </button>
//               </div>

//               {/* New Variant Form */}
//               {showNewVariantForm && (
//                 <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
//                   <h4 className="text-xs font-medium text-gray-700 mb-3">New Variant</h4>
//                   <div className="grid grid-cols-2 gap-3 mb-3">
//                     {productForm.attributes.map((attr, idx) => (
//                       <div key={idx}>
//                         <label className="block text-xs text-gray-500 mb-1">{attr.name}</label>
//                         <select
//                           value={newVariant.attributes[attr.name] || ''}
//                           onChange={(e) => setNewVariant({
//                             ...newVariant,
//                             attributes: { ...newVariant.attributes, [attr.name]: e.target.value }
//                           })}
//                           className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
//                         >
//                           <option value="">Select {attr.name}</option>
//                           {attr.values.map(val => (
//                             <option key={val} value={val}>{val}</option>
//                           ))}
//                         </select>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="grid grid-cols-3 gap-3 mb-3">
//                     <div>
//                       <label className="block text-xs text-gray-500 mb-1">Price ($)</label>
//                       <input
//                         type="number"
//                         value={newVariant.price}
//                         onChange={(e) => setNewVariant({ ...newVariant, price: parseFloat(e.target.value) || 0 })}
//                         className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
//                         step="0.01"
//                         min="0"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs text-gray-500 mb-1">Sale Price</label>
//                       <input
//                         type="number"
//                         value={newVariant.salePrice || ''}
//                         onChange={(e) => setNewVariant({ ...newVariant, salePrice: e.target.value ? parseFloat(e.target.value) : undefined })}
//                         className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
//                         step="0.01"
//                         min="0"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs text-gray-500 mb-1">Stock</label>
//                       <input
//                         type="number"
//                         value={newVariant.stock}
//                         onChange={(e) => setNewVariant({ ...newVariant, stock: parseInt(e.target.value) || 0 })}
//                         className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
//                         min="0"
//                       />
//                     </div>
//                   </div>
//                   <div className="flex justify-end gap-2">
//                     <button
//                       onClick={() => setShowNewVariantForm(false)}
//                       className="px-3 py-1 border border-gray-300 text-gray-700 text-xs rounded-md hover:bg-gray-100"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleAddNewVariant}
//                       disabled={loading}
//                       className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
//                     >
//                       Add Variant
//                     </button>
//                   </div>
//                 </div>
//               )}

//               <div className="overflow-x-auto border border-gray-200 rounded-md">
//                 <table className="w-full text-sm">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attribute 1</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attribute 2</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price ($)</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sale Price</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>

//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {variants.map((variant, idx) => {
//                       const { firstAttr, firstValue, secondAttr, secondValue } = getVariantAttributes(variant);
//                       const stockStatus = getStockStatus(variant.stock);
                      
//                       if (editingVariantId === variant._id && editForm) {
//                         return (
//                           <tr key={variant._id} className="bg-yellow-50">
//                             <td className="px-4 py-3">
//                               <input
//                                 type="text"
//                                 value={editForm.sku}
//                                 onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
//                                 className="w-28 px-2 py-1 text-xs border border-gray-300 rounded font-mono"
//                               />
//                             </td>
//                             <td className="px-4 py-3">
//                               <span className="text-xs text-gray-500">{firstAttr}</span>
//                             </td>
//                             <td className="px-4 py-3">
//                               <input
//                                 type="text"
//                                 value={firstValue}
//                                 onChange={(e) => {
//                                   const newAttributes = { ...editForm.attributes };
//                                   const key = Object.keys(editForm.attributes)[0];
//                                   if (key) {
//                                     newAttributes[key] = e.target.value;
//                                     setEditForm({ ...editForm, attributes: newAttributes });
//                                   }
//                                 }}
//                                 className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
//                               />
//                             </td>
//                             <td className="px-4 py-3">
//                               <span className="text-xs text-gray-500">{secondAttr}</span>
//                             </td>
//                             <td className="px-4 py-3">
//                               <input
//                                 type="text"
//                                 value={secondValue}
//                                 onChange={(e) => {
//                                   const newAttributes = { ...editForm.attributes };
//                                   const key = Object.keys(editForm.attributes)[1];
//                                   if (key) {
//                                     newAttributes[key] = e.target.value;
//                                     setEditForm({ ...editForm, attributes: newAttributes });
//                                   }
//                                 }}
//                                 className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
//                               />
//                             </td>
//                             <td className="px-4 py-3">
//                               <input
//                                 type="number"
//                                 value={editForm.price}
//                                 onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
//                                 className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
//                                 step="0.01"
//                                 min="0"
//                               />
//                             </td>
//                             <td className="px-4 py-3">
//                               <input
//                                 type="number"
//                                 value={editForm.salePrice || ''}
//                                 onChange={(e) => setEditForm({ 
//                                   ...editForm, 
//                                   salePrice: e.target.value ? parseFloat(e.target.value) : undefined 
//                                 })}
//                                 className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
//                                 step="0.01"
//                                 min="0"
//                                 placeholder="-"
//                               />
//                             </td>
//                             <td className="px-4 py-3">
//                               <input
//                                 type="number"
//                                 value={editForm.stock}
//                                 onChange={(e) => setEditForm({ ...editForm, stock: parseInt(e.target.value) || 0 })}
//                                 className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
//                                 min="0"
//                               />
//                             </td>
//                             <td className="px-4 py-3">
//                               <select
//                                 value={editForm.isPublished ? 'published' : 'draft'}
//                                 onChange={(e) => setEditForm({ 
//                                   ...editForm, 
//                                   isPublished: e.target.value === 'published' 
//                                 })}
//                                 className="px-2 py-1 text-xs border border-gray-300 rounded"
//                               >
//                                 <option value="published">Published</option>
//                                 <option value="draft">Draft</option>
//                               </select>
//                             </td>
//                             <td className="px-4 py-3">
//                               <div className="flex items-center gap-2">
//                                 <button
//                                   onClick={() => handleVariantUpdate(variant._id, editForm)}
//                                   disabled={variantLoading === variant._id}
//                                   className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
//                                 >
//                                   {variantLoading === variant._id ? (
//                                     <Loader className="w-3 h-3 animate-spin" />
//                                   ) : (
//                                     <Save className="w-3 h-3" />
//                                   )}
//                                   Save
//                                 </button>
//                                 <button
//                                   onClick={cancelEditing}
//                                   className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
//                                 >
//                                   Cancel
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         );
//                       }
                      
//                       return (
//                         <tr key={variant._id} className="hover:bg-gray-50">
//                           <td className="px-4 py-3 font-mono text-xs text-gray-600">{variant.sku}</td>
//                           <td className="px-4 py-3 text-xs text-gray-500">{firstAttr}</td>
//                           <td className="px-4 py-3">
//                             <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
//                               {firstValue}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3 text-xs text-gray-500">{secondAttr}</td>
//                           <td className="px-4 py-3">
//                             <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
//                               {secondValue}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3 font-medium">${formatPrice(variant.price)}</td>
//                           <td className="px-4 py-3 text-gray-500">
//                             {variant.salePrice ? `$${formatPrice(variant.salePrice)}` : '-'}
//                           </td>
//                           <td className="px-4 py-3">
//                             <span className={`px-2 py-1 text-xs rounded-full ${stockStatus.className}`}>
//                               {variant.stock}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3">
//                             <span className={`px-2 py-1 text-xs rounded-full ${
//                               variant.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
//                             }`}>
//                               {variant.isPublished ? 'Active' : 'Draft'}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3">
//                             <div className="flex items-center gap-1">
//                               {variant.images.slice(0, 2).map((img, imgIdx) => (
//                                 <div key={imgIdx} className="relative w-6 h-6 group">
//                                   <img src={img} alt="" className="w-full h-full object-cover rounded" />
//                                 </div>
//                               ))}
//                               {variant.images.length > 2 && (
//                                 <span className="text-xs text-gray-500">+{variant.images.length - 2}</span>
//                               )}
//                             </div>
//                           </td>
//                           <td className="px-4 py-3">
//                             <button
//                               onClick={() => startEditing(variant)}
//                               className="p-1 hover:bg-blue-50 rounded transition-colors"
//                               title="Edit variant"
//                             >
//                               <Edit2 className="w-4 h-4 text-blue-600" />
//                             </button>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* Shipping Options */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-700 mb-3">Shipping Options</h3>
//             <div className="grid grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-xs text-gray-500 mb-1">Standard ($)</label>
//                 <input
//                   type="number"
//                   value={productForm.shipping.standard}
//                   onChange={(e) => setProductForm({
//                     ...productForm,
//                     shipping: { ...productForm.shipping, standard: parseFloat(e.target.value) || 0 }
//                   })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
//                   step="0.01"
//                   min="0"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs text-gray-500 mb-1">Overnight ($)</label>
//                 <input
//                   type="number"
//                   value={productForm.shipping.overnight}
//                   onChange={(e) => setProductForm({
//                     ...productForm,
//                     shipping: { ...productForm.shipping, overnight: parseFloat(e.target.value) || 0 }
//                   })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
//                   step="0.01"
//                   min="0"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs text-gray-500 mb-1">Local ($)</label>
//                 <input
//                   type="number"
//                   value={productForm.shipping.local}
//                   onChange={(e) => setProductForm({
//                     ...productForm,
//                     shipping: { ...productForm.shipping, local: parseFloat(e.target.value) || 0 }
//                   })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
//                   step="0.01"
//                   min="0"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Meta Fields */}
//           {productForm.metaFields.length > 0 && (
//             <div>
//               <h3 className="text-sm font-medium text-gray-700 mb-3">Meta Fields</h3>
//               <div className="space-y-2">
//                 {productForm.metaFields.map((field, idx) => (
//                   <div key={idx} className="grid grid-cols-2 gap-4">
//                     <input
//                       type="text"
//                       value={field.key}
//                       onChange={(e) => {
//                         const newFields = [...productForm.metaFields];
//                         newFields[idx].key = e.target.value;
//                         setProductForm({ ...productForm, metaFields: newFields });
//                       }}
//                       className="px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
//                       placeholder="Key"
//                     />
//                     <input
//                       type="text"
//                       value={field.value}
//                       onChange={(e) => {
//                         const newFields = [...productForm.metaFields];
//                         newFields[idx].value = e.target.value;
//                         setProductForm({ ...productForm, metaFields: newFields });
//                       }}
//                       className="px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
//                       placeholder="Value"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Discount */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-700 mb-3">Discount</h3>
//             <div className="grid grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-xs text-gray-500 mb-1">Type</label>
//                 <select
//                   value={productForm.discount.type}
//                   onChange={(e) => setProductForm({
//                     ...productForm,
//                     discount: { ...productForm.discount, type: e.target.value as 'percentage' | 'fixed' }
//                   })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
//                 >
//                   <option value="percentage">Percentage</option>
//                   <option value="fixed">Fixed</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-xs text-gray-500 mb-1">Amount</label>
//                 <input
//                   type="number"
//                   value={productForm.discount.amount}
//                   onChange={(e) => setProductForm({
//                     ...productForm,
//                     discount: { ...productForm.discount, amount: parseFloat(e.target.value) || 0 }
//                   })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
//                   step="0.01"
//                   min="0"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs text-gray-500 mb-1">Min Cart Value</label>
//                 <input
//                   type="number"
//                   value={productForm.discount.minCartValue}
//                   onChange={(e) => setProductForm({
//                     ...productForm,
//                     discount: { ...productForm.discount, minCartValue: parseFloat(e.target.value) || 0 }
//                   })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#c9a227] focus:border-[#c9a227]"
//                   step="0.01"
//                   min="0"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Lightbox Modal for Images */}
//         {selectedImage && (
//           <div className="fixed inset-0 bg-black bg-opacity-90 z-[60] flex items-center justify-center p-4">
//             <button
//               onClick={() => setSelectedImage(null)}
//               className="absolute top-4 right-4 text-white hover:text-gray-300"
//             >
//               <X className="w-8 h-8" />
//             </button>
//             <img src={selectedImage} alt="Product" className="max-h-full max-w-full object-contain" />
//           </div>
//         )}

//         {/* Footer Actions */}
//         <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleProductSubmit}
//             disabled={loading}
//             className="px-4 py-2 bg-[#c9a227] text-white text-sm font-medium rounded-md hover:bg-[#b8921f] transition-colors flex items-center gap-2 disabled:opacity-50"
//           >
//             {loading ? (
//               <>
//                 <Loader className="w-4 h-4 animate-spin" />
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <Save className="w-4 h-4" />
//                 Save Changes
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }