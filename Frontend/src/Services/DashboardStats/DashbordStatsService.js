import { axiosInstance } from "../authService";
import ApiUrlConstant from "../Constants";

const DashboardStatsService = {
  dashboardConent: () => {
    return axiosInstance.get(ApiUrlConstant.fetchDashboardContent(), null);
  },
};

export default DashboardStatsService;
