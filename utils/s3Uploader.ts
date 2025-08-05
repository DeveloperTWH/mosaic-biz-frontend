import axios from "axios";

export const uploadToS3 = async (file: File): Promise<string> => {
  try {
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

    // ✅ 2. Get Pre-Signed URL from backend
    console.log(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/s3-presigned-url`);
    
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/s3-presigned-url`,
      {
        params: { fileName: file.name, fileType },
        withCredentials: true, // ✅ Needed if backend requires auth
      }
    );

    const { uploadUrl, fileUrl } = data;
    if (!uploadUrl || !fileUrl) {
      throw new Error("Invalid S3 presigned URL response");
    }

    console.log("🔗 Presigned URL received:", uploadUrl);

    // ✅ 3. Upload File to S3 (with proper headers & large file support)
    await axios.put(uploadUrl, file, {
      headers: { "Content-Type": fileType },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    console.log("✅ Successfully Uploaded to S3:", fileUrl);
    return fileUrl;
  } catch (error) {
    console.error("❌ S3 Upload Error:", error);
    throw new Error("Failed to upload file to S3");
  }
};
