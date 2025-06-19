import mongoose from "mongoose";
import Package from "../models/packages";
import {
  addRecord,
  copyPackageData,
  countPackageOccurrences,
  generatePackageNumber,
  getMaxPackages,
  getPaginatedResults,
  getPaginatedResultsForAll,
  getSingleDocument,
  getUploadedFileDetails,
  recordExists,
  resolveTieWithPriority,
} from "../utils/customeFunction";
import { Error, Success } from "../utils/customeResponse";
import { resolve } from "path";
import Body from "../models/bodyParts";
import updatePartDetails from "../bodyManagement/Controller";

/**
 * Admin package creation proces, save the packageshere.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 13-Jan-2025
 */
const createPackages = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role; // Fetching user role
    const { packageName, description, amount, priorityLevel, includes } =
      req.body;

    const uploadedFiles = await getUploadedFileDetails(req);

    // Check for missing fields
    if (
      !packageName ||
      !description ||
      !amount ||
      !priorityLevel ||
      !includes
    ) {
      return Error(res, 400, "All details are mandatory");
    }

    const duplicatePackageName = await recordExists(Package, {
      packageName,
      userId: userId,
    });

    const duplicatePriorityLevel = await recordExists(Package, {
      priorityLevel,
      userId: userId,
    });

    if (duplicatePackageName) {
      return Error(res, 409, "Package name already exists");
    }

    if (duplicatePriorityLevel) {
      return Error(res, 409, "Priority level already exists");
    }

    const packageNumber = await generatePackageNumber();

    // Save package
    const savePackage = await addRecord(Package, {
      packageName,
      description,
      amount,
      priorityLevel,
      userId,
      includes: includes,
      packageNumber: packageNumber,
      files: uploadedFiles,
    });

    if (savePackage) {
      if (userRole === "admin") {
        const duplicatePackageForClinics = await copyPackageData(savePackage);
      }
    }

    if (savePackage) {
      // Only call copyPackageData if the user is an admin
      return Success(res, 200, "Package created successfully", savePackage);
    } else {
      return Error(res, 400, "Failed to create package");
    }
  } catch (error) {
    console.log("error ", error.message);
    return Error(res, 500, "An internal server error occurred");
  }
};

/**
 * get list of all packages created.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 13-Jan-2025
 */

const getPackages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page, limit, sort, search } = req.query;

    const searchFields = ["packageName", "description"];
    const [sortField, sortOrder] = sort?.split(":") || ["createdAt", "desc"];

    const packages = await getPaginatedResults(Package, {
      searchFields,
      search,
      sortField,
      sortOrder,
      page,
      limit,
      userId,
    });

    if (packages.data) {
      packages.data = packages?.data.map((item) => {
        item.files = item?.files.map((file) => ({
          ...file,
          path: `${process.env.BASE_PATH}${file.path}`, // Prepending BASE_PATH to the path
        }));
        return item;
      });
    }
    if (packages.data.length > 0) {
      return Success(res, 200, "Packages fetched successfully", packages);
    } else {
      return Success(res, 204, "No Packages found");
    }
  } catch (error) {
    return Error(res, 500, "An internal server error occurred");
  }
};

/**
 * get list of all packages created.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 13-Jan-2025
 */

const getAllPackages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page, limit, sort, search, status } = req.query;

    const searchFields = ["packageName", "description"];
    const [sortField, sortOrder] = sort?.split(":") || ["createdAt", "desc"];

    const packages = await getPaginatedResultsForAll(Package, {
      searchFields,
      search,
      sortField,
      sortOrder,
      page,
      limit,
      userId,
      status,
    });

    if (packages.data) {
      packages.data = packages?.data.map((item) => {
        item.files = item?.files.map((file) => ({
          ...file,
          path: `${process.env.BASE_PATH}${file.path}`, // Prepending BASE_PATH to the path
        }));
        return item;
      });
    }
    if (packages.data.length > 0) {
      return Success(res, 200, "Packages fetched successfully", packages);
    } else {
      return Success(res, 204, "No Packages found");
    }
  } catch (error) {
    console.log(error.message);

    return Error(res, 500, "An internal server error occurred");
  }
};

