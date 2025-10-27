import User from "../models/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Body from "../models/bodyParts";
import Image from "../models/images";
import mongoose from "mongoose";
import Consultation from "../models/consultations";
import puppeteer from "puppeteer";
import Package from "../models/packages";
import {
  sendEmailToClinicWithAllDetails,
  sendEmailToClinicWithPatientDetails,
  sendEmailToPatientWithAllDetails,
} from "./customeEmailSender";
import Content from "../models/contents";
import fs from "fs";
import path from "path";
const pdfUploadFolder = path.join(__dirname, "../../user-uploads/pdfFile");
// const pdfData = fs.readFileSync(pdfPath).toString("base64");

if (!fs.existsSync(pdfUploadFolder)) {
  fs.mkdirSync(pdfUploadFolder, { recursive: true });
}

/**
 * Checks if a record exists in the database based on given fields.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 19-Nov-2024
 */
export const recordExists = async (model, criteria) => {
  try {
    criteria.isDeleted = false;
    const exists = await model.exists(criteria);
    return !!exists;
  } catch (error) {
    throw error;
  }
};

/**
 * To create a user with jwt token we use user specific create method.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 19-Nov-2024
 */
export const createUser = async (model, data) => {
  try {
    let addNewUser = new model({
      firstName: data.firstName,
      lastName: data.lastName,
      userName: data.userName,
      email: data.email,
      clinicName: data.clinicName,
      mobile: data.mobile,
      password: bcrypt.hashSync(data.password, 8),
      role: data.role,
      bio: data.bio,
      profilePicture: data.profilePicture,
    });
    let savedUser = await addNewUser.save();
    if (savedUser) {
      return savedUser;
    }
  } catch (error) {
    throw error;
  }
};

/**
 * We can use this function to pass any model and data that should be added in the collection
 * for user specific.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 19-Nov-2024
 */
export const addRecord = async (model, data) => {
  try {
    const newRecord = new model(data);
    const savedRecord = await newRecord.save();
    return savedRecord;
  } catch (error) {
    throw error;
  }
};

/**
 * We use this function to check users password, we verify users provided password with encrypted password.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 19-Nov-2024
 */
