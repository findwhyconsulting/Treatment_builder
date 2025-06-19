import { axiosInstance } from "../authService";
import ApiUrlConstant from "../Constants";

const bodyManagementService = {
  listParts: (data) => {
    return axiosInstance.get(ApiUrlConstant.listPartsService(), {
      params: data,
    });
  },
  addBodyAndPartData: (values) => {
    return axiosInstance.post(
      ApiUrlConstant.addBodyAndPartDataService(),
      values
    );
  },
  getPartDetails: (id) => {
    return axiosInstance.get(ApiUrlConstant.getPartDetailsService(), id);
  },
  updatePartDetails: (id, values) => {
    return axiosInstance.put(
      ApiUrlConstant.updatePartDetailsService(id),
      values
    );
  },

  /* Parts */
  addPart: (values) => {
    return axiosInstance.post(ApiUrlConstant.addPartNew(), values);
  },
  getParts: (data) => {
    // console.log('askjdasjkdasjkdn',data);

    return axiosInstance.get(ApiUrlConstant.getParts(), {
      params: data,
    });
  },
  updatePart: (id, values) => {
    return axiosInstance.put(ApiUrlConstant.updateParts(id), values);
  },

  /* Packages */
  getPackagesList: (data) => {
    console.log('data getPackagesList: ',data);
    
    return axiosInstance.get(ApiUrlConstant.getPackages(), {
      params: data,
    });
  },
};

export default bodyManagementService;

/* 
Send data as per query params example 
return axiosInstance.post(ApiUrlConstant.loginService(), null, { params: data });


https://api.example.com/login?username=john_doe&password=12345
*/
