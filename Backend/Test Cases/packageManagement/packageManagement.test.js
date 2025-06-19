import * as helpers from "../../src/utils/customeFunction.js";
import * as responseHandler from "../../src/utils/customeResponse.js";
import controller from "../../src/packageManagement/Controller.js";
import { Package } from "../../src/models/packages.js";
import mongoose from "mongoose";
import { Success } from "../../src/utils/customeResponse.js";
import { Body } from "../../src/models/bodyParts.js";


// Mock all required functions
jest.mock("../../src/utils/customeFunction.js");
jest.mock("../../src/utils/customeResponse.js");

// describe("getRecommendation Controller", () => {
//   let req, res;

//   beforeEach(() => {
//     jest.clearAllMocks(); // Reset all mocks before each test

//     req = {
//       body: { data: ["pkg1", "pkg2", "pkg3"] }, // Sample valid input
//     };

//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
//   });

//   it("should return 200 and recommended package", async () => {
//     // ✅ Mock Data
//     req.body = { data: ["pkg1", "pkg2", "pkg3"] };
  
//     const mockPackage = {
//       _id: "605c72b2f1c2c4a36c9f4b21",
//       files: [{ path: "uploads/file1.png" }],
//     };
  
//     // ✅ Mock Dependencies
//     helpers.countPackageOccurrences.mockResolvedValue({ pkg1: 3, pkg2: 2 });
//     helpers.getMaxPackages.mockResolvedValue(["605c72b2f1c2c4a36c9f4b21"]);
//     helpers.resolveTieWithPriority.mockResolvedValue("605c72b2f1c2c4a36c9f4b21");
//     helpers.getSingleDocument.mockResolvedValue(mockPackage);
  
//     // ✅ Call Controller
//     await controller.getRecommendation(req, res);
  
//     // ✅ Assertions
  
//     // Ensure package occurrences are counted
//     expect(helpers.countPackageOccurrences).toHaveBeenCalledWith(["pkg1", "pkg2", "pkg3"]);
  
//     // Ensure package selection helpers are called
//     expect(helpers.getMaxPackages).toHaveBeenCalled();
//     expect(helpers.resolveTieWithPriority).toHaveBeenCalledWith(["605c72b2f1c2c4a36c9f4b21"]);
  
//     // Ensure the correct package is fetched
//     expect(helpers.getSingleDocument).toHaveBeenCalledWith(expect.any(Function), {
//       _id: "605c72b2f1c2c4a36c9f4b21",
//     });
  
//     // Ensure success response is sent
//     expect(responseHandler.Success).toHaveBeenCalledWith(
//       res,
//       200,
//       "Recommended package retrieved successfully",
//       expect.objectContaining({
//         _id: "605c72b2f1c2c4a36c9f4b21",
//         files: [{ path: expect.stringContaining("http://localhost:8055/uploads/file1.png") }],
//       })
//     );
//   });
  

//   it("should return 400 if input data is invalid", async () => {
//     req.body.data = ""; // Invalid data

//     await controller.getRecommendation(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 400, "Invalid or empty data provided");
//   });

//   it("should return 404 if no valid package is found", async () => {
//     helpers.countPackageOccurrences.mockResolvedValue({});
//     helpers.getMaxPackages.mockResolvedValue([]);

//     await controller.getRecommendation(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 404, "No valid package found");
//   });

//   it("should return 400 if selected package ID is invalid", async () => {
//     helpers.countPackageOccurrences.mockResolvedValue({ pkg1: 2 });
//     helpers.getMaxPackages.mockResolvedValue(["invalid-id"]);
//     helpers.resolveTieWithPriority.mockResolvedValue("invalid-id");

//     await controller.getRecommendation(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 400, "Invalid Package ID");
//   });

//   it("should return 404 if package is not found in database", async () => {
//     helpers.countPackageOccurrences.mockResolvedValue({ pkg1: 3 });
//     helpers.getMaxPackages.mockResolvedValue(["605c72b2f1c2c4a36c9f4b21"]);
//     helpers.resolveTieWithPriority.mockResolvedValue("605c72b2f1c2c4a36c9f4b21");
//     helpers.getSingleDocument.mockResolvedValue(null);

