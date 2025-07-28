"use client";

import React from "react";

interface ProductPricingProps {
  productData: any;
  setProductData: React.Dispatch<React.SetStateAction<any>>;
}

const ProductPricing: React.FC<ProductPricingProps> = ({
  productData,
  setProductData,
}) => {
  const handleChange = (field: string, value: string) => {
    setProductData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-lg font-semibold">Product Pricing</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Regular Price */}
        <div>
          <label className="block mb-1 text-sm font-medium">Regular Price</label>
          <input
            type="number"
            value={productData.regularPrice}
            onChange={(e) => handleChange("regularPrice", e.target.value)}
            placeholder="Enter regular price"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Sale Price */}
        <div>
          <label className="block mb-1 text-sm font-medium">Sale Price</label>
          <input
            type="number"
            value={productData.salePrice}
            onChange={(e) => handleChange("salePrice", e.target.value)}
            placeholder="Enter sale price"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Discount */}
        <div>
          <label className="block mb-1 text-sm font-medium">Discount (%)</label>
          <input
            type="number"
            value={productData.discount}
            onChange={(e) => handleChange("discount", e.target.value)}
            placeholder="Enter discount %"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Minimum Order Quantity */}
        <div>
          <label className="block mb-1 text-sm font-medium">Minimum Order Quantity</label>
          <input
            type="number"
            value={productData.minOrderQty}
            onChange={(e) => handleChange("minOrderQty", e.target.value)}
            placeholder="Enter minimum order quantity"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Info Text */}
      <p className="mt-3 text-xs text-gray-500">
        * Sale price and discount are optional. If not provided, the regular price will be used as the selling price.
      </p>
    </div>
  );
};

export default ProductPricing;
