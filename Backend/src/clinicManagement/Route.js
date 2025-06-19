import { uploadSingleProfileImage } from "../middleware/userUploads";
import Controller from "./Controller";

export default (router) => {
  // =============================================================
  // Private Routes (Authentication Required)
  // =============================================================
  router.post(
    "/users",
    uploadSingleProfileImage("profileImage"),
    Controller.addUser
  );

  return router;
};
