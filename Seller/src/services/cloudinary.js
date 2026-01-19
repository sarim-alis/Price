// Cloudinary Configuration from environment variables.
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Upload image to Cloudinary.
export const uploadImage = async (file) => {
  // Validate config
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    console.error("Cloudinary config missing:", { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET });
    throw new Error("Cloudinary configuration missing. Check .env file and restart dev server.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    console.log("Cloudinary response:", data);
    if (!response.ok) throw new Error(data.error?.message || "Upload failed");
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

// Upload multiple images.
export const uploadImages = async (files) => {
  const uploads = files.map((file) => uploadImage(file));
  return Promise.all(uploads);
};

// Delete image from Cloudinary (requires backend for signed requests).
export const deleteImage = async (publicId) => {
  // Note: Deletion requires server-side implementation for security
  console.warn("Image deletion requires backend implementation");
};
