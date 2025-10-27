import multer from "multer";
import { uploadToSpaces, deleteFromSpaces } from "../services/spacesService.js";
import { Error, Success } from "../utils/customeResponse.js";

// Configure multer for memory storage (we'll upload directly to Spaces)
const storage = multer.memoryStorage();

// Validate file type
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb("Only JPG, JPEG, PNG and WEBP files are allowed", false); // Reject file
  }
};

// Initialize multer with memory storage and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max size: 10MB
});

/**
 * Upload single image to DigitalOcean Spaces
 * @param {string} fieldName - Form field name
 * @param {string} folder - Folder path in bucket (optional)
 * @returns {Function} Express middleware
 */
export const uploadSingleImageToSpaces = (fieldName, folder = 'images') => {
  return async (req, res, next) => {
    try {
      const uploadHandler = upload.single(fieldName);
      
      uploadHandler(req, res, async (err) => {
        if (err) {
          console.error("Multer Error:", err);
          if (err.code === "LIMIT_FILE_SIZE") {
            return Error(res, 400, "File size exceeds 10MB");
          }
          return Error(res, 400, err.message || "File upload error");
        }

        if (!req.file) {
          return Error(res, 400, "No file uploaded");
        }

        try {
          // Upload to DigitalOcean Spaces
          const uploadResult = await uploadToSpaces(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            folder
          );

          // Add upload result to request object for use in controllers
          req.spacesUpload = uploadResult;
          
          console.log("File uploaded to Spaces successfully:", uploadResult.cdnUrl);
          next();
        } catch (spacesError) {
          console.error("Spaces Upload Error:", spacesError);
          return Error(res, 500, `Upload to storage failed: ${spacesError.message}`);
        }
      });
    } catch (error) {
      console.error("Upload Middleware Error:", error);
      return Error(res, 500, "Internal server error during upload");
    }
  };
};

/**
 * Upload multiple images to DigitalOcean Spaces
 * @param {string} fieldName - Form field name
 * @param {number} maxCount - Maximum number of files
 * @param {string} folder - Folder path in bucket (optional)
 * @returns {Function} Express middleware
 */
export const uploadMultipleImagesToSpaces = (fieldName, maxCount, folder = 'images') => {
  return async (req, res, next) => {
    try {
      const uploadHandler = upload.array(fieldName, maxCount);
      
      uploadHandler(req, res, async (err) => {
        if (err) {
          console.error("Multer Error:", err);
          if (err.code === "LIMIT_FILE_SIZE") {
            return Error(res, 400, "File size exceeds 10MB");
          }
          if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return Error(res, 400, `You can upload up to ${maxCount} files`);
          }
          return Error(res, 400, err.message || "File upload error");
        }

        if (!req.files || req.files.length === 0) {
          return Error(res, 400, "No files uploaded");
        }

        try {
          // Upload all files to DigitalOcean Spaces
          const uploadPromises = req.files.map(file => 
            uploadToSpaces(file.buffer, file.originalname, file.mimetype, folder)
          );
          
          const uploadResults = await Promise.all(uploadPromises);
          
          // Add upload results to request object for use in controllers
          req.spacesUploads = uploadResults;
          
          console.log(`${uploadResults.length} files uploaded to Spaces successfully`);
          next();
        } catch (spacesError) {
          console.error("Spaces Upload Error:", spacesError);
          return Error(res, 500, `Upload to storage failed: ${spacesError.message}`);
        }
      });
    } catch (error) {
      console.error("Upload Middleware Error:", error);
      return Error(res, 500, "Internal server error during upload");
    }
  };
};

/**
 * Upload multiple images to DigitalOcean Spaces (OPTIONAL - for updates)
 * @param {string} fieldName - Form field name
 * @param {number} maxCount - Maximum number of files
 * @param {string} folder - Folder path in bucket (optional)
 * @returns {Function} Express middleware
 */
export const uploadMultipleImagesToSpacesOptional = (fieldName, maxCount, folder = 'images') => {
  return async (req, res, next) => {
    try {
      const uploadHandler = upload.array(fieldName, maxCount);
      
      uploadHandler(req, res, async (err) => {
        if (err) {
          console.error("Multer Error:", err);
          if (err.code === "LIMIT_FILE_SIZE") {
            return Error(res, 400, "File size exceeds 10MB");
          }
          if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return Error(res, 400, `You can upload up to ${maxCount} files`);
          }
          return Error(res, 400, err.message || "File upload error");
        }

        // Allow proceeding without files (for updates)
        if (!req.files || req.files.length === 0) {
          console.log("No files uploaded - proceeding with update");
          req.spacesUploads = []; // Set empty array
          return next();
        }

        try {
          // Upload all files to DigitalOcean Spaces
          const uploadPromises = req.files.map(file => 
            uploadToSpaces(file.buffer, file.originalname, file.mimetype, folder)
          );
          
          const uploadResults = await Promise.all(uploadPromises);
          
          // Add upload results to request object for use in controllers
          req.spacesUploads = uploadResults;
          
          console.log(`${uploadResults.length} files uploaded to Spaces successfully`);
          next();
        } catch (spacesError) {
          console.error("Spaces Upload Error:", spacesError);
          return Error(res, 500, `Upload to storage failed: ${spacesError.message}`);
        }
      });
    } catch (error) {
      console.error("Upload Middleware Error:", error);
      return Error(res, 500, "Internal server error during upload");
    }
  };
};

