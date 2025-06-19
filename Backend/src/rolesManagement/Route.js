import Controller from "./Controller";

export default (router) => {
  // =============================================================
  // Private Routes (Authentication Required)
  // =============================================================
  router.get("/roles", Controller.listRoles);
  router.post("/add-role", Controller.addRole);
  router.put("/update-role/:_id", Controller.updateRole);
  router.get("/get-role/:_id", Controller.getRoleDetails);

  return router;
};
