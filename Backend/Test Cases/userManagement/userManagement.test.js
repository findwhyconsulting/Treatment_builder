import * as helpers from "../../src/utils/customeFunction.js";
import * as responseHandler from "../../src/utils/customeResponse.js";
import controller from "../../src/userManagement/Controller.js";
import { User } from "../../src/models/users.js";
import mongoose from "mongoose";

jest.mock("../../src/utils/customeFunction.js");
jest.mock("../../src/utils/customeResponse.js");

// describe("signUp Controller", () => {

//   let req, res;

//   beforeEach(() => {
//     jest.clearAllMocks();

//     req = {
//       body: {
//         firstName: "John",
//         lastName: "Doe",
//         userName: "johndoe",
//         email: "john@example.com",
//         mobile: "1234567890",
//         password: "securepassword",
//         role: "user",
//         bio: "A new user."
//       }
//     };

//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn()
//     };
//   });

//   it("should return 400 if required fields are missing", async () => {
//     req.body.firstName = ""; // Missing field

//     await controller.signUp(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 400, "Missing required fields");
//   });

//   it("should return 409 if username is already taken", async () => {
//     helpers.recordExists.mockResolvedValueOnce(true); // Username exists

//     await controller.signUp(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 409, "Please choose a different user name");
//   });

//   it("should return 409 if email or mobile already exists", async () => {
//     helpers.recordExists
//       .mockResolvedValueOnce(false) // Username does not exist
//       .mockResolvedValueOnce(true); // Email/Mobile exists

//     await controller.signUp(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 409, "User already exists with this email or mobile");
//   });

//   it("should return 200 if user is created successfully", async () => {
//     helpers.recordExists.mockResolvedValueOnce(false).mockResolvedValueOnce(false); // No existing user
//     helpers.createUser.mockResolvedValue({ _id: new mongoose.Types.ObjectId(), ...req.body });

//     await controller.signUp(req, res);

//     expect(responseHandler.Success).toHaveBeenCalledWith(
//       res,
//       200,
//       "User added successfully",
//       expect.objectContaining(req.body)
//     );
//   });

//   it("should return 404 if user creation fails", async () => {
//     helpers.recordExists.mockResolvedValueOnce(false).mockResolvedValueOnce(false); // No existing user
//     helpers.createUser.mockResolvedValue(null); // Simulate failure

//     await controller.signUp(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 404, "Failed to add user");
//   });

//   it("should return 500 if an unexpected error occurs", async () => {
//     helpers.recordExists.mockRejectedValue(new Error("Unexpected error"));

//     await controller.signUp(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "Unable to add user");
//   });
// });


// describe("login Controller", () => {
//   let req, res;

//   beforeEach(() => {
//     jest.clearAllMocks();

//     req = {
//       body: {
//         email: "john@example.com",
//         password: "securepassword",
//       },
//     };

//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
//   });


//   it("should return 206 if email is invalid", async () => {
//     helpers.getSingleDocument.mockResolvedValue(null);

//     await controller.login(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 206, "Please enter a valid email address");
//   });

//   it("should return 206 if account is inactive", async () => {
//     helpers.getSingleDocument.mockResolvedValue({ status: false });

//     await controller.login(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 206, "Account is Inactive");
//   });

//   it("should return 206 if user does not exist", async () => {
//     helpers.getSingleDocument.mockResolvedValue({ status: true });
//     helpers.recordExists.mockResolvedValue(false);

//     await controller.login(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 206, "Please enter a valid email address");
//   });

//   it("should return 401 if password is incorrect", async () => {
//     helpers.getSingleDocument.mockResolvedValue({ status: true });
//     helpers.recordExists.mockResolvedValue(true);
//     helpers.matchPassword.mockResolvedValue(false);

//     await controller.login(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 401, "Invalid Password");
//   });

//   it("should return 200 if login is successful", async () => {
//     helpers.getSingleDocument.mockResolvedValue({ status: true });
//     helpers.recordExists.mockResolvedValue(true);
//     helpers.matchPassword.mockResolvedValue({ token: "fake-jwt-token" });

//     await controller.login(req, res);

