import * as helpers from "../../src/utils/customeFunction.js";
import * as responseHandler from "../../src/utils/customeResponse.js";
import Controller from "../../src/bodyManagement/Controller.js"; // Correct path for the controller
import { Body } from "../../src/models/bodyParts.js"; // Assuming Body model exists
import {Part} from "../../src/models/parts.js"

// Mock all required functions
jest.mock("../../src/utils/customeFunction.js"); // Mock helpers
jest.mock("../../src/utils/customeResponse.js"); // Mock responseHandler

// describe("addBodyAndPartData Controller", () => {
//   let req, res;

//   beforeEach(() => {
//     req = {
//       user: { _id: "user123", role: "admin" },
//       body: {
//         bodyType: "upper",
//         part: "arm",
//         imagePartType: "x-ray",
//         question: "Is there any pain?",
//       },
//     };

//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     jest.clearAllMocks();
//   });



//   it("should return 200 and saved data when details are added successfully", async () => {
//     // Mocking necessary functions
//     helpers.recordExists.mockResolvedValue(false); // Simulating that the record doesn't exist
//     helpers.addRecord.mockResolvedValue({
//       bodyType: "upper",
//       part: "arm",
//       imagePartType: "x-ray",
//       question: "Is there any pain?",
//       userId: "user123",
//     });
  
//     // Mocking the Success function to track its calls
//     responseHandler.Success = jest.fn();
  
//     // Simulating a request and response object
//     const req = {
//       user: { _id: "user123", role: "admin" },
//       body: { bodyType: "upper", part: "arm", imagePartType: "x-ray", question: "Is there any pain?" },
//     };
    
//     const res = { 
//       json: jest.fn(), 
//       status: jest.fn().mockReturnThis() 
//     };
  
//     // Call the controller function
//     await Controller.addBodyAndPartData(req, res);
  
//     // Verify addRecord was called with the correct arguments
//     expect(helpers.addRecord).toHaveBeenCalledWith(
//       expect.anything(), // The model, which should be Body
//       {
//         bodyType: "upper",
//         part: "arm",
//         imagePartType: "x-ray",
//         question: "Is there any pain?",
//         userId: "user123",
//       }
//     );
  
//     // Verify Success was called with the correct parameters
//     expect(responseHandler.Success).toHaveBeenCalledWith(
//       res,
//       200,
//       "Details added successfully",
//       {
//         bodyType: "upper",
//         part: "arm",
//         imagePartType: "x-ray",
//         question: "Is there any pain?",
//         userId: "user123",
//       }
//     );
//   });
  
  
  
  

//   it("should return 400 if failed to add details", async () => {
//     helpers.recordExists.mockResolvedValue(false); // Simulating that the record doesn't exist
//     helpers.addRecord.mockResolvedValue(null); // Simulating a failure in saving the record

//     await Controller.addBodyAndPartData(req, res); // Call the correct controller method

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 400, "Failed to add details");
//   });

//   it("should call copyBodyConcernToClinic if the user is admin", async () => {
//     helpers.recordExists.mockResolvedValue(false); // Simulating that the record doesn't exist
//     helpers.addRecord.mockResolvedValue({
//       bodyType: "upper",
//       part: "arm",
//       imagePartType: "x-ray",
//       question: "Is there any pain?",
//       userId: "user123",
//     });

//     const copyBodyConcernToClinicMock = jest.fn();
//     helpers.copyBodyConcernToClinic = copyBodyConcernToClinicMock;

//     await Controller.addBodyAndPartData(req, res); // Call the correct controller method

//     expect(copyBodyConcernToClinicMock).toHaveBeenCalledWith({
//       bodyType: "upper",
//       part: "arm",
//       imagePartType: "x-ray",
//       question: "Is there any pain?",
//     });
//   });

//   it("should not call copyBodyConcernToClinic if the user is not admin", async () => {
//     req.user.role = "user"; // Change the user role to "user"

//     helpers.recordExists.mockResolvedValue(false); // Simulating that the record doesn't exist
//     helpers.addRecord.mockResolvedValue({
//       bodyType: "upper",
//       part: "arm",
//       imagePartType: "x-ray",
//       question: "Is there any pain?",
//       userId: "user123",
//     });

//     const copyBodyConcernToClinicMock = jest.fn();
//     helpers.copyBodyConcernToClinic = copyBodyConcernToClinicMock;

//     await Controller.addBodyAndPartData(req, res); // Call the correct controller method

//     expect(copyBodyConcernToClinicMock).not.toHaveBeenCalled();
//   });

//   it("should return 500 if an error occurs", async () => {
//     helpers.recordExists.mockResolvedValue(false); // Simulating that the record doesn't exist
//     helpers.addRecord.mockRejectedValue(new Error("Internal Error")); // Simulating an error

