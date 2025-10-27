import User from "../models/users";
import {
  clinicLoginViaAdmin,
  createUser,
  generateToken,
  getAdminDashboardContent,
  getClinicDashboardContent,
  getHashedPassword,
  getPaginatedResults,
  getSingleDocument,
  getUploadedFileDetails,
  getCloudUploadedFileDetails,
  matchPassword,
  recordExists,
  updateData,
  verifyToken,
} from "../utils/customeFunction";
import { deleteFromSpaces } from "../services/spacesService.js";
import { Error, Success } from "../utils/customeResponse";
import path from "path";
import fs from "fs";
import { verifyForgotPassword } from "../utils/customeEmailSender";

/**
 * Extract the key from a DigitalOcean Spaces URL
 * @param {string} url - The full URL
 * @returns {string|null} - The key or null if not a valid Spaces URL
 */
const extractKeyFromSpacesUrl = (url) => {
  if (!url || !url.includes('digitaloceanspaces.com')) {
    return null;
  }
  
  // Extract key from URL like: https://aesthetiq.syd1.digitaloceanspaces.com/profiles/filename.jpg
  const parts = url.split('/');
  const keyParts = parts.slice(4); // Skip protocol, domain, and bucket
  return keyParts.join('/');
};

/**
 * Function is used for user sign-up.
 * @access public
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 19-Nov-2024
 */

const signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      userName,
      email,
      mobile,
      password,
      role,
      bio,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !userName ||
      !email ||
      !mobile ||
      !password
    ) {
      return Error(res, 400, "Missing required fields");
    }
    // Check if userName already exists
    const isUserNameTaken = await recordExists(User, { userName });
    if (isUserNameTaken) {
      return Error(res, 409, "Please choose a different user name");
    }

    // Check if email or mobile already exists
    const isUserExists = await recordExists(User, {
      $or: [{ email }, { mobile }],
    });
    if (isUserExists) {
      return Error(res, 409, "User already exists with this email or mobile");
    }

    // Add new user to database
    const savedUser = await createUser(User, {
      firstName,
      lastName,
      userName,
      email,
      mobile,
      password,
      role,
      bio,
    });

    if (savedUser) {
      return Success(res, 200, "User added successfully", savedUser);
    } else {
      return Error(res, 404, "Failed to add user");
    }
  } catch (error) {
    return Error(res, 500, "Unable to add user");
  }
};

/**
 * Function is used for user login.
 * @access public
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 18-Nov-2024
 */

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkStatus = await getSingleDocument(User, { email: email });
    if (!checkStatus) {
      return Error(res, 206, "Please enter a valid email address");
    }
    if (!checkStatus?.status) {
      return Error(res, 206, "Account is Inactive");
    }

    // Check if email and password are provided
    if (!email || !password) {
      return Error(res, 400, "Email and password are required");
    }

    // Check if user exists
    let user = await recordExists(User, { email: email });
    if (!user) {
      return Error(res, 206, "Please enter a valid email address");
    }
    // Check password
    const isMatch = await matchPassword({ email: email, password: password });

    if (!isMatch) {
      return Error(res, 401, "Invalid Password");
    }
    // Generate token
    return Success(res, 200, "Logged in", isMatch);
  } catch (error) {
    return Error(res, 500, error.message);
  }
};

/**
 * Handles content display based on user role.
 * - If the role is 'admin', the admin-specific content is shown.
 * - If the role is 'clinic', the clinic-specific content is shown.
 * - If the role does not match 'admin' or 'clinic', or an error occurs,
 * a default error message is shown.
 * @param {string} role - The role of the user (either 'admin' or 'clinic').
 * @returns {string} - The content or error message based on the role.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 09-Jan-2025
 */
const getDashboardContent = async (req, res) => {
  try {
    const { _id, role } = req.user;
    if (!_id || !role) {
      return Error(res, 400, "User not found");
    }

    if (role === "admin") {
      const AdminDashboardContent = await getAdminDashboardContent({
        _id,
        role,
      });
      if (AdminDashboardContent) {
        return Success(
          res,
          200,
          "Admin Dashboard Content",
          AdminDashboardContent
        );
      } else {
        return Error(res, 404, "Admin Dashboard Content Not Found");
      }
    } else if (role === "clinic") {
      const clinicDashboardContent = await getClinicDashboardContent({
        _id,
        role,
      });
      if (clinicDashboardContent) {
        return Success(
          res,
          200,
          "Clinic Dashboard Content",
          clinicDashboardContent
        );
      } else {
        return Error(res, 206, "Clinic Dashboard Content Not Found");
      }
    } else {
      return Error(res, 206, "Invalid Role");
    }
  } catch (error) {
    return Error(res, 404, "Something went wrong while processing request");
  }
};

