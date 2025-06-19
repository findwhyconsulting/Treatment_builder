import { axiosInstance } from "../authService";
import ApiUrlConstant from "../Constants";

const PublicContentManagementService = {
  getPublicContent: (values) => {
    return axiosInstance.post(ApiUrlConstant.fetchPublicContent(), values);
  },
};

export default PublicContentManagementService;

/* 
Send data as per query params example 
return axiosInstance.post(ApiUrlConstant.loginService(), null, { params: data });


https://api.example.com/login?username=john_doe&password=12345
*/
