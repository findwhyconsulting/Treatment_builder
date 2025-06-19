import Dashboard from "../Pages/Private/Dashboard/Dashboard";
import AddConcernForm from "../Pages/Private/AestheticManagement/AddConcernForm";
import AestheticManagement from "../Pages/Private/AestheticManagement/AestheticManagement";
import ClinicManagment from "../Pages/Private/ClinicsManagement/ClinicManagment";
import ClinicForm from "../Pages/Private/ClinicsManagement/ClinicForm";
import Profile from "../Pages/Private/Profile/Profile";
import Images from "../Pages/Private/Images/Images";
import PackageManagement from "../Pages/Private/PackageManagement/PackageManagement";
import PackageForm from "../Pages/Private/PackageManagement/PackageForm";
import DynamicFace from "../Pages/Public/Face/DynamicFace";

const AdminRoutes = [
  { path: "/images-axis", element: <Images /> },
  { path: "/dashboard", element: <Dashboard /> },
  {
    path: "/profile",
    element: <Profile />, // Route for editing an existing concern
  },
  {
    path: "/aesthetic-management",
    element: <AestheticManagement />,
  },
  {
    path: "/add-concern",
    element: <AddConcernForm />,
  },
  {
    path: "/edit-concern/:id",
    element: <AddConcernForm />, // Route for editing an existing concern
  },
  {
    path: "/view-concern/:id",
    element: <AddConcernForm />, // Route for viewing a concern in read-only mode
  },
  {
    path: "/clinics-management",
    element: <ClinicManagment />, // Route for viewing a concern in read-only mode
  },
  {
    path: "/add-clinic",
    element: <ClinicForm />, // Route for clinic as per selected mode
  },
  {
    path: "/view-clinic/:id",
    element: <ClinicForm />, // Route for viewing a concern in read-only mode
  },
  {
    path: "/edit-clinic/:id",
    element: <ClinicForm />, // Route for editing an existing concern
  },
  {
    path: "/packages-management",
    element: <PackageManagement />, // Route for editing an existing concern
  },
  {
    path: "/add-package",
    element: <PackageForm />, // Route for clinic as per selected mode
  },
  {
    path: "/view-package/:id",
    element: <PackageForm />, // Route for viewing a concern in read-only mode
  },
  {
    path: "/edit-package/:id",
    element: <PackageForm />, // Route for editing an existing concern
  },
  {
    path: "/dynamic",
    element: <DynamicFace />,
  },
];

export default AdminRoutes;
