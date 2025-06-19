import * as helpers from '../../src/utils/customeFunction.js';
import * as responseHandler from '../../src/utils/customeResponse.js'; 
import controller from '../../src/clinicManagement/Controller.js'; 
import * as Emailhelpers from '../../src/utils/customeEmailSender.js'; 

const { addUser } = controller;

describe('addUser', () => {

    beforeEach(() => {
        jest.clearAllMocks(); 
    });

    it('should successfully create a new user when all required fields are provided', async () => {
      // ✅ Mock dependencies
      const mockReq = {
          body: {
              firstName: 'John',
              lastName: 'Doe',
              userName: 'johndoe',
              email: 'john@example.com',
              mobile: '1234567890',
              bio: 'Test bio',
              clinicName: 'Test Clinic'
          },
          files: [{ originalname: 'test.jpg', filename: 'test123.jpg' }],
          user: { _id: 'mockMasterId' }
      };

      const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
      };

      const mockUploads = { originalName: 'test.jpg', savedName: 'test123.jpg', path: 'test123.jpg' };
      const mockPassword = 'randomPassword123';
      const mockSavedUser = {
          _id: 'mockUserId',
          firstName: 'John',
          lastName: 'Doe',
          userName: 'johndoe',
          email: 'john@example.com',
          mobile: '1234567890',
          clinicName: 'Test Clinic'
      };

      // ✅ Mock functions correctly
      jest.spyOn(helpers, 'getUploadedFileDetails').mockResolvedValue(mockUploads);
      jest.spyOn(helpers, 'generateRandomPassword').mockResolvedValue(mockPassword);
      jest.spyOn(helpers, 'recordExists').mockImplementation((model, query) => {
          if (JSON.stringify(query) === JSON.stringify({ userName: 'johndoe' })) {
              return Promise.resolve(false);
          }
          if (JSON.stringify(query) === JSON.stringify({ $or: [{ email: 'john@example.com' }, { mobile: '1234567890' }] })) {
              return Promise.resolve(false);
          }
          return Promise.resolve(true);
      });
      jest.spyOn(helpers, 'createUser').mockResolvedValue(mockSavedUser);
      jest.spyOn(helpers, 'newCopyPackageForClinc').mockResolvedValue(2);
      jest.spyOn(helpers, 'newCopyPartsForClinc').mockResolvedValue(3);
      jest.spyOn(Emailhelpers, 'EmailProcess').mockResolvedValue();

      // ✅ Spy and Mock `Success` Response
      jest.spyOn(responseHandler, 'Success').mockImplementation((res, code, message, data) => {
          res.status(code).json({ success: true, statusCode: code, message, data });
      });

      // ✅ Execute function
      await addUser(mockReq, mockRes);

      // ✅ Assertions
      expect(helpers.getUploadedFileDetails).toHaveBeenCalledWith(mockReq);
      expect(helpers.generateRandomPassword).toHaveBeenCalledWith(12);
      expect(helpers.recordExists).toHaveBeenCalledWith(expect.any(Function), { userName: 'johndoe' });
      expect(helpers.recordExists).toHaveBeenCalledWith(expect.any(Function), { $or: [{ email: 'john@example.com' }, { mobile: '1234567890' }] });
      expect(helpers.createUser).toHaveBeenCalledWith(expect.any(Function), {
          firstName: 'John',
          lastName: 'Doe',
          userName: 'johndoe',
          email: 'john@example.com',
          mobile: '1234567890',
          clinicName: 'Test Clinic',
          password: mockPassword,
          role: 'clinic',
          bio: 'Test bio',
          profilePicture: mockUploads
      });
      expect(helpers.newCopyPackageForClinc).toHaveBeenCalledWith('mockMasterId', mockSavedUser);
      expect(helpers.newCopyPartsForClinc).toHaveBeenCalledWith('mockMasterId', mockSavedUser);
      expect(Emailhelpers.EmailProcess).toHaveBeenCalledWith({
          firstName: 'John',
          lastName: 'Doe',
          userEmail: 'john@example.com',
          userPassword: mockPassword
      });
      expect(responseHandler.Success).toHaveBeenCalledWith(mockRes, 200, 'User added successfully', mockSavedUser);
  });


    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return error when required fields are missing', async () => {
      // ✅ Mock dependencies
      const mockReq = {
        body: {
          firstName: '',
          lastName: '',
          userName: '',
          email: '',
          mobile: '',
          bio: 'Test bio',
          clinicName: 'Test Clinic'
        },
        files: [{ originalname: 'test.jpg', filename: 'test123.jpg' }],
        user: { _id: 'mockMasterId' }
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // ✅ Mock Error function
      jest.spyOn(responseHandler, 'Error');

      // ✅ Execute function
      await addUser(mockReq, mockRes);

      // ✅ Assertions
      expect(responseHandler.Error).toHaveBeenCalledWith(mockRes, 400, 'Missing required fields');
    });

    afterEach(() => {
        jest.restoreAllMocks(); // ✅ Restore mocks after each test
    });

});
