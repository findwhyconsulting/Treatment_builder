import Consultation from "../models/consultations";
import {
  addRecord,
  getConsultationPaginatedResults,
  getImageDataFromDB,
  getPaginatedResults,
  sendEmailToClinicAndPatient,
} from "../utils/customeFunction";
import { Error, Success } from "../utils/customeResponse";

/**
 * Save patients uploadsed image to the server.
 * @access public
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 19-Nov-2024
 */

const saveUploadedImage = async (req, res) => {
  try {
    const BASE_PATH = process.env.BASE_PATH || "http://localhost:8055/";

    const files = req.files || (req.file ? [req.file] : []); // Handle both single and multiple files
    // If no files are uploaded
    if (files.length === 0) {
      return Error(res, 400, "Please choose a file to upload");
    }
    // Process the uploaded files
    // const filePaths = files.map((file) => `${BASE_PATH}${file.filename}`);
    const filePaths = req.files.map((file) => ({
      originalName: file.originalname,
      savedName: file.filename,
      path: `${BASE_PATH}${file.filename}`,
    }));
    // console.log("Uploaded file paths:", filePaths);
    return Success(res, 200, "Images uploaded successfully", filePaths);
  } catch (error) {
    console.error("Error uploading image:", error);
    return Error(res, 500, "Unable to upload image");
  }
};

/**
 * Save Patinet Consultation in database as per clinic.
 * @access public
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 19-Nov-2024
 */

const saveConsultations = async (req, res) => {
  try {
    const {
      clinicId,
      firstName,
      lastName,
      phone,
      email,
      ageRange,
      recommandation,
      hadAestheticTreatmentBefore,
      isConsultationSaved,
      areasOfConcern,
      selectedImage, // This can be a DB reference (static) or a direct URL (dynamic)
    } = req.body;

    // Validate required fields
    if (
      !clinicId ||
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !ageRange ||
      !recommandation ||
      hadAestheticTreatmentBefore === "undefined" ||
      !areasOfConcern ||
      !selectedImage
    ) {
      return Error(res, 404, "All fields are required");
    }

    let finalImageUrl;

    // Check if `selectedImage` is a database ObjectId (24-character hex string) or a direct URL
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(selectedImage);

    if (isObjectId) {
      // Fetch the static image from the database
      const getImageData = await getImageDataFromDB(selectedImage);
      if (!getImageData) {
        return Error(res, 404, "Image not found in database, please try again");
      }
      finalImageUrl = getImageData.imageUrl; // Use the image URL from the DB
    } else {
      // Use the directly uploaded image URL (dynamic)
      finalImageUrl = selectedImage.imageUrl;
    }

    // Create the consultation object
    const object = {
      clinicId,
      firstName,
      lastName,
      phone,
      email,
      ageRange,
      recommandation: recommandation._id,
      hadAestheticTreatmentBefore,
      isConsultationSaved: true,
      areasOfConcern,
      selectedImage: finalImageUrl, // Correctly store the image URL
    };

    const savedConsultation = await addRecord(Consultation, object);
    if (savedConsultation) {
      await sendEmailToClinicAndPatient(object, savedConsultation);

      return Success(
        res,
        200,
        "Consultation Booked successfully",
        savedConsultation
      );
    } else {
      return Error(res, 500, "Failed to save consultation");
    }
  } catch (error) {
    console.log(error, "Error in consultation");
    return Error(res, 500, "Unable to save consultation");
  }
};

const saveConsultationAfterSubmit = async (req, res) => {
  try {
    const {
      clinicId,
      firstName,
      lastName,
      phone,
      email,
      ageRange,
      recommandation,
      hadAestheticTreatmentBefore,
      areasOfConcern,
      selectedImage, 
    } = req.body;

    if (
      !clinicId ||
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !ageRange ||
      !recommandation ||
      hadAestheticTreatmentBefore === "undefined" ||
      !areasOfConcern ||
      !selectedImage
    ) {
      return Error(res, 404, "All fields are required");
    }

    let finalImageUrl;

    // Check if `selectedImage` is a database ObjectId (24-character hex string) or a direct URL
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(selectedImage);

    if (isObjectId) {
      // Fetch the static image from the database
      const getImageData = await getImageDataFromDB(selectedImage);
      if (!getImageData) {
        return Error(res, 404, "Image not found in database, please try again");
      }
      finalImageUrl = getImageData.imageUrl; // Use the image URL from the DB
    } else {
      // Use the directly uploaded image URL (dynamic)
      finalImageUrl = selectedImage.imageUrl;
    }

    // Create the consultation object
    const object = {
      clinicId,
      firstName,
      lastName,
      phone,
      email,
      ageRange,
      recommandation: recommandation._id,
      hadAestheticTreatmentBefore,
      isConsultationSaved: false,
      areasOfConcern,
      selectedImage: finalImageUrl, // Correctly set the image URL
    };

    // Save the consultation record
    const savedConsultation = await addRecord(Consultation, object);
    console.log(savedConsultation, "savedconsultation--");

    if (savedConsultation) {
      return Success(
        res,
        200,
        "Consultation saved successfully",
        savedConsultation
      );
    } else {
      return Error(res, 500, "Failed to save consultation");
    }
  } catch (error) {
    console.error("Error saving consultation:", error);
    return Error(res, 500, "Unable to save consultation");
  }
};


