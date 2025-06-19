import ForgotPassword from "../Pages/Public/ForgotPassword/ForgotPassword";
import Home from "../Pages/Public/Home/Home";
import ResetPassword from "../Pages/Public/ResetPassword/ResetPassword";
import Submission from "../Pages/Public/Submission/Submission";
import Consulation from "../Pages/Public/Consulation/Consulation";

const PublicRoute = [
  {
    path: "/home",
    element: <Home />,
  },

  {
    path: "/consulation",
    exact: true,
    element: <Consulation />,
  },
];

export default PublicRoute;