//     await controller.getRecommendation(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 404, "Package not found");
//   });

//   it("should return 500 if an internal error occurs", async () => {
//     helpers.countPackageOccurrences.mockRejectedValue(new Error("Database error"));

//     await controller.getRecommendation(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "An internal server error occurred");
//   });
// });





// Mock dependencies


// describe("getAllPackages Controller", () => {
//   let req, res;

//   beforeEach(() => {
//     req = {
//       user: { _id: "user123" },
//       query: {
//         page: "1",
//         limit: "10",
//         sort: "createdAt:desc",
//         search: "test",
//         status: "active",
//       },
//     };

//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     process.env.BASE_PATH = "http://localhost:8055/";

//     // Clear all mocks before each test
//     jest.clearAllMocks();
//   });

//   it("should return 200 and packages when data exists", async () => {
//     const mockPackages = {
//       data: [
//         {
//           _id: "pkg123",
//           packageName: "Test Package",
//           files: [{ path: "uploads/file1.png" }],
//         },
//       ],
//     };

//     helpers.getPaginatedResultsForAll.mockResolvedValue(mockPackages); // Mock function

//     await controller.getAllPackages(req, res); // ✅ Use `controller.getAllPackages`

//     expect(helpers.getPaginatedResultsForAll).toHaveBeenCalledWith(expect.any(Function), {
//       searchFields: ["packageName", "description"],
//       search: "test",
//       sortField: "createdAt",
//       sortOrder: "desc",
//       page: "1",
//       limit: "10",
//       userId: "user123",
//       status: "active",
//     });
    

//     expect(Success).toHaveBeenCalledWith(res, 200, "Packages fetched successfully", {
//       data: [
//         {
//           _id: "pkg123",
//           packageName: "Test Package",
//           files: [
//             {
//               path: "http://localhost:8055/uploads/file1.png",
//             },
//           ],
//         },
//       ],
//     });
//   });

//   it("should return 204 when no packages exist", async () => {
//     const mockPackages = { data: [] };

//     helpers.getPaginatedResultsForAll.mockResolvedValue(mockPackages);

//     await controller.getAllPackages(req, res);

//     expect(Success).toHaveBeenCalledWith(res, 204, "No Packages found");
//   });

//   it("should return 500 if an error occurs", async () => {
//     const errorMessage = "Database connection error";
//     helpers.getPaginatedResultsForAll.mockRejectedValue(new Error(errorMessage));

//     await controller.getAllPackages(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "An internal server error occurred");
//   });
// });




// jest.mock("../../src/utils/customeFunction.js", () => ({
//   getUploadedFileDetails: jest.fn(),
//   recordExists: jest.fn(),
//   generatePackageNumber: jest.fn(),
//   addRecord: jest.fn(),
//   copyPackageData: jest.fn(),
// }));

// jest.mock("../../src/utils/customeResponse.js", () => ({
//   Success: jest.fn(),
//   Error: jest.fn(),
// }));

// describe("createPackages Controller", () => {
//   let req, res;

//   beforeEach(() => {
//     req = {
//       user: { _id: "user123", role: "admin" },
//       body: {
//         packageName: "Test Package",
//         description: "This is a test package",
//         amount: 100,
//         priorityLevel: 1,
//         includes: ["Feature 1", "Feature 2"],
//       },
//     };

//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     jest.clearAllMocks();
//   });

//   it("should return 400 if required fields are missing", async () => {
//     req.body.packageName = ""; // Missing packageName

//     await controller.createPackages(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 400, "All details are mandatory");
//   });

//   it("should return 409 if package name already exists", async () => {
//     helpers.recordExists.mockResolvedValueOnce(true); // Simulate package name exists

//     await controller.createPackages(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 409, "Package name already exists");
//   });

//   it("should return 409 if priority level already exists", async () => {
//     helpers.recordExists.mockResolvedValueOnce(false); // Package name does not exist
//     helpers.recordExists.mockResolvedValueOnce(true); // Priority level exists

