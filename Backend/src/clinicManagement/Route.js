import { uploadSingleProfileImage } from "../middleware/userUploads";
import { uploadSingleImageToSpaces, uploadProfileImageWithReplacement } from "../middleware/spacesUpload.js";
import Controller from "./Controller";

export default (router) => {
  // =============================================================
  // Private Routes (Authentication Required)
  // =============================================================
  router.post(
    "/users",
    uploadProfileImageWithReplacement("profileImage", "profiles"),
    Controller.addUser
  );

  return router;
};