/**
 * Direct upload endpoint for client images
 * @param {string} fieldName - Form field name
 * @param {string} folder - Folder path in bucket (optional)
 * @returns {Function} Express middleware
 */
export const uploadSingleClientImageToSpaces = (fieldName, folder = 'client-images') => {
  return async (req, res) => {
    console.log(`Upload function called for field: ${fieldName}`);

    try {
      const uploadHandler = upload.single(fieldName);
      
      uploadHandler(req, res, async (err) => {
        if (err) {
          console.error("Upload Error:", err);
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ 
              statusCode: 400,
              message: "File size exceeds 10MB" 
            });
          }
          return res.status(400).json({ 
            statusCode: 400,
            message: err.message || "File upload error" 
          });
        }

        if (!req.file) {
          return res.status(400).json({ 
            statusCode: 400,
            message: "No file uploaded" 
          });
        }

        try {
          // Upload to DigitalOcean Spaces
          const uploadResult = await uploadToSpaces(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            folder
          );

          return res.status(200).json({
            statusCode: 200,
            message: "File uploaded successfully",
            fileUrl: uploadResult.cdnUrl, // Use CDN URL for better performance
            spacesKey: uploadResult.key,
            fileName: uploadResult.fileName
          });
        } catch (spacesError) {
          console.error("Spaces Upload Error:", spacesError);
          return res.status(500).json({
            statusCode: 500,
            message: `Upload to storage failed: ${spacesError.message}`
          });
        }
      });
    } catch (error) {
      console.error("Internal Server Error:", error);
      return res.status(500).json({
        statusCode: 500,
        message: "Internal server error while uploading file"
      });
    }
  };
};

/**
 * Upload single profile image to DigitalOcean Spaces with replacement
 * Deletes old image and uploads new one with client name
 * @param {string} fieldName - Form field name
 * @param {string} folder - Folder path in bucket (optional)
 * @returns {Function} Express middleware
 */
export const uploadProfileImageWithReplacement = (fieldName, folder = 'profiles') => {
  return async (req, res, next) => {
    try {
      const uploadHandler = upload.single(fieldName);
      
      uploadHandler(req, res, async (err) => {
        if (err) {
          console.error("Multer Error:", err);
          if (err.code === "LIMIT_FILE_SIZE") {
            return Error(res, 400, "File size exceeds 10MB");
          }
          return Error(res, 400, err.message || "File upload error");
        }

        // If no file uploaded, proceed without changes
        if (!req.file) {
          req.spacesUpload = null;
          return next();
        }

        try {
          // Create client name from form data
          const clientName = `${req.body.firstName || 'user'}_${req.body.lastName || 'profile'}`;
          
          // Upload new image with client name
          const uploadResult = await uploadToSpaces(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            folder,
            clientName
          );

          // Store old image key for deletion (will be handled in controller)
          req.oldImageKey = req.body.oldImageKey || null;
          
          // Add upload result to request object for use in controllers
          req.spacesUpload = uploadResult;
          
          console.log("Profile image uploaded successfully:", uploadResult.cdnUrl);
          next();
        } catch (spacesError) {
          console.error("Spaces Upload Error:", spacesError);
          return Error(res, 500, `Upload to storage failed: ${spacesError.message}`);
        }
      });
    } catch (error) {
      console.error("Upload Middleware Error:", error);
      return Error(res, 500, "Internal server error during upload");
    }
  };
};

/**
 * Upload multiple package images to DigitalOcean Spaces with replacement
 * Deletes old images and uploads new ones with package name
 * @param {string} fieldName - Form field name
 * @param {number} maxCount - Maximum number of files
 * @param {string} folder - Folder path in bucket (optional)
 * @returns {Function} Express middleware
 */
export const uploadPackageImagesWithReplacement = (fieldName, maxCount, folder = 'packages') => {
  return async (req, res, next) => {
    try {
      const uploadHandler = upload.array(fieldName, maxCount);
      
      uploadHandler(req, res, async (err) => {
        if (err) {
          console.error("Multer Error:", err);
          if (err.code === "LIMIT_FILE_SIZE") {
            return Error(res, 400, "File size exceeds 10MB");
          }
          if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return Error(res, 400, `You can upload up to ${maxCount} files`);
          }
          return Error(res, 400, err.message || "File upload error");
        }

        // If no files uploaded, proceed without changes
        if (!req.files || req.files.length === 0) {
          req.spacesUploads = [];
          req.shouldReplaceImages = false;
          return next();
        }

        try {
          // Create package name from form data for identification
          const packageName = req.body.packageName || 'package';
          
          // Upload all new images with package name
          const uploadPromises = req.files.map(file => 
            uploadToSpaces(file.buffer, file.originalname, file.mimetype, folder, packageName)
          );
          
          const uploadResults = await Promise.all(uploadPromises);
          
          // Add upload results to request object for use in controllers
          req.spacesUploads = uploadResults;
          req.shouldReplaceImages = true; // Flag to indicate replacement needed
          
          console.log(`${uploadResults.length} package images uploaded successfully`);
          next();
        } catch (spacesError) {
          console.error("Spaces Upload Error:", spacesError);
          return Error(res, 500, `Upload to storage failed: ${spacesError.message}`);
        }
      });
    } catch (error) {
      console.error("Upload Middleware Error:", error);
      return Error(res, 500, "Internal server error during upload");
    }
  };
};

export default {
  uploadSingleImageToSpaces,
  uploadMultipleImagesToSpaces,
  uploadSingleClientImageToSpaces,
  uploadProfileImageWithReplacement,
  uploadPackageImagesWithReplacement,
}; 