export const matchPassword = async (data) => {
  try {
    let user = await User.findOne({ email: data.email });
    if (user) {
      const isMatch = await bcrypt.compare(data.password, user.password);
      if (isMatch) {
        const { password, ...userWithoutPassword } = user.toObject();
        let token = jwt.sign(
          { user: userWithoutPassword },
          process.env.JWT_KEY,
          {
            expiresIn: "8h",
          }
        );
        return { token: token };
      } else {
        return false;
      }
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Verify provided token with reset password parameters
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 17-Jan-2025
 */

export const verifyToken = async (token) => {
  let jwtKey = process.env.JWT_KEY || "local";
  return new Promise((resolve) => {
    jwt.verify(token, jwtKey, (err, decoded) => {
      if (err) {
        let errorMessage = "";
        if (err.name === "TokenExpiredError") {
          errorMessage = "Token expired";
        } else {
          errorMessage = "Invalid token";
        }
        return resolve({ error: errorMessage }); // Resolve with the error message
      }
      resolve({ user: decoded }); // Resolve with the user data if token is valid
    });
  });
};

/**
 * Generate temporary token for forgetPassword.
 * @access public
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 17-Jan-2025
 */
export const generateToken = async (data) => {
  try {
    let user = await User.findOne({ email: data });
    if (user) {
      let token = jwt.sign(
        { email: user.email, _id: user._id },
        process.env.JWT_KEY,
        {
          expiresIn: "15m",
        }
      );
      return token;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Generate hashed password.
 * @access public
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 17-Jan-2025
 */

export const getHashedPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hashSync(password, 8);
    if (hashedPassword) {
      return hashedPassword;
    } else {
      return false;
    }
  } catch (error) {
    return error.message;
  }
};

/**
 * When admin access the clinic account with login as clinic, we use this function to verify the clinic password.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 19-Nov-2024
 */
export const clinicLoginViaAdmin = async (model, data) => {
  try {
    let user = await model.findOne({ _id: data?._id, role: data?.role });
    if (user) {
      // const isMatch = await bcrypt.compare(data.password, user.password);
      // if (isMatch) {
      const { password, ...userWithoutPassword } = user.toObject();
      let token = jwt.sign({ user: userWithoutPassword }, process.env.JWT_KEY, {
        expiresIn: "8h",
      });
      return { token: token };
    } else {
      return false;
    }
    // }
  } catch (error) {
    throw error;
  }
};

/**
 * Used to get all data from the collection as per options and model provided included pagination.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 19-Nov-2024
 */
export const getPaginatedResults = async (model, options) => {
  try {
    const {
      searchFields,
      search,
      sortField,
      sortOrder,
      page,
      limit,
      role,
      userId,
    } = options;

    let filters = { isDeleted: false }; // Exclude soft-deleted users

    if (options?.status) {
      filters.status = options?.status;
    }
    if (options?.clinicId) {
      filters.clinicId = options?.clinicId;
    }
    if (search && searchFields?.length) {
      filters.$or = searchFields.map((field) => ({
        [field]: { $regex: search, $options: "i" }, // Case-insensitive search
      }));
    }
    if (role) {
      filters.role = role;
    }
    if (userId) {
      filters.userId = userId;
    }

    // Sorting
    const sortBy = sortField || "createdAt";
    const order = sortOrder === "desc" ? -1 : 1;

    // Pagination
    const pageNumber = parseInt(page, 10) || 1;
    let itemsPerPage = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * itemsPerPage;
    // Query execution
    const data = await model
      .find(filters)
      .select("-password")
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(itemsPerPage);
    const total = await model.countDocuments(filters);

    let response = {
      data,
      total,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / itemsPerPage),
    };

    return {
      data,
      total,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / itemsPerPage),
    };
  } catch (error) {
    throw error;
  }
};

/**
 * In case of getting consultations get it with selected package id.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 22-Jan-2025
 */
export const getConsultationPaginatedResults = async (model, options) => {
  try {
    const {
      searchFields,
      search,
      sortField,
      sortOrder,
      page,
      limit,
      role,
      userId,
    } = options;

    let filters = { isDeleted: false }; // Exclude soft-deleted users

    if (options?.status) {
      filters.status = options?.status;
    }
    if (options?.clinicId) {
      filters.clinicId = options?.clinicId;
    }
    if (search && searchFields?.length) {
      filters.$or = searchFields.map((field) => ({
        [field]: { $regex: search, $options: "i" }, // Case-insensitive search
      }));
    }
    if (role) {
      filters.role = role;
    }
    if (userId) {
      filters.userId = userId;
    }

    // Sorting
    const sortBy = sortField || "createdAt";
    const order = sortOrder === "desc" ? -1 : 1;

    // Pagination
    const pageNumber = parseInt(page, 10) || 1;
    let itemsPerPage = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * itemsPerPage;
    // Query execution
    const data = await model
      .find(filters)
      .populate({
        path: "recommandation", // Path to populate
        model: "Package", // Reference model
        select: "packageName description", // Fields to include in the populated data
      })
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(itemsPerPage);
    const total = await model.countDocuments(filters);

    let response = {
      data,
      total,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / itemsPerPage),
    };

    return {
      data,
      total,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / itemsPerPage),
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Used to get all data from the collection as per options and model provided included pagination package.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 16-Jan-2025
 */
export const getPaginatedForPackageResults = async (model, options) => {
  try {
    const {
      searchFields,
      search,
      sortField,
      sortOrder,
      page,
      limit,
      role,
      userId,
    } = options;

    let filters = { isDeleted: false }; // Exclude soft-deleted users

    if (options?.status) {
      filters.status = options?.status;
    }
    if (options?.clinicId) {
      filters.clinicId = options?.clinicId;
    }
    if (search && searchFields?.length) {
      filters.$or = searchFields.map((field) => ({
        [field]: { $regex: search, $options: "i" }, // Case-insensitive search
      }));
    }
    if (role) {
      filters.role = role;
    }
    if (userId) {
      filters.userId = userId;
    }

    // Sorting
    const sortBy = sortField || "createdAt";
    const order = sortOrder === "desc" ? -1 : 1;

    // Pagination
    const pageNumber = parseInt(page, 10) || 1;
    let itemsPerPage = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * itemsPerPage;
    // Query execution
    const data = await model
      .find(filters)
      .populate({
        path: "question.packageIds", // Path to populate
        model: "Package", // Reference model
        select: "packageName description", // Fields to include in the populated data
      })
      .select("-password")
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(itemsPerPage);
    const total = await model.countDocuments(filters);

    let response = {
      data,
      total,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / itemsPerPage),
    };

    return {
      data,
      total,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / itemsPerPage),
    };
  } catch (error) {
    throw error;
  }
};

/**
 * get all docs.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 19-Nov-2024
 */
export const getPaginatedResultsForAll = async (model, options) => {
  try {
    const { searchFields, search, sortField, sortOrder, page, limit, role } =
      options;

    // Search filter
    let filters = { isDeleted: false }; // Exclude soft-deleted users

    /* We use this status specially to get parts as per active state */
    if (options?.status) {
      filters.status = options?.status;
    }
    if (options?.userId) {
      filters.userId = options?.userId;
    }
    if (search && searchFields?.length) {
      filters.$or = searchFields.map((field) => ({
        [field]: { $regex: search, $options: "i" }, // Case-insensitive search
      }));
    }
    if (role) {
      filters.role = role;
    }

    // Sorting
    const sortBy = sortField || "createdAt";
    const order = sortOrder === "desc" ? -1 : 1;

    // Pagination
    const pageNumber = parseInt(page, 10) || 1;
    let itemsPerPage = "";
    if (limit) {
      itemsPerPage = parseInt(limit, 10) || 10;
    }
    const skip = (pageNumber - 1) * itemsPerPage;

    // Query execution
    const data = await model
      .find(filters)
      .select("-password")
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(itemsPerPage);

    // Total count for pagination
    const total = await model.countDocuments(filters);

    return {
      data,
      total,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / itemsPerPage),
    };
  } catch (error) {
    throw error;
  }
};

