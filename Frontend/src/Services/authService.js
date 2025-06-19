import axios from "axios";
import { store } from "../Redux/Store"; // Import your redux store
import { apiUrl } from "../Utils/Environment";
import showToast from "../Utils/Toast/ToastNotification";
import { userlogout } from "../Redux/Slice/Auth/AuthSlice";
import { clearProfile } from "../Redux/Slice/Profile/ProfileSlice";
import { logOutAsClinic } from "../Redux/Slice/LoginAsClinic/LoginAsClinicSlice";

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

// Request interceptor to add the token to the request headers if present in the store state.
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState(); // Access the Redux store

    // Get tokens from Redux state
    const sessionClinicToken = state?.adminSessionAsClinic?.clinic?.token;
    const authToken = state?.auth?.user?.token;

    // Prioritize sessionClinicToken if it exists, otherwise use authToken
    const token = sessionClinicToken ? sessionClinicToken : authToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // console.log("No token found, proceeding without Authorization header.");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (
      response?.status === 401 &&
      response?.data?.message === "Unauthorized"
    ) {
      showToast("error", "Session Expired. Logging out...");
      // Clear session and profile
      store.dispatch(userlogout());
      store.dispatch(clearProfile());
      store.dispatch(logOutAsClinic());
      // window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export { axiosInstance };
