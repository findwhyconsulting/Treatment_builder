import {
  uploadMultipleImages,
  uploadMultiplePackageFiles,
} from "../middleware/userUploads";
import { uploadMultipleImagesToSpaces, uploadMultipleImagesToSpacesOptional, uploadPackageImagesWithReplacement } from "../middleware/spacesUpload.js";
import Controller from "./Controller";

export default (router) => {
  // ==========================
  // Private Routes           |
  // ==========================
  router.get("/packages", Controller.getPackages);
  router.get("/packages/all", Controller.getAllPackages);
  router.post(
    "/packages",
    uploadPackageImagesWithReplacement("files", 6, "packages"),
    Controller.createPackages
  );
  router.put(
    "/packages/:_id",
    uploadPackageImagesWithReplacement("files", 6, "packages"),
    Controller.updatePackage
  );
  router.put(
    "/package/:_id",
    Controller.deletePackage
  );

  router.get("/affected-packages/:_id",Controller.listAffectedBodyParts);
  
  router.get("/get-package/:_id", Controller.getPackageDetails);
  router.post("/remove-file", Controller.removeFileFromPackage);

  // ==========================
  // Public Routes            |
  // ==========================
  router.post("/recommendations", Controller.getRecommendation);

  return router;
};