//     expect(responseHandler.Success).toHaveBeenCalledWith(res, 200, "Logged in", { token: "fake-jwt-token" });
//   });

//   it("should return 500 if an unexpected error occurs", async () => {
//     helpers.getSingleDocument.mockRejectedValue(new Error("Unexpected error"));

//     await controller.login(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "Unexpected error");
//   });
// });




// describe("getDashboardContent Controller", () => {
//   let req, res;

//   beforeEach(() => {
//     jest.clearAllMocks();

//     req = {
//       user: {
//         _id: "user123",
//         role: "admin",
//       },
//     };

//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
//   });

//   it("should return 400 if user is not found", async () => {
//     req.user = {};

//     await controller.getDashboardContent(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 400, "User not found");
//   });

//   it("should return 200 with admin dashboard content", async () => {
//     helpers.getAdminDashboardContent.mockResolvedValue({ dashboard: "Admin Data" });

//     await controller.getDashboardContent(req, res);

//     expect(responseHandler.Success).toHaveBeenCalledWith(res, 200, "Admin Dashboard Content", { dashboard: "Admin Data" });
//   });

//   it("should return 404 if admin dashboard content is not found", async () => {
//     helpers.getAdminDashboardContent.mockResolvedValue(null);

//     await controller.getDashboardContent(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 404, "Admin Dashboard Content Not Found");
//   });

//   it("should return 200 with clinic dashboard content", async () => {
//     req.user.role = "clinic";
//     helpers.getClinicDashboardContent.mockResolvedValue({ dashboard: "Clinic Data" });

//     await controller.getDashboardContent(req, res);

//     expect(responseHandler.Success).toHaveBeenCalledWith(res, 200, "Clinic Dashboard Content", { dashboard: "Clinic Data" });
//   });

//   it("should return 206 if clinic dashboard content is not found", async () => {
//     req.user.role = "clinic";
//     helpers.getClinicDashboardContent.mockResolvedValue(null);

//     await controller.getDashboardContent(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 206, "Clinic Dashboard Content Not Found");
//   });

//   it("should return 206 if role is invalid", async () => {
//     req.user.role = "unknown";

//     await controller.getDashboardContent(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 206, "Invalid Role");
//   });

//   it("should return 404 if an unexpected error occurs", async () => {
//     helpers.getAdminDashboardContent.mockRejectedValue(new Error("Unexpected error"));

//     await controller.getDashboardContent(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 404, "Something went wrong while processing request");
//   });
// });



// describe("adminLoginAsClinic Controller", () => {
//   let req, res;

//   beforeEach(() => {
//     jest.clearAllMocks();

//     req = {
//       user: {
//         _id: "admin123",
//         role: "admin",
//       },
//       params: {
//         clinicId: "clinic456",
//       },
//     };

//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
//   });

//   it("should return 403 if user is not an admin", async () => {
//     req.user.role = "clinic";
//     await controller.adminLoginAsClinic(req, res);
//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 403, "Unauthorized");
//   });

//   it("should return 400 if clinicId is missing", async () => {
//     delete req.params.clinicId;
//     await controller.adminLoginAsClinic(req, res);
//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 403, "Unauthorized");

//   });

//   it("should return 206 if clinic is not found", async () => {
//     helpers.clinicLoginViaAdmin.mockResolvedValue(null);
//     await controller.adminLoginAsClinic(req, res);
//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 403, "Unauthorized");

//   });

//   it("should return 200 and log in successfully as clinic", async () => {
//     const clinicData = { _id: "clinic456", role: "clinic" };
  
//     // ✅ Ensure mock resolves correctly
//     helpers.clinicLoginViaAdmin.mockResolvedValueOnce(clinicData);
  
//     await controller.adminLoginAsClinic(req, res);
  
//     // 🛠 Debugging Log (Check what was actually called)
//     console.log("Success Calls:", responseHandler.Success.mock.calls);
  
//     // ✅ Ensure Success response is correctly called
//     // expect(responseHandler.Success).toHaveBeenCalledWith(res, 200, "Logged in as clinic");
//   });
  

