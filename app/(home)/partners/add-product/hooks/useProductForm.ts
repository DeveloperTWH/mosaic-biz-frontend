import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  ProductFormData, 
  FormErrors, 
  Category, 
  Subcategory, 
  Business, 
  Variant,
  Attribute,
  MetaField,
  Discount,
  SelectedFile,
  UploadProgress,
  UploadResponse,
  ApiProductPayload
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Initial form state matching the structure
const initialFormData: ProductFormData = {
  productTitle: '',
  categoryId: '',
  subCategoryId: '',
  productDescription: '',
  hasVariants: true,
  businessId: '',
  featureImage: '',
  galleryImages: [],
  attributes: [],
  variants: [],
  metaFields: [],
  discount: {
    discountType: 'percentage',
    discountValue: 0,
    costValue: 0
  }
};

// Generate SKU
const generateSKU = (attribute1Value: string, attribute2Value: string, index: number) => {
  const prefix = 'MSKU';
  const attr1 = attribute1Value.substring(0, 2).toUpperCase();
  const attr2 = attribute2Value.substring(0, 2).toUpperCase();
  const num = (index + 1).toString().padStart(3, '0');
  return `${prefix}-${attr1}${attr2}-${num}`;
};

export const useProductForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Data from APIs
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  
  // Upload states
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<string, SelectedFile | null>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's businesses (requires auth)
      const businessRes = await axios.get(`${API_BASE_URL}/api/business/my`, {
        withCredentials: true,
      });
      setBusinesses(businessRes.data.businesses || []);
      
      // Fetch categories - PUBLIC API
      await fetchCategories();
      
      // If only one business, auto-select it
      if (businessRes.data.businesses?.length === 1) {
        handleInputChange('businessId', businessRes.data.businesses[0]._id);
      }
      
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to load required data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories - PUBLIC API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories/products`);
      const categoriesData = response.data.data?.productCategories || [];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  // Fetch subcategories - PUBLIC API
  const fetchSubcategories = async (categoryId: string) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products/subcategories/${categoryId}`);
      setSubcategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast.error('Failed to load subcategories');
    }
  };

  useEffect(() => {
    if (formData.categoryId) {
      fetchSubcategories(formData.categoryId);
    } else {
      setSubcategories([]);
    }
  }, [formData.categoryId]);

  // Handle input changes
  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle attributes
  const addAttribute = () => {
    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, { attributeName: '', attributeValues: [] }],
    }));
  };

  const updateAttribute = (index: number, field: keyof Attribute, value: any) => {
    const updated = [...formData.attributes];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, attributes: updated }));
  };

  const removeAttribute = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
    setFormData(prev => ({ ...prev, variants: [] }));
  };

  const addAttributeValue = (attrIndex: number, value: string) => {
    if (!value.trim()) return;
    const updated = [...formData.attributes];
    updated[attrIndex].attributeValues.push(value.trim());
    setFormData(prev => ({ ...prev, attributes: updated }));
  };

  const removeAttributeValue = (attrIndex: number, valueIndex: number) => {
    const updated = [...formData.attributes];
    updated[attrIndex].attributeValues = updated[attrIndex].attributeValues.filter((_, i) => i !== valueIndex);
    setFormData(prev => ({ ...prev, attributes: updated }));
  };

  // Generate variants from attributes
