import * as responseHandler from "../../src/utils/customeResponse.js";
import Controller from "../../src/rolesManagement/Controller.js";
import { Role } from "../../src/models/roles.js";
import { getPaginatedResults } from "../../src/utils/customeFunction.js";
import * as helpers from "../../src/utils/customeFunction.js";

jest.mock("../../src/utils/customeResponse.js");
jest.mock("../../src/utils/customeFunction.js");

// describe("listRoles", () => {
//   let req, res;

//   beforeEach(() => {
//     req = {
//       query: {
//         page: 1,
//         limit: 10,
//         sort: "roleName:asc",
//         search: "admin",
//       },
//     };

//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     jest.clearAllMocks();
//   });

//   test("should return 200 and roles list when roles exist", async () => {
//     const mockRoles = {
//       data: [
//         { _id: "1", roleName: "Admin" },
//         { _id: "2", roleName: "User" },
//       ],
//       total: 2,
//     };
  
//     // Correctly mock `getPaginatedResults` from `helpers`
//     helpers.getPaginatedResults.mockResolvedValue(mockRoles);
  
//     await Controller.listRoles(req, res);
  
//     expect(helpers.getPaginatedResults).toHaveBeenCalledWith(expect.any(Function), {
//         searchFields: ["roleName"],
//         search: "admin",
//         sortField: "roleName",
//         sortOrder: "asc",
//         page: Number(req.query.page), // Convert to number
//         limit: Number(req.query.limit), // Convert to number
//       });
      
  
//     expect(responseHandler.Success).toHaveBeenCalledWith(
//       res,
//       200,
//       "Roles fetched successfully",
//       mockRoles
//     );
//   });
  

//   test("should return 200 with 'No roles found' when no roles exist", async () => {
//     getPaginatedResults.mockResolvedValue({ data: [], total: 0 });

//     await Controller.listRoles(req, res);

//     expect(responseHandler.Success).toHaveBeenCalledWith(
//       res,
//       200,
//       "No roles found"
//     );
//   });

//   test("should return 500 when an error occurs", async () => {
//     getPaginatedResults.mockRejectedValue(new Error("Database error"));

//     await Controller.listRoles(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(
//       res,
//       500,
//       "Unable to fetch roles"
//     );
//   });
// });



// describe("addRole Controller", () => {
//   let req, res;

//   beforeEach(() => {
//     req = {
//       body: { roleName: "Admin" },
//     };
//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     jest.clearAllMocks();
//   });

//   test("should return 409 if role already exists", async () => {
//     // Mock `recordExists` to return `true` (indicating role exists)
//     helpers.recordExists.mockResolvedValue(true);
  
//     await Controller.addRole(req, res);
  
//     // Allow any function as the first argument (model)
//     expect(helpers.recordExists).toHaveBeenCalledWith(expect.any(Function), { roleName: "Admin" });
  
//     // Ensure correct error response is sent
//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 409, "Role already exists");
//   });
  

//   test("should add a new role and return 200", async () => {
//     const mockRole = { _id: "123", roleName: "Admin" };
//     helpers.recordExists.mockResolvedValue(false);
//     helpers.addRecord.mockResolvedValue(mockRole);
  
//     await Controller.addRole(req, res);
  
//     // Fix model expectation
//     expect(helpers.recordExists).toHaveBeenCalledWith(expect.any(Function), { roleName: "Admin" });
//     expect(helpers.addRecord).toHaveBeenCalledWith(expect.any(Function), { roleName: "Admin" });
  
//     // Ensure correct success response
//     expect(responseHandler.Success).toHaveBeenCalledWith(res, 200, "Role added successfully", mockRole);
//   });
  

//   test("should return 500 if an error occurs", async () => {
//     // Properly mock `recordExists` to reject with an error
//     jest.spyOn(helpers, "recordExists").mockRejectedValue(new Error("Database error"));
  
//     await Controller.addRole(req, res);
  