/**
 * Function is used for admin to login as a clinic without password.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 19-Dec-2024
 */

const adminLoginAsClinic = async (req, res) => {
  try {
    const { _id, role } = req.user;
    if (role !== "admin" && !_id) {
      return Error(res, 403, "Unauthorized");
    }
    if (_id) {
      const admin = await recordExists(User, { _id });
      if (!admin) {
        return Error(res, 403, "Unauthorized");
      }
    }
    const { clinicId } = req.params;
    if (!clinicId) {
      return Error(res, 400, "Missing required fields");
    }

    // Check if clinic exists
    const clinic = await clinicLoginViaAdmin(User, {
      _id: clinicId,
      role: "clinic",
    });
    if (!clinic) {
      return Error(res, 206, "Clinic not found");
    }

    return Success(res, 200, "Logged in as clinic", clinic);
  } catch (error) {
    return Error(res, 404, error.message);
  }
};

/**
 * Function is used for getting user profile data via auth token.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 23-Nov-2024
 */

const getUserProfile = async (req, res) => {
  try {
    const { _id } = req.user;
    // console.log("userID", _id);

    const user = await getSingleDocument(User, { _id: _id });
    if (user?.profilePicture?.path) {
      // Use cloud URL if available
      if (user.profilePicture.cloudUrl) {
        user.profilePicture.path = user.profilePicture.cloudUrl;
      } 
      // Check if it's a valid cloud URL (DigitalOcean Spaces)
      else if (user.profilePicture.path.includes('digitaloceanspaces.com')) {
        user.profilePicture.path = user.profilePicture.path;
      }
      // If it's a local filename (no http), add BASE_PATH
      else if (!user.profilePicture.path.startsWith('http')) {
        user.profilePicture.path = `${process.env.BASE_PATH}${user.profilePicture.path}`;
      }
      // If it's an old/invalid HTTP URL, set to null so frontend shows default
      else {
        user.profilePicture.path = null;
      }
    }
    if (user) {
      return Success(res, 200, "User profile fetched successfully", user);
    } else {
      return Error(res, 206, "User not found");
    }
  } catch (error) {
    return Error(res, 500, "Unable to fetch user profile");
  }
};

/**
 * Function is used for user lists and search sort feature.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 23-Nov-2024
 */

const listUsers = async (req, res) => {
  try {
    const { page, limit, sort, search, role } = req.query;
    const searchFields = ["firstName", "lastName", "email"];
    const [sortField, sortOrder] = sort?.split(":") || ["createdAt", "desc"];

    // Fetch users with reusable pagination function
    const users = await getPaginatedResults(User, {
      searchFields,
      search,
      sortField,
      sortOrder,
      page,
      limit,
      role,
    });

    users.data = users.data.map((user) => {
      if (user.profilePicture && user.profilePicture.path) {
        // Use cloud URL if available
        if (user.profilePicture.cloudUrl) {
          user.profilePicture.path = user.profilePicture.cloudUrl;
        } 
        // Check if it's a valid cloud URL (DigitalOcean Spaces)
        else if (user.profilePicture.path.includes('digitaloceanspaces.com')) {
          user.profilePicture.path = user.profilePicture.path;
        }
        // If it's a local filename (no http), add BASE_PATH
        else if (!user.profilePicture.path.startsWith('http')) {
          user.profilePicture.path = `${process.env.BASE_PATH}${user.profilePicture.path}`;
        }
        // If it's an old/invalid HTTP URL, set to null so frontend shows default
        else {
          user.profilePicture.path = null;
        }
      } else {
        user.profilePicture = {};
      }
      return user;
    });

    // Success response
    if (users.data.length > 0) {
      return Success(res, 200, "Users fetched successfully", users);
    } else {
      return Success(res, 200, "No users found");
    }
  } catch (error) {
    console.log(error.message);

    return Error(res, 500, "Unable to fetch users");
  }
};

/**
 * Function is used for user sign-up.
 * @access public
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 19-Nov-2024
 */

