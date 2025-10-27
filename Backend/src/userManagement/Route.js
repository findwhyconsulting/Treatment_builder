import { uploadSingleProfileImage } from "../middleware/userUploads";
import { uploadSingleImageToSpaces, uploadProfileImageWithReplacement } from "../middleware/spacesUpload.js";
import Controller from "./Controller";

export default (router) => {
  // ==========================
  // Public Routes
  // ==========================
  router.post("/", Controller.welcome);
  router.post("/login", Controller.login);
  router.post("/sign-up", Controller.signUp);
  router.post("/logout", Controller.logout);

  // ==========================
  // Private Routes (Authentication Required)
  // ==========================

  router.get("/dashboard", Controller.getDashboardContent);
  router.post("/login-as/:clinicId", Controller.adminLoginAsClinic);
  router.get("/users", Controller.listUsers);
  router.get("/profile", Controller.getUserProfile);
  router.put(
    "/update-profile",
    uploadProfileImageWithReplacement("profileImage", "profiles"),
    Controller.updateProfile
  );
  router.put(
    "/update-user/:_id",
    uploadProfileImageWithReplacement("profileImage", "profiles"),
    Controller.updateUser
  );
  router.get("/get-user/:_id", Controller.getSingleUser);

  // ==========================
  // Public Routes (Authentication Not Required)
  // ==========================
  router.post("/forgot-password", Controller.forgetPassword);
  router.post("/reset-password", Controller.resetPassword);


  return router;
};
