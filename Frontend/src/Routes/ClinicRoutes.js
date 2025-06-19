import AestheticManagement from "../Pages/Private/AestheticManagement/AestheticManagement";
import AddForm from "../Pages/Private/Consulatation/AddForm";
import ConsultationManagement from "../Pages/Private/Consulatation/ConsultationManagement";
import ContentManagement from "../Pages/Private/ContentManagement/ContentManagement";
import Dashboard from "../Pages/Private/Dashboard/Dashboard";
import PackageForm from "../Pages/Private/PackageManagement/PackageForm";
import PackageManagement from "../Pages/Private/PackageManagement/PackageManagement";
import Profile from "../Pages/Private/Profile/Profile";
import AddConcernForm from "../Pages/Private/AestheticManagement/AddConcernForm";

// Add other clinic-specific imports here

const ClinicRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/profile", element: <Profile /> },
  { path: "/aesthetic-management", element: <AestheticManagement /> },
  { path: "/consultations", element: <ConsultationManagement /> },
  { path: "/content-management", element: <ContentManagement /> },
  { path: "/consultation-form/:_id", element: <AddForm /> },
  { path: "/packages-management", element: <PackageManagement /> },
  { path: "/add-package", element: <PackageForm /> },
  { path: "/view-package/:id", element: <PackageForm /> },
  { path: "/edit-package/:id", element: <PackageForm /> },
  { path: "/add-concern", element: <AddConcernForm /> },
  { path: "/edit-concern/:id", element: <AddConcernForm /> },
  { path: "/view-concern/:id", element: <AddConcernForm /> },
];

export default ClinicRoutes;
