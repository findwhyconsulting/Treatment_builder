import { apiUrl } from "../Utils/Environment";

const ApiUrlConstant = {
  // =================================
  // Login Endpoint's                |
  // =================================
  loginService: () => `${apiUrl}/login`,
  logoutService: () => `${apiUrl}/logout`,
  forgotPasswordService: () => `${apiUrl}/forgot-password`,
  // resetPasswordService: (token) => `${apiUrl}/reset-password/${token}`,
  resetPasswordService: (token) => `${apiUrl}/reset-password`,

  // =================================
  // Get logged in user's profile    |
  // =================================

  profileService: () => `${apiUrl}/profile`,
  updateProfile: () => `${apiUrl}/update-profile`,

  // =================================
  // Dashboard Section               |
  // =================================
  fetchDashboardContent: () => `${apiUrl}/dashboard`,

  // =================================
  // Body Management Endpoint's      |
  // =================================
  listPartsService: () => `${apiUrl}/body-parts`,
  addBodyAndPartDataService: () => `${apiUrl}/body-parts`,
  getPartDetailsService: (id) => `${apiUrl}/body-parts/${id}`,
  updatePartDetailsService: (id) => `${apiUrl}/body-parts/${id}`,

  // =================================
  // Body Management Endpoint's For Parts |
  // =================================
  addPartNew: () => `${apiUrl}/parts`,
  getParts: () => `${apiUrl}/parts`,
  updateParts: (id) => `${apiUrl}/parts/${id}`,

  // =================================
  // Body Management Endpoint's For Package |
  // =================================
  // addPartNew: () => `${apiUrl}/add-part`,
  getPackages: () => `${apiUrl}/packages/all`,
  getRecommendation: () => `${apiUrl}/recommendations`,
  // updateParts: (id) => `${apiUrl}/update-part/${id}`,

  // =================================
  // Clinic Management Endpoint's |
  // =================================
  listClinics: () => `${apiUrl}/users`,
  addClinic: () => `${apiUrl}/users`,
  updateClinic: (id) => `${apiUrl}/update-user/${id}`,
  loginToClinic: (clinicId) => `${apiUrl}/login-as/${clinicId}`,

  // =================================
  // Content Management Endpoint's | Public
  // =================================
  fetchPublicContent: () => `${apiUrl}/public-content`,

  // =================================
  // Content Management Endpoint's |
  // =================================
  fetchContent: () => `${apiUrl}/contents`,
  updateContent: () => `${apiUrl}/contents`,
  updateDesign: () => `${apiUrl}/update-design`,
  resetDesign: () => `${apiUrl}/contents/reset`,
  changeLogo: () => `${apiUrl}/settings/logo`,

  // =================================
  // Images Management Endpoint's |
  // =================================
  fetchImages: () => `${apiUrl}/images`,
  updateImages: () => `${apiUrl}/parts`,
  updateDashedImages: () => `${apiUrl}/parts/coordinates`,
  uploadClientImage: () => `${apiUrl}/uploadImage`,


  // =================================
  // Consultation Endpoint's |
  // =================================
  addConsultation: () => `${apiUrl}/consultation`,
  addConsultationAfterSubmit: () => `${apiUrl}/consultations-submit`,
  sendConsultationEmail: () => `${apiUrl}/consultations-email`,
  consultationsList: () => `${apiUrl}/consultations`,
  editconsultation: (_id) => `${apiUrl}/consultations/${_id}`,
  getPackageDetails: () => `${apiUrl}/recommendations`,

  // =================================
  // Packages Management Endpoint's |
  // =================================
  listPackages: () => `${apiUrl}/packages`,
  removeFiles: () => `${apiUrl}/remove-file`,
  addPackages: () => `${apiUrl}/packages`,
  updatePackage: (id) => `${apiUrl}/packages/${id}`,
  deletePackage: (id) => `${apiUrl}/package/${id}`,
  getPackage: (id) => `${apiUrl}/get-package/${id}`,
  affectedBodyParts: (id) => `${apiUrl}/affected-packages/${id}`,
};

export default ApiUrlConstant;
