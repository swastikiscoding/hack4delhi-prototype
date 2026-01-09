import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

const toSafePublicId = (filename) => {
  const base = String(filename || "proof")
    .replace(/\.pdf$/i, "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return `${base || "proof"}-${Date.now()}`;
};

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = () => {
  return Boolean(cloudName && apiKey && apiSecret);
};

export const configureCloudinary = () => {
  if (!isCloudinaryConfigured()) return;
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
};

export const uploadPdfBuffer = async ({ buffer, filename, folder }) => {
  configureCloudinary();

  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET",
    );
  }

  const publicId = toSafePublicId(filename);

  return await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        // Upload as an "image" resource so the delivery URL is /image/upload/.../*.pdf
        // This is generally more compatible than /raw/upload for PDF viewing.
        resource_type: "image",
        folder: folder || "uer/proofs",
        public_id: publicId,
        format: "pdf",
        allowed_formats: ["pdf"],
        // Cloudinary can reject `q_auto` (often applied via upload presets / incoming transformations)
        // when the output format is PDF unless the incoming transformation is async.
        async: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) return reject(error);

        const secureUrl =
          result?.secure_url ||
          result?.url ||
          (result?.public_id
            ? cloudinary.url(result.public_id, {
                secure: true,
                resource_type: "image",
                format: "pdf",
              })
            : "");

        if (!secureUrl) {
          return reject(
            new Error("Cloudinary upload succeeded but no URL was returned"),
          );
        }

        return resolve({ ...result, secure_url: secureUrl });
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};
