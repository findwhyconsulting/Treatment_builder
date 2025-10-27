import User from "../models/users";
import { EmailProcess } from "../utils/customeEmailSender";
import {
  createUser,
  generateRandomPassword,
  getUploadedFileDetails,
  getCloudUploadedFileDetails,
  newCopyPackageForClinc,
  newCopyPartsForClinc,
  recordExists,
} from "../utils/customeFunction";
import { Error, Success } from "../utils/customeResponse";
import { sendCustomEmail } from "../utils/sendEmail";

/**
 * Function is used for user sign-up.
 * @access public
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 13-Dec-2024
 */

const addUser = async (req, res) => {
  try {
    // Handle profile image upload
    let profilePicture = null;
    if (req.spacesUpload) {
      profilePicture = {
        originalName: req.file.originalname,
        savedName: req.spacesUpload.fileName,
        path: req.spacesUpload.cdnUrl,
        spacesKey: req.spacesUpload.key,
        cloudUrl: req.spacesUpload.cdnUrl,
      };
    }
    
    const randomPassword = await generateRandomPassword(12);

    const { firstName, lastName, userName, email, mobile, bio, clinicName } =
      req.body;
    console.log("body", req.body);

    if (!firstName || !lastName || !userName || !email || !mobile) {
      return Error(res, 400, "Missing required fields");
    }

    const isUserNameTaken = await recordExists(User, { userName });
    if (isUserNameTaken) {
      return Error(
        res,
        409,
        "Username already taken. Please choose a different one."
      );
    }

    const isUserExists = await recordExists(User, {
      $or: [{ email }, { mobile }],
    });
    if (isUserExists) {
      return Error(
        res,
        409,
        "clinic already exists with this email or mobile."
      );
    }

    let savedUser;
    try {
      savedUser = await createUser(User, {
        firstName,
        lastName,
        userName,
        email,
        mobile,
        clinicName,
        password: randomPassword,
        role: "clinic",
        bio,
        profilePicture: profilePicture,
      });
    } catch (err) {
      if (err.code === 11000) {
        return Error(res,409,"clinic already exists with this email or mobile.");
      }
      throw err; 
    }

    if (savedUser) {
      await newCopyPackageForClinc(req.user._id, savedUser);
      await newCopyPartsForClinc(req.user._id, savedUser);

      const emailData = {
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        userEmail: savedUser.email,
        userPassword: randomPassword,
      };
      await EmailProcess(emailData);

      return Success(res, 200, "User added successfully", savedUser);
    } else {
      return Error(res, 500, "Failed to add user"); 
    }
  } catch (error) {
    return Error(res, 500, error.message || "Internal Server Error"); 
  }
};

export default {
  addUser,
};
