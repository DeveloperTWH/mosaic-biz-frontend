"use client";

import React, { useState } from "react";

interface ProductVisibilityProps {
  productData: any;
  setProductData: React.Dispatch<React.SetStateAction<any>>;
}

const ProductVisibility: React.FC<ProductVisibilityProps> = ({
  productData,
  setProductData,
}) => {
  const [scheduleDate, setScheduleDate] = useState("");

  const handleChange = (field: string, value: string) => {
    setProductData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-lg font-semibold">Product Visibility</h2>

      {/* Visibility Options */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">Visibility</label>
        <div className="flex gap-4">
          {["published", "schedule", "hidden"].map((status) => (
            <label key={status} className="flex items-center gap-1 capitalize">
              <input
                type="radio"
                name="visibility"
                checked={productData.visibility === status}
                onChange={() => handleChange("visibility", status)}
              />
              {status}
            </label>
          ))}
        </div>
      </div>

      {/* Schedule Date (Only if schedule is selected) */}
      {productData.visibility === "schedule" && (
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">
            Schedule Publish Date
          </label>
          <input
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => {
              setScheduleDate(e.target.value);
              handleChange("scheduleDate", e.target.value);
            }}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      )}

      {/* Visible To */}
      <div>
        <label className="block mb-1 text-sm font-medium">Visible To</label>
        <select
          value={productData.visibleTo}
          onChange={(e) => handleChange("visibleTo", e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="both">Both Vendor & Customer</option>
          <option value="vendor">Vendor Only</option>
          <option value="customer">Customer Only</option>
        </select>
      </div>
    </div>
  );
};

export default ProductVisibility;
