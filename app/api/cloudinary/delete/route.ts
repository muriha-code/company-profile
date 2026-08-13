import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

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
    console.error("Firebase token verification error during delete:", err);
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

    const body = await req.json();
    const { public_id } = body;

    if (!public_id) {
      return NextResponse.json(
        { error: "No public_id provided for deletion" },
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

    // Sorted parameters to sign: public_id, timestamp
    const strToSign = `public_id=${public_id}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(strToSign).digest("hex");

    const deleteData = new FormData();
    deleteData.append("public_id", public_id);
    deleteData.append("timestamp", timestamp);
    deleteData.append("api_key", apiKey);
    deleteData.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: "POST",
        body: deleteData,
      }
    );

    const data = await response.json();

    if (!response.ok || data.result !== "ok") {
      console.warn("Cloudinary delete response:", data);
      return NextResponse.json(
        {
          error: data.error?.message || "Failed to delete asset from Cloudinary",
          result: data.result,
        },
        { status: response.status || 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Asset successfully deleted from Cloudinary",
      public_id,
    });
  } catch (error: any) {
    console.error("Cloudinary delete API route error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