//     await Controller.addBodyAndPartData(req, res); // Call the correct controller method

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "Internal Server Error");
//   });
// });




// describe("listParts Controller", () => {
// it("should return 200 and body parts when parts are found", async () => {
//     // Mocking necessary functions
//     helpers.getPaginatedForPackageResults.mockResolvedValue({
//         data: [
//         { bodyType: "upper", part: "arm" },
//         { bodyType: "lower", part: "leg" },
//         ],
//         total: 2,
//         page: 1,
//         limit: 10,
//     });
    
//     // Mocking the Success function to track its calls
//     responseHandler.Success = jest.fn();
    
//     // Simulating a request and response object
//     const req = {
//         user: { _id: "user123" },
//         query: {
//         page: 1,
//         limit: 10,
//         sort: "createdAt:desc",
//         search: "arm",
//         },
//     };
//     const res = { 
//         json: jest.fn(), 
//         status: jest.fn().mockReturnThis() 
//     };
    
//     // Call the controller function
//     await Controller.listParts(req, res);
    
//     // Verify getPaginatedForPackageResults was called with the correct arguments
//     expect(helpers.getPaginatedForPackageResults).toHaveBeenLastCalledWith(
//         expect.any(Function), // Accepts any function reference (avoids model mismatch issues)
//         {
//             searchFields: ["bodyType", "part"],
//             search: "arm",
//             sortField: "createdAt",
//             sortOrder: "desc",
//             page: 1,
//             limit: 10,
//             userId: "user123",
//         }
//         );
        
        
    
//     // Verify the Success response was sent with the correct data
//     expect(responseHandler.Success).toHaveBeenCalledWith(
//         res,
//         200,
//         "Body parts fetched successfully",
//         {
//         data: [
//             { bodyType: "upper", part: "arm" },
//             { bodyType: "lower", part: "leg" },
//         ],
//         total: 2,
//         page: 1,
//         limit: 10,
//         }
//     );
//     });
      

//   it("should return 500 if an error occurs", async () => {
//     // Simulating an error in the database function
//     helpers.getPaginatedForPackageResults.mockRejectedValue(new Error("Database error"));

//     // Mocking the Error function to track its calls
//     responseHandler.Error = jest.fn();

//     // Simulating a request and response object
//     const req = {
//       user: { _id: "user123" },
//       query: {
//         page: 1,
//         limit: 10,
//         sort: "createdAt:desc",
//         search: "arm",
//       },
//     };
//     const res = { 
//       json: jest.fn(), 
//       status: jest.fn().mockReturnThis() 
//     };

//     // Call the controller function
//     await Controller.listParts(req, res);

//     // Verify the Error response was sent with the correct data
//     expect(responseHandler.Error).toHaveBeenCalledWith(
//       res,
//       500,
//       "Unable to fetch body parts"
//     );
//   });
// });



// describe("getPartDetails Controller", () => {
//   let req, res;

//   beforeEach(() => {
//     req = { params: { _id: "12345" } }; // Mock request with an ID
//     res = { 
//       status: jest.fn().mockReturnThis(), 
//       json: jest.fn() 
//     }; // Mock response
//   });

//   test("should return body part details when found", async () => {
//     const mockBodyPart = { _id: "12345", name: "Heart" };
  
//     jest.spyOn(helpers, "getSingleDocument").mockResolvedValue(mockBodyPart);
//     jest.spyOn(responseHandler, "Success").mockImplementation(() => {}); // Mock Success handler
  
//     await Controller.getPartDetails(req, res);
  
//     console.log("Mock Calls for getSingleDocument:", helpers.getSingleDocument.mock.calls);
  
//     expect(helpers.getSingleDocument).toHaveBeenCalledWith(expect.any(Function), { _id: "12345" }); // Handle function mismatch
//     expect(responseHandler.Success).toHaveBeenCalledWith(res, 200, "Body Part details fetched successfully", mockBodyPart);
//   });
  

//   test("should return 404 when body part is not found", async () => {
//     helpers.getSingleDocument = jest.fn().mockResolvedValue(null);
//     responseHandler.Error = jest.fn();

//     await Controller.getPartDetails(req, res); // Using Controller

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 404, "Body Part details not found");
//   });

//   test("should return 500 when an error occurs", async () => {
//     helpers.getSingleDocument = jest.fn().mockRejectedValue(new Error("Database error"));
//     responseHandler.Error = jest.fn();

//     await Controller.getPartDetails(req, res); // Using Controller

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "Unable to fetch body part details");
//   });
// });



// describe("addNewPart Controller", () => {
//   let req, res;

//   beforeEach(() => {
//     jest.clearAllMocks(); // Clear mock calls before each test

