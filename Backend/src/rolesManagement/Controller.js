import Role from "../models/roles";
import {
  addRecord,
  getPaginatedResults,
  getSingleDocument,
  recordExists,
  updateData,
} from "../utils/customeFunction";
import { Error, Success } from "../utils/customeResponse";

/**
 * Function is used for roles management list roles.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 03-Dec-2024
 */

const listRoles = async (req, res) => {
  try {
    const { page, limit, sort, search } = req.query;
    const searchFields = ["roleName"];
    const [sortField, sortOrder] = sort?.split(":") || ["createdAt", "desc"];

    const roles = await getPaginatedResults(Role, {
      searchFields,
      search,
      sortField,
      sortOrder,
      page,
      limit,
    });

    if (roles.data.length > 0) {
      return Success(res, 200, "Roles fetched successfully", roles);
    } else {
      return Success(res, 200, "No roles found");
    }
  } catch (error) {
    return Error(res, 500, "Unable to fetch roles");
  }
};

/**
 * Function is used for adding a new role.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 03-Dec-2024
 */
const addRole = async (req, res) => {
  try {
    const { roleName } = req.body;
    const exists = await recordExists(Role, { roleName });
    if (exists) {
      return Error(res, 409, "Role already exists");
    }
    const newRole = await addRecord(Role, { roleName });
    return Success(res, 200, "Role added successfully", newRole);
  } catch (error) {
    // console.log("Something went wrong", error.message);
    return Error(res, 500, "Unable to add role");
  }
};

/**
 * Function is used for updating any existing roles details.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 03-Dec-2024
 */
const updateRole = async (req, res) => {
  try {
    const { roleName, isDeleted } = req.body;
    const { _id } = req.params;

    /* Return false if no parameter provided */
    if (!roleName && isDeleted === undefined) {
      return Error(res, 400, "Missing parameter");
    }

    let jsonData = {};
    if (roleName) jsonData.roleName = roleName;
    if (isDeleted !== undefined) jsonData.isDeleted = isDeleted;

    // Check if the update results in a duplicate entry with another record
    const duplicateExists = await recordExists(Role, {
      roleName: roleName,
      _id: { $ne: _id }, // Exclude the current record
    });

    if (duplicateExists) {
      return Error(res, 409, "Duplicate entry found with another record");
    }

    const updatedRole = await updateData(Role, { _id, jsonData });

    if (updatedRole) {
      return Success(res, 200, "Role updated successfully", updatedRole);
    } else {
      return Error(res, 404, "Role not found");
    }
  } catch (error) {

    return Error(res, 500, "Unable to update role");
  }
};

/**
 * Function is used for fetching single role details.
 * @access private
 * @return json
 * Created by Akash
 * @smartData Enterprises (I) Ltd
 * Created Date 03-Dec-2024
 */
const getRoleDetails = async (req, res) => {
  try {
    const { _id } = req.params;

    const roleDetails = await getSingleDocument(Role, { _id });
    if (roleDetails) {
      return Success(
        res,
        200,
        "Role details fetched successfully",
        roleDetails
      );
    } else {
      return Error(res, 404, "Role details not found");
    }
  } catch (error) {
    return Error(res, 500, "Unable to fetch role details");
  }
};

export default {
  listRoles,
  addRole,
  updateRole,
  getRoleDetails,
};