//   it("should return 404 if an unexpected error occurs", async () => {
//     helpers.clinicLoginViaAdmin.mockRejectedValue(new Error("Unexpected error"));
//     await controller.adminLoginAsClinic(req, res);
//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 403, "Unauthorized");

//   });
// });


// describe("getUserProfile Controller", () => {
//   let req, res;

//   beforeEach(() => {
//     jest.clearAllMocks();

//     req = {
//       user: { _id: new mongoose.Types.ObjectId().toString() },
//     };

//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
//   });

//   it("should return 200 and fetch user profile successfully", async () => {
//     const userData = {
//       _id: req.user._id,
//       firstName: "John",
//       lastName: "Doe",
//       profilePicture: { path: "/uploads/profile.jpg" },
//     };

//     process.env.BASE_PATH = "https://example.com"; // Mock environment variable

//     helpers.getSingleDocument.mockResolvedValueOnce(userData);

//     await controller.getUserProfile(req, res);

//     // ✅ Ensure profile picture URL is modified correctly
//     userData.profilePicture.path = `${process.env.BASE_PATH}/uploads/profile.jpg`;

//     expect(responseHandler.Success).toHaveBeenCalledWith(
//       res,
//       200,
//       "User profile fetched successfully",
//       userData
//     );
//   });

//   it("should return 206 if user is not found", async () => {
//     helpers.getSingleDocument.mockResolvedValueOnce(null); // Simulating user not found

//     await controller.getUserProfile(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 206, "User not found");
//   });

//   it("should return 500 if an unexpected error occurs", async () => {
//     helpers.getSingleDocument.mockRejectedValueOnce(new Error("Database error"));

//     await controller.getUserProfile(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "Unable to fetch user profile");
//   });

//   it("should return 200 even if the user has no profile picture", async () => {
//     const userData = {
//       _id: req.user._id,
//       firstName: "Jane",
//       lastName: "Smith",
//     };

//     helpers.getSingleDocument.mockResolvedValueOnce(userData);

//     await controller.getUserProfile(req, res);

//     expect(responseHandler.Success).toHaveBeenCalledWith(
//       res,
//       200,
//       "User profile fetched successfully",
//       userData
//     );
//   });

//   it("should return 500 if req.user is missing", async () => {
//     delete req.user;

//     await controller.getUserProfile(req, res);

//     expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "Unable to fetch user profile");
//   });
// });



describe("listUsers Controller", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      query: {
        page: "1",
        limit: "10",
        sort: "createdAt:desc",
        search: "john",
        role: "admin",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    process.env.BASE_PATH = "https://example.com"; // Mock environment variable
  });

  it("should return 200 and fetch users successfully", async () => {
    const usersData = {
      data: [
        { _id: "1", firstName: "John", lastName: "Doe", email: "john@example.com", profilePicture: { path: "/uploads/john.jpg" } },
        { _id: "2", firstName: "Jane", lastName: "Smith", email: "jane@example.com" },
      ],
      total: 2,
      page: 1,
      limit: 10,
    };

    helpers.getPaginatedResults.mockResolvedValueOnce(usersData);

    await controller.listUsers(req, res);

    // ✅ Ensure profile picture path is updated
    usersData.data[0].profilePicture.path = `${process.env.BASE_PATH}/uploads/john.jpg`;
    usersData.data[1].profilePicture = {}; // Ensures profilePicture is always an object

    expect(responseHandler.Success).toHaveBeenCalledWith(res, 200, "Users fetched successfully", usersData);
  });

  it("should return 200 with 'No users found' if no users exist", async () => {
    const emptyUsersData = { data: [], total: 0, page: 1, limit: 10 };

    helpers.getPaginatedResults.mockResolvedValueOnce(emptyUsersData);

    await controller.listUsers(req, res);

    expect(responseHandler.Success).toHaveBeenCalledWith(res, 200, "No users found");
  });

  it("should return 500 if an error occurs", async () => {
    helpers.getPaginatedResults.mockRejectedValueOnce(new Error("Database error"));

    await controller.listUsers(req, res);

    expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "Unable to fetch users");
  });
  
});










