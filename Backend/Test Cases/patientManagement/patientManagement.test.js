import * as helpers from "../../src/utils/customeFunction.js";
import * as responseHandler from "../../src/utils/customeResponse.js";
import Controller from "../../src/patientController/Controller.js";
import { Consultation } from "../../src/models/consultations.js";
import mongoose, { mongo } from "mongoose";
import { Success, Error } from "../../src/utils/customeResponse.js";

// Mock all required functions
jest.mock("../../src/utils/customeFunction.js");
jest.mock("../../src/utils/customeResponse.js");

// describe("saveConsultations Controller", () => {

//   let req, res;

//   beforeEach(() => {
//     req = {
//       body: {
//         clinicId: "clinic123",
//         firstName: "John",
//         lastName: "Doe",
//         phone: "1234567890",
//         email: "john.doe@example.com",
//         ageRange: "30-40",
//         recommandation: { _id: "rec123" },
//         hadAestheticTreatmentBefore: true,
//         areasOfConcern: ["Face", "Neck"],
//         selectedImage: "60d21b4667d0d8992e610c85",
//       },
//     };
//     res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
//   });

//   afterEach(() => {
//     jest.restoreAllMocks();
//   });

//   it("should return 404 if required fields are missing", async () => {
//     req.body.firstName = "";

//     await controller.saveConsultations(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 404, "All fields are required");
//   });

//   it("should return 404 if the selected image is not found in the database", async () => {
//     helpers.getImageDataFromDB.mockResolvedValue(null);

//     await controller.saveConsultations(req, res);

//     expect(helpers.getImageDataFromDB).toHaveBeenCalledWith("60d21b4667d0d8992e610c85");
//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 404, "Image not found in database, please try again");
//   });

//   it("should save consultation successfully when all data is valid", async () => {
//     const mockImageData = { imageUrl: "http://example.com/image.jpg" };
//     const mockConsultation = { _id: "consult123" };

//     helpers.getImageDataFromDB.mockResolvedValue(mockImageData);
//     helpers.addRecord.mockResolvedValue(mockConsultation);
//     helpers.sendEmailToClinicAndPatient.mockResolvedValue();

//     await controller.saveConsultations(req, res);

//     expect(helpers.addRecord).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ selectedImage: "http://example.com/image.jpg" }));
//     expect(helpers.sendEmailToClinicAndPatient).toHaveBeenCalled();
//     expect(responseHandler.Success).toHaveBeenCalledWith(res, 200, "Consultation Booked successfully", mockConsultation);
//   });

//   it("should return 500 if saving consultation fails", async () => {
//     helpers.getImageDataFromDB.mockResolvedValue({ imageUrl: "http://example.com/image.jpg" });
//     helpers.addRecord.mockResolvedValue(null);

//     await controller.saveConsultations(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "Failed to save consultation");
//   });

//   it("should return 500 on internal server error", async () => {
//     helpers.getImageDataFromDB.mockRejectedValue(new Error("DB error"));

//     await controller.saveConsultations(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "Unable to save consultation");
//   });
// });

// describe("saveConsultationAfterSubmit Controller", () => {
//     let req, res;
  
//     beforeEach(() => {
//       req = {
//         body: {
//           clinicId: "clinic123",
//           firstName: "John",
//           lastName: "Doe",
//           phone: "1234567890",
//           email: "john.doe@example.com",
//           ageRange: "30-40",
//           recommandation: { _id: "rec123" },
//           hadAestheticTreatmentBefore: true,
//           areasOfConcern: ["Face", "Neck"],
//           selectedImage: "60d21b4667d0d8992e610c85",
//         },
//       };
//       res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
//     });
  
//     afterEach(() => {
//       jest.restoreAllMocks();
//     });
  
//     it("should return 404 if required fields are missing", async () => {
//       req.body.firstName = "";
  
//       await controller.saveConsultationAfterSubmit(req, res);
  
//       expect(responseHandler.Error).toHaveBeenCalledWith(res, 404, "All fields are required");
//     });
  
//     it("should return 404 if the selected image is not found in the database", async () => {
//       helpers.getImageDataFromDB.mockResolvedValue(null);
  
//       await controller.saveConsultationAfterSubmit(req, res);
  
//       expect(helpers.getImageDataFromDB).toHaveBeenCalledWith("60d21b4667d0d8992e610c85");
//       expect(responseHandler.Error).toHaveBeenCalledWith(res, 404, "Image not found in database, please try again");
//     });
  
//     it("should save consultation successfully when all data is valid", async () => {
//       const mockImageData = { imageUrl: "http://example.com/image.jpg" };
//       const mockConsultation = { _id: "consult123" };
  
//       helpers.getImageDataFromDB.mockResolvedValue(mockImageData);
//       helpers.addRecord.mockResolvedValue(mockConsultation);
  
//       await controller.saveConsultationAfterSubmit(req, res);
  