const generateVariants = () => {
  if (formData.attributes.length < 1) {
    toast.error('Need at least 1 attribute (e.g., Size or Color) to generate variants');
    return;
  }

  for (const attr of formData.attributes) {
    if (attr.attributeValues.length === 0) {
      toast.error(`Add values for "${attr.attributeName || 'attribute'}" before generating variants`);
      return;
    }
  }

  const attr1 = formData.attributes[0];
  const attr2 = formData.attributes[1]; // may be undefined

  const newVariants: Variant[] = [];
  let variantIndex = 0;

  // ✅ If only ONE attribute
  if (!attr2) {
    for (const val1 of attr1.attributeValues) {
      newVariants.push({
        sku: generateSKU(val1, '', variantIndex),
        attribute1Name: attr1.attributeName,
        attribute1Value: val1,
        attribute2Name: '',
        attribute2Value: '',
        price: 0.0,
        salePrice: undefined,
        stock: 0,
        standardShipping: 0,
        overnightShipping: 0,
        localShipping: 0,
        images: []
      });
      variantIndex++;
    }
  } 
  // ✅ If TWO attributes
  else {
    for (const val1 of attr1.attributeValues) {
      for (const val2 of attr2.attributeValues) {
        newVariants.push({
          sku: generateSKU(val1, val2, variantIndex),
          attribute1Name: attr1.attributeName,
          attribute1Value: val1,
          attribute2Name: attr2.attributeName,
          attribute2Value: val2,
          price: 0.0,
          salePrice: undefined,
          stock: 0,
          standardShipping: 0,
          overnightShipping: 0,
          localShipping: 0,
          images: []
        });
        variantIndex++;
      }
    }
  }

  setFormData(prev => ({ ...prev, variants: newVariants, hasVariants: true }));
  toast.success(`Generated ${newVariants.length} variants`);
};

  // const generateVariants = () => {
  //   if (formData.attributes.length < 1) {
  //     toast.error('Need at least 1 attributes (e.g., Size or Color) to generate variants');
  //     return;
  //   }

  //   for (const attr of formData.attributes) {
  //     if (attr.attributeValues.length === 0) {
  //       toast.error(`Add values for "${attr.attributeName || 'attribute'}" before generating variants`);
  //       return;
  //     }
  //   }

  //   const attr1 = formData.attributes[0];
  //   const attr2 = formData.attributes[1];

  //   const newVariants: Variant[] = [];
  //   let variantIndex = 0;

  //   for (const val1 of attr1.attributeValues) {
  //     for (const val2 of attr2.attributeValues) {
  //       newVariants.push({
  //         sku: generateSKU(val1, val2, variantIndex),
  //         attribute1Name: attr1.attributeName,
  //         attribute1Value: val1,
  //         attribute2Name: attr2.attributeName,
  //         attribute2Value: val2,
  //         price: 129.00,
  //         stock: 24,
  //         availability: 24,
  //         standardShipping: 0,
  //         overnightShipping: 0,
  //         localShipping: 0,
  //         images: [] // Initialize empty images array
  //       });
  //       variantIndex++;
  //     }
  //   }

  //   setFormData(prev => ({ ...prev, variants: newVariants, hasVariants: true }));
  //   toast.success(`Generated ${newVariants.length} variants`);
  // };

  // Update variant
  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const updated = [...formData.variants];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, variants: updated }));
  };

  // Update all variants shipping
  const updateAllShipping = (field: 'standardShipping' | 'overnightShipping' | 'localShipping', value: number) => {
    const updated = formData.variants.map(variant => ({
      ...variant,
      [field]: value
    }));
    setFormData(prev => ({ ...prev, variants: updated }));
  };

  // Remove variant
  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // Toggle hasVariants
