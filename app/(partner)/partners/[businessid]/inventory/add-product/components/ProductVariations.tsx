"use client";

import React from "react";

interface ProductVariationsProps {
  productData: any;
  setProductData: React.Dispatch<React.SetStateAction<any>>;
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const genders = ["Male", "Female", "Unisex"];
const colors = ["#000000", "#FFFFFF", "#FF0000", "#0000FF", "#008000", "#FFD700"];
const fabrics = ["Cotton", "Polyester", "Linen", "Wool"];
const fits = ["Regular", "Slim", "Loose"];
const sleeves = ["Full Sleeve", "Half Sleeve", "Sleeveless"];
const patterns = ["Solid", "Striped", "Printed"];
const suitableForOptions = ["Casual", "Formal", "Sports"];

const ProductVariations: React.FC<ProductVariationsProps> = ({
  productData,
  setProductData,
}) => {
  const toggleArrayValue = (field: string, value: string) => {
    setProductData((prev: any) => {
      const currentValues = prev[field] || [];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((v: string) => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: updatedValues };
    });
  };

  const handleChange = (field: string, value: string) => {
    setProductData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-lg font-semibold">Product Variations</h2>

      {/* Sizes */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">Available Sizes</label>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleArrayValue("sizes", size)}
              className={`px-3 py-1 border rounded-md ${
                productData.sizes.includes(size)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">Gender</label>
        <div className="flex gap-4">
          {genders.map((gender) => (
            <label key={gender} className="flex items-center gap-1">
              <input
                type="radio"
                name="gender"
                checked={productData.gender === gender}
                onChange={() => handleChange("gender", gender)}
              />
              {gender}
            </label>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">Available Colors</label>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <div
              key={color}
              onClick={() => toggleArrayValue("colors", color)}
              className={`w-8 h-8 rounded-full cursor-pointer border ${
                productData.colors.includes(color)
                  ? "ring-2 ring-blue-500"
                  : "ring-0"
              }`}
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>
      </div>

      {/* Dropdowns: Fabric, Fit, Sleeve, Pattern, Suitable For */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block mb-1 text-sm font-medium">Fabric</label>
          <select
            value={productData.fabric}
            onChange={(e) => handleChange("fabric", e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Fabric</option>
            {fabrics.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Fit</label>
          <select
            value={productData.fit}
            onChange={(e) => handleChange("fit", e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Fit</option>
            {fits.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Sleeve</label>
          <select
            value={productData.sleeve}
            onChange={(e) => handleChange("sleeve", e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Sleeve</option>
            {sleeves.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Pattern</label>
          <select
            value={productData.pattern}
            onChange={(e) => handleChange("pattern", e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Pattern</option>
            {patterns.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Suitable For</label>
          <select
            value={productData.suitableFor}
            onChange={(e) => handleChange("suitableFor", e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Option</option>
            {suitableForOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductVariations;
