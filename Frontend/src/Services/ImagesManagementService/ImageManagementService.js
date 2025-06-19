import { axiosInstance } from "../authService";
import ApiUrlConstant from "../Constants";

const ImageManagementService = {
  getImages: (data) => {
    return axiosInstance.get(ApiUrlConstant.fetchImages(), {
      params: data,
    });
  },
  updateImages: (values) => {
    return axiosInstance.put(ApiUrlConstant.updateImages(), values);
  },
  updateDashedPartInImage: (values) => {
    return axiosInstance.put(ApiUrlConstant.updateDashedImages(), values);
  },
  uploadClientImage: (values) => {
    return axiosInstance.post(ApiUrlConstant.uploadClientImage(), values);
  },
};


export default ImageManagementService;
