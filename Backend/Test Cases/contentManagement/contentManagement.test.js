import * as helpers from '../../src/utils/customeFunction.js';
import * as responseHandler from '../../src/utils/customeResponse.js'; 
import controller from '../../src/contentManagement/Controller.js';
import { Body } from '../../src/models/bodyParts.js';
import { Content } from '../../src/models/contents.js';
import { User } from '../../src/models/users.js';
import mongoose from 'mongoose';


const { getPublicContent } = controller;

// describe('getPublicContent', () => {
  
//     beforeEach(() => {
//       jest.restoreAllMocks(); // Ensures clean mocks for each test case
//     });

//     it('should return 200 with content when valid userName and part are provided', async () => {
//       // Mock request and response objects
//       const req = {
//         body: {
//           userName: 'testUser',
//           part: 'testPart'
//         } 
//       };
    
//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn()
//       };
    
//       const mockUser = { _id: 'userId123', userName: 'testUser' };
//       const mockContent = { 
//         user: 'userId123', 
//         services: { testPart: { data: 'test data' } },
//         logo: { path: '/logo.png' }
//       };
//       const mockActiveParts = { 
//         data: [{ name: 'part1' }], 
//         total: 1, 
//         currentPage: 1, 
//         totalPages: 1 
//       };
    
//       process.env.BASE_PATH = 'http://example.com';
    
//       // ✅ Properly Mock Helper Functions with Debugging Logs
//       jest.spyOn(helpers, 'getSingleDocument').mockImplementation((model, query) => {
//         console.log('🔍 getSingleDocument called with:', model, query);
//         return Promise.resolve(mockUser);
//       });
    
//       jest.spyOn(helpers, 'getSingleContent').mockImplementation((model, query) => {
//         console.log('🔍 getSingleContent called with:', model, query);
//         return Promise.resolve(mockContent);
//       });
    
//       jest.spyOn(helpers, 'getPaginatedResultsForAll').mockResolvedValue(mockActiveParts);
//       jest.spyOn(responseHandler, 'Success').mockImplementation((res, code, message, data) => {
//         res.status(code).json({ success: true, statusCode: code, message, data });
//       });
    
//       // Execute function
//       await getPublicContent(req, res);
    
//       // ✅ Debugging logs
//       console.log('📌 Expected Content model:', Content);
//       console.log('📌 Actual getSingleContent Calls:', helpers.getSingleContent.mock.calls);
    
//       // ✅ Assertions with Fixes
//       expect(helpers.getSingleDocument).toHaveBeenCalledWith(expect.any(Function), { 
//         userName: 'testUser',
//         isDeleted: false,
//         status: true
//       });
    
//       expect(helpers.getSingleContent).toHaveBeenCalledWith(expect.any(Function), { user: 'userId123' });
    
//       expect(helpers.getPaginatedResultsForAll).toHaveBeenCalledWith(expect.any(Function), {
//         status: 'active',
//         userId: 'userId123'
//       });
    
//       expect(responseHandler.Success).toHaveBeenCalledWith(res, 200, 'Public content found', {
//         user: 'testUser',
//         logo: 'http://example.com/logo.png',
//         part: 'testPart',
//         data: mockContent,
//         activepParts: mockActiveParts.data
//       });
//     });
    

//     // ✅ Missing userName in request returns 400 error
//     it('should return 400 error when userName is missing', async () => {
//       // Mock request and response objects
//       const req = {
//         body: {
//           part: 'testPart'
//           // userName is missing
//         }
//       };
  
//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn()
//       };
  
//       // ✅ Properly Mock Error Response
//       jest.spyOn(responseHandler, 'Error').mockImplementation((res, code, message) => {
//         res.status(code).json({ success: false, statusCode: code, message });
//       });

//       // ✅ Mock required functions before calling getPublicContent
//       jest.spyOn(helpers, 'getSingleDocument').mockImplementation(() => {}); 
//       jest.spyOn(helpers, 'getSingleContent').mockImplementation(() => {}); 
//       jest.spyOn(helpers, 'getPaginatedResultsForAll').mockImplementation(() => {}); 

//       // Execute function
//       await getPublicContent(req, res);
  
