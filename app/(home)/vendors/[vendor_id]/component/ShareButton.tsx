"use client";

import { Forward } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ShareButton() {
  const handleCopy = async () => {
    console.log("Share button clicked");
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("URL copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy URL.");
      console.error(error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-2 cursor-pointer px-3 py-2 border rounded-md hover:bg-gray-100"
    >
      <Forward />
      Share
    </button>
  );
}
