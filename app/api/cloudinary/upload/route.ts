import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { slugify } from "@/lib/utils/slugify";

const ALLOWED_FOLDERS = [
  "growthline/hero",
  "growthline/logos",
  "growthline/portfolio",
  "growthline/services",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

async function verifyFirebaseToken(authHeader: string | null): Promise<boolean> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const idToken = authHeader.split("Bearer ")[1]?.trim();
  if (!idToken) return false;

  const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!firebaseApiKey) return true;

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );
    const data = await res.json();
    return res.ok && Array.isArray(data.users) && data.users.length > 0;
  } catch (err) {
    console.error("Firebase token verification error:", err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader) {
      const isValidUser = await verifyFirebaseToken(authHeader);
      if (!isValidUser) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid or expired Firebase Auth token" },
          { status: 401 }
        );
      }
    }

    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string | null;
    const rawPublicId = (formData.get("public_id") || formData.get("slug")) as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided for upload" },
        { status: 400 }
      );
    }

    if (!file.type || !file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Only image files (JPEG, PNG, WebP, GIF, SVG) are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum allowed limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB.` },
        { status: 400 }
      );
    }

    if (!folder) {
      return NextResponse.json(
        { error: "No folder specified for upload" },
        { status: 400 }
      );
    }

    if (!ALLOWED_FOLDERS.includes(folder)) {
      return NextResponse.json(
        {
          error: `Folder '${folder}' is not whitelisted. Allowed folders: ${ALLOWED_FOLDERS.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary credentials (Cloud Name, API Key, API Secret) are incomplete" },
        { status: 500 }
      );
    }

    const timestamp = Math.round(Date.now() / 1000).toString();
    const uploadData = new FormData();

    uploadData.append("file", file);
    uploadData.append("folder", folder);

    let strToSign = "";
    let cleanPublicId = "";

    if (rawPublicId && rawPublicId.trim() !== "") {
      // Ensure public_id is clean slug without folder prefix if user passed full folder path
      cleanPublicId = rawPublicId.includes("/")
        ? rawPublicId.split("/").pop()!
        : rawPublicId;
      cleanPublicId = slugify(cleanPublicId);

      // Alphabetical order for signature: folder, overwrite, public_id, timestamp
      strToSign = `folder=${folder}&overwrite=true&public_id=${cleanPublicId}&timestamp=${timestamp}${apiSecret}`;
      uploadData.append("overwrite", "true");
      uploadData.append("public_id", cleanPublicId);
    } else {
      // Alphabetical order for signature: folder, timestamp
      strToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    }

    const signature = crypto.createHash("sha1").update(strToSign).digest("hex");

    uploadData.append("timestamp", timestamp);
    uploadData.append("api_key", apiKey);
    uploadData.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudinary signed upload error response:", data);
      return NextResponse.json(
        { error: data.error?.message || "Failed to upload image to Cloudinary" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      url: data.secure_url,
      public_id: data.public_id, // Full public_id e.g. "growthline/logos/mckinsey-company"
      folder: folder,
      slug: cleanPublicId,
    });
  } catch (error: any) {
    console.error("Cloudinary upload API route error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}