//       // ✅ Assertions
//       expect(responseHandler.Error).toHaveBeenCalledWith(
//         res, 
//         400, 
//         "Invalid request. Username and part are required."
//       );
//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({
//         success: false,
//         statusCode: 400,
//         message: "Invalid request. Username and part are required."
//       });

//       // ✅ Ensure helper functions were NOT called
//       expect(helpers.getSingleDocument).not.toHaveBeenCalled();
//       expect(helpers.getSingleContent).not.toHaveBeenCalled();
//       expect(helpers.getPaginatedResultsForAll).not.toHaveBeenCalled();
//     });
// });

const { resetContent } = controller;

// describe('resetContent', () => {
//     let req, res, mockUserId;

//     beforeEach(() => {
//         jest.restoreAllMocks(); // Reset all mocks before each test

//         mockUserId = 'userId123';
//         req = { user: { _id: mockUserId } };
//         res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn()
//         };
//     });

//     it('should reset content successfully and return 200', async () => {
//         jest.spyOn(helpers, 'deleteSingleContent').mockResolvedValue(true);
//         jest.spyOn(helpers, 'addRecord').mockResolvedValue(true);
//         jest.spyOn(responseHandler, 'Success').mockImplementation((res, code, message) => {
//             res.status(code).json({ success: true, statusCode: code, message });
//         });

//         await resetContent(req, res);

//         expect(helpers.deleteSingleContent).toHaveBeenCalledWith(expect.any(Function), { user: mockUserId });
//         expect(helpers.addRecord).toHaveBeenCalledWith(expect.any(Function), { user: mockUserId });
//         expect(responseHandler.Success).toHaveBeenCalledWith(res, 200, 'Content reset successfully');
//     });

//     it('should return 500 error when new content creation fails', async () => {
//         jest.spyOn(helpers, 'deleteSingleContent').mockResolvedValue(true);
//         jest.spyOn(helpers, 'addRecord').mockResolvedValue(false);
//         jest.spyOn(responseHandler, 'Error').mockImplementation((res, code, message) => {
//             res.status(code).json({ success: false, statusCode: code, message });
//         });

//         await resetContent(req, res);

//         expect(helpers.deleteSingleContent).toHaveBeenCalledWith(expect.any(Function), { user: mockUserId });
//         expect(helpers.addRecord).toHaveBeenCalledWith(expect.any(Function), { user: mockUserId });
//         expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, 'Failed to create new content');
//     });
// });



jest.mock("../../src/utils/customeFunction.js");
jest.mock("../../src/utils/customeResponse.js");

describe("getContent Controller", () => {
  let req, res, mockNewContent;

  beforeEach(() => {
    jest.clearAllMocks(); // ✅ Reset mocks before each test

    req = {
      user: { _id: new mongoose.Types.ObjectId().toString(), userName: "testUser" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNewContent = {
      _id: "456",
      services: {},
      toObject: jest.fn().mockReturnValue({
        _id: "456",
        services: {},
      }),
    };
  });

  it("should return 200 and existing content if found", async () => {
    console.log("getSingleContent Calls (Before):", helpers.getSingleContent.mock.calls);
  
    // ✅ Mock existing content
    helpers.getSingleContent.mockResolvedValue(mockNewContent);
    helpers.generatePaths.mockReturnValue(["path1"]);
  
    await controller.getContent(req, res);
  
    console.log("getSingleContent Calls (After):", helpers.getSingleContent.mock.calls);
  
    // ✅ Check if correct methods are called
    expect(helpers.getSingleContent).toHaveBeenCalledWith(
      expect.any(Function), // 🔥 Allow any function (Mongoose model)
      { user: req.user._id }
    );
    
    expect(helpers.generatePaths).toHaveBeenCalledWith({}, req.user.userName);
  
    // ✅ Ensure success response
    expect(responseHandler.Success).toHaveBeenCalledWith(
      res,
      200,
      "Content found",
      expect.objectContaining({
        _id: "456",
        services: {},
        paths: ["path1"],
      })
    );
  });
  

  it("should return 500 if creating new content fails", async () => {
    helpers.getSingleContent.mockResolvedValueOnce(null);
    helpers.addRecord.mockResolvedValue(null); // Simulate failure in content creation

    await controller.getContent(req, res);

    // ✅ Ensure failure response is triggered
    expect(responseHandler.Error).toHaveBeenCalledWith(res, 500, "Failed to create new content");
  });


});
