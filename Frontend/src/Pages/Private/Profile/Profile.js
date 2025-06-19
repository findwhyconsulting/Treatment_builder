import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Container,
  Paper,
  Grid,
  IconButton,
  Avatar,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import showToast from "../../../Utils/Toast/ToastNotification";
import profileManagementService from "../../../Services/ProfileManagementService/ProfileManagementService";
import { setProfile } from "../../../Redux/Slice/Profile/ProfileSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    mobile: "",
    bio: "",
  });

  const fetchProfileData = async () => {
    try {
      const response = await profileManagementService.getProfile();

      if (response?.data?.statusCode === 200) {
        const profileData = response?.data?.data;
        dispatch(setProfile(profileData));
        setFormData({
          firstName: profileData?.firstName || "",
          lastName: profileData?.lastName || "",
          email: profileData?.email || "",
          userName: profileData?.userName || "",
          mobile: profileData?.mobile || "",
          bio: profileData?.bio || "",
          profilePicture: profileData?.profilePicture || null, // Include profilePicture
        });
      } else {
        showToast("error", "Failed to fetch profile data.");
      }
    } catch (error) {
      showToast("error", "Error fetching profile data.");
      console.error(error);
    }
  };
  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleButtonClick = () => {
    if (viewMode) {
      // Navigate back to the desired route
      navigate(-1); // Navigates to the previous page
    } else {
      // Cancel the current process
      setViewMode(false); // Optionally reset viewMode if required
    }
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      if (profileImage) {
        formDataToSend.append("profileImage", profileImage);
      }
      const response = await profileManagementService.updateProfile(
        formDataToSend
      );

      if (response?.data?.statusCode === 200) {
        const updatedData = response?.data?.data;
        // dispatch(setProfile(updatedData));

        // Update the form data with the new profile data
        setFormData({
          firstName: updatedData?.firstName || "",
          lastName: updatedData?.lastName || "",
          email: updatedData?.email || "",
          userName: updatedData?.userName || "",
          mobile: updatedData?.mobile || "",
          bio: updatedData?.bio || "",
        });

        showToast("success", "Profile updated successfully.");
        setViewMode(true);
      } else {
        showToast("error", "Failed to update profile.");
      }
    } catch (error) {
      showToast("error", "Error updating profile.");
      console.error(error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          {viewMode ? "View Profile" : "Edit Profile"}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            mb: 3,
          }}
        >
          <Avatar
            alt="Profile Image"
            src={
              profileImage
                ? URL.createObjectURL(profileImage) // Display selected image if present
                : formData.profilePicture?.path || "/default-avatar.jpg" // Display fetched image or default
            }
            sx={{ width: 100, height: 100 }}
          />
          {!viewMode && (
            <IconButton
              color="primary"
              component="label"
              sx={{
                position: "absolute",
                bottom: 0,
                right: "calc(50% - 50px)",
                bgcolor: "background.paper",
                borderRadius: "50%",
              }}
            >
              <CameraAltIcon />
              <input
                id="profileImageInput"
                type="file"
                hidden
                onChange={handleProfileImageChange}
              />
            </IconButton>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              fullWidth
              disabled={viewMode}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              fullWidth
              disabled={viewMode}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              fullWidth
              disabled={viewMode}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Username"
              value={formData.userName}
              onChange={(e) => handleInputChange("userName", e.target.value)}
              fullWidth
              disabled={viewMode}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Mobile"
              value={formData.mobile}
              onChange={(e) => handleInputChange("mobile", e.target.value)}
              fullWidth
              disabled={viewMode}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              fullWidth
              multiline
              rows={3}
              disabled={viewMode}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          {viewMode ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setViewMode(false)}
            >
              Edit
            </Button>
          ) : (
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Save
            </Button>
          )}
          {viewMode ? (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setViewMode(true)}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;

// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   Container,
//   Paper,
//   Grid,
//   IconButton,
//   Avatar,
// } from "@mui/material";
// import CameraAltIcon from "@mui/icons-material/CameraAlt";
// import showToast from "../../../Utils/Toast/ToastNotification";
// import { useNavigate } from "react-router-dom";
// import { setProfile } from "../../../Redux/Slice/Profile/ProfileSlice";
// import profileManagementService from "../../../Services/ProfileManagementService/ProfileManagementService";

// const Profile = () => {
//   const loggedInUser = useSelector((state) => state?.user?.user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [viewMode, setViewMode] = useState(true);
//   const [profileImage, setProfileImage] = useState(null);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     userName: "",
//     mobile: "",
//     bio: "",
//   });

//   useEffect(() => {
//     if (!loggedInUser) {
//       showToast("error", "User not found.");
//     } else {
//       // Fetch user profile data from the API or Redux and set it to the state
//       // Replace the below mock data with the actual API call if needed
//       const fetchProfileData = async () => {
//         try {
//           // Call your API to fetch the profile data
//           // const response = await profileManagementService.getProfile(loggedInUser._id);
//           // dispatch(setProfile(response.data));
//           const getProfile = await profileManagementService.getProfile();
//           if (getProfile?.data?.statusCode === 200) {
//             console.log("getProfile______", getProfile?.data?.data);
//             dispatch(setProfile(getProfile?.data?.data));
//           }
//           // Mocking the API response
//           const userProfile = {
//             firstName: loggedInUser.firstName || "",
//             lastName: loggedInUser.lastName || "",
//             email: loggedInUser.email || "",
//             userName: loggedInUser.userName || "",
//             mobile: loggedInUser.mobile || "",
//             bio: loggedInUser.bio || "",
//           };

//           setFormData(userProfile);
//         } catch (error) {
//           showToast("error", "Failed to fetch profile data.");
//           console.error(error);
//         }
//       };

//       fetchProfileData();
//     }
//   }, [loggedInUser, dispatch]);

//   const handleProfileImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setProfileImage(file);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       // Prepare the updated data for submission
//       const updatedProfileData = {
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         email: formData.email,
//         userName: formData.userName,
//         mobile: formData.mobile,
//         bio: formData.bio,
//         profileImage,
//       };

//       // Call the API to update the profile with updatedProfileData
//       // const response = await profileManagementService.updateProfile(loggedInUser._id, updatedProfileData);

//       // Handle success response
//       // dispatch(setProfile(response.data));
//       // showToast("success", "Profile updated successfully.");

//       setViewMode(true);
//     } catch (error) {
//       showToast("error", "Failed to update profile.");
//       console.error(error);
//     }
//   };

//   return (
//     <Container maxWidth="md" sx={{ mt: 4 }}>
//       <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
//         <Typography variant="h5" align="center" gutterBottom>
//           {viewMode ? "View Profile" : "Edit Profile"}
//         </Typography>

//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "flex-end",
//             position: "relative",
//             mb: 3,
//           }}
//         >
//           <Avatar
//             alt="Profile Image"
//             src={
//               profileImage
//                 ? URL.createObjectURL(profileImage)
//                 : loggedInUser?.profilePicture?.path || "/default-avatar.jpg"
//             }
//             sx={{ width: 100, height: 100 }}
//           />
//           {!viewMode && (
//             <IconButton
//               color="primary"
//               component="label"
//               sx={{
//                 position: "absolute",
//                 bottom: 0,
//                 right: "-10px",
//                 bgcolor: "background.paper",
//                 borderRadius: "50%",
//                 border: "2px solid #fff",
//               }}
//             >
//               <CameraAltIcon />
//               <input
//                 id="profileImageInput"
//                 type="file"
//                 hidden
//                 onChange={handleProfileImageChange}
//               />
//             </IconButton>
//           )}
//         </Box>

//         <Grid container spacing={3}>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="First Name"
//               value={formData.firstName}
//               onChange={(e) =>
//                 setFormData({ ...formData, firstName: e.target.value })
//               }
//               fullWidth
//               disabled={viewMode}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Last Name"
//               value={formData.lastName}
//               onChange={(e) =>
//                 setFormData({ ...formData, lastName: e.target.value })
//               }
//               fullWidth
//               disabled={viewMode}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Email"
//               value={formData.email}
//               onChange={(e) =>
//                 setFormData({ ...formData, email: e.target.value })
//               }
//               fullWidth
//               disabled={viewMode}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Username"
//               value={formData.userName}
//               onChange={(e) =>
//                 setFormData({ ...formData, userName: e.target.value })
//               }
//               fullWidth
//               disabled={viewMode}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Mobile"
//               value={formData.mobile}
//               onChange={(e) =>
//                 setFormData({ ...formData, mobile: e.target.value })
//               }
//               fullWidth
//               disabled={viewMode}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Bio"
//               value={formData.bio}
//               onChange={(e) =>
//                 setFormData({ ...formData, bio: e.target.value })
//               }
//               fullWidth
//               multiline
//               rows={3}
//               disabled={viewMode}
//             />
//           </Grid>
//         </Grid>

//         <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
//           {viewMode ? (
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => setViewMode(false)}
//             >
//               Edit
//             </Button>
//           ) : (
//             <Button
//               type="button"
//               variant="contained"
//               color="primary"
//               onClick={handleSubmit}
//             >
//               Save
//             </Button>
//           )}
//           <Button
//             variant="outlined"
//             color="secondary"
//             onClick={() => setViewMode(true)}
//           >
//             {viewMode ? "Back" : "Cancel"}
//           </Button>
//         </Box>
//       </Paper>
//     </Container>
//   );
// };