/**
 * get single package details.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 13-Jan-2025
 */
const getPackageDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const _id = req.params._id;
    const fetchPackage = await getSingleDocument(Package, {
      _id: _id,
      userId: userId,
    });

    if (fetchPackage.files) {
      fetchPackage.files = fetchPackage.files.map((file) => ({
        ...file,
        path: `${process.env.BASE_PATH}${file.path}`, // Prepending BASE_PATH to the path
      }));
    }

    if (fetchPackage) {
      return Success(
        res,
        200,
        "Package details fetched successfully",
        fetchPackage
      );
    } else {
      return Error(res, 404, "Package not found");
    }
  } catch (error) {
    return Error(res, 500, "An internal server error occurred");
  }
};

/**
 * update package details.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 13-Jan-2025
 */



const listAffectedBodyParts = async (req, res) => {
  try {
    const userId = req.user._id;
    const { _id } = req.params;

    // console.log("Checking if package exists for the given ID...");

    // Step 1: Find the package using _id (including deleted packages)
    const existingPackage = await Package.findOne({
      _id,
      userId,
      isDeleted: false,
    });

    if (!existingPackage) {
      return Error(res, 404, "Package not found");
    }

    // Step 2: Find all related clinic packages using packageNumber (including deleted ones)

    //below code can be searched in clinic package and admin package
    const clinicPackages = await Package.find(
      {
        $or: [
          { _id: existingPackage._id },
          { packageNumber: existingPackage.packageNumber }, 
        ],
        isDeleted: false, 
      },
      { _id: 1 }
    ).lean();

    const clinicPackageIds = clinicPackages.map((pkg) => pkg._id.toString());


    if (clinicPackageIds.length === 0) {
      return Error(res, 404, "No related clinic packages found");
    }

    // Step 3: Fetch affected body parts (including those that had package IDs removed)
    let affectedBodyParts = await Body.find(
      {
        userId,
        isDeleted: false,
        "question.packageIds": { $in: clinicPackageIds },
      },
      { _id: 1, part: 1, bodyType: 1, question: 1 }
    ).lean();

    // Step 6: If no affected body parts remain, return empty response
    if (affectedBodyParts.length === 0) {
      return Success(res, 200, "No affected body parts found", {
        exists: false,
        affectedBodyParts: [],
      });
    }

    return Success(res, 200, "Fetched affected body parts successfully", {
      exists: true,
      affectedBodyParts,
    });
  } catch (error) {
    console.error("Error in listAffectedBodyParts:", error);
    return Error(res, 500, "An internal server error occurred");
  }
};