//     await controller.createPackages(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 409, "Priority level already exists");
//   });

//   it("should create a package and return 200", async () => {
//     helpers.recordExists.mockResolvedValue(false); // No duplicates
//     helpers.getUploadedFileDetails.mockResolvedValue([]); // No files
//     helpers.generatePackageNumber.mockResolvedValue("PKG001");
//     helpers.addRecord.mockResolvedValue({ _id: "newPackage123", ...req.body });

//     await controller.createPackages(req, res);

//     expect(responseHandler.Success).toHaveBeenCalledWith(res, 200, "Package created successfully", {
//       _id: "newPackage123",
//       ...req.body,
//     });
//   });

//   it("should return 500 if an internal error occurs", async () => {
//     helpers.recordExists.mockRejectedValue(new Error("Database error"));

//     await controller.createPackages(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "An internal server error occurred");
//   });
// });



// describe("getPackages Controller", () => {
//   let req, res;

//   beforeEach(() => {
//     req = {
//       user: { _id: "user123" },
//       query: {
//         page: "1",
//         limit: "10",
//         sort: "createdAt:desc",
//         search: "test",
//       },
//     };

//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     process.env.BASE_PATH = "http://localhost:8055/";

//     jest.clearAllMocks();
//   });

//   it("should return 200 and packages when data exists", async () => {
//     const mockPackages = {
//       data: [
//         {
//           _id: "pkg123",
//           packageName: "Test Package",
//           files: [{ path: "uploads/file1.png" }],
//         },
//       ],
//     };

//     jest.spyOn(helpers, "getPaginatedResults").mockResolvedValue(mockPackages); // ✅ Use spyOn instead of assignment

//     await controller.getPackages(req, res);

//     expect(helpers.getPaginatedResults).toHaveBeenCalledWith(
//       expect.any(Function), // Instead of Package
//       expect.objectContaining({
//         searchFields: ["packageName", "description"],
//         search: "test",
//         sortField: "createdAt",
//         sortOrder: "desc",
//         page: "1",
//         limit: "10",
//         userId: "user123",
//       })
//     );
    

//     expect(responseHandler.Success).toHaveBeenCalledWith(res, 200, "Packages fetched successfully", {
//       data: [
//         {
//           _id: "pkg123",
//           packageName: "Test Package",
//           files: [
//             {
//               path: "http://localhost:8055/uploads/file1.png",
//             },
//           ],
//         },
//       ],
//     });
//   });

//   it("should return 204 when no packages exist", async () => {
//     helpers.getPaginatedResults.mockResolvedValue({ data: [] });

//     await controller.getPackages(req, res);

//     expect(responseHandler.Success).toHaveBeenCalledWith(res, 204, "No Packages found");
//   });

//   it("should return 500 if an error occurs", async () => {
//     helpers.getPaginatedResults.mockRejectedValue(new Error("Database error"));

//     await controller.getPackages(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "An internal server error occurred");
//   });
// });



describe("getPackageDetails Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { _id: "user123" },
      params: { _id: "pkg123" },
    };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    process.env.BASE_PATH = "http://localhost:8055/";
  });

  it("should return 200 and package details when package is found", async () => {
    const mockPackage = {
      _id: "pkg123",
      packageName: "Test Package",
      files: [{ path: "uploads/file1.png" }],
    };

    helpers.getSingleDocument.mockResolvedValue(mockPackage);

    await controller.getPackageDetails(req, res);

    console.log("Mock Calls:", helpers.getSingleDocument.mock.calls);

    expect(helpers.getSingleDocument).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        _id: "pkg123",
        userId: "user123",
      })
    );

    expect(responseHandler.Success).toHaveBeenCalledWith(res, 200, "Package details fetched successfully", {
      _id: "pkg123",
      packageName: "Test Package",
      files: [{ path: "http://localhost:8055/uploads/file1.png" }],
    });
  });

  it("should return 500 on internal server error", async () => {
    helpers.getSingleDocument.mockRejectedValue(new Error("DB error"));

    await controller.getPackageDetails(req, res);

    expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "An internal server error occurred");
  });
});