// const updateUser = async (req, res) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       userName,
//       email,
//       mobile,
//       role,
//       bio,
//       isDeleted,
//       status,
//     } = req.body;
//     const { _id } = req.params;
//     const uploads = await getUploadedFileDetails(req);
//     console.log("uploads", uploads);
//     if (uploads?.path) {
//       const existingUser = await getSingleDocument(User, { _id });
//       console.log("existingUser", existingUser);

//       // Unlink old profile picture if exists
//       if (existingUser?.profilePicture?.path) {
//         const oldFilePath = path.join(
//           __dirname,
//           "../..",
//           "user-uploads/profiles",
//           existingUser?.profilePicture?.path
//         );
//         fs.unlink(oldFilePath, (err) => {
//           if (err) console.error("Error unlinking old profile picture:", err);
//         });
//       }

//       // Add new profile picture to update data
//       jsonData.profilePicture = uploads;
//     }

//     let jsonData = {};
//     if (firstName) jsonData.firstName = firstName;
//     if (lastName) jsonData.lastName = lastName;
//     if (userName) jsonData.userName = userName;
//     if (email) jsonData.email = email;
//     if (mobile) jsonData.mobile = mobile;
//     if (role) jsonData.role = role;
//     if (bio) jsonData.bio = bio;
//     if (isDeleted != null) jsonData.isDeleted = isDeleted;
//     if (status != null) jsonData.status = status;
//     if (uploads) jsonData.profilePicture = uploads;

//     // Check for duplicate entry
//     const duplicateExists = await recordExists(User, {
//       $or: [{ email }, { mobile }],
//       _id: { $ne: _id }, // Exclude the current record
//     });

//     if (duplicateExists) {
//       return Error(res, 400, "Email or Mobile already exists");
//     }

//     // Update user in database
//     let checkCondition = { _id: _id, jsonData: jsonData };
//     let updatedData = await updateData(User, checkCondition);

//     console.log("updatedData", updatedData);
//     if (updatedData?.profilePicture?.path) {
//       updatedData.profilePicture.path = `${process.env.BASE_PATH}${updatedData?.profilePicture?.path}`;
//     }

//     if (updatedData) {
//       return Success(res, 200, "User updated successfully", updatedData);
//     } else {
//       return Error(res, 404, "User not found");
//     }
//   } catch (error) {
//     console.log(error.message);

//     return Error(res, 500, "Internal Server Error");
//   }
// };
const updateUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      userName,
      email,
      mobile,
      role,
      bio,
      isDeleted,
      status,
      clinicName
    } = req.body;
    const { _id } = req.params;

    let jsonData = {};
    if (firstName) jsonData.firstName = firstName;
    if (lastName) jsonData.lastName = lastName;
    if (userName) jsonData.userName = userName;
    if (email) jsonData.email = email;
    if (mobile) jsonData.mobile = mobile;
    if (role) jsonData.role = role;
    if (bio) jsonData.bio = bio;
    if (isDeleted != null) jsonData.isDeleted = isDeleted;
    if (status != null) jsonData.status = status;
    if (clinicName) jsonData.clinicName = clinicName;

    // Handle profile image replacement
    if (req.spacesUpload) {
      // Get existing user to find old image
      const existingUser = await getSingleDocument(User, { _id });
      
      // Delete old image from DigitalOcean Spaces if it exists
      if (existingUser?.profilePicture?.path) {
        const oldKey = extractKeyFromSpacesUrl(existingUser.profilePicture.path);
        if (oldKey) {
          try {
            await deleteFromSpaces(oldKey);
            console.log("Old profile image deleted:", oldKey);
          } catch (deleteError) {
            console.error("Failed to delete old image:", deleteError.message);
            // Continue with upload even if deletion fails
          }
        }
      }
      
      // Add new profile picture to update data
      jsonData.profilePicture = {
        originalName: req.file.originalname,
        savedName: req.spacesUpload.fileName,
        path: req.spacesUpload.cdnUrl,
        spacesKey: req.spacesUpload.key,
        cloudUrl: req.spacesUpload.cdnUrl,
      };
    }

    // Check for duplicate email or mobile
    const duplicateExists = await recordExists(User, {
      $or: [{ email }, { mobile }],
      _id: { $ne: _id }, // Exclude the current record
    });

    // if (duplicateExists) {
    //   return Error(res, 400, "Email or Mobile already exists");
    // }

    if (duplicateExists) {
      const emailExists = await recordExists(User, { email, _id: { $ne: _id } });
      const mobileExists = await recordExists(User, { mobile, _id: { $ne: _id } });

      if (emailExists) {
        return Error(res, 400, "Email already exists");
      } else if (mobileExists) {
        return Error(res, 400, "Mobile number already exists");
      } else {
        return Error(res, 400, "Email or Mobile already exists");
      }
    }

    // Update user in database
    let checkCondition = { _id: _id, jsonData: jsonData };
    const updatedData = await updateData(User, checkCondition);

    if (updatedData?.profilePicture?.path) {
      // Use cloud URL if available
      if (updatedData.profilePicture.cloudUrl) {
        updatedData.profilePicture.path = updatedData.profilePicture.cloudUrl;
      } 
      // Check if it's a valid cloud URL (DigitalOcean Spaces)
      else if (updatedData.profilePicture.path.includes('digitaloceanspaces.com')) {
        updatedData.profilePicture.path = updatedData.profilePicture.path;
      }
      // If it's a local filename (no http), add BASE_PATH
      else if (!updatedData.profilePicture.path.startsWith('http')) {
        updatedData.profilePicture.path = `${process.env.BASE_PATH}${updatedData.profilePicture.path}`;
      }
      // If it's an old/invalid HTTP URL, set to null so frontend shows default
      else {
        updatedData.profilePicture.path = null;
      }
    }

    if (updatedData) {
      return Success(res, 200, "User updated successfully", updatedData);
    } else {
      return Error(res, 404, "User not found");
    }
  } catch (error) {
    console.error("Update profile error:", error.message);
    return Error(res, 500, "Internal Server Error");
  }
};

