export default function (express) {
  let router = express.Router();
  /* User Management */
  require("./userManagement/Route").default(router);

  /* Body Management */
  require("./bodyManagement/Route").default(router);

  /* Roles Management */
  require("./rolesManagement/Route").default(router);

  /* Permission Management */
  require("./permissionManagement/Route").default(router);

  /* clinics Management */
  require("./clinicManagement/Route").default(router);

  /* Patient Management */
  require("./patientController/Route").default(router);

  /* Clinic Content Management */
  require("./contentManagement/Route").default(router);

  /* Pakcages Management */
  require("./packageManagement/Route").default(router);

  /* Image Content Management */
  require("./ImageManagement/Route").default(router);

  return router;
}
