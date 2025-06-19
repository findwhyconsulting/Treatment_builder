import Controller from "./Controller";

export default (router) => {
  // =============================================================
  // Private Routes (Authentication Required) concern details
  // =============================================================
  router.post("/body-parts", Controller.addBodyAndPartData);
  router.get("/body-parts", Controller.listParts);
  router.put("/body-parts/:_id", Controller.updatePartDetails);
  router.get("/body-parts/:_id", Controller.getPartDetails);
  // =============================================================
  // Private Routes (Authentication Required) Part Details
  // =============================================================
  router.post("/parts", Controller.addNewPart);
  router.put("/parts/:_id", Controller.updatePartById);
  router.get("/parts", Controller.getAllParts);

  return router;
};