const toggleHasVariants = (value: boolean) => {
  setFormData(prev => ({
    ...prev,
    hasVariants: value,
    variants: value
      ? prev.variants
      : [
          {
            sku: '',
            attribute1Name: '',
            attribute1Value: '',
            attribute2Name: '',
            attribute2Value: '',
            price: 0,
            salePrice: undefined,
            stock: 0,
            standardShipping: 0,
            overnightShipping: 0,
            localShipping: 0,
            images: [],
          },
        ],
  }));
};

  // const toggleHasVariants = (value: boolean) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     hasVariants: value,
  //     variants: value ? prev.variants : []
  //   }));
  // };

  // Meta fields
  const addMetaField = () => {
    setFormData(prev => ({
      ...prev,
      metaFields: [...prev.metaFields, { metaFieldName: '', metaFieldValue: '' }],
    }));
  };

  const updateMetaField = (index: number, field: keyof MetaField, value: string) => {
    const updated = [...formData.metaFields];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, metaFields: updated }));
  };

  const removeMetaField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      metaFields: prev.metaFields.filter((_, i) => i !== index),
    }));
  };

  // Discount
  const updateDiscount = (field: keyof Discount, value: any) => {
    setFormData(prev => ({
      ...prev,
      discount: { ...prev.discount, [field]: value }
    }));
  };

  // File upload for feature and gallery images
  const handleFileUpload = async (type: 'feature' | 'gallery', file: File): Promise<void> => {
    try {
      setUploading(prev => ({ ...prev, [type]: true }));
      setUploadProgress(prev => ({ ...prev, [type]: 0 }));

      const interval = setInterval(() => {
        setUploadProgress(prev => ({
          ...prev,
          [type]: Math.min((prev[type] || 0) + 10, 90)
        }));
      }, 200);

      const documentType = type === 'feature' ? 'product-cover' : 'product-gallery';
      
      const response = await fetch(
        `${API_BASE_URL}/api/product/upload-url?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}&documentType=${documentType}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const data: UploadResponse = await response.json();

      // Upload to S3
      const uploadResponse = await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }

      clearInterval(interval);
      setUploadProgress(prev => ({ ...prev, [type]: 100 }));

      // Update form data with file URL
      if (type === 'feature') {
        setFormData(prev => ({ ...prev, featureImage: data.fileUrl }));
        setErrors(prev => {
          const next = { ...prev };
          delete next.featureImage;
          return next;
        });
      } else {
        setFormData(prev => ({
          ...prev,
          galleryImages: [...prev.galleryImages, data.fileUrl],
        }));
        setErrors(prev => {
          const next = { ...prev };
          delete next.galleryImages;
          return next;
        });
      }

      toast.success('File uploaded successfully!');

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
      setTimeout(() => {
        setUploadProgress(prev => ({ ...prev, [type]: 0 }));
      }, 2000);
    }
  };

  // Upload variant image
  const handleVariantImageUpload = async (file: File, variantIndex: number): Promise<string> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/product/upload-url?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}&documentType=product-variant&variantIndex=${variantIndex}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const data: UploadResponse = await response.json();

      const uploadResponse = await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }

      return data.fileUrl;
    } catch (error) {
      console.error('Variant image upload error:', error);
      throw error;
    }
  };

  // Remove image
  const removeImage = (type: 'feature' | 'gallery', index?: number) => {
    if (type === 'feature') {
      handleInputChange('featureImage', '');
    } else if (type === 'gallery' && index !== undefined) {
      const updated = formData.galleryImages.filter((_, i) => i !== index);
      handleInputChange('galleryImages', updated);
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.productTitle.trim()) newErrors.productTitle = 'Product title is required';
    if (!formData.productDescription.trim()) newErrors.productDescription = 'Description is required';
    if (!formData.businessId) newErrors.businessId = 'Business is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.subCategoryId) newErrors.subCategoryId = 'Subcategory is required';
    if (!formData.featureImage.trim()) newErrors.featureImage = 'Cover image is required';
    if (!formData.galleryImages.length) newErrors.galleryImages = 'At least one gallery image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Transform to API payload
  const transformToApiPayload = (): ApiProductPayload => {
    // Default placeholder image for variants if none provided
    const defaultVariantImage = 'https://via.placeholder.com/300x300?text=Product+Image';
    
    return {
      title: formData.productTitle,
      description: formData.productDescription,
      categoryId: formData.categoryId,
      subcategoryId: formData.subCategoryId,
      businessId: formData.businessId,
      attributes: formData.attributes.map(attr => ({
        name: attr.attributeName,
        values: attr.attributeValues
      })),
      shipping: {
        standard: formData.variants[0]?.standardShipping || 0,
        overnight: formData.variants[0]?.overnightShipping || 0,
        local: formData.variants[0]?.localShipping || 0
      },
      coverImage: formData.featureImage || '',
      galleryImages: formData.galleryImages,
      metaFields: formData.metaFields.map(field => ({
        key: field.metaFieldName,
        value: field.metaFieldValue
      })),
      discount: formData.discount.discountValue > 0 ? {
        type: formData.discount.discountType,
        amount: formData.discount.discountValue,
        minCartValue: formData.discount.costValue > 0 ? formData.discount.costValue : undefined
      } : undefined,
      variants: formData.variants.map(variant => {
        const attributes: Record<string, string> = {};

        if (variant.attribute1Name?.trim() && variant.attribute1Value?.trim()) {
          attributes[variant.attribute1Name] = variant.attribute1Value;
        }
        if (variant.attribute2Name?.trim() && variant.attribute2Value?.trim()) {
          attributes[variant.attribute2Name] = variant.attribute2Value;
        }

        return {
          attributes,
          price: variant.price,
          salePrice:
            variant.salePrice !== undefined && variant.salePrice > 0
              ? variant.salePrice
              : undefined,
          stock: variant.stock,
          images: variant.images && variant.images.length > 0 ? variant.images : [defaultVariantImage],
          sku: variant.sku,
          shipping: {
            standard: variant.standardShipping || 0,
            overnight: variant.overnightShipping || 0,
            local: variant.localShipping || 0
          }
        };
      }),
      isPublished: true
    };
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    
    const isValid = validateForm();
    console.log('Validation result:', isValid);
    
    if (!isValid) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      
      const apiPayload = transformToApiPayload();
      console.log('Sending to API:', JSON.stringify(apiPayload, null, 2));
      
      const response = await axios.post(
        `${API_BASE_URL}/api/product`,
        apiPayload,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('API response:', response.data);
      toast.success('Product created successfully!');
      router.push(`/partners/products/`);
      
    } catch (error: any) {
  console.error('Error creating product:', error);
  console.error('Error response:', error.response?.data);

  const backendError = error.response?.data;

  let errorMessage = 'Failed to create product';

  if (backendError?.error?.message) {
    errorMessage = backendError.error.message;
  } else if (backendError?.message) {
    errorMessage = backendError.message;
  }

  toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    formData,
    errors,
    businesses,
    categories,
    subcategories,
    uploading,
    uploadProgress,
    selectedFiles,
    handleInputChange,
    handleSubmit,
    toggleHasVariants,
    // Attributes
    attributes: formData.attributes,
    addAttribute,
    updateAttribute,
    removeAttribute,
    addAttributeValue,
    removeAttributeValue,
    // Variants
    variants: formData.variants,
    generateVariants,
    updateVariant,
    updateAllShipping,
    removeVariant,
    // Meta fields
    metaFields: formData.metaFields,
    addMetaField,
    updateMetaField,
    removeMetaField,
    // Discount
    discount: formData.discount,
    updateDiscount,
    // Upload
    handleFileUpload,
    handleVariantImageUpload, // Export this for variant image uploads
    removeImage,
  };
};