// export default Profile;

// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   Container,
//   Paper,
//   Grid,
//   IconButton,
//   Avatar,
// } from "@mui/material";
// import CameraAltIcon from "@mui/icons-material/CameraAlt";
// import showToast from "../../../Utils/Toast/ToastNotification";
// import profileManagementService from "../../../Services/ProfileManagementService/ProfileManagementService";
// import { useNavigate } from "react-router-dom";
// import { setProfile } from "../../../Redux/Slice/Profile/ProfileSlice";

// const Profile = () => {
//   const loggedInUser = useSelector((state) => state?.user?.user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [viewMode, setViewMode] = useState(true);
//   const [profileImage, setProfileImage] = useState(null);
//   const [formData, setFormData] = useState({
//     firstName: loggedInUser?.firstName || "",
//     lastName: loggedInUser?.lastName || "",
//     email: loggedInUser?.email || "",
//     userName: loggedInUser?.userName || "",
//     mobile: loggedInUser?.mobile || "",
//     bio: loggedInUser?.bio || "",
//   });

//   useEffect(() => {
//     if (!loggedInUser) {
//       showToast("error", "User not found.");
//     }
//   }, [loggedInUser]);

//   const handleProfileImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setProfileImage(file);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       // Create a new FormData object
//       const formDataToSend = new FormData();

