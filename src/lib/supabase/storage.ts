import type { BucketName } from "@/types/database";
import { createClient } from "./client";

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_DOC_TYPES = ["application/pdf"];

function validateFile(file: File, isImage: boolean): string | null {
  const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
  if (file.size > maxBytes) {
    return `File size exceeds ${MAX_FILE_SIZE_MB}MB limit`;
  }

  const allowed = isImage ? ALLOWED_IMAGE_TYPES : ALLOWED_DOC_TYPES;
  if (!allowed.includes(file.type)) {
    return `Invalid file type. Allowed: ${allowed.join(", ")}`;
  }

  return null;
}

function buildPath(entityId: string, fileName: string): string {
  const timestamp = Date.now();
  const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${entityId}/${timestamp}-${sanitized}`;
}

export async function uploadFile(
  bucket: BucketName,
  entityId: string,
  file: File
): Promise<{ url: string; path: string }> {
  const isImage = bucket === "vehicle-images" || bucket === "client-documents";
  const error = validateFile(file, isImage);
  if (error) throw new Error(error);

  const supabase = createClient();
  const path = buildPath(entityId, file.name);

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (uploadError) throw uploadError;

  if (bucket === "vehicle-images") {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return { url: data.publicUrl, path };
  }

  const { data } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 3600);

  return { url: data?.signedUrl ?? "", path };
}

export async function getSignedUrl(
  bucket: BucketName,
  path: string,
  expiresIn = 3600
): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) throw error;
  return data.signedUrl;
}

export async function deleteFile(
  bucket: BucketName,
  path: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}