//     req = {
//       body: { bodyType: "Bone", part: "Skull" },
//     }; // Mock request

//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     }; // Mock response
//   });

//   test("should return 400 when bodyType or part is missing", async () => {
//     req.body = {}; // Empty request body

//     await Controller.addNewPart(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 400, "Body type and part details are required");
//   });

//   test("should return 409 when a duplicate entry exists", async () => {
//     helpers.recordExists = jest.fn().mockResolvedValue(true); // Simulate existing part
  
//     await Controller.addNewPart(req, res);
  
//     console.log("Mock Calls for recordExists:", helpers.recordExists.mock.calls); // Debugging
  
//     expect(helpers.recordExists).toHaveBeenCalledWith(
//       expect.any(Function), // Match any function
//       { bodyType: "Bone", part: "Skull", isDeleted: false }
//     );
  
//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 409, "Duplicate entry found");
//   });
  

//   test("should return 200 when part is successfully added", async () => {
//     const mockPart = { id: "123", bodyType: "Bone", part: "Skull" };
  
//     helpers.recordExists = jest.fn().mockResolvedValue(false); // No duplicate exists
//     helpers.addRecord = jest.fn().mockResolvedValue(mockPart); // Simulate successful insert
  
//     await Controller.addNewPart(req, res);
  
//     console.log("Mock Calls for addRecord:", helpers.addRecord.mock.calls); // Debugging
  
//     expect(helpers.addRecord).toHaveBeenCalledWith(expect.any(Function), { bodyType: "Bone", part: "Skull" });
//     expect(responseHandler.Success).toHaveBeenCalledWith(res, 200, "Part added successfully", mockPart);
//   });
  

//   test("should return 500 when addRecord fails", async () => {
//     helpers.recordExists = jest.fn().mockResolvedValue(false);
//     helpers.addRecord = jest.fn().mockResolvedValue(null); // Simulate failure

//     await Controller.addNewPart(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "Failed to add part");
//   });

//   test("should return 500 on unexpected errors", async () => {
//     helpers.recordExists = jest.fn().mockRejectedValue(new Error("Database error"));

//     await Controller.addNewPart(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "Internal Server Error");
//   });
// });


// describe("getAllParts Controller", () => {
//   let req, res;

//   beforeEach(() => {
//     jest.clearAllMocks(); // Clear mock calls before each test

//     req = {
//       query: {
//         page: "1",
//         limit: "10",
//         sort: "createdAt:desc",
//         search: "Bone",
//       },
//     }; // Mock request with pagination & search query

//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     }; // Mock response
//   });
//   test("should return 200 when parts are found", async () => {
//     const mockParts = { data: [{ _id: "123", bodyType: "Bone", part: "Skull" }] };
  
//     helpers.getPaginatedResultsForAll = jest.fn().mockResolvedValue(mockParts); // Simulate found data
  
//     await Controller.getAllParts(req, res);
  
//     console.log("Mock Calls for getPaginatedResultsForAll:", helpers.getPaginatedResultsForAll.mock.calls); // Debugging
  
//     expect(helpers.getPaginatedResultsForAll).toHaveBeenCalledWith(
//       expect.any(Function), // Use expect.any(Function) instead of Part
//       {
//         searchFields: ["bodyType", "part"],
//         search: "Bone",
//       }
//     );
  
//     expect(responseHandler.Success).toHaveBeenCalledWith(res, 200, "Parts fetched successfully", mockParts);
//   });
  

//   test("should return 200 with no data when no parts are found", async () => {
//     const mockParts = { data: [] };

//     helpers.getPaginatedResultsForAll = jest.fn().mockResolvedValue(mockParts); // Simulate no data

//     await Controller.getAllParts(req, res);

//     expect(responseHandler.Success).toHaveBeenCalledWith(res, 200, "No parts found", { data: [] });
//   });

//   test("should return 500 when an error occurs", async () => {
//     helpers.getPaginatedResultsForAll = jest.fn().mockRejectedValue(new Error("Database error"));

//     await Controller.getAllParts(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "Unable to fetch parts");
//   });
// });



// describe("updatePartById Controller", () => {
//   let req, res;

//   beforeEach(() => {
//     jest.clearAllMocks(); // Clear mock calls before each test

//     req = {
//       params: { _id: "12345" }, // Mock ID parameter
//       body: { bodyType: "Bone", part: "Skull", isDeleted: false }, // Mock body data
//     };

//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     }; // Mock response
//   });

//   test("should return 200 when details are successfully updated", async () => {
//     helpers.recordExists = jest.fn()
//       .mockResolvedValueOnce(true) // First call: Record exists
//       .mockResolvedValueOnce(false); // Second call: No duplicate exists
  