//     // Ensure `recordExists` was called with correct arguments
//     expect(helpers.recordExists).toHaveBeenCalledWith(expect.any(Function), { roleName: "Admin" });
  
//     // Ensure error response is returned
//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "Unable to add role");
//   });
  
// });


// describe("updateRole Controller", () => {
//   let req, res;

//   beforeEach(() => {
//     req = {
//       params: { _id: "123" },
//       body: { roleName: "Admin", isDeleted: false },
//     };
//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     jest.clearAllMocks();
//   });

//   test("should return 400 if no parameters are provided", async () => {
//     req.body = {}; // No parameters

//     await Controller.updateRole(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 400, "Missing parameter");
//   });

//   test("should return 409 if a duplicate roleName exists", async () => {
//     helpers.recordExists.mockResolvedValue(true); // Simulating duplicate found

//     await Controller.updateRole(req, res);

//     expect(helpers.recordExists).toHaveBeenCalledWith(expect.any(Function), {
//       roleName: "Admin",
//       _id: { $ne: "123" },
//     });

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 409, "Duplicate entry found with another record");
//   });

//   test("should return 404 if role is not found", async () => {
//     helpers.recordExists.mockResolvedValue(false);
//     helpers.updateData.mockResolvedValue(null); // Simulating role not found

//     await Controller.updateRole(req, res);

//     expect(helpers.updateData).toHaveBeenCalledWith(expect.any(Function), {
//       _id: "123",
//       jsonData: { roleName: "Admin", isDeleted: false },
//     });

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 404, "Role not found");
//   });

//   test("should return 200 and update role successfully", async () => {
//     const mockUpdatedRole = { _id: "123", roleName: "Admin", isDeleted: false };
//     helpers.recordExists.mockResolvedValue(false);
//     helpers.updateData.mockResolvedValue(mockUpdatedRole); // Simulating successful update

//     await Controller.updateRole(req, res);

//     expect(helpers.updateData).toHaveBeenCalledWith(expect.any(Function), {
//       _id: "123",
//       jsonData: { roleName: "Admin", isDeleted: false },
//     });

//     expect(responseHandler.Success).toHaveBeenCalledWith(res, 200, "Role updated successfully", mockUpdatedRole);
//   });

//   test("should return 500 if an error occurs", async () => {
//     helpers.recordExists.mockRejectedValue(new Error("Database error")); // Simulate an error

//     await Controller.updateRole(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "Unable to update role");
//   });
// });



describe("getRoleDetails Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { _id: "123" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test("should return 200 if role details are found", async () => {
    const mockRoleDetails = { _id: "123", roleName: "Admin" };
    helpers.getSingleDocument.mockResolvedValue(mockRoleDetails);
  
    console.log("Mocked role details:", await helpers.getSingleDocument(Role, { _id: "123" })); // Debugging
  
    await Controller.getRoleDetails(req, res);
  
    expect(helpers.getSingleDocument).toHaveBeenCalledWith(Role, { _id: "123" });
  
    expect(responseHandler.Success).toHaveBeenCalledWith(
      res,
      200,
      "Role details fetched successfully",
      mockRoleDetails
    );
  });
  

  test("should return 404 if role details are not found", async () => {
    helpers.getSingleDocument.mockResolvedValue(null); // Ensure it returns null
  
    await Controller.getRoleDetails(req, res);
  
    console.log("Mocked roleDetails:", await helpers.getSingleDocument(Role, { _id: "123" })); // Debugging
  
    expect(helpers.getSingleDocument).toHaveBeenCalledWith(Role, { _id: "123" });
  
    expect(responseHandler.Error).toHaveBeenCalledWith(res, 404, "Role details not found");
  });
  

  test("should return 500 if an error occurs", async () => {
    helpers.getSingleDocument.mockRejectedValue(new Error("Database error")); // Simulate an error

    await Controller.getRoleDetails(req, res);

    expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "Unable to fetch role details");
  });
});
