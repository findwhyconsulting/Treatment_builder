import multer from "multer";
import fs from "fs";
import path from "path";
import { Error } from "../utils/customeResponse";
import Image from "../models/images";

// Define the base upload folder
const uploadBaseFolder = path.join(__dirname, "../../user-uploads/images");
const uploadPackageFolder = path.join(__dirname, "../../user-uploads/files");
const profileUploadFolder = path.join(__dirname, "../../user-uploads/profiles");
const logoUploadFolder = path.join(__dirname, "../../user-uploads/logos");
const clientImageUploadFolder = path.join(
  __dirname,
  "../../user-uploads/client-images"
);

// Ensure profile upload folder exists
if (!fs.existsSync(profileUploadFolder)) {
  fs.mkdirSync(profileUploadFolder, { recursive: true });
}
// Ensure the base folder exists
if (!fs.existsSync(uploadBaseFolder)) {
  fs.mkdirSync(uploadBaseFolder, { recursive: true });
}
// Ensure the base folder exists
if (!fs.existsSync(uploadPackageFolder)) {
  fs.mkdirSync(uploadPackageFolder, { recursive: true });
}
// Ensure the base folder exists
if (!fs.existsSync(logoUploadFolder)) {
  fs.mkdirSync(logoUploadFolder, { recursive: true });
}
//Ensure the base folder exists
if (!fs.existsSync(clientImageUploadFolder)) {
  fs.mkdirSync(clientImageUploadFolder, { recursive: true });
}

/* Images storage */
// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadBaseFolder); // Save in the images folder
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Use the unique name for the uploaded file
  },
});

// Validate file type
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    // cb(new Error("Only JPG, JPEG, and PNG files are allowed"), false); // Reject file
    cb("Only JPG, JPEG, and PNG files are allowed", false); // Reject file
  }
};

// Initialize multer with storage and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max size: 10MB
});

const uploadSingleImage = (fieldName) => async (req, res, next) => {
  try {
    const uploadHandler = upload.single(fieldName);
    uploadHandler(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return Error(res, 206, "File size exceeds 5MB");
        }
        return Error(res, 206, err.message);
      }
      next();
    });
  } catch (err) {
    return Error(res, 206, "An error occurred while uploading the file");
  }
};

// Middleware for multiple image uploads
const uploadMultipleImages =
  (fieldName, maxCount) => async (req, res, next) => {
    try {
      const uploadHandler = upload.array(fieldName, maxCount);
      uploadHandler(req, res, (err) => {
        if (err) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return Error(res, 206, "File size exceeds 5MB");
          }
          if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return Error(res, 206, `You can upload upto ${maxCount} Files`);
          }
          return Error(res, 206, err.message);
        }
        next();
      });
    } catch (err) {
      console.log("err", err);
      return Error(res, 500, "An error occurred while uploading the file");
    }
  };

/* Profile Storage */

// Configure multer storage for profile images
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileUploadFolder); // Save files in profile upload folder
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Save with a unique name
  },
});

// Validate profile image file type
const profileFileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb("Only JPG, JPEG, PNG and WEBP files are allowed", false); // Reject file
  }
};

// Initialize multer for profile uploads
const profileUpload = multer({
  storage: profileStorage,
  fileFilter: profileFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max size: 5MB
});

// Middleware for single profile image upload
const uploadSingleProfileImage = (fieldName) => {
  return async (req, res, next) => {
    try {
      const uploadHandler = profileUpload.single(fieldName);

      if (typeof uploadHandler !== "function") {
        console.error("uploadHandler is not a function:", uploadHandler);
        return res.status(500).json({
          error: "Upload handler could not be initialized",
        });
      }

      // Handle the upload
      uploadHandler(req, res, (err) => {
        if (err) {
          console.error("Error in uploadHandler:", err);
          if (err.code === "LIMIT_FILE_SIZE") {
            return Error(res, 206, "File size exceeds 5MB");
          }

          return res.status(206).json({
            error: err.message || "An unknown error occurred during upload",
          });
        }

        // Proceed to next middleware if no error
        next();
      });
    } catch (err) {
      console.error("Unexpected error:", err);

      return res.status(500).json({
        error: "An unexpected error occurred while uploading the profile image",
      });
    }
  };
};

