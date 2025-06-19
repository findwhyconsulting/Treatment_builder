import { axiosInstance } from "../authService";
import ApiUrlConstant from "../Constants";

const ContentManagementService = {
  getContent: () => {
    return axiosInstance.get(ApiUrlConstant.fetchContent(), null);
  },
  updateContent: (values) => {
    return axiosInstance.put(ApiUrlConstant.updateContent(), values);
  },
  updateDesign: (values) => {
    return axiosInstance.put(ApiUrlConstant.updateDesign(), values);
  },
  resetDesign: () => {
    return axiosInstance.post(ApiUrlConstant.resetDesign(), "");
  },
  updateContentLogo: (values) => {
    return axiosInstance.put(ApiUrlConstant.changeLogo(), values);
  },
};

export default ContentManagementService;
