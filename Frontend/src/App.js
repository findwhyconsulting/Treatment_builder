import { useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ErrorComponent from "./Components/ErrorPage/ErrorComponent";
import PublicRoute from "./Routes/PublicRoutes";
import Layout from "./Layouts/Public/Layout";
import PrivateLayout from "./Layouts/Private/PrivateLayout";
import AdminRoutes from "./Routes/PrivateRoutes";
import ClinicRoutes from "./Routes/ClinicRoutes";
import { ProtectedOutlet, PublicOutlet } from "./ProtectedRoutes";
import Login from "./Pages/Public/Login/Login";
import DynamicPage from "./Pages/Public/DynamicPage/DynamicPage";
import ResetPassword from "./Pages/Public/ResetPassword/ResetPassword";
import ForgotPassword from "./Pages/Public/ForgotPassword/ForgotPassword";
import Submission from "./Pages/Public/Submission/Submission";

function App() {
  const loggedInUserRole = useSelector((state) => state?.user?.user?.role);
  const isLoggedInAsClinic = useSelector(
    (state) => state?.adminSessionAsClinic?.isLoggedInAsClinic
  );

  const routesConfig = createBrowserRouter([
    {
      path: "/",
      element: <PublicOutlet />,
      errorElement: <ErrorComponent />,
      children: [
        {
          children: [
            {
              path: "/",
              element: <Login />,
            },
            {
              path: "/forgot-password",
              element: <ForgotPassword />,
            },
            {
              path: "/reset-password",
              element: <ResetPassword />,
            },
          ],
        },
      ],
    },
    {
      path: "/",
      element: <PublicOutlet />,
      errorElement: <ErrorComponent />,
      children: [
        {
          children: [
            {
              path: "/:username/:part",
              element: <DynamicPage />,
            },
            {
              path: "/submission",
              element: <Submission />,
            },
          ],
        },
      ],
    },
    {
      path: "/",
      element: <PublicOutlet />,
      errorElement: <ErrorComponent />,
      children: [
        {
          element: <Layout />,
          children: PublicRoute,
        },
      ],
    },
    {
      path: "/",
      element: <ProtectedOutlet />,
      errorElement: <ErrorComponent />,
      children: [
        {
          element: <PrivateLayout />,
          children:
            loggedInUserRole === "clinic"
              ? ClinicRoutes
              : isLoggedInAsClinic
              ? ClinicRoutes
              : AdminRoutes,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={routesConfig} />
      <ToastContainer />
    </>
  );
}

export default App;