/* Upload Multiple packages files in seperate folder */
const sanitizeFilename = (filename) => {
  return filename.replace(/\s+/g, "_").replace(/\?/g, "").trim();
};
const PackageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPackageFolder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = sanitizeFilename(path.basename(file.originalname, ext));
    const uniqueName = `${Date.now()}-${name}${ext}`;
    cb(null, uniqueName);
  },
});

const packageFileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  file.originalname = sanitizeFilename(file.originalname);
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, and PNG files are allowed"), false);
    return res
      .status(404)
      .json({ error: "Only JPG, JPEG, and PNG files are allowed" });
  }
};

const packageUpload = multer({
  storage: PackageStorage,
  fileFilter: packageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadMultiplePackageFiles =
  (fieldName, maxCount) => async (req, res, next) => {
    try {
      const uploadHandler = packageUpload.array(fieldName, maxCount);
      uploadHandler(req, res, (err) => {
        if (err) {
          console.error("Upload Error:", err.message);
          if (err.code === "LIMIT_FILE_SIZE") {
            return Error(res, 206, "File size exceeds 5MB");
          }
          if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res
              .status(206)
              .json({ error: `You can upload up to ${maxCount} files` });
          }
          return res.status(206).json({ error: err.message });
        }
        next();
      });
    } catch (err) {
      console.error("Error during upload:", err.message);
      return res
        .status(500)
        .json({ error: "An error occurred while uploading the file" });
    }
  };

/* Logo Uploding */
const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, logoUploadFolder); // Save in the images folder
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Use the unique name for the uploaded file
  },
});

// Validate file type
const logoFileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb("Only JPG, JPEG, and PNG files are allowed");
    // cb(new Error("Only JPG, JPEG, and PNG files are allowed"), false); // Reject file
  }
};

// Initialize multer with storage and file filter
const logoUpload = multer({
  storage: logoStorage,
  fileFilter: logoFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max size: 5MB
});

const uploadSingleLogo = (fieldName) => async (req, res, next) => {
  try {
    const uploadHandler = logoUpload.single(fieldName);
    uploadHandler(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return Error(res, 206, "File size exceeds 5MB");
        }
        return Error(
          res,
          206,
          err.message || "Invalid file type please use jpeg, jpg, or png"
        );
      }
      next();
    });
  } catch (err) {
    return Error(res, 206, "An error occurred while uploading the file");
  }
};

/* Client Images storage */
// Configure multer storage
const clientImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, clientImageUploadFolder); // Save in the images folder
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Use the unique name for the uploaded file
  },
});

// Validate client image file type
const clientImageFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    // cb(new Error("Only JPG, JPEG, and PNG files are allowed"), false); // Reject file
    cb("Only JPG, JPEG, and PNG files are allowed", false); // Reject file
  }
};

// Initialize multer with storage and file filter
const clientImageUpload = multer({
  storage: clientImageStorage,
  fileFilter: clientImageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max size: 10MB
});

const uploadSingleClientImage = (fieldName) => async (req, res) => {
  console.log(`Upload function called for field: ${fieldName}`);

  try {
    const uploadHandler = clientImageUpload.single(fieldName);
    const basePath = process.env.BASE_PATH || "http://localhost:8055/";

    uploadHandler(req, res, async (err) => {
      if (err) {
        console.error("Upload Error:", err);
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(206).json({ message: "File size exceeds 5MB" });
        }
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // console.log("File uploaded successfully!", req.file);

      // Generate the image URL
      const fileUrl = `${basePath}${req.file.filename}`;

      // // Save image data to MongoDB
      // const newImage = new Image({
      //   uniqueCode: req.file.filename,
      //   imageUrl: fileUrl,
      // });

      // await newImage.save(); // Store in MongoDB

      return res.status(200).json({
        statusCode: 200,
        message: "File uploaded successfully",
        fileUrl: fileUrl, // Send back the file path
      });
    });
  } catch (err) {
    console.error("Internal Server Error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error while uploading file" });
  }
};

export {
  uploadSingleImage,
  uploadSingleLogo,
  uploadMultipleImages,
  uploadSingleProfileImage,
  uploadMultiplePackageFiles,
  uploadSingleClientImage,
};