export const getPaginatedResultsForAllImages = async (model, options) => {
  try {
    const { searchFields, search, sortField, sortOrder, page, limit, role } =
      options;

    // Search filter
    let filters = { isDeleted: false }; // Exclude soft-deleted users

    /* We use this status specially to get parts as per active state */
    if (options?.status) {
      filters.status = options?.status;
    }
    if (options?.userId) {
      filters.userId = options?.userId;
    }
    if (search && searchFields?.length) {
      filters.$or = searchFields.map((field) => ({
        [field]: { $regex: search, $options: "i" }, // Case-insensitive search
      }));
    }
    if (role) {
      filters.role = role;
    }

    // Sorting
    const sortBy = sortField || "createdAt";
    const order = sortOrder === "desc" ? -1 : 1;

    // Pagination
    const pageNumber = parseInt(page, 10) || 1;
    let itemsPerPage = "";
    if (limit) {
      itemsPerPage = parseInt(limit, 10) || 10;
    }
    const skip = (pageNumber - 1) * itemsPerPage;

    if (options?.type) {
      filters.type = options?.type;
    }
    // Query execution
    const data = await model
      .find(filters)
      .select("-password")
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(itemsPerPage);

    // Total count for pagination
    const total = await model.countDocuments(filters);

    return {
      data,
      total,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / itemsPerPage),
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Used to update data in the collection we provide model and data which need to be udpated
 * for user specific.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 19-Nov-2024
 */
export const updateData = async (model, data) => {
  try {
    const updatedData = await model.findByIdAndUpdate(data._id, data.jsonData, {
      new: true,
    });

    console.log("updatedData", updatedData);

    if (updatedData) {
      return updatedData;
    }
  } catch (error) {
    console.log("error", error);

    throw error;
  }
};

/**
 * Used to update data in the collection we provide model and data which need to be udpated
 * for user specific this is used specially for content.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 24-Nov-2024
 */
export const updateOldContent = async (model, condition, updateData) => {
  try {
    const updatedData = await model
      .findOneAndUpdate(condition, updateData, { new: true })
      .populate("user", "userName");
    return updatedData;
  } catch (error) {
    console.error("Error in updateOldContent:", error);
    throw error;
  }
};

/**
 * This will be used to update the data like part which will be soft deleted by admin
 * so it shall be soft deleted by clinic too
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 09-Jan-2025
 */
export const updateDuplicateContentForClinic = async (
  model,
  condition,
  updateData
) => {
  console.log(
    "model : ",
    model,
    "condition : ",
    condition,
    "updateData",
    updateData
  );

  try {
    const updatedData = await model.findOneAndUpdate(condition, updateData, {
      new: true,
    });
    return updatedData;
  } catch (error) {
    console.error("Error in updateOldContent:", error);
    throw error;
  }
};

/**
 * This will be used to update the data like package which will be soft deleted by admin
 * so it shall be soft deleted by clinic too
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 15-01-25
 */
export const updateDuplicatePackageForClinic = async (
  model,
  condition,
  updateData
) => {
  try {
    const updatedData = await model.findOneAndUpdate(condition, updateData, {
      new: true,
    });
    return updatedData;
  } catch (error) {
    console.error("Error in updateOldContent:", error);
    throw error;
  }
};

/**
 * Use this funciton to check if any data provided for body is duplicate or now.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 19-Nov-2024
 */
/* Cuurrently not in use we use common function = recordExists */
export const bodyDetailsExists = async (data) => {
  try {
    const bodyData = await Body.findOne({
      $and: [{ bodyType: data.bodyType }, { part: data.part }],
      isDeleted: false,
    });
    if (bodyData) {
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
};

/**
 * Get single document.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 13-Dec-2024
 */
export const getSingleDocument = async (model, criteria) => {
  try {
    criteria.isDeleted = false;
    const document = await model.findOne(criteria).select("-password");
    if (document) {
      return document;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

/**
 * Get single document for content with population for user.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 24-Nov-2024
 */
export const getSingleContent = async (model, criteria) => {
  try {
    const document = await model.findOne(criteria);
    if (document) {
      return document;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

/**
 * delete single document for content.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 7-Jan-2025
 */
export const deleteSingleContent = async (model, criteria) => {
  try {
    const document = await model.findOneAndDelete(criteria);
    if (document) {
      return document;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

/**
 * Generate a random password for user.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 13-Dec-2024
 */

export const generateRandomPassword = (length) => {
  const charset = process?.env?.CHAR_SET;
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

/**
 * Get uploaded file details from request.
 * @access private
 * @return json
 */

export const getUploadedFileDetails = (req) => {
  // Retrieve files from request
  const files = req.files || (req.file ? [req.file] : []); // Handle single and multiple files

  if (files) {
    // Map file details
    const fileDetails = files.map((file) => ({
      originalName: file.originalname,
      savedName: file.filename,
      path: `${file.filename}`,
    }));

    // Return either a single file detail or an array of file details
    return files.length === 1 ? fileDetails[0] : fileDetails;
  } else {
    return null;
  }
};

/**
 * Get uploaded file details from cloud storage (DigitalOcean Spaces)
 * @param {Object} req - Request object containing spacesUploads
 * @returns {Array|Object|null} File details from cloud storage
 */
export const getCloudUploadedFileDetails = (req) => {
  // Retrieve files from cloud storage uploads
  const spacesUploads = req.spacesUploads || (req.spacesUpload ? [req.spacesUpload] : []);

  if (spacesUploads && spacesUploads.length > 0) {
    // Map file details from cloud storage
    const fileDetails = spacesUploads.map((upload) => ({
      originalName: upload.originalName || upload.fileName,
      savedName: upload.fileName,
      path: upload.cdnUrl, // Use CDN URL for cloud storage
      spacesKey: upload.key, // Store the Spaces key for future reference
      cloudUrl: upload.cdnUrl, // Explicit cloud URL field
    }));

    // Return either a single file detail or an array of file details
    return spacesUploads.length === 1 ? fileDetails[0] : fileDetails;
  } else {
    return [];
  }
};

// Reusable function to generate paths
export const generatePaths = (services, userName) => {
  const basePath = process.env.CLIENT_BASE_PATH;
  const paths = {};

  if (services?.face) paths.face = `${basePath}${userName}/face`;
  if (services?.body) paths.body = `${basePath}${userName}/body`;

  return paths;
};

/**
 * Fetch clinic-specific package IDs for given questions
 * @param {Array} question - List of questions containing admin package IDs
 * @param {String} clinicId - ID of the clinic for which package IDs need to be fetched
 * @returns {Array} Updated questions with clinic-specific package IDs
 */
// export const getClinicPackageIdsback = async (question, clinicId) => {
//   const updatedQuestions = [];
//   for (const q of question) {
//     const clinicPackageIds = [];

//     for (const adminPackageId of q.packageIds) {
//       // Fetch the admin package to find the package name
//       const adminPackage = await Package.findOne({ _id: adminPackageId });
//       if (adminPackage) {
//         // Use packageName to find the corresponding clinic package
//         const clinicPackage = await Package.findOne({
//           packageNumber: adminPackage.packageNumber,
//           userId: new mongoose.Types.ObjectId(clinicId),
//           isDeleted: false,
//         });
//         if (clinicPackage) {
//           clinicPackageIds.push(clinicPackage._id); // Add clinic-specific package ID
//         }
//       }
//     }

//     // Update the question with clinic-specific package IDs
//     updatedQuestions.push({
//       ...q,
//       packageIds: clinicPackageIds,
//     });
//   }
//   return updatedQuestions;
// };

export const getClinicPackageIdsback = async (question, clinicId) => {
  const updatedQuestions = [];
  const clinicPackageIds = new Set(); // Use a Set to store unique clinic package IDs

  for (const q of question) {
    const questionPackageIds = [];

    for (const adminPackageId of q.packageIds) {
      // Fetch the admin package to find the packageNumber
      const adminPackage = await Package.findOne({ _id: adminPackageId });

      if (adminPackage) {
        // Find the clinic package using packageNumber
        const clinicPackage = await Package.findOne({
          packageNumber: adminPackage.packageNumber,
          userId: new mongoose.Types.ObjectId(clinicId),
          isDeleted: false,
        });

        if (clinicPackage) {
          questionPackageIds.push(clinicPackage._id);
          clinicPackageIds.add(clinicPackage._id.toString()); // Store unique IDs
        }
      }
    }

    // Update the question with clinic-specific package IDs
    updatedQuestions.push({
      ...q,
      packageIds: questionPackageIds,
    });
  }

  return {
    updatedQuestions,
    clinicPackageIds: Array.from(clinicPackageIds), // Convert Set to an array
  };
};


/**
 * Function to copy added part by admin to clinic.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 27-Nov-2024
 */

export const copyBodyConcernToClinic = async (data) => {
  const { bodyType, part, imagePartType, question } = data;

  try {
    const totalClinics = await User.find({ role: "clinic", isDeleted: false });

    for (const clinic of totalClinics) {
      const existingBodyPart = await Body.findOne({
        userId: clinic._id,
        bodyType,
        part,
        isDeleted: false, // Ensure not matching with soft-deleted entries
      });
      console.log("existingBodyPart :", existingBodyPart);

      if (existingBodyPart) {
        return false;
      } else {
        // Fetch clinic-specific questions with updated package IDs
        const clinicQuestions = await getClinicPackageIdsback(
          question,
          clinic._id
        );

        // Prepare the data to insert for the clinic
        const dataToInsert = {
          bodyType,
          part,
          imagePartType: imagePartType,
          question: clinicQuestions,
          userId: clinic._id,
          status: "inactive",
        };

        console.log("dataToInsert : ", dataToInsert);

        // Insert data into the database
        let copiedData = await addRecord(Body, dataToInsert);
        console.log(`Data copied for clinic: ${clinic._id}`);
      }
    }
    return totalClinics.length;
  } catch (error) {
    console.error("Error copying body concern to clinics:", error);
    throw new Error("Failed to copy body concern to clinics.");
  }
};

/**
 * Once a new clinic is added all the parts should be added to clinic as per there current status status.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 27-Nov-2024
 */
export const newCopyPartsForClinc = async (masterId, clinic) => {
  const { _id } = clinic;

  const fetchMasterData = await Body.find({
    userId: masterId,
    isDeleted: false,
    status: "active",
  });
  console.log("fetchMasterData : ", fetchMasterData);

  for (const element of fetchMasterData) {
    const data = {
      bodyType: element?.bodyType,
      part: element?.part,
      question: element?.question,
      imagePartType: element?.imagePartType,
      userId: _id,
      status: "inactive",
    };
    const addData = await addRecord(Body, data);
  }
  return fetchMasterData.length;
};

/**
 * Common function to update all the duplicate clinic entries in the clinic specific
 * to soft delete the parts
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 09-Jan-2025
 */
export const deleteFromAllClinics = async (updatedData) => {
  const totalClinics = await User.find({ role: "clinic", isDeleted: false });
  for (const clinic of totalClinics) {
    const query = {
      userId: new mongoose.Types.ObjectId(clinic?._id),
      bodyType: updatedData?.bodyType,
      part: updatedData?.part,
    };
    const softDeleteData = await updateDuplicateContentForClinic(Body, query, {
      isDeleted: true,
    });
  }
  return totalClinics.length;
};

/**
 * Function to get admins specific data for dashboard content and stats
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 09-Jan-2025
 */
export const getAdminDashboardContent = async (data) => {
  const clinicCount = await User.countDocuments({
    role: "clinic",
    isDeleted: false,
  });

  const masterAestheticConcernCount = await Body.countDocuments({
    userId: new mongoose.Types.ObjectId(data._id),
    isDeleted: false,
  });

  const allConsulationsCounts = await Consultation.countDocuments({
    isDeleted: false,
  });

  const response = {
    clinicCount: clinicCount ? clinicCount : "",
    masterAestheticConcernCount: masterAestheticConcernCount
      ? masterAestheticConcernCount
      : "",
    allConsulationsCounts: allConsulationsCounts ? allConsulationsCounts : 0,
  };
  return response;
};

/**
 * Function to get clinic specific data for dashboard content and stats
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 09-Jan-2025
 */
export const getClinicDashboardContent = async (data) => {
  const clinicAestheticConcernCount = await Body.countDocuments({
    userId: new mongoose.Types.ObjectId(data._id),
    isDeleted: false,
  });

  const consulationsCounts = await Consultation.countDocuments({
    clinicId: new mongoose.Types.ObjectId(data._id),
  });

  const response = {
    clinicAestheticConcernCount: clinicAestheticConcernCount
      ? clinicAestheticConcernCount
      : "",
    consulationsCounts: consulationsCounts ? consulationsCounts : 0,
  };
  return response;
};

/**
 * Copy package to all clicnics as clinic need to show threre
 * own package content to user
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 15-01-2025
 */
export const copyPackageData = async (data) => {
  const {
    packageName,
    description,
    amount,
    priorityLevel,
    userId,
    files,
    packageNumber,
    includes,
  } = data;

  console.log("includes : ", includes);

  const totalClinics = await User.find({ role: "clinic", isDeleted: false });
  for (const clinic of totalClinics) {
    const data = {
      packageName: packageName,
      description: description,
      amount: amount,
      priorityLevel: priorityLevel,
      userId: clinic._id,
      includes: includes,
      files: files,
      status: "active",
      packageNumber: packageNumber,
    };
    console.log("data : ", data);

    const addData = await addRecord(Package, data);
  }
  return totalClinics.length;
};

/**
 * Copy all packlages to clinics once created
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 27-Nov-2024
 */
export const newCopyPackageForClinc = async (masterId, clinic) => {
  const { _id } = clinic;

  const fetchMasterData = await Package.find({
    userId: masterId,
    isDeleted: false,
  });

  for (const element of fetchMasterData) {
    const data = {
      packageName: element.packageName,
      description: element.description,
      packageNumber: element.packageNumber,
      amount: element.amount,
      priorityLevel: element.priorityLevel,
      status: "active",
      userId: _id,
      files: element.files,
    };
    const addData = await addRecord(Package, data);
  }
  return fetchMasterData.length;
};

/* Custom Package Number Generator */
export const generatePackageNumber = async () => {
  const prefix = "PKG"; // Optional prefix to indicate it's a package number
  const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000); // 10-digit random number
  let packageNumber = `${prefix}${randomNumber}`; // Concatenate prefix and number as a string

  // Return the package number directly as a string
  return packageNumber;
};

/**
 * Counts occurrences of each package ID from the input data.
 * @param {Array} data - The input data array with part names and package IDs.
 * @returns {Object} - An object with package IDs as keys and their counts as values.
 */
export const countPackageOccurrences = async (data) => {
  const packageCount = {};
  for (const item of data) {
    for (const packageId of item.packageIds) {
      packageCount[packageId] = (packageCount[packageId] || 0) + 1;
    }
  }
  return packageCount;
};

/**
 * Finds the packages with the highest occurrence count.
 * @param {Object} packageCount - An object with package IDs as keys and their counts as values.
 * @returns {Array} - An array of package IDs with the highest occurrence count.
 */
export const getMaxPackages = async (packageCount) => {
  let maxCount = 0;
  const maxPackages = [];
  for (const packageId in packageCount) {
    const checkStatus = await Package.findById({ _id: packageId });

    if (checkStatus?.status == "active") {
      if (packageCount[packageId] > maxCount) {
        maxCount = packageCount[packageId];
        maxPackages.length = 0; // Reset the max packages array
        maxPackages.push(packageId);
      } else if (packageCount[packageId] === maxCount) {
        maxPackages.push(packageId);
      }
    }
  }
  return maxPackages;
};

/**
 * Resolves ties by selecting the package with the highest priority.
 * @param {Array} maxPackages - An array of package IDs with the highest count.
 * @returns {String} - The selected package ID with the highest priority.
 */
export const resolveTieWithPriority = async (maxPackages) => {
  if (maxPackages.length === 1) {
    return maxPackages[0]; // Only one package has the max count
  }

  // Fetch package priorities
  const packagePriorities = await getPackagePriorities(maxPackages);

  // Determine the package with the highest priority level
  let highestPriorityPackage = null;
  let highestPriorityLevel = -Infinity;

  for (const packageId of maxPackages) {
    const priorityLevel = packagePriorities[packageId] || 0; // Default priority level is 0
    if (priorityLevel > highestPriorityLevel) {
      highestPriorityLevel = priorityLevel;
      highestPriorityPackage = packageId;
    }
  }

  return highestPriorityPackage; // Return the package ID with the highest priority level
};

/**
 * Fetches priority levels for the given package IDs.
 * @param {Array} maxPackages - An array of package IDs.
 * @returns {Object} - An object mapping package IDs to their priority levels.
 */
export const getPackagePriorities = async (maxPackages) => {
  try {
    const priorities = {};
    for (const packageId of maxPackages) {
      const packageData = await Package.findOne({ _id: packageId });
      if (packageData) {
        priorities[packageId] = packageData.priorityLevel || 0; // Default priority level is 0
      }
    }
    return priorities;
  } catch (error) {
    console.error("Error fetching package priorities:", error.message);
    throw new Error("Failed to fetch package priorities");
  }
};

/**
 * Fetch Image Name or id from the db to save with the consultation.
 * @param {Object} consultation - The consultation object.
 * @returns {Object} - The consultation object with the image name or id.
 */

export const getImageDataFromDB = async (selectedImagedData) => {
  const getImageData = await Image.findOne({ _id: selectedImagedData._id });
  // console.log(getImageData,"getimagedata--------------------------------")
  if (getImageData) {
    return getImageData;
  } else {
    return false;
  }
};

/* This function is used to send email to clinic 
and the patient with slightly changed data  */
// export const sendEmailToClinicAndPatient = async (data, savedConsultation) => {
//   try {
//     const findClinicData = await User.findOne({
//       _id: new mongoose.Types.ObjectId(data?.clinicId),
//       role: "clinic",
//     }).select("-password");

//     const clinicConent = await Content.findOne({
//       user: new mongoose.Types.ObjectId(data?.clinicId),
//     });

//     const getPackageData = await Package.findOne({
//       _id: new mongoose.Types.ObjectId(data?.recommandation),
//     });

//     let allDetails = {
//       clinicData: findClinicData,
//       clinicConent: clinicConent,
//       bookingData: data,
//       packageData: getPackageData,
//     };
//     if (data?.clinicId) {
//       if (findClinicData?.email) {
//         const sendEmailToClinic = await sendEmailToClinicWithPatientDetails(
//           allDetails
//         );
//       } else {
//         return false;
//       }
//     }
//     if (data?.email) {
//       /* Send email to patient on received email */
//       const sendEmailToPatient = await sendEmailToPatientWithAllDetails(
//         allDetails,
//         savedConsultation
//       );
//     } else {
//       return false;
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// };

export const sendEmailToClinicAndPatient = async (data, savedConsultation) => {
  try {
    console.log("Received Data for Email:", data);

    if (!data?.clinicId) {
      console.error("Error: clinicId is missing");
      return false;
    }

    if (!data?.recommandation) {
      console.error("Error: recommandation (package ID) is missing");
      return false;
    }

    const clinicIdObj = new mongoose.Types.ObjectId(data.clinicId);
    const packageIdObj = new mongoose.Types.ObjectId(data.recommandation);

    const findClinicData = await User.findOne({
      _id: clinicIdObj,
      role: "clinic",
    }).select("-password");

    if (!findClinicData) {
      console.error("Error: Clinic data not found for ID:", data.clinicId);
      return false;
    }

    const clinicConent = await Content.findOne({ user: clinicIdObj });
    const getPackageData = await Package.findOne({ _id: packageIdObj });

    let allDetails = {
      clinicData: findClinicData,
      clinicConent: clinicConent,
      bookingData: data,
      packageData: getPackageData,
    };

    let emailSent = false;

    if (findClinicData?.email) {
      console.log("Sending email to clinic...");
      await sendEmailToClinicWithPatientDetails(allDetails);
      emailSent = true;
    } else {
      console.error("Clinic email not found.");
    }

    if (data?.email) {
      console.log("Sending email to patient...");
      await sendEmailToPatientWithAllDetails(allDetails, savedConsultation);
      emailSent = true;
    } else {
      console.error("Patient email not found.");
    }

    return emailSent; // Return true if at least one email was sent
  } catch (error) {
    console.error("Error in sendEmailToClinicAndPatient:", error.message);
    return false;
  }
};



/**
 * This function is used to generate a pdf from a customised html form
 * @param {string}
 * @param {html}
 * we pass details for patient and package he have selected in the html content
 */
// export const generatePDFviaHtml = async (data, savedConsultation) => {
//   try {
//     const uniqueName = `${Date.now()}-${savedConsultation._id}.pdf`; // Ensure file extension
//     const filePath = `user-uploads/pdfFile/${uniqueName}`; // Save path
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     await page.setViewport({ width: 1920, height: 1080 });
//     await page.setContent(data, { waitUntil: "networkidle0" });
//     await page.emulateMediaType("screen");

//     await page.pdf({
//       path: filePath,
//       printBackground: true,
//       format: "A4",
//     });

//     await browser.close();
//     const pdfData = fs.readFileSync(filePath).toString("base64");
//     let Newdata = [
//       {
//         content: pdfData,
//         filename: uniqueName,
//         type: "application/pdf",
//         disposition: "attachment",
//       },
//     ];
//     console.log('data : ',Newdata);
    
//     return Newdata;
//   } catch (error) {
//     console.log("in pdf", error);

//     return null;
//   }
// };


// export const generatePDFviaHtml = async (data, savedConsultation) => {
//   try {
//     const uniqueName = `${Date.now()}-${savedConsultation._id}.pdf`;
//     const filePath = `user-uploads/pdfFile/${uniqueName}`;
    
//     console.log("Generating PDF at path:", filePath);

//     const browser = await puppeteer.launch({
//       headless: 'new',
//       args: ['--no-sandbox', '--disable-setuid-sandbox'], // Prevent permission issues
//     });

//     const page = await browser.newPage();
//     await page.setViewport({ width: 1920, height: 1080 });

//     if (!data) {
//       throw new Error("PDF generation failed: HTML content is empty.");
//     }

//     await page.setContent(data, { waitUntil: "networkidle0" });
//     await page.emulateMediaType("screen");

//     await page.pdf({
//       path: filePath,
//       printBackground: true,
//       format: "A4",
//     });

//     await browser.close();

//     // Check if the PDF was successfully created
//     if (!fs.existsSync(filePath)) {
//       throw new Error("PDF generation failed: File does not exist.");
//     }

//     console.log("PDF successfully created at:", filePath);

//     // Convert the PDF to base64 for attachment
//     const pdfData = fs.readFileSync(filePath).toString("base64");

//     return [
//       {
//         content: pdfData,
//         filename: uniqueName,
//         type: "application/pdf",
//         disposition: "attachment",
//       },
//     ];
//   } catch (error) {
//     console.error("Error in generatePDFviaHtml:", error);
//     return null; // Return null so email doesn't try to attach a missing file
//   }
// };


export const generatePDFviaHtml = async (data, savedConsultation) => {
  try {
    const uniqueName = `${Date.now()}-${savedConsultation._id}.pdf`;
    const filePath = `user-uploads/pdfFile/${uniqueName}`;

    console.log("🚀 Generating PDF...");
    console.log("📌 Received HTML content:", data ? "✅ Not Empty" : "❌ Empty");

    if (!data || data.trim() === "") {
      throw new Error("PDF generation failed: HTML content is empty.");
    }

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setContent(data, { waitUntil: "networkidle0" });
    await page.emulateMediaType("screen");

    await page.pdf({
      path: filePath,
      printBackground: true,
      format: "A4",
    });

    await browser.close();

    if (!fs.existsSync(filePath)) {
      throw new Error("PDF generation failed: File does not exist.");
    }

    console.log("✅ PDF successfully created at:", filePath);

    const pdfData = fs.readFileSync(filePath).toString("base64");

    return [
      {
        content: pdfData,
        filename: uniqueName,
        type: "application/pdf",
        disposition: "attachment",
      },
    ];
  } catch (error) {
    console.error("❌ Error in generatePDFviaHtml:", error);
    return null; // Ensure the calling function knows there’s an error
  }
};
