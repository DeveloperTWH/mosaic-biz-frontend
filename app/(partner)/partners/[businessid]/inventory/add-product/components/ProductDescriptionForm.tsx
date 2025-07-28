"use client";

import React from "react";

interface ProductDescriptionFormProps {
  productData: any;
  setProductData: React.Dispatch<React.SetStateAction<any>>;
}

const ProductDescriptionForm: React.FC<ProductDescriptionFormProps> = ({
  productData,
  setProductData,
}) => {
  const handleChange = (field: string, value: string) => {
    setProductData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-lg font-semibold">Product Description</h2>

      {/* Product Name */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">Product Name</label>
        <input
          type="text"
          value={productData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter product name"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Product Description */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">
          Product Description
        </label>
        <textarea
          value={productData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter product description"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
        ></textarea>
      </div>

      {/* Category */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block mb-1 text-sm font-medium">Category</label>
          <select
            value={productData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Category</option>
            <option value="clothing">Clothing</option>
            <option value="footwear">Footwear</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        {/* Sub Category */}
        <div>
          <label className="block mb-1 text-sm font-medium">Sub Category</label>
          <select
            value={productData.subCategory}
            onChange={(e) => handleChange("subCategory", e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Sub Category</option>
            <option value="tshirts">T-Shirts</option>
            <option value="jeans">Jeans</option>
            <option value="jackets">Jackets</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductDescriptionForm;
