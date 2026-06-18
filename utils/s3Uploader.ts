import axios from "axios";

export type GalleryImageType =
  | "product-gallery"
  | "service-gallery"
  | "food-gallery";

/**
 * Thrown when the backend returns 403 (gallery limit reached for the partner's plan).
 */
export class GalleryLimitError extends Error {
  constructor(message = "Gallery image limit reached for your plan.") {
    super(message);
    this.name = "GalleryLimitError";
  }
}

interface UploadOptions {
  /**
   * Pass this for gallery images so the backend can enforce per-plan limits.
   * Do NOT pass for cover images, variant images, menu images, child service images.
   */
  galleryType?: GalleryImageType;
  /**
   * Number of images already in the gallery array.
   * Required when galleryType is provided.
   */
  currentImageCount?: number;
}

export const uploadToS3 = async (
  file: File,
  options?: UploadOptions
): Promise<string> => {
  // ✅ 1. Ensure the file has a valid MIME type
  let fileType = file.type;
  if (!fileType || fileType.trim() === "") {
    const ext = file.name.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "jpg":
      case "jpeg":
        fileType = "image/jpeg";
        break;
      case "png":
        fileType = "image/png";
        break;
      case "mp4":
        fileType = "video/mp4";
        break;
      default:
        fileType = "application/octet-stream";
    }
  }

  console.log(`📤 Uploading File: ${file.name}, Type: ${fileType}`);

  try {
    let uploadUrl: string;
    let fileUrl: string;

    if (options?.galleryType !== undefined) {
      // ✅ 2a. Gallery upload – use the tier-enforced endpoint
      const currentImageCount = options.currentImageCount ?? 0;
      console.log(
        `📊 Gallery upload – type: ${options.galleryType}, currentCount: ${currentImageCount}`
      );

      let response;
      try {
        response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/presigned-url`,
          {
            params: {
              type: options.galleryType,
              currentImageCount,
              fileName: file.name,
              fileType,
            },
            withCredentials: true,
          }
        );
      } catch (err: any) {
        if (err?.response?.status === 403) {
          // Backend says limit exceeded – surface a clear, plan-specific error
          const msg: string =
            err.response?.data?.message ||
            err.response?.data?.error ||
            "Gallery image limit reached for your plan.";
          throw new GalleryLimitError(msg);
        }
        throw err;
      }

      uploadUrl = response.data.uploadUrl;
      fileUrl = response.data.fileUrl;
    } else {
      // ✅ 2b. Non-gallery upload – use the original generic endpoint
      console.log(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/s3-presigned-url`
      );
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/s3-presigned-url`,
        {
          params: { fileName: file.name, fileType },
          withCredentials: true,
        }
      );
      uploadUrl = data.uploadUrl;
      fileUrl = data.fileUrl;
    }

    if (!uploadUrl || !fileUrl) {
      throw new Error("Invalid S3 presigned URL response");
    }

    console.log("🔗 Presigned URL received:", uploadUrl);

    // ✅ 3. Upload File to S3
    await axios.put(uploadUrl, file, {
      headers: { "Content-Type": fileType },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    console.log("✅ Successfully Uploaded to S3:", fileUrl);
    return fileUrl;
  } catch (error) {
    if (error instanceof GalleryLimitError) {
      // Re-throw as-is so callers can show the right toast
      throw error;
    }
    console.error("❌ S3 Upload Error:", error);
    throw new Error("Failed to upload file to S3");
  }
};