//     helpers.updateData = jest.fn().mockResolvedValue({ _id: "12345", ...req.body });
  
//     await Controller.updatePartById(req, res);
  
//     expect(helpers.recordExists).toHaveBeenCalledWith(Part, { _id: "12345" });
  
//     expect(helpers.recordExists).toHaveBeenCalledWith(
//       Part,
//       expect.objectContaining({
//         bodyType: "Bone",
//         isDeleted: false,
//         part: "Skull",
//         _id: expect.objectContaining({ $ne: "12345" }), // ✅ Fix applied here
//       })
//     );
  
//     expect(helpers.updateData).toHaveBeenCalledWith(Part, {
//       _id: "12345",
//       jsonData: { bodyType: "Bone", part: "Skull", isDeleted: false },
//     });
  
//     expect(responseHandler.Success).toHaveBeenCalledWith(res, 200, "Details updated successfully", {
//       _id: "12345",
//       bodyType: "Bone",
//       part: "Skull",
//       isDeleted: false,
//     });
//   });
  
  
  

//   test("should return 404 when the record is not found", async () => {
//     helpers.recordExists = jest.fn().mockResolvedValue(false); // Simulate record not found

//     await Controller.updatePartById(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 404, "Body Part details not found");
//   });

//   test("should return 409 when a duplicate record exists", async () => {
//     helpers.recordExists = jest.fn()
//       .mockResolvedValueOnce(true) // Record exists
//       .mockResolvedValueOnce(true); // Duplicate exists

//     await Controller.updatePartById(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 409, "Duplicate entry found with another record");
//   });

//   test("should return 400 when the update fails", async () => {
//     helpers.recordExists = jest.fn()
//       .mockResolvedValueOnce(true) // Record exists
//       .mockResolvedValueOnce(false); // No duplicate

//     helpers.updateData = jest.fn().mockResolvedValue(null); // Simulate update failure

//     await Controller.updatePartById(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 400, "Failed to update details");
//   });

//   test("should return 500 when an error occurs", async () => {
//     helpers.recordExists = jest.fn().mockRejectedValue(new Error("Database error")); // Simulate DB failure

//     await Controller.updatePartById(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "Internal Server Error");
//   });
// });



describe("updatePartDetails", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { _id: "user123" },
      params: { _id: "12345" },
      body: {
        bodyType: "Bone",
        part: "Skull",
        question: "What is this part?",
        status: "active",
        isDeleted: false,
        imagePartType: "X-ray",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test("should return 200 when details are successfully updated", async () => {
    helpers.recordExists
      .mockResolvedValueOnce(true) // First call: Record exists
      .mockResolvedValueOnce(false); // Second call: No duplicate exists

    Body.findByIdAndUpdate = jest.fn().mockResolvedValue({
      _id: "12345",
      ...req.body,
    });

    await Controller.updatePartDetails(req, res);

    expect(helpers.recordExists).toHaveBeenCalledWith(Body, { _id: "12345" });

    expect(helpers.recordExists).toHaveBeenCalledWith(
      Body,
      expect.objectContaining({
        bodyType: "Bone",
        part: "Skull",
        userId: "user123",
        _id: expect.objectContaining({ $ne: "12345" }), // Handle MongoDB query syntax
      })
    );

    expect(Body.findByIdAndUpdate).toHaveBeenCalledWith(
      "12345",
      { $set: req.body },
      { new: true }
    );

    expect(responseHandler.Success).toHaveBeenCalledWith(
      res,
      200,
      "Details updated successfully",
      expect.objectContaining({
        _id: "12345",
        bodyType: "Bone",
        part: "Skull",
      })
    );
  });

  test("should return 404 when the body part does not exist", async () => {
    helpers.recordExists.mockResolvedValue(false);

    await Controller.updatePartDetails(req, res);

    expect(helpers.recordExists).toHaveBeenCalledWith(Body, { _id: "12345" });
    expect(responseHandler.Error).toHaveBeenCalledWith(
      res,
      404,
      "Body Part details not found"
    );
  });

  test("should return 409 when a duplicate entry exists", async () => {
    helpers.recordExists
      .mockResolvedValueOnce(true) // Record exists
      .mockResolvedValueOnce(true); // Duplicate exists

    await Controller.updatePartDetails(req, res);

    expect(responseHandler.Error).toHaveBeenCalledWith(
      res,
      409,
      "Duplicate entry found with another record"
    );
  });

  test("should return 500 when an unexpected error occurs", async () => {
    helpers.recordExists.mockRejectedValue(new Error("DB error"));

    await Controller.updatePartDetails(req, res);

    expect(responseHandler.Error).toHaveBeenCalledWith(
      res,
      500,
      "Internal Server Error"
    );
  });
});
