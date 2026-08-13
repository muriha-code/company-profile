import { auth } from "@/lib/firebase";

export interface CloudinaryUploadResponse {
  success: boolean;
  url: string;
  public_id: string;
  folder: string;
  slug?: string;
}

/**
 * Upload an image file to Cloudinary via server-side signed API route.
 * Automatically attaches Firebase Auth ID token if logged in.
 *
 * @param file The image File object
 * @param folder The whitelisted Cloudinary folder (e.g. "growthline/logos")
 * @param customPublicId Optional custom public_id / slug (e.g. "mckinsey-company")
 */
export async function uploadToCloudinary(
  file: File,
  folder: "growthline/hero" | "growthline/logos" | "growthline/portfolio" | "growthline/services",
  customPublicId?: string
): Promise<CloudinaryUploadResponse> {
  const uploadFormData = new FormData();
  uploadFormData.append("file", file);
  uploadFormData.append("folder", folder);

  if (customPublicId && customPublicId.trim() !== "") {
    uploadFormData.append("public_id", customPublicId);
  }

  const headers: Record<string, string> = {};

  if (auth.currentUser) {
    try {
      const idToken = await auth.currentUser.getIdToken();
      headers["Authorization"] = `Bearer ${idToken}`;
    } catch (err) {
      console.warn("Could not retrieve Firebase Auth ID token for upload:", err);
    }
  }

  const res = await fetch("/api/cloudinary/upload", {
    method: "POST",
    headers,
    body: uploadFormData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Gagal mengunggah gambar ke Cloudinary");
  }

  return {
    success: true,
    url: data.url,
    public_id: data.public_id,
    folder: data.folder,
    slug: data.slug,
  };
}

/**
 * Delete a Cloudinary asset by its public_id via server-side API route.
 * Automatically attaches Firebase Auth ID token if logged in.
 *
 * @param publicId The full public_id of the asset (e.g. "growthline/logos/mckinsey-company")
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!publicId) return false;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth.currentUser) {
    try {
      const idToken = await auth.currentUser.getIdToken();
      headers["Authorization"] = `Bearer ${idToken}`;
    } catch (err) {
      console.warn("Could not retrieve Firebase Auth ID token for delete:", err);
    }
  }

  try {
    const res = await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers,
      body: JSON.stringify({ public_id: publicId }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Failed to delete Cloudinary asset:", data.error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    return false;
  }
}
