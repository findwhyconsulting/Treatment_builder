import {
  uploadMultipleImages,
  uploadMultiplePackageFiles,
} from "../middleware/userUploads";
import Controller from "./Controller";

export default (router) => {
  // ==========================
  // Private Routes           |
  // ==========================
  router.get("/packages", Controller.getPackages);
  router.get("/packages/all", Controller.getAllPackages);
  router.post(
    "/packages",
    uploadMultiplePackageFiles("files", 6),
    Controller.createPackages
  );
  router.put(
    "/packages/:_id",
    uploadMultiplePackageFiles("files", 6),
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
