import { uploadSingleClientImage, uploadSingleImage } from "../middleware/userUploads";
import { uploadSingleImageToSpaces, uploadSingleClientImageToSpaces } from "../middleware/spacesUpload.js";
import Controller from "./Controller";

export default (router) => {
  // =============================================================
  // Private Routes (Authentication Required) concern details
  // =============================================================
  router.post(
    "/upload-image",
    uploadSingleImageToSpaces("image", "face-images"),
    Controller.addImageWithCode
  ); // for single image upload

  router.post(
    "/uploadImage",
    uploadSingleClientImageToSpaces("image", "client-images"),
  );

  router.get("/images", Controller.listImages);
  router.put("/parts", Controller.updatePartForImage);
  router.put("/parts/coordinates", Controller.chnangeLinesCoordinates);



  return router;
};
