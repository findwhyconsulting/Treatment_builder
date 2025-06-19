import { axiosInstance } from "../authService";
import ApiUrlConstant from "../Constants";

const authService = {
  login: (data) => {
    return axiosInstance.post(ApiUrlConstant.loginService(), data);
  },
  logout: () => {
    return axiosInstance.post(ApiUrlConstant.logoutService(), null);
  },
  profile: () => {
    return axiosInstance.get(ApiUrlConstant.profileService(), null);
  },
  forgotPassword: (data) => {
    return axiosInstance.post(ApiUrlConstant.forgotPasswordService(), data);
  },
  resetPassword: (data) => {
    return axiosInstance.post(ApiUrlConstant.resetPasswordService(), data);
  },
};

export default authService;

/* 
Send data as per query params example 
return axiosInstance.post(ApiUrlConstant.loginService(), null, { params: data });


https://api.example.com/login?username=john_doe&password=12345
*/