const sendConsultationEmail = async (req, res) => {
  try {
    const { clinicId } = req.body;

    if (!clinicId) {
      return Error(res, 400, "Clinic ID is required to send an email");
    }

    console.log("Fetching consultation for clinicId:", clinicId);

    // Fetch the most recent consultation record for the given clinicId
    const consultation = await Consultation.findOne({ clinicId }).sort({
      createdAt: -1,
    });

    if (!consultation) {
      return Error(res, 404, "No consultation found for the given clinic");
    }

    console.log("Fetched Consultation:----", consultation);

    // Extract _id from the consultation
    const consultationId = consultation._id;

    // Update the isConsultationSaved field to true
    await Consultation.findByIdAndUpdate(consultationId, {
      isConsultationSaved: true,
    });

    console.log(
      `Updated isConsultationSaved to true for consultation ID: ${consultationId}`
    );

    // Send email using the updated consultation data
    const emailResponse = await sendEmailToClinicAndPatient(
      consultation,
      consultation
    );

    if (emailResponse) {
      return Success(
        res,
        200,
        "Email sent successfully and consultation updated"
      );
    } else {
      return Error(res, 500, "Failed to send email");
    }
  } catch (error) {
    console.error("Error in sendConsultationEmail:", error);
    return Error(res, 500, "Unable to send email");
  }
};

/**
 * Get all consultations for a specific clinic.
 * @access public
 * @return json
 */
const getConsultations = async (req, res) => {
  try {
    const basePath = process.env.BASE_PATH || "http://localhost:8055/";
    const clinicId = req.user._id;
    const { page, limit, sort, search, role } = req.query;
    const searchFields = ["firstName", "lastName", "email"];
    const [sortField, sortOrder] = sort?.split(":") || ["createdAt", "desc"];

    const consultations = await getConsultationPaginatedResults(Consultation, {
      searchFields,
      search,
      sortField,
      sortOrder,
      page,
      limit,
      role,
      clinicId: clinicId,
    });
    console.log("consultations : ", consultations);

    if (consultations?.data?.length > 0) {
      const updatedData = consultations.data.map((consultation) => {
        if (consultation.selectedImage) {
          // Check if the selectedImage is just a filename (not a full URL)
          if (!consultation.selectedImage.startsWith("http")) {
            consultation.selectedImage = `${basePath}${consultation.selectedImage}`;
          }
        }
        return consultation;
      });

      consultations.data = updatedData;

      return Success(res,200,"Consultations retrieved successfully",consultations);
    } else {
      return Error(res, 204, "No consultations found");
    }
  } catch (error) {
    return Error(res, 500, "Unable to retrieve consultations");
  }
};

/**
 * Update consultation by id.
 * @access public
 * @return json
 */
const updateConsultation = async (req, res) => {
  try {
    const { _id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      ageRange,
      hadAestheticTreatmentBefore,
      isDeleted,
    } = req.body;

    let jsonData = {};
    if (firstName) jsonData.firstName = firstName;
    if (lastName) jsonData.lastName = lastName;
    if (email) jsonData.email = email;
    if (phone) jsonData.phone = phone;
    if (ageRange) jsonData.ageRange = ageRange;
    if (hadAestheticTreatmentBefore !== undefined)
      jsonData.hadAestheticTreatmentBefore = hadAestheticTreatmentBefore;
    if (isDeleted !== undefined) jsonData.isDeleted = isDeleted;

    const updatedData = await Consultation.findByIdAndUpdate(
      _id,
      { $set: jsonData },
      { new: true } // Return the updated document
    );

    if (updatedData) {
      return Success(
        res,
        200,
        "Consultation updated successfully",
        updatedData
      );
    } else {
      return Error(res, 404, "Consultation not found");
    }
  } catch (error) {
    return Error(res, 500, "Unable to update consultation");
  }
};

export default {
  saveConsultations,
  saveConsultationAfterSubmit,
  sendConsultationEmail,
  getConsultations,
  updateConsultation,
};
