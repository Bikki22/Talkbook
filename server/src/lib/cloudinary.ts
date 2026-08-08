import { v2 as cloudinary } from "cloudinary";
import { ValidationError } from "../types/app-error";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET ?? "t6ccjtoh";
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export type CloudinaryUploadResult = {
  secureUrl: string;
  publicId: string;
  bytes: number;
  originalFilename: string;
  resourceType: "raw" | "image";
};

type CloudinaryUploadResponse = {
  secure_url: string;
  public_id: string;
  bytes: number;
  resource_type?: string;
  error?: { message: string };
};

export function getSignedCloudinaryDownloadUrl(
  publicId: string,
  resourceType: "raw" | "image" = "raw",
) {
  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary.url(publicId, {
    resource_type: resourceType,
    type: "upload",
    sign_url: true,
    secure: true,
  });
}

export async function uploadPdfToCloudinary(
  buffer: Buffer,
  filename: string,
): Promise<CloudinaryUploadResult> {
  if (!cloudName) {
    throw new ValidationError("Cloudinary is not configured on the server");
  }

  const form = new FormData();
  form.append(
    "file",
    new Blob([new Uint8Array(buffer)], { type: "application/pdf" }),
  );

  form.append("upload_preset", uploadPreset);
  form.append("folder", "Talkbook/pdfs");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
    {
      method: "POST",
      body: form,
    },
  );

  const result = (await response.json()) as CloudinaryUploadResponse;

  if (!response.ok) {
    const message =
      result.error?.message ?? `Cloudinary upload failed (${response.status})`;

    if (response.status === 403) {
      throw new ValidationError(
        "cloudinary rejected the upload. check CLOUDINARY_UPLOAD_PRESET in server/.env  match an unsigned preset in your dashboard",
      );
    }

    throw new ValidationError(message);
  }

  return {
    secureUrl: result.secure_url,
    publicId: result.public_id,
    bytes: result.bytes,
    originalFilename: filename,
    resourceType: result.resource_type === "image" ? "image" : "raw",
  };
}