/**
 * Function is used get single user data for admin.
 * @access public
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 18-Nov-2024
 */

const getSingleUser = async (req, res) => {
  try {
    const { _id } = req.params;

    // Fetch the record using the common function
    const user = await getSingleDocument(User, { _id });
    if (user) {
      // Process profile picture path like other functions
      if (user?.profilePicture?.path) {
        // Use cloud URL if available
        if (user.profilePicture.cloudUrl) {
          user.profilePicture.path = user.profilePicture.cloudUrl;
        } 
        // Check if it's a valid cloud URL (DigitalOcean Spaces)
        else if (user.profilePicture.path.includes('digitaloceanspaces.com')) {
          user.profilePicture.path = user.profilePicture.path;
        }
        // If it's a local filename (no http), add BASE_PATH
        else if (!user.profilePicture.path.startsWith('http')) {
          user.profilePicture.path = `${process.env.BASE_PATH}${user.profilePicture.path}`;
        }
        // If it's an old/invalid HTTP URL, set to null so frontend shows default
        else {
          user.profilePicture.path = null;
        }
      }
      
      // If record found, return it
      return Success(res, 200, "User fetched successfully", user);
    } else {
      return Error(res, 404, "User not found");
    }
  } catch (error) {
    return Error(res, 500, "Unable to fetch user");
  }
};

/**
 * Function is used for user logout.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 18-Nov-2024
 */

const logout = async (req, res) => {
  try {
    return Success(res, 200, `Logged out successfully`);
  } catch (error) {
    return Error(res, 500, error.message);
  }
};

/**
 * Function is used for user forget password.
 * @access public
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 17-Jan-2025
 */
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await getSingleDocument(User, { email });

    if (!user) {
      return Error(res, 404, "User not found");
    }
    const CLIENT_BASE_PATH = process.env.CLIENT_BASE_PATH;
    const RESET_PASS_PAGE = "reset-password/";
    const TOKEN = await generateToken(email);
    const resetLink = `${CLIENT_BASE_PATH}${RESET_PASS_PAGE}?token=${TOKEN}`;
    let data = {
      userEmail: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      resetLink: resetLink,
      currentYear: new Date().getFullYear(),
    };
    const sendVerificationEmail = await verifyForgotPassword(data);

    if (sendVerificationEmail) {
      return Success(res, 200, "Email sent to reset password");
    } else {
      return Error(res, 500, "Unable to send email");
    }
  } catch (error) {
    console.log(error.message);

    return Error(res, 500, "Unable to reset password");
  }
};

/**
 * Function is used for user reset password by token verification.
 * @access public
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 17-Jan-2025
 */
