import { axiosInstance } from "../authService";
import ApiUrlConstant from "../Constants";

const profileManagementService = {
  getProfile: () => {
    return axiosInstance.get(ApiUrlConstant.profileService());
  },
  updateProfile: (values) => {
    return axiosInstance.put(ApiUrlConstant.updateProfile(), values);
  },
};

export default profileManagementService;

/* 
Send data as per query params example 
return axiosInstance.post(ApiUrlConstant.loginService(), null, { params: data });


https://api.example.com/login?username=john_doe&password=12345
*/
