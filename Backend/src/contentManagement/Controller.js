import Body from "../models/bodyParts";
import Content from "../models/contents";
import Part from "../models/parts";
import User from "../models/users";
import mongoose from "mongoose";
import {
  addRecord,
  deleteSingleContent,
  generatePaths,
  getPaginatedResults,
  getPaginatedResultsForAll,
  getSingleContent,
  getSingleDocument,
  getUploadedFileDetails,
  recordExists,
  updateOldContent,
} from "../utils/customeFunction";
import { Error, Success } from "../utils/customeResponse";

/**
 * Get content of any registered clinic, in case if no content doc available,
 * It will create one and return .
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 25-Dec-2024
 */
const getContent = async (req, res) => {
  try {
    const { _id, userName } = req.user;
    let content = await getSingleContent(Content, { user: _id });

    if (!content) {
      const newContent = await addRecord(Content, { user: _id });
      if (!newContent) {
        return Error(res, 500, "Failed to create new content");
      }
      content = await getSingleContent(Content, { user: _id });
    }
    const paths = generatePaths(content.services || {}, userName);

    const responseContent = {
      ...content.toObject(), // Convert content to plain object for modifications
      paths,
    };
    if (responseContent?.logo?.path) {
      const basePath = process.env.BASE_PATH || "http://localhost:8055"; // Set your base URL
      responseContent.logo.path = responseContent?.logo?.path
        ? `${basePath}/${responseContent?.logo?.path}`
        : ""; // Modify the path
    }
    return Success(res, 200, "Content found", responseContent);
  } catch (error) {
    console.error("Error in getContent:", error);
    return Error(res, 500, error.message);
    // return Error(res, 500, "Error occurred while fetching or creating content");
  }
};

/**
 * Used to update the content data by using clinic token,
 * It will create one and return .
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 25-Dec-2024
 */
const updateContent = async (req, res) => {
  try {
    const { _id, userName } = req.user;
    const {
      services,
      step1,
      step2,
      step3,
      step4,
      buttonSettings,
      stepperSettings,
      footer,
      header,
      headingSettings,
      submitForm,
      submission,
      font
    } = req.body;
    if (!services || typeof services !== "object") {
      return Error(res, 400, "Invalid services data");
    }

    let content = await getSingleContent(Content, { user: _id });
    if (!content) {
      return Error(res, 404, "Content not found");
    }

    const updateData = {};
    if (services) updateData.services = services;
    if (step1) updateData.step1 = step1;
    if (step2) updateData.step2 = step2;
    if (step3) updateData.step3 = step3;
    if (step4) updateData.step4 = step4;
    if (buttonSettings) updateData.buttonSettings = buttonSettings;
    if (stepperSettings) updateData.stepperSettings = stepperSettings;
    if (footer) updateData.footer = footer;
    if (header) updateData.header = header;
    if (headingSettings) updateData.headingSettings = headingSettings;
    if (submitForm) updateData.submitForm = submitForm;
    if (submission) updateData.submission = submission;
    if (font) updateData.font = font;

    const updatedContent = await updateOldContent(
      Content,
      { user: _id },
      updateData
    );

    if (!updatedContent) {
      return Error(res, 500, "Failed to update content");
    }

    const paths = generatePaths(services, userName);

    const responseContent = {
      ...updatedContent.toObject(), // Convert updated content to plain object
      paths,
    };

    return Success(res, 200, "Content updated successfully", responseContent);
  } catch (error) {
    console.error("Error in updateContent:", error);
    return Error(res, 500, "Error occurred while updating content");
  }
};

/**
 * This is a public function where user will get dynamic design details and be shown in UI,
 * It will create one and return .
 * @access public
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 25-Dec-2024
 */
const getPublicContent = async (req, res) => {
  try {
    const { userName, part } = req.body;

    if (!userName || !part) {
      return Error(res,400,"Invalid request. Username and part are required.");
    }

    // Find the user based on the username
    const user = await getSingleDocument(User, {
      userName: userName,
      isDeleted: false,
      status: true,
    });
    if (!user) {
      return Error(res, 404, "Clinic does not provide service for this part");
    }

    // Fetch the content for the user
    const content = await getSingleContent(Content, { user: user._id });
    if (!content) {
      return Error(res, 404, "Content not found for the specified user");
    }

    // Check if the requested part exists in the services
    if (!content.services || !content.services[part]) {
      return Error(res, 404, `Clinic dont provide service for this part`);
    }

    const clinicActiveParts = await getPaginatedResultsForAll(Body, {
      status: "active",
      userId: user?._id,
    });

    let logo = `${process.env.BASE_PATH}${content?.logo?.path}`;

    // Construct the response
    const responseContent = {
      user: user ? user.userName : "",
      logo: logo ? logo : "",
      part,
      data: content ? content : {},
      activepParts: clinicActiveParts ? clinicActiveParts?.data : [],
    };

    return Success(res, 200, "Public content found", responseContent);
  } catch (error) {
    console.error("Error in getPublicContent:", error);
    return Error(res, 500, "Error occurred while fetching public content");
  }
};

/**
 * Update content design of the pages .
 * @access public
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 25-Dec-2024
 */
const resetContent = async (req, res) => {
  try {
    const userId = req.user._id;
    const removeContent = await deleteSingleContent(Content, { user: userId });
    if (removeContent) {
      const newContent = await addRecord(Content, { user: userId });
      if (!newContent) {
        return Error(res, 500, "Failed to create new content");
      }
      return Success(res, 200, "Content reset successfully");
    } else {
      return Error(res, 500, "Error occurred while resetting content");
    }
  } catch (error) {
    return Error(res, 500, "Unexpected server error");
  }
};

/* Update clinic logo */
const changeLogo = async (req, res) => {
  try {
    const { user } = req.body;
    const uploadedLogo = await getUploadedFileDetails(req);
    const contentData = await getSingleContent(Content, {
      user: new mongoose.Types.ObjectId(user),
    });
    if (!contentData) {
      return Error(res, 404, "Content not found");
    }
    let jsonData = {};
    if (uploadedLogo) {
      jsonData.logo = uploadedLogo;
    }

    const updatedUser = await Content.findByIdAndUpdate(
      { _id: contentData._id },
      { $set: jsonData },
      { new: true }
    );

    if (updatedUser) {
      const basePath = process.env.BASE_PATH || "http://localhost:8055"; // Set your base URL
      updatedUser.logo.path = `${basePath}/${updatedUser.logo.path}`; // Modify the path

      return Success(res, 200, "Logo updated successfully", updatedUser);
    } else {
      return Error(res, 500, "Failed to update logo");
    }
  } catch (error) {
    return Error(res, 500, "Something went wrong");
  }
};

export default {
  getContent,
  updateContent,
  changeLogo,
  resetContent,
  getPublicContent,
};
