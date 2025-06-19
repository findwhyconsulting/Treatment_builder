import Controller from "./Controller";

export default (router) => {
  // =============================================================
  // Private Routes (Authentication Required)
  // =============================================================
  router.post("/add-permission", Controller.addPermission);
  router.get("/list-permissions", Controller.listPermissions);
  router.put("/update-permission/:_id", Controller.updatePermission);
  router.get("/get-permission/:_id", Controller.getPermissionDetails);

  return router;
};
