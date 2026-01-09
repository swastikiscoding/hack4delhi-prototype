import { Router } from "express";
import multer from "multer";

import { verifyVoter } from "../middlewares/voter.middleware.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadPdfBuffer } from "../utils/cloudinary.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (_req, file, cb) => {
    const isPdf = file.mimetype === "application/pdf";
    if (!isPdf) {
      return cb(new ApiError(400, "Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

router.post(
  "/proof",
  verifyVoter,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, "PDF file is required");
    }

    const result = await uploadPdfBuffer({
      buffer: req.file.buffer,
      filename: req.file.originalname,
      folder: "uer/proofs",
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          url: result.secure_url,
          publicId: result.public_id,
        },
        "Proof uploaded",
      ),
    );
  }),
);

export { router as uploadRouter };