const updatePackage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { _id } = req.params;
    const {
      packageName,
      description,
      amount,
      priorityLevel,
      isDeleted,
      includes,
      status,
    } = req.body;

    console.log("Received status:", status, typeof status); // Debugging

    // Fetch the existing package
    const existingPackage = await Package.findOne({
      _id,
      userId,
      isDeleted: false,
    });

    if (!existingPackage) {
      console.log("Package not found");
      return Error(res, 404, "Package not found");
    }

    const clinicPackages = await Package.find(
      {
        $or: [
          { _id: existingPackage._id},
          { packageNumber: existingPackage.packageNumber }
        ],
        isDeleted: false
      },
      { _id: 1 }
    ).lean();
    

    const clinicPackageIds = clinicPackages.map((pkg) => pkg._id.toString());

    if (clinicPackageIds.length === 0) {
      return Error(res, 404, "No related clinic packages found");
    }

    let affectedBodyParts = [];

    // Only execute package removal logic when status is "inactive"
    if (status === "inactive") {
      affectedBodyParts = await Body.find(
        { "question.packageIds": { $in: clinicPackageIds }, userId, isDeleted: false },
        { _id: 1, part: 1, bodyType: 1, question: 1 }
      ).lean();

      console.log("Affected body parts:", affectedBodyParts);

      // Remove package IDs from questions
      const pullResult1 = await Body.updateMany(
        { "question.packageIds": { $in: clinicPackageIds } },
        { $pull: { "question.$[].packageIds": { $in: clinicPackageIds } } }
      );

      console.log(
        "Package IDs removed from questions:",
        pullResult1.modifiedCount
      );

      // Remove empty questions
      const pullResult2 = await Body.updateMany(
        { userId, "question.packageIds": { $size: 0 } },
        { $pull: { question: { packageIds: { $size: 0 } } } }
      );

      console.log(
        "Questions with empty package IDs removed:",
        pullResult2.modifiedCount
      );
    }

    let jsonData = {};

    if (packageName) {
      const duplicatePackageName = await recordExists(Package, {
        _id: { $ne: _id },
        packageName,
        userId,
      });

      if (duplicatePackageName) {
        return Error(res, 409, "Package name already exists");
      }
      jsonData.packageName = packageName;
    }

    if (priorityLevel) {
      const duplicatePriorityLevel = await recordExists(Package, {
        _id: { $ne: _id },
        priorityLevel,
        userId,
      });

      if (duplicatePriorityLevel) {
        return Error(res, 409, "Priority level already exists");
      }
      jsonData.priorityLevel = priorityLevel;
    }

    const uploadedFiles = await getUploadedFileDetails(req);

    if (description) jsonData.description = description;
    if (amount) jsonData.amount = amount;
    if (includes) jsonData.includes = includes;
    if (isDeleted !== undefined) jsonData.isDeleted = isDeleted;

    if (String(status).trim().toLowerCase() === "active") {
      jsonData.status = "active";
    } else if (String(status).trim().toLowerCase() === "inactive") {
      jsonData.status = "inactive";
    }

    // Handle file updates
    let updatedFiles = existingPackage.files || [];
    if (uploadedFiles) {
      updatedFiles = Array.isArray(uploadedFiles)
        ? [...updatedFiles, ...uploadedFiles]
        : [...updatedFiles, uploadedFiles];
    }
    jsonData.files = updatedFiles;

    // Check jsonData before updating
    console.log("Final jsonData before update:", jsonData);

    // Only update if jsonData has changes
    if (Object.keys(jsonData).length > 0) {
      console.log("Updating package with:", jsonData);
      const updatedPackage = await Package.findByIdAndUpdate(_id, jsonData, {
        new: true,
      });

      if (!updatedPackage) {
        console.log("Update failed, package not found.");
        return Error(res, 404, "Package not found");
      }

      console.log("Update successful:", updatedPackage);
      return Success(res, 200, "Package updated successfully", {
        updatedPackage,
        affectedBodyParts,
      });
    }

    return Success(res, 200, "No changes made to the package");
  } catch (error) {
    console.error("Error in updatePackage:", error);
    return Error(res, 500, "An internal server error occurred");
  }
};

const deletePackage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { _id } = req.params; // Get package ID from request parameters

    console.log("Checking if package exists for the given ID...");
    const existingPackage = await Package.findOne({
      _id,
      userId,
      isDeleted: false,
    });

    if (!existingPackage) {
      return Error(res, 404, "Package not found");
    }

    const clinicPackages = await Package.find(
      {
        $or: [
          { _id: existingPackage._id},
          { packageNumber: existingPackage.packageNumber }
        ],
        isDeleted: false 
      },
      { _id: 1 }
    ).lean();

    const clinicPackageIds = clinicPackages.map((pkg) => pkg._id.toString());
    console.log("Clinic Package IDs:", clinicPackageIds);

    // Step 3: Remove package references from Body collection
    await Body.updateMany(
      { "question.packageIds": _id },
      { $pull: { "question.$[].packageIds": _id } }
    );

    // Remove `text` if `packageIds` becomes empty
    await Body.updateMany(
      { userId, "question.packageIds": { $size: 0 } },
      { $pull: { question: { packageIds: { $size: 0 } } } }
    );

    // Step 4: Soft delete the package (mark it as deleted)
    await Package.updateOne({ _id }, { isDeleted: true });

    console.log(`Package with ID ${_id} marked as deleted.`);

    return Success(res, 200, "Package deleted successfully");
  } catch (error) {
    console.error("Error in deletePackageById:", error);
    return Error(res, 500, "An internal server error occurred");
  }
};


