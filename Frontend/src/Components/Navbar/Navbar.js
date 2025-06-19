import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import showToast from "../../Utils/Toast/ToastNotification";
import authService from "../../Services/Login/LoginService";
import { useDispatch } from "react-redux";
import { userlogout } from "../../Redux/Slice/Auth/AuthSlice";
import { useSelector } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./Navbar.css";
import {
  clearProfile,
  setProfile,
} from "../../Redux/Slice/Profile/ProfileSlice";
import { logOutAsClinic } from "../../Redux/Slice/LoginAsClinic/LoginAsClinicSlice";
import logo from "../../Assets/images/logo.svg";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state?.user);
  // console.log('loggedInUser " ', loggedInUser);

  const isLoggedInAsClinic = useSelector(
    (state) => state?.adminSessionAsClinic?.isLoggedInAsClinic
  );
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const checkProfile = () => {
    navigate("/profile");
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    setTimeout(async () => {
      try {
        if (isLoggedInAsClinic) {
          dispatch(logOutAsClinic());
          const profileResponse = await authService.profile();
          if (profileResponse?.data?.statusCode === 200) {
            await dispatch(setProfile(profileResponse?.data?.data));
            showToast("success", "Switched back to admin session");
            window.location.href = "/";
          }
          return;
        }

        // Handle logging out of the entire session
        const loggedOutUser = await authService.logout();
        if (loggedOutUser?.data?.statusCode === 200) {
          dispatch(userlogout());
          dispatch(clearProfile());
          navigate("/");
          showToast("success", loggedOutUser?.data?.message);
        }
        setAnchorEl(null);
      } catch (error) {
        showToast("error", "An unexpected error occurred");
        console.error("Logout error:", error);
      }
    }, 500);
  };

  return (
    <AppBar position="fixed" className="main_Navbar">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <div className="Navbar_logo">
            <img src={logo} alt="logo" height={55} width={200} />
          </div>
        </Typography>
        <div>
          <Avatar
            alt="User Profile"
            onClick={handleClick}
            src={loggedInUser?.user?.profilePicture?.path || ""}
            sx={{ cursor: "pointer" }}
          >
            {loggedInUser?.user?.firstName
              ? loggedInUser?.user?.firstName?.charAt(0).toUpperCase()
              : "A"}
            {loggedInUser?.user?.lastName
              ? loggedInUser?.user?.lastName?.charAt(0).toUpperCase()
              : "A"}
          </Avatar>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={checkProfile}>
              <div className="profile-sec">
                <AccountCircleIcon />
              </div>
              <div className="profile-sec">{loggedInUser?.user?.firstName}</div>
            </MenuItem>
            {isLoggedInAsClinic ? (
              <MenuItem onClick={handleLogout}>Switch To Admin</MenuItem>
            ) : (
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            )}
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