//       // Append only the changed or provided fields to the FormData object
//       if (formData.firstName !== loggedInUser?.firstName) {
//         formDataToSend.append("firstName", formData.firstName);
//       }
//       if (formData.lastName !== loggedInUser?.lastName) {
//         formDataToSend.append("lastName", formData.lastName);
//       }
//       if (formData.email !== loggedInUser?.email) {
//         formDataToSend.append("email", formData.email);
//       }
//       if (formData.userName !== loggedInUser?.userName) {
//         formDataToSend.append("userName", formData.userName);
//       }
//       if (formData.mobile !== loggedInUser?.mobile) {
//         formDataToSend.append("mobile", formData.mobile);
//       }
//       if (formData.bio !== loggedInUser?.bio) {
//         formDataToSend.append("bio", formData.bio);
//       }

//       // Append the profile image only if it's changed
//       if (profileImage) {
//         formDataToSend.append("profileImage", profileImage);
//       }

//       // Make the API call to update the profile
//       const updateProfile = await profileManagementService.updateProfile(
//         loggedInUser._id,
//         formDataToSend
//       );

//       if (updateProfile?.data?.statusCode === 200) {
//         dispatch(setProfile(updateProfile?.data?.data));
//         showToast("success", updateProfile?.data?.message);
//       } else {
//         showToast("error", "Failed to update profile");
//       }
//       setViewMode(true); // Switch to view mode after submission
//     } catch (error) {
//       showToast("error", "Failed to update profile");
//       console.error(error);
//     }
//   };

//   return (
//     <Container maxWidth="md" sx={{ mt: 4 }}>
//       <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
//         <Typography variant="h5" align="center" gutterBottom>
//           {viewMode ? "View Profile" : "Edit Profile"}
//         </Typography>

//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "flex-end",
//             position: "relative",
//             mb: 3,
//           }}
//         >
//           <Avatar
//             alt="Profile Image"
//             src={
//               profileImage
//                 ? URL.createObjectURL(profileImage)
//                 : loggedInUser?.profilePicture?.path || "/default-avatar.jpg"
//             }
//             sx={{ width: 100, height: 100 }}
//           />
//           {!viewMode && (
//             <IconButton
//               color="primary"
//               component="label"
//               sx={{
//                 position: "absolute",
//                 bottom: 0,
//                 right: "-10px",
//                 bgcolor: "background.paper",
//                 borderRadius: "50%",
//                 border: "2px solid #fff",
//               }}
//             >
//               <CameraAltIcon />
//               <input
//                 id="profileImageInput"
//                 type="file"
//                 hidden
//                 onChange={handleProfileImageChange}
//               />
//             </IconButton>
//           )}
//         </Box>

//         <Grid container spacing={3}>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="First Name"
//               value={formData.firstName}
//               onChange={(e) =>
//                 setFormData({ ...formData, firstName: e.target.value })
//               }
//               fullWidth
//               disabled={viewMode}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Last Name"
//               value={formData.lastName}
//               onChange={(e) =>
//                 setFormData({ ...formData, lastName: e.target.value })
//               }
//               fullWidth
//               disabled={viewMode}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Email"
//               value={formData.email}
//               onChange={(e) =>
//                 setFormData({ ...formData, email: e.target.value })
//               }
//               fullWidth
//               disabled={viewMode}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Username"
//               value={formData.userName}
//               onChange={(e) =>
//                 setFormData({ ...formData, userName: e.target.value })
//               }
//               fullWidth
//               disabled={viewMode}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Mobile"
//               value={formData.mobile}
//               onChange={(e) =>
//                 setFormData({ ...formData, mobile: e.target.value })
//               }
//               fullWidth
//               disabled={viewMode}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Bio"
//               value={formData.bio}
//               onChange={(e) =>
//                 setFormData({ ...formData, bio: e.target.value })
//               }
//               fullWidth
//               multiline
//               rows={3}
//               disabled={viewMode}
//             />
//           </Grid>
//         </Grid>

//         <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
//           {viewMode ? (
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => setViewMode(false)}
//             >
//               Edit
//             </Button>
//           ) : (
//             <Button
//               type="button"
//               variant="contained"
//               color="primary"
//               onClick={handleSubmit}
//             >
//               Save
//             </Button>
//           )}
//           <Button
//             variant="outlined"
//             color="secondary"
//             onClick={() => setViewMode(true)}
//           >
//             {viewMode ? "Back" : "Cancel"}
//           </Button>
//         </Box>
//       </Paper>
//     </Container>
//   );
// };

// export default Profile;