//       expect(helpers.addRecord).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ selectedImage: "http://example.com/image.jpg" }));
//       expect(responseHandler.Success).toHaveBeenCalledWith(res, 200, "Consultation saved successfully", mockConsultation);
//     });
  
//     it("should return 500 if saving consultation fails", async () => {
//       helpers.getImageDataFromDB.mockResolvedValue({ imageUrl: "http://example.com/image.jpg" });
//       helpers.addRecord.mockResolvedValue(null);
  
//       await controller.saveConsultationAfterSubmit(req, res);
  
//       expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "Failed to save consultation");
//     });
  
//     it("should return 500 on internal server error", async () => {
//       helpers.getImageDataFromDB.mockRejectedValue(new Error("DB error"));
  
//       await controller.saveConsultationAfterSubmit(req, res);
  
//       expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "Unable to save consultation");
//     });
//   });

// describe("saveConsultationAfterSubmit Controller", () => {
//   let req, res;

//   beforeEach(() => {
//     req = {
//       body: {
//         clinicId: "clinic123",
//         firstName: "John",
//         lastName: "Doe",
//         phone: "1234567890",
//         email: "john.doe@example.com",
//         ageRange: "30-40",
//         recommandation: { _id: "rec123" },
//         hadAestheticTreatmentBefore: true,
//         areasOfConcern: ["Face", "Neck"],
//         selectedImage: "60d21b4667d0d8992e610c85",
//       },
//     };
//     res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
//   });

//   afterEach(() => {
//     jest.restoreAllMocks();
//   });

//   it("should return 404 if required fields are missing", async () => {
//     req.body.firstName = "";

//     await controller.saveConsultationAfterSubmit(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 404, "All fields are required");
//   });

//   it("should return 404 if the selected image is not found in the database", async () => {
//     helpers.getImageDataFromDB.mockResolvedValue(null);

//     await controller.saveConsultationAfterSubmit(req, res);

//     expect(helpers.getImageDataFromDB).toHaveBeenCalledWith("60d21b4667d0d8992e610c85");
//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 404, "Image not found in database, please try again");
//   });

//   it("should save consultation successfully when all data is valid", async () => {
//     const mockImageData = { imageUrl: "http://example.com/image.jpg" };
//     const mockConsultation = { _id: "consult123" };

//     helpers.getImageDataFromDB.mockResolvedValue(mockImageData);
//     helpers.addRecord.mockResolvedValue(mockConsultation);

//     await controller.saveConsultationAfterSubmit(req, res);

//     expect(helpers.addRecord).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ selectedImage: "http://example.com/image.jpg" }));
//     expect(responseHandler.Success).toHaveBeenCalledWith(res, 200, "Consultation saved successfully", mockConsultation);
//   });

//   it("should return 500 if saving consultation fails", async () => {
//     helpers.getImageDataFromDB.mockResolvedValue({ imageUrl: "http://example.com/image.jpg" });
//     helpers.addRecord.mockResolvedValue(null);

//     await controller.saveConsultationAfterSubmit(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "Failed to save consultation");
//   });

//   it("should return 500 on internal server error", async () => {
//     helpers.getImageDataFromDB.mockRejectedValue(new Error("DB error"));

//     await controller.saveConsultationAfterSubmit(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "Unable to save consultation");
//   });
// });


// Mock Consultation model




// describe("sendConsultationEmail Controller", () => {
//   let req, res;

//   beforeEach(() => {
//     req = { body: { clinicId: "clinic123" } };
//     res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
//   });

//   afterEach(() => {
//     jest.restoreAllMocks();
//   });

// //   it("should update consultation and send email successfully", async () => {
// //     const mockConsultation = { _id: "consult123", clinicId: "clinic123" };

// //     Consultation.findOne.mockResolvedValue(mockConsultation);
// //     Consultation.findByIdAndUpdate.mockResolvedValue(true);
// //     helpers.sendEmailToClinicAndPatient.mockResolvedValue(true);

// //     await controller.sendConsultationEmail(req, res);

// //     expect(Consultation.findOne).toHaveBeenCalledWith({ clinicId: "clinic123" });
// //     expect(Consultation.findByIdAndUpdate).toHaveBeenCalledWith("consult123", { isConsultationSaved: true });
// //     expect(helpers.sendEmailToClinicAndPatient).toHaveBeenCalledWith(mockConsultation, mockConsultation);
// //     expect(responseHandler.Success).toHaveBeenCalledWith(res, 200, "Email sent successfully and consultation updated");
// //   });

//   it("should return 400 if clinicId is missing", async () => {
//     req.body.clinicId = "";

//     await controller.sendConsultationEmail(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 400, "Clinic ID is required to send an email");
//   });

// //   it("should return 500 if email sending fails", async () => {
// //     const mockConsultation = { _id: "consult123", clinicId: "clinic123" };

// //     Consultation.findOne.mockResolvedValue(mockConsultation);
// //     Consultation.findByIdAndUpdate.mockResolvedValue(true);
// //     helpers.sendEmailToClinicAndPatient.mockResolvedValue(false);

