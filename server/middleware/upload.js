import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// server/uploads — sibling of middleware/, regardless of where the process is started from.
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

// Matches ALLOWED_IMAGE_TYPES / MAX_IMAGE_BYTES in the frontend's ReportIssue.jsx
// so both layers reject the same invalid files.
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
    const safeExtension = path.extname(file.originalname).toLowerCase();
    cb(null, `report-${uniqueSuffix}${safeExtension}`);
  },
});

function fileFilter(_req, file, cb) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    const error = new Error("Only JPG, PNG, or WEBP images are allowed.");
    error.statusCode = 400;
    cb(error);
    return;
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1,
  },
});

/**
 * Wraps multer's single-file upload so its errors (wrong type, file too
 * large, unexpected field) reach errorHandler.js in a consistent shape
 * instead of multer's raw MulterError.
 */
function uploadComplaintImage(req, res, next) {
  upload.single("image")(req, res, (error) => {
    if (!error) return next();

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        error.statusCode = 400;
        error.message = "Image must be smaller than 5MB.";
      } else {
        error.statusCode = 400;
      }
    }

    next(error);
  });
}

export default uploadComplaintImage;
export { UPLOAD_DIR, ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES };