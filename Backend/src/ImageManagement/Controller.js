import Body from "../models/bodyParts";
import Image from "../models/images";
import Part from "../models/parts";
import {
  addRecord,
  copyBodyConcernToClinic,
  getPaginatedResults,
  getPaginatedResultsForAll,
  getPaginatedResultsForAllImages,
  getSingleDocument,
  getUploadedFileDetails,
  recordExists,
  updateData,
} from "../utils/customeFunction";
import { Error, Success } from "../utils/customeResponse";
import { uploadToSpaces } from "../services/spacesService.js";

/**
 * Function is used for adding face images and type and part details.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 26-Dec-2024
 */

const addImageWithCode = async (req, res) => {
  try {
    const { uniqueCode, type } = req.body;

    // Check if image was uploaded to Spaces via middleware
    if (!req.spacesUpload) {
      return Error(res, 400, "No image uploaded or upload failed");
    }

    let data = {
      imageUrl: req.spacesUpload.cdnUrl, // Use CDN URL from DigitalOcean Spaces
      uniqueCode: uniqueCode || req.spacesUpload.fileName,
      type: type,
      spacesKey: req.spacesUpload.key, // Store the Spaces key for future reference
    };
    
    const addNewImage = await addRecord(Image, data);
    if (addNewImage) {
      return Success(res, 200, "Item added successfully", addNewImage);
    } else {
      return Error(res, 500, "Failed to add item");
    }
  } catch (error) {
    console.error("Error in addImageWithCode:", error);
    return Error(res, 500, "Internal Server Error");
  }
};

/**
 * Returns a list of available images
 * @access private
 * @return json
 * Created by Akash
 */

const listImages = async (req, res) => {
  try {
    const { page, limit, sort, search, type } = req.query;

    // Fields to search for images
    const searchFields = ["uniqueCode", "imageUrl", "partName", "type"];
    const [sortField, sortOrder] = sort?.split(":") || ["createdAt", "desc"];

    // Fetch paginated results from the Image model based on search and filters
    const images = await getPaginatedResultsForAllImages(Image, {
      searchFields,
      search,
      sortField,
      sortOrder,
      page,
      limit,
      type,
    });

    if (images.data.length > 0) {
      // Images from DigitalOcean Spaces already have full CDN URLs
      // No need to modify the imageUrl as it's already a complete URL
      
      // Respond with success and image data
      return Success(res, 200, "Images fetched successfully", {
        data: images.data,
        page: images.page,
        limit: images.limit,
        total: images.total, // If available, include total count
        totalPages: images.totalPages, // If available, include totalPages
      });
    } else {
      // Return no images found message
      return Error(res, 404, "No images found");
    }
  } catch (error) {
    // Log and return error message
    console.error("Error in fetching images:", error);
    return Error(res, 500, "Unable to fetch images");
  }
};

/* update part by id */
const updatePartForImage = async (req, res) => {
  try {
    const { uniqueCode, partName, coordinates } = req.body;

    // Step 1: Find the image by its uniqueCode
    const image = await Image.findOne({ uniqueCode });
    if (!image) {
      return Error(res, 404, "Image not found");
    }
    if (!partName || !coordinates) {
      return Error(res, 400, "Part name or coordinate missing");
    }

    // Step 2: Check if the part already exists
    const partIndex = image.parts.findIndex(
      (part) => part.partName === partName
    );

    // Step 3: If part exists, replace the coordinates; otherwise, add the new part
    if (partIndex !== -1) {
      // Part exists, update coordinates
      image.parts[partIndex].coordinates = coordinates;
    } else {
      // Part doesn't exist, add new part
      image.parts.push({
        partName,
        coordinates,
      });
    }

    // Step 4: Save the updated image document
    await image.save();

    // Step 5: Return success response
    return Success(res, 200, "Image part updated successfully", image);
  } catch (error) {
    console.error("Error updating image part:", error);
    return Error(res, 500, "Internal Server Error");
  }
};

const chnangeLinesCoordinates = async (req, res) => {
  try {
    const { dashedLinePositions, uniqueCode } = req.body;

    // Validate input
    if (!dashedLinePositions || typeof dashedLinePositions !== "object") {
      return Error(res, 400, "Dashed line positions missing or invalid");
    }

    // Validate uniqueCode
    if (!uniqueCode) {
      return Error(res, 400, "Unique code missing");
    }

    // Find the image by uniqueCode
    const image = await Image.findOne({ uniqueCode });
    if (!image) {
      return Error(res, 404, "Image not found");
    }

    // Update the dashedLinePositions field
    image.dashedLinePositions = dashedLinePositions;

    // Save the updated image
    await image.save();

    return Success(
      res,
      200,
      "Dashed line positions updated successfully",
      image
    );
  } catch (error) {
    console.error("Error updating dashed line positions:", error);
    return Error(res, 500, "Internal Server Error");
  }
};

export default {
  listImages,
  updatePartForImage,
  addImageWithCode,
  chnangeLinesCoordinates,
};
