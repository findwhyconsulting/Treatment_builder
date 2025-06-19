import Permission from "../models/permissions";
import {
  addRecord,
  getPaginatedResults,
  getSingleDocument,
  recordExists,
  updateData,
} from "../utils/customeFunction";
import { Error, Success } from "../utils/customeResponse";

/**
 * Function is used for permissions management.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 03-Dec-2024
 */

const listPermissions = async (req, res) => {
  try {
    const { page, limit, sort, search } = req.query;
    const searchFields = ["moduleName", "modulePath"];
    const [sortField, sortOrder] = sort?.split(":") || ["createdAt", "desc"];

    const permissions = await getPaginatedResults(Permission, {
      searchFields,
      search,
      sortField,
      sortOrder,
      page,
      limit,
    });

    if (permissions.data.length > 0) {
      return Success(res, 200, "Permissions fetched successfully", permissions);
    } else {
      return Success(res, 204, "No permissions found");
    }
  } catch (error) {
    return Error(res, 500, "Unable to fetch permissions");
  }
};

/**
 * Function is used for adding a new permission.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 03-Dec-2024
 */
const addPermission = async (req, res) => {
  try {
    const { moduleName, modulePath, permissions } = req.body;

    if (!moduleName || !modulePath) {
      return Error(res, 400, "Missing required fields");
    }

    if (permissions) {
      const { create, read, update, delete: del } = permissions;

      if (
        typeof create !== "boolean" ||
        typeof read !== "boolean" ||
        typeof update !== "boolean" ||
        typeof del !== "boolean"
      ) {
        return Error(
          res,
          400,
          "Permissions must include boolean values for create, read, update, and delete operations"
        );
      }
    }

    const exists = await recordExists(Permission, {
      $or: [{ moduleName }, { modulePath }],
    });
    if (exists) {
      return Error(res, 409, "Permission already exists for this module");
    }

    const newPermission = await addRecord(Permission, {
      moduleName,
      modulePath,
      permissions,
    });
    return Success(res, 200, "Permission added successfully", newPermission);
  } catch (error) {
    return Error(res, 500, "Unable to add permission");
  }
};

/**
 * Function is used for updating any existing permission details.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 03-Dec-2024
 */
const updatePermission = async (req, res) => {
  try {
    const { moduleName, modulePath, permissions, isDeleted } = req.body;
    const { _id } = req.params;

    // Check if required fields are provided
    if (!moduleName && !modulePath && isDeleted === undefined) {
      return Error(res, 400, "Missing required fields");
    }

    if (permissions) {
      const { create, read, update, delete: del } = permissions;

      if (
        typeof create !== "boolean" ||
        typeof read !== "boolean" ||
        typeof update !== "boolean" ||
        typeof del !== "boolean"
      ) {
        return Error(
          res,
          400,
          "Permissions must include boolean values for create, read, update, and delete operations"
        );
      }
    }

    let jsonData = {};
    if (moduleName) jsonData.moduleName = moduleName;
    if (modulePath) jsonData.modulePath = modulePath;
    if (permissions) jsonData.permissions = permissions;
    if (isDeleted !== undefined) jsonData.isDeleted = isDeleted;

    const duplicateExists = await recordExists(Permission, {
      moduleName: moduleName,
      modulePath: modulePath,
      _id: { $ne: _id }, // Exclude the current record
    });

    if (duplicateExists) {
      return Error(res, 409, "Duplicate entry found with another record");
    }
    // Ensure data is only updated when something is changed
    const updatedPermission = await updateData(Permission, {
      _id,
      jsonData,
    });

    if (updatedPermission) {
      return Success(
        res,
        200,
        "Permission updated successfully",
        updatedPermission
      );
    } else {
      return Error(res, 404, "Permission not found");
    }
  } catch (error) {
    // console.log(error.message);

    return Error(res, 500, "Unable to update permission");
  }
};

/**
 * Function is used for fetching single permission details.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 03-Dec-2024
 */
const getPermissionDetails = async (req, res) => {
  try {
    const { _id } = req.params;

    const permissionDetails = await getSingleDocument(Permission, { _id });
    if (permissionDetails) {
      return Success(
        res,
        200,
        "Permission details fetched successfully",
        permissionDetails
      );
    } else {
      return Error(res, 404, "Permission details not found");
    }
  } catch (error) {
    return Error(res, 500, "Unable to fetch permission details");
  }
};

export default {
  listPermissions,
  addPermission,
  updatePermission,
  getPermissionDetails,
};
