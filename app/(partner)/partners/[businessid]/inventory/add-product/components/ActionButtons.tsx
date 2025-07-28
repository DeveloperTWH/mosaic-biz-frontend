"use client";

import React from "react";

interface ActionButtonsProps {
  productData: any;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ productData }) => {
  const handleSaveDraft = () => {
    console.log("Saving as Draft:", productData);
    // 👉 API call for saving draft will go here
  };

  const handlePublish = () => {
    console.log("Publishing Product:", productData);
    // 👉 API call for publishing product will go here
  };

  const handleDelete = () => {
    console.log("Deleting Product...");
    // 👉 API call for deleting product will go here
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-md">
      <button
        type="button"
        onClick={handleSaveDraft}
        className="px-4 py-2 text-sm font-semibold text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
      >
        Save Draft
      </button>

      <button
        type="button"
        onClick={handlePublish}
        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Publish Product
      </button>

      <button
        type="button"
        onClick={handleDelete}
        className="px-4 py-2 text-sm font-semibold text-red-600 bg-transparent border border-red-600 rounded-md hover:bg-red-100"
      >
        Delete Product
      </button>
    </div>
  );
};

export default ActionButtons;
