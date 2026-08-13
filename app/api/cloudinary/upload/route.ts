import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!folder) {
      return NextResponse.json(
        { error: "No folder provided" },
        { status: 400 }
      );
    }

    const cloudName =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName) {
      return NextResponse.json(
        {
          error:
            "Cloudinary cloud name is not configured",
        },
        { status: 500 }
      );
    }

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        {
          error:
            "Cloudinary API Key / API Secret is not configured",
        },
        { status: 500 }
      );
    }

    // ============================================
    // CLOUDINARY SIGNED UPLOAD
    // ============================================

    const timestamp = Math.round(
      Date.now() / 1000
    ).toString();

    // Parameter yang ditandatangani harus sama
    // dengan parameter yang dikirim ke Cloudinary.
    const strToSign =
      `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

    const signature = crypto
      .createHash("sha1")
      .update(strToSign)
      .digest("hex");

    // ============================================
    // FORM DATA
    // ============================================

    const uploadData = new FormData();

    uploadData.append("file", file);
    uploadData.append("folder", folder);
    uploadData.append("timestamp", timestamp);
    uploadData.append("api_key", apiKey);
    uploadData.append("signature", signature);

    // ============================================
    // UPLOAD
    // ============================================

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "Cloudinary upload error:",
        data
      );

      return NextResponse.json(
        {
          error:
            data.error?.message ||
            "Failed to upload image to Cloudinary",
        },
        {
          status: response.status,
        }
      );
    }

    return NextResponse.json({
      success: true,
      url: data.secure_url,
      public_id: data.public_id,
      folder: data.asset_folder,
    });
  } catch (error: any) {
    console.error(
      "Cloudinary upload API route error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}