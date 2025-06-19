import { uploadSingleLogo } from "../middleware/userUploads";
import Controller from "./Controller";

export default (router) => {
  // =============================================================
  // Public Routes (Authentication Not Required)
  // =============================================================
  router.post("/public-content", Controller.getPublicContent);

  // =============================================================
  // Private Routes (Authentication Required)
  // =============================================================
  router.get("/contents", Controller.getContent);
  router.put("/contents", Controller.updateContent);
  router.post("/contents/reset", Controller.resetContent);
  router.put("/settings/logo", uploadSingleLogo("logo"), Controller.changeLogo);
  return router;
};
