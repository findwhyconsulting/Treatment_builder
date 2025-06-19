import {
  uploadMultipleImages,
  uploadSingleImage,
} from "../middleware/userUploads";
import Controller from "./Controller";

export default (router) => {
  // ==========================
  // Public Routes
  // ==========================

  router.post("/consultation", Controller.saveConsultations);
  router.post("/consultations-submit", Controller.saveConsultationAfterSubmit);
  router.post("/consultations-email", Controller.sendConsultationEmail);


  router.get("/consultations", Controller.getConsultations);
  router.put("/consultations/:_id", Controller.updateConsultation);

  // POST route for single image upload
  // router.post(
  //   "/upload-image",
  //   uploadSingleImage("image"),
  //   Controller.saveUploadedImage
  // ); // for single image upload

  // POST route for multiple image upload (if needed)
  // router.post(
  //   "/upload-images",
  //   uploadMultipleImages("images", 5),
  //   Controller.saveUploadedImage
  // ); // for multiple images upload

  return router;
};
