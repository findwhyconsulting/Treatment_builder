import { axiosInstance } from "../authService";
import ApiUrlConstant from "../Constants";

const ClinicManagementService = {
  listClinics: (data) => {
    return axiosInstance.get(ApiUrlConstant.listClinics(), {
      params: data,
    });
  },
  addClinic: (values) => {
    return axiosInstance.post(ApiUrlConstant.addClinic(), values);
  },
  updateClinic: (id, values) => {
    return axiosInstance.put(ApiUrlConstant.updateClinic(id), values);
  },
  adminLoginToClinic: (clinicId) => {
    return axiosInstance.post(ApiUrlConstant.loginToClinic(clinicId), {});
  },
};

export default ClinicManagementService;

/* 
Send data as per query params example 
return axiosInstance.post(ApiUrlConstant.loginService(), null, { params: data });


https://api.example.com/login?username=john_doe&password=12345
*/
