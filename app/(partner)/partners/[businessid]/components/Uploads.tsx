"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Camera, Pencil, X } from "lucide-react";
import {uploadToS3} from "@/utils/s3Uploader"; // must return a public URL string
import { toast } from "react-toastify";
import { Business } from '@/types/business';

export default function BrandAssetsLinkedInStyle({
  setShowUploadScreen,
  business,
}: {
  setShowUploadScreen: React.Dispatch<React.SetStateAction<boolean>>;
  business: Business | null;
}) {
  const [logoFile, setLogoFile] = useState<File | undefined>();
  const [coverFile, setCoverFile] = useState<File | undefined>();
  const [logoPreview, setLogoPreview] = useState<string | undefined>();
  const [coverPreview, setCoverPreview] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  

  // previews
  useEffect(() => {
    if (logoFile) {
      const url = URL.createObjectURL(logoFile);
      setLogoPreview(url);
      return () => URL.revokeObjectURL(url);
    } else setLogoPreview(undefined);
  }, [logoFile]);

  useEffect(() => {
    if (coverFile) {
      const url = URL.createObjectURL(coverFile);
      setCoverPreview(url);
      return () => URL.revokeObjectURL(url);
    } else setCoverPreview(undefined);
  }, [coverFile]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setLogoFile(f);
  };
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setCoverFile(f);
  };

  // PUT default logo on skip
  const onSkip = async () => {
    try {
      setIsSaving(true);
      const defaultLogo =
        "https://upload.wikimedia.org/wikipedia/commons/d/dc/No_Preview_image_2.png";

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business/${business?._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ logo: defaultLogo }),
        }
      );
      if (!res.ok) throw new Error("Business update failed");
      setShowUploadScreen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to set default logo");
    } finally {
      setIsSaving(false);
    }
  };

  // Upload to S3 (presigned) then PUT URLs as JSON
  const onSave = async () => {
    if (!business?._id) return;
    try {
      setIsSaving(true);

      let logoUrl: string | undefined;
      let coverUrl: string | undefined;

      if (logoFile) logoUrl = await uploadToS3(logoFile);
      if (coverFile) coverUrl = await uploadToS3(coverFile);

      const payload: Record<string, any> = {};
      if (logoUrl) payload.logo = logoUrl;
      if (coverUrl) payload.coverImage = coverUrl;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business/${business._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Business update failed");
      setShowUploadScreen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload and save images");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden border">
        {/* Header */}
        <div className="px-6 pt-6">
          <h2 className="text-2xl font-bold text-gray-800">Set up your business profile</h2>
          <p className="text-sm text-gray-500 mt-1">
            Add a cover image and a logo. We’ll show them like LinkedIn: banner behind, logo on top.
          </p>
        </div>

        {/* Banner */}
        <div className="relative group mt-6">
          <div className="relative w-full h-48 sm:h-56 md:h-64 bg-gray-200">
            {coverPreview ? (
              <Image
                src={coverPreview}
                alt="Cover preview"
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Camera className="w-10 h-10" />
              </div>
            )}

            {/* Change cover */}
            <label className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onClick={(e) => ((e.currentTarget as HTMLInputElement).value = "")}
                onChange={handleCoverChange}
                className="hidden"
              />
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 hover:bg-white/100 text-sm text-gray-700 border shadow-sm">
                <Pencil className="w-4 h-4" />
                Change cover
              </span>
            </label>

            {/* Remove cover */}
            {coverPreview && (
              <button
                type="button"
                onClick={() => {
                  setCoverFile(undefined);
                  if (coverInputRef.current) coverInputRef.current.value = "";
                }}
                className="absolute right-4 top-4 translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all rounded-lg bg-white/80 hover:bg-white p-2 border shadow-sm"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>
            )}
          </div>

          {/* Logo overlapping */}
          <div className="absolute left-6 -bottom-12">
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md">
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Camera className="w-8 h-8" />
                  </div>
                )}
              </div>

              {/* Change logo */}
              <label className="absolute right-0 bottom-0 translate-x-2 translate-y-2">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onClick={(e) => ((e.currentTarget as HTMLInputElement).value = "")}
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-xs text-white font-medium shadow">
                  <Pencil className="w-3.5 h-3.5" />
                  Change
                </span>
              </label>

              {/* Remove logo */}
              {logoPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setLogoFile(undefined);
                    if (logoInputRef.current) logoInputRef.current.value = "";
                  }}
                  className="absolute -right-2 -top-2 rounded-full bg-white hover:bg-gray-100 p-1.5 border shadow-sm"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="h-16" />

        {/* Actions */}
        <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
          <button
            type="button"
            onClick={onSkip}
            className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors disabled:opacity-50"
            disabled={isSaving}
          >
            Skip
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
            disabled={isSaving || (!logoFile && !coverFile)}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
