import { axiosInstance } from "../authService";
import ApiUrlConstant from "../Constants";

const ConsultationService = {
  addNewConsultation: (values) => {
    return axiosInstance.post(ApiUrlConstant.addConsultation(), values);
  },
  addNewConsultationAfterSubmit: (values) => {
    return axiosInstance.post(ApiUrlConstant.addConsultationAfterSubmit(), values);
  },
  sendNewConsultationEmail: (values) => {
    return axiosInstance.post(ApiUrlConstant.sendConsultationEmail(), values);
  },
  editConsultation: (_id, values) => {
    return axiosInstance.put(ApiUrlConstant.editconsultation(_id), values);
  },
  getConsultations: (data) => {
    return axiosInstance.get(ApiUrlConstant.consultationsList(), {
      params: data,
    });
  },
  /* Recommendation */
  getRecommendation: (data) => {
    return axiosInstance.post(ApiUrlConstant.getRecommendation(), data);
  },
};

export default ConsultationService;
