import { axiosInstance } from "../authService";
import ApiUrlConstant from "../Constants";

const PackageManagementService = {
  getPackages: (data) => {
    return axiosInstance.get(ApiUrlConstant.listPackages(), {
      params: data,
    });
  },
  addNewPackage: (values) => {
    return axiosInstance.post(ApiUrlConstant.addPackages(), values);
  },
  updatePackage: (id, values) => {
    return axiosInstance.put(ApiUrlConstant.updatePackage(id), values);
  },
  deletePackage: (id) => {
    return axiosInstance.put(ApiUrlConstant.deletePackage(id));
  },
  getSinglePackage: (id) => {
    return axiosInstance.put(ApiUrlConstant.getPackage(id), {});
  },
  removeImage: (data) => {
    return axiosInstance.post(ApiUrlConstant.removeFiles(), data);
  },

  affectedBodyParts: (id) => {
    return axiosInstance.get(ApiUrlConstant.affectedBodyParts(id));
  }
};

export default PackageManagementService;