const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;
    if (password !== confirmPassword) {
      return Error(res, 400, "Passwords do not match");
    }

    // Handle token verification and check for errors
    const checkVerification = await verifyToken(token);
    if (checkVerification.error) {
      return Error(res, 401, checkVerification.error); // Send error message if token is invalid or expired
    }

    const hashedPassword = await getHashedPassword(password);
    if (hashedPassword) {
      let data = {
        _id: checkVerification?.user?._id,
        jsonData: {
          password: hashedPassword,
        },
      };

      const changePassword = await updateData(User, data);
      if (changePassword) {
        return Success(res, 200, "Password reset successfully");
      } else {
        return Error(res, 500, "Unable to reset password");
      }
    }
  } catch (error) {
    return Error(res, 500, error.message || "Unable to reset password");
  }
};
/**
 * Function is used for user details update.
 * @access public
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 19-Nov-2024
 */

const updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      userName,
      email,
      mobile,
      role,
      bio,
      isDeleted,
      status,
    } = req.body;
    const { _id } = req.user;

    let jsonData = {};
    if (firstName) jsonData.firstName = firstName;
    if (lastName) jsonData.lastName = lastName;
    if (userName) jsonData.userName = userName;
    if (email) jsonData.email = email;
    if (mobile) jsonData.mobile = mobile;
    if (role) jsonData.role = role;
    if (bio) jsonData.bio = bio;
    if (isDeleted != null) jsonData.isDeleted = isDeleted;
    if (status != null) jsonData.status = status;

    // Handle profile image replacement
    if (req.spacesUpload) {
      // Get existing user to find old image
      const existingUser = await getSingleDocument(User, { _id });
      
      // Delete old image from DigitalOcean Spaces if it exists
      if (existingUser?.profilePicture?.path) {
        const oldKey = extractKeyFromSpacesUrl(existingUser.profilePicture.path);
        if (oldKey) {
          try {
            await deleteFromSpaces(oldKey);
            console.log("Old profile image deleted:", oldKey);
          } catch (deleteError) {
            console.error("Failed to delete old image:", deleteError.message);
            // Continue with upload even if deletion fails
          }
        }
      }
      
      // Add new profile picture to update data
      jsonData.profilePicture = {
        originalName: req.file.originalname,
        savedName: req.spacesUpload.fileName,
        path: req.spacesUpload.cdnUrl,
        spacesKey: req.spacesUpload.key,
        cloudUrl: req.spacesUpload.cdnUrl,
      };
    }

    // Check for duplicate email or mobile
    const duplicateExists = await recordExists(User, {
      $or: [{ email }, { mobile }],
      _id: { $ne: _id }, // Exclude the current record
    });

    if (duplicateExists) {
      return Error(res, 400, "Email or Mobile already exists");
    }

    // Update user in database
    let checkCondition = { _id: _id, jsonData: jsonData };
    const updatedData = await updateData(User, checkCondition);

    if (updatedData?.profilePicture?.path) {
      // Use cloud URL if available
      if (updatedData.profilePicture.cloudUrl) {
        updatedData.profilePicture.path = updatedData.profilePicture.cloudUrl;
      } 
      // Check if it's a valid cloud URL (DigitalOcean Spaces)
      else if (updatedData.profilePicture.path.includes('digitaloceanspaces.com')) {
        updatedData.profilePicture.path = updatedData.profilePicture.path;
      }
      // If it's a local filename (no http), add BASE_PATH
      else if (!updatedData.profilePicture.path.startsWith('http')) {
        updatedData.profilePicture.path = `${process.env.BASE_PATH}${updatedData.profilePicture.path}`;
      }
      // If it's an old/invalid HTTP URL, set to null so frontend shows default
      else {
        updatedData.profilePicture.path = null;
      }
    }

    if (updatedData) {
      return Success(res, 200, "User updated successfully", updatedData);
    } else {
      return Error(res, 404, "User not found");
    }
  } catch (error) {
    console.error("Update profile error:", error.message);
    return Error(res, 500, "Internal Server Error");
  }
};

/**
 * Function is used for user welcome.
 * @access public
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 18-Nov-2024
 */

const welcome = async (req, res) => {
  try {
    return Success(res, 200, "success");
  } catch (error) {
    console.log("Error", error);
  }
};

export default {
  welcome,
  login,
  logout,
  signUp,
  listUsers,
  updateUser,
  getSingleUser,
  getUserProfile,
  adminLoginAsClinic,
  forgetPassword,
  resetPassword,
  updateProfile,
  getDashboardContent,
};
