import "server-only";
import { randomBytes } from "node:crypto";
import { writeFile, unlink, mkdir } from "node:fs/promises";
import path from "node:path";

/**
 * Local filesystem upload storage for development.
 *
 * Production is designed for object storage (S3/R2 — see docs/architecture.md §8).
 * This module is the single seam to swap: replace saveUpload/deleteUpload's bodies with
 * signed-upload calls to the object store, keep the same function signatures, and every
 * admin action that calls them keeps working unchanged.
 */

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

type FileKind = "image" | "document";

const ALLOWED_TYPES: Record<FileKind, Record<string, number[][]>> = {
  // MIME type -> list of acceptable magic-byte signatures (first N bytes)
  image: {
    "image/jpeg": [[0xff, 0xd8, 0xff]],
    "image/png": [[0x89, 0x50, 0x4e, 0x47]],
    "image/webp": [[0x52, 0x49, 0x46, 0x46]], // "RIFF" (WEBP checked further below)
  },
  document: {
    "application/pdf": [[0x25, 0x50, 0x44, 0x46]], // "%PDF"
    "image/jpeg": [[0xff, 0xd8, 0xff]],
    "image/png": [[0x89, 0x50, 0x4e, 0x47]],
  },
};

const MAX_SIZE: Record<FileKind, number> = {
  image: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
};

export class UploadValidationError extends Error {}

function matchesSignature(bytes: Buffer, signature: number[]) {
  return signature.every((byte, i) => bytes[i] === byte);
}

function detectType(bytes: Buffer, kind: FileKind, declaredType: string): string | null {
  const candidates = ALLOWED_TYPES[kind];
  for (const [mime, signatures] of Object.entries(candidates)) {
    if (signatures.some((sig) => matchesSignature(bytes, sig))) {
      if (mime === "image/webp") {
        // RIFF containers are also used by WAV/AVI — confirm the WEBP fourcc at offset 8.
        const fourCc = bytes.subarray(8, 12).toString("ascii");
        if (fourCc !== "WEBP") continue;
      }
      return mime;
    }
  }
  // Fall back to the browser-declared type only if it's in the allowlist — never trust
  // it alone, but don't hard-fail a valid file whose signature we didn't special-case.
  return declaredType in candidates ? declaredType : null;
}

export async function saveUpload(file: File, kind: FileKind) {
  if (file.size === 0) throw new UploadValidationError("The selected file is empty.");
  if (file.size > MAX_SIZE[kind]) {
    throw new UploadValidationError(
      `File is too large. Maximum size is ${MAX_SIZE[kind] / (1024 * 1024)}MB.`
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detectedType = detectType(buffer, kind, file.type);
  if (!detectedType) {
    throw new UploadValidationError(
      kind === "image"
        ? "Unsupported file type. Please upload a JPG, PNG, or WebP image."
        : "Unsupported file type. Please upload a PDF, JPG, or PNG file."
    );
  }

  await mkdir(UPLOAD_ROOT, { recursive: true });

  const extension = detectedType.split("/")[1].replace("jpeg", "jpg");
  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${extension}`;
  const filePath = path.join(UPLOAD_ROOT, filename);

  await writeFile(filePath, buffer);

  return {
    url: `/uploads/${filename}`,
    fileType: detectedType,
    fileSize: buffer.byteLength,
  };
}

export async function deleteUpload(url: string) {
  if (!url.startsWith("/uploads/")) return; // never delete seeded/static assets outside the upload dir
  const filePath = path.join(process.cwd(), "public", url);
  await unlink(filePath).catch(() => {});
}