// //     await controller.sendConsultationEmail(req, res);

// //     expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "Failed to send email");
// //   });
// });



// describe("getConsultations Controller", () => {
//   let req, res;

//   beforeEach(() => {
//     req = {
//       user: { _id: "clinic123" }, // Mock clinic ID
//       query: {
//         page: 1,
//         limit: 10,
//         sort: "createdAt:desc",
//         search: "John",
//         role: "admin",
//       },
//     };

//     res = {
//       json: jest.fn(),
//       status: jest.fn().mockReturnThis(),
//     };

//     jest.clearAllMocks();
//   });

//   it("should return 200 and consultations when data is found", async () => {
//     const mockConsultations = {
//       data: [
//         { _id: "consult1", selectedImage: "image1.jpg" },
//         { _id: "consult2", selectedImage: "http://localhost:8055/image2.jpg" },
//       ],
//     };

//     helpers.getConsultationPaginatedResults.mockResolvedValue(mockConsultations);

//     await Controller.getConsultations(req, res);

//     expect(helpers.getConsultationPaginatedResults).toHaveBeenCalledWith(
//         expect.anything(),  // This will accept any value instead of undefined
//         expect.objectContaining({
//           clinicId: "clinic123",
//           limit: 10,
//           page: 1,
//           role: "admin",
//           search: "John",
//           searchFields: ["firstName", "lastName", "email"],
//           sortField: "createdAt",
//           sortOrder: "desc",
//         })
//       );
      

//     expect(Success).toHaveBeenCalledWith(
//       res,
//       200,
//       "Consultations retrieved successfully",
//       {
//         data: [
//           { _id: "consult1", selectedImage: "http://localhost:8055/image1.jpg" }, // Transformed URL
//           { _id: "consult2", selectedImage: "http://localhost:8055/image2.jpg" }, // Already a full URL
//         ],
//       }
//     );
//   });

//   it("should return 204 if no consultations are found", async () => {
//     helpers.getConsultationPaginatedResults.mockResolvedValue({ data: [] });

//     await Controller.getConsultations(req, res);

//     expect(Error).toHaveBeenCalledWith(res, 204, "No consultations found");
//   });

//   it("should return 500 on internal server error", async () => {
//     helpers.getConsultationPaginatedResults.mockRejectedValue(new Error("DB Error"));

//     await Controller.getConsultations(req, res);

//     expect(Error).toHaveBeenCalledWith(res, 500, "Unable to retrieve consultations");
//   });
// });



// describe("updateConsultation Controller", () => {
//   let req, res;

//   beforeEach(() => {
//     req = {
//       params: { _id: "consult123" },
//       body: {
//         firstName: "John",
//         lastName: "Doe",
//         email: "john@example.com",
//         phone: "1234567890",
//         ageRange: "25-30",
//         hadAestheticTreatmentBefore: true,
//         isDeleted: false,
//       },
//     };

//     res = {
//       json: jest.fn(),
//       status: jest.fn().mockReturnThis(),
//     };

//     jest.clearAllMocks(); // Clear mock calls before each test
//   });

//   it("should update consultation and return 200", async () => {
//     const mockUpdatedConsultation = {
//       _id: "consult123",
//       firstName: "John",
//       lastName: "Doe",
//       email: "john@example.com",
//       phone: "1234567890",
//       ageRange: "25-30",
//       hadAestheticTreatmentBefore: true,
//       isDeleted: false,
//     };

//     // ✅ Mock the model function
//     Consultation.findByIdAndUpdate.mockResolvedValue(mockUpdatedConsultation);

//     await Controller.updateConsultation(req, res);

//     expect(Consultation.findByIdAndUpdate).toHaveBeenCalledWith(
//       "consult123",
//       {
//         $set: {
//           firstName: "John",
//           lastName: "Doe",
//           email: "john@example.com",
//           phone: "1234567890",
//           ageRange: "25-30",
//           hadAestheticTreatmentBefore: true,
//           isDeleted: false,
//         },
//       },
//       { new: true }
//     );

//     expect(Success).toHaveBeenCalledWith(
//       res,
//       200,
//       "Consultation updated successfully",
//       mockUpdatedConsultation
//     );
//   });

//   it("should return 404 if consultation is not found", async () => {
//     Consultation.findByIdAndUpdate.mockResolvedValue(null); // Simulate no consultation found

//     await Controller.updateConsultation(req, res);

//     expect(Consultation.findByIdAndUpdate).toHaveBeenCalled();
//     expect(Error).toHaveBeenCalledWith(res, 404, "Consultation not found");
//   });

//   it("should return 500 if an error occurs", async () => {
//     Consultation.findByIdAndUpdate.mockRejectedValue(new Error("Database error"));

//     await Controller.updateConsultation(req, res);

//     expect(Consultation.findByIdAndUpdate).toHaveBeenCalled();
//     expect(Error).toHaveBeenCalledWith(res, 500, "Unable to update consultation");
//   });
// });
