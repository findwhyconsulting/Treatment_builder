import Body from "../models/bodyParts";
import Part from "../models/parts";
import {
  addRecord,
  copyBodyConcernToClinic,
  deleteFromAllClinics,
  getPaginatedForPackageResults,
  getPaginatedResultsForAll,
  getSingleDocument,
  recordExists,
  updateData,
} from "../utils/customeFunction";
import { Error, Success } from "../utils/customeResponse";

/**
 * Function is used for adding body type and part details.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 27-Nov-2024
 */

const addBodyAndPartData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bodyType, part, imagePartType, question } = req.body;
    const role = req.user.role; // Fetching user role
    console.log("role : ", role);

    // Check if the record already exists
    const exists = await recordExists(Body, {
      bodyType,
      part,
      isDeleted: false,
      userId,
    });
    if (exists) {
      return Error(res, 409, "Duplicate entry found");
    }

    const data = {
      bodyType,
      part,
      imagePartType,
      question,
      userId,
    };
    const savedDetails = await addRecord(Body, data);

    // If admin, copy concerns to clinic
    if (savedDetails && role === "admin") {
      await copyBodyConcernToClinic({
        bodyType,
        part,
        imagePartType,
        question,
      });
    }

    if (savedDetails) {
      return Success(res, 200, "Details added successfully", savedDetails); 
    } else {
      return Error(res, 400, "Failed to add details");
    }
  } catch (error) {
    console.error("error", error.message);
    return Error(res, 500, "Internal Server Error"); 
  }
};

/**
 * Returns a list of available parts
 * @access private
 * @return json
 * Created by Akash
 */

const listParts = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page, limit, sort, search } = req.query;

    const searchFields = ["bodyType", "part"];
    const [sortField, sortOrder] = sort?.split(":") || ["createdAt", "desc"];

    const bodyParts = await getPaginatedForPackageResults(Body, {
      searchFields,
      search,
      sortField,
      sortOrder,
      page,
      limit,
      userId,
      // status: "active",
    });

    if (bodyParts.data.length > 0) {
      return Success(res, 200, "Body parts fetched successfully", bodyParts);
    } else {
      return Error(res, 404, "No body parts found");
    }
  } catch (error) {
    return Error(res, 500, "Unable to fetch body parts");
  }
};



/**
 * Returns details of a specific body part
 * @access private
 * @return json
 * Created by Akash
 */

const getPartDetails = async (req, res) => {
  try {
    const { _id } = req.params;

    // Fetch the record using the common function
    const bodyPart = await getSingleDocument(Body, { _id });

    if (bodyPart) {
      // If record found, return it
      return Success(res, 200, "Body Part details fetched successfully", bodyPart);
    } else {
      return Error(res, 404, "Body Part details not found");  
    }
  } catch (error) {
    return Error(res, 500, "Unable to fetch body part details");
  }
};

/**
 * Updates body part details
 * @access private
 * @return json
 * Created by Akash
 */

const updatePartDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { _id } = req.params;
    const { bodyType, part, question, status, isDeleted, imagePartType } = req.body;

    // Check if the record exists by _id
    const exists = await recordExists(Body, { _id });
    if (!exists) {
      return Error(res, 404, "Body Part details not found");  
    }

    // Build the updated data
    let jsonData = {};
    if (bodyType) jsonData.bodyType = bodyType;
    if (part) jsonData.part = part;
    if (question) jsonData.question = question;
    if (status !== undefined) jsonData.status = status;
    if (isDeleted !== undefined) jsonData.isDeleted = isDeleted;
    if (imagePartType) jsonData.imagePartType = imagePartType;

    // Check for duplicate entry
    const duplicateExists = await recordExists(Body, {
      bodyType: bodyType || null,
      part: part || null,
      userId: userId || null,
      _id: { $ne: _id }, // Exclude the current record
    });

    if (duplicateExists) {
      return Error(res, 409, "Duplicate entry found with another record"); 
    }

    // Update the record in the database
    const updatedData = await Body.findByIdAndUpdate(
      _id,
      { $set: jsonData },
      { new: true } // Return the updated document
    );

    if (updatedData) {
      // If admin removes any part details, remove it from all clinics
      if (isDeleted !== undefined) {
        await deleteFromAllClinics(updatedData);
      }
      return Success(res, 200, "Details updated successfully", updatedData);
    } else {
      return Error(res, 500, "Failed to update details"); 
    }
  } catch (error) {
    console.error("Error updating body part details:", error);
    return Error(res, 500, "Internal Server Error");
  }
};

/* Add new part crud */
const addNewPart = async (req, res) => {
  try {
    const { bodyType, part } = req.body;

    if (!bodyType || !part) {  
      return Error(res, 400, "Body type and part details are required");
    }

    // Check if the record already exists
    const exists = await recordExists(Part, {
      bodyType,
      part,
      isDeleted: false,
    });
    if (exists) {
      return Error(res, 409, "Duplicate entry found");
    }

    // Add new details to the database using the generic function
    const savedDetails = await addRecord(Part, { bodyType, part });

    if (savedDetails) {
      return Success(res, 200, "Part added successfully", savedDetails);  
    } else {
      return Error(res, 500, "Failed to add part"); 
    }
  } catch (error) {
    console.error("Error adding new part:", error);
    return Error(res, 500, "Internal Server Error");
  }
};

/* Get all parts */
const getAllParts = async (req, res) => {
  try {
    const { page, limit, sort, search } = req.query;
    const searchFields = ["bodyType", "part"];
    const [sortField, sortOrder] = sort?.split(":") || ["createdAt", "desc"];

    const parts = await getPaginatedResultsForAll(Part, {
      searchFields,
      search,
    });
    if (parts.data.length > 0) {
      return Success(res, 200, "Parts fetched successfully", parts);
    } else {
      return Success(res, 200, "No parts found", { data: [] }); 
    }
  } catch (error) {
    return Error(res, 500, "Unable to fetch parts");
  }
};

/* update part by id */
const updatePartById = async (req, res) => {
  try {
    const { _id } = req.params;
    const { bodyType, part, isDeleted } = req.body;

    // Check if the record exists by _id
    const exists = await recordExists(Part, { _id });

    if (!exists) {
      return Error(res, 404, "Body Part details not found");
    }

    // Build the updated data
    let jsonData = {};
    if (bodyType) jsonData.bodyType = bodyType;
    if (part) jsonData.part = part;
    if (isDeleted != null) jsonData.isDeleted = isDeleted;

    // Check for duplicate entry with another record
    const duplicateExists = await recordExists(Part, {
      bodyType: bodyType,
      isDeleted: isDeleted,
      part: part,
      _id: { $ne: _id }, // Exclude the current record
    });

    if (duplicateExists) {
      return Error(res, 409, "Duplicate entry found with another record");
    }

    // Update the record in the database
    let updatedData = await updateData(Part, { _id: _id, jsonData: jsonData });
    if (updatedData) {
      return Success(res, 200, "Details updated successfully", updatedData);
    } else {
      return Error(res, 400, "Failed to update details");
    }
  } catch (error) {
    return Error(res, 500, "Internal Server Error");
  }
};

export default {
  listParts,
  addBodyAndPartData,
  updatePartDetails,
  getPartDetails,
  addNewPart,
  getAllParts,
  updatePartById,
};
