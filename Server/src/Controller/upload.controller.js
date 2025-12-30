const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { asyncHandler } = require("../utils/Asynchandler");
const { ok } = require("../utils/Response");
const { cfg } = require("../config/config");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-random-originalname
    // Sanitize filename: replace spaces and special characters with hyphens
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext)
      .replace(/\s+/g, '-')  // Replace spaces with hyphens
      .replace(/[^a-zA-Z0-9\-_]/g, '-')  // Replace special chars with hyphens
      .replace(/-+/g, '-')  // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '');  // Remove leading/trailing hyphens
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!"), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Middleware for single file upload
const uploadSingle = upload.single("image");

/**
 * Upload image file
 * Returns the URL to access the uploaded image
 */
exports.uploadImage = asyncHandler(async (req, res) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ success: false, message: "File too large. Maximum size is 5MB." });
        }
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Generate URL to access the file
    // In development, use localhost; in production, use the configured base URL
    const baseUrl = cfg.NODE_ENV === "development" 
      ? `http://localhost:${cfg.PORT}`
      : cfg.APP_BASE_URL;
    
    // Use filename as-is (spaces will be URL-encoded by the browser automatically)
    // Express static middleware will decode them when serving the file
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

    return ok(res, "Image uploaded successfully", {
      imageUrl: imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  });
});