/* Remove files from model */
const removeFileFromPackage = async (req, res) => {
  try {
    const { packageId, fileId } = req.body;

    // Validate IDs
    if (!packageId || !fileId) {
      return Error(res, 400, "Package ID and File ID are required");
    }

    // Remove the file from the package
    const result = await Package.findByIdAndUpdate(
      packageId,
      { $pull: { files: { _id: new mongoose.Types.ObjectId(fileId) } } },
      { new: true }
    );

    if (!result) {
      return Error(res, 404, "Package not found");
    }

    return Success(res, 200, "File removed successfully", result);
  } catch (error) {
    return Error(res, 500, "An internal server error occurred");
  }
};

/**
 * Algorithm to retrieve the package based on user selection.
 * This function processes the user's input and fetches the corresponding package from the available options.
 * It takes into account the user's selected preferences and returns the package details in JSON format.
 * @param {Object} userSelection - The user's selected options for the package.
 * @returns {Object} packageDetails - The details of the selected package in JSON format.
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 20-Jan-2025
 * @access private
 */

const getRecommendation = async (req, res) => {
  try {
    // console.log("Received Payload:", req.body);
    const { data } = req.body;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return Error(res, 400, "Invalid or empty data provided");
    }

    // console.log("Extracted Data:", data);
    const packageCount = await countPackageOccurrences(data);
    // console.log("Package Count:", packageCount);

    const maxPackages = await getMaxPackages(packageCount);
    // console.log("Max Packages (Before Filtering):", maxPackages);

    // Ignore null values in maxPackages
    const validPackages = maxPackages.filter((pkg) => pkg !== null);
    // console.log("Valid Packages (After Filtering):", validPackages);

    if (validPackages.length === 0) {
      return Error(res, 404, "No valid package found");
    }

    const selectedPackage = await resolveTieWithPriority(validPackages);
    // console.log("Selected Package:", selectedPackage);

    if (!selectedPackage) {
      // console.log("No package selected after filtering.");
      return Error(res, 404, "No valid package found");
    }

    if (!mongoose.Types.ObjectId.isValid(selectedPackage)) {
      // console.log("Invalid ObjectId:", selectedPackage);
      return Error(res, 400, "Invalid Package ID");
    }

    const recommendedPackage = await getSingleDocument(Package, {
      _id: selectedPackage,
    });

    if (!recommendedPackage) {
      console.log("Package not found for ID:", selectedPackage);
      return Error(res, 404, "Package not found");
    }

    const basePath = process.env.BASE_PATH || "http://localhost:8055/";
    recommendedPackage.files = recommendedPackage.files.map((file) => ({
      ...file,
      path: `${basePath}${file.path}`,
    }));

    // console.log("Final Recommended Package:", recommendedPackage);
    return Success(res, 200, "Recommended package retrieved successfully", recommendedPackage);
  } catch (error) {
    console.error("Error in getRecommendation:", error);
    return Error(res, 500, "An internal server error occurred");
  }
};

export default {
  createPackages,
  getPackages,
  getPackageDetails,
  updatePackage,
  deletePackage,
  listAffectedBodyParts,
  removeFileFromPackage,
  getAllPackages,
  getRecommendation,
};
