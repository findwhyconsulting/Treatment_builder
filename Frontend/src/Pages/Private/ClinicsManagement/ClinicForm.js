import React, { useEffect, useState } from "react";
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
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import showToast from "../../../Utils/Toast/ToastNotification";
import ClinicManagementService from "../../../Services/ClinicManagement/ClinicManagementService";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";

const ClinicForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { action, clinic } = location.state || {};
  const [formData, setFormData] = useState(clinic || {});
  const [viewMode, setViewMode] = useState(action === "View");
  const [formKey, setFormKey] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const isEditMode = !viewMode && action === "Edit";
  const isAddMode = action === "Add";
  const [selectedCountry, setSelectedCountry] = useState("AU"); // Track selected country const
  const [phoneValue, setPhoneValue] = useState(""); // Track

  useEffect(() => {
    if (!formData && !isAddMode) {
      showToast("error", "No data available. Redirecting...");
      navigate("/clinics-management");
    }
  }, [formData, isAddMode, navigate]);

  const initialValues = {
    firstName: formData?.firstName || "",
    lastName: formData?.lastName || "",
    email: formData?.email || "",
    userName: formData?.userName || "",
    mobile: formData?.mobile || "",
    clinicName: formData?.clinicName || "",
    role: "clinic",
    bio: formData?.bio || "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    clinicName: Yup.string().required("Clinic Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    userName: Yup.string()
      .matches(
        /^[a-zA-Z0-9-_]+$/,
        "Username can only contain letters, numbers, hyphens (-), and underscores (_) without spaces"
      )
      .required("Username is required"),
    // mobile: Yup.string()
    //   .matches(/^[0-9]{10}$/, "Mobile must be 10 digits")
    //   .required("Mobile is required"),
    mobile: Yup.string()
      .test("isValidMobile", "Invalid phone number", (value) =>
        isValidPhoneNumber(value || "")
      )
      .required("Mobile is required"),
    bio: Yup.string().max(250, "Bio must be less than 250 characters"),
  });

  const switchToEditMode = () => {
    setViewMode(false);
    setFormKey((prevKey) => prevKey + 1); // Force reinitialization of Formik
    navigate(`/edit-clinic/${formData._id}`, {
      state: { action: "Edit", clinic: formData },
    });
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("firstName", values.firstName);
      formDataToSubmit.append("lastName", values.lastName);
      formDataToSubmit.append("email", values.email);
      formDataToSubmit.append("userName", values.userName);
      formDataToSubmit.append("clinicName", values.clinicName);
      formDataToSubmit.append("mobile", values.mobile);
      formDataToSubmit.append("bio", values.bio);
      formDataToSubmit.append("role", values.role);

      // Append profile image if selected
      if (profileImage) {
        const profileImageFile =
          document.getElementById("profileImageInput").files[0];
        if (profileImageFile) {
          formDataToSubmit.append("profileImage", profileImageFile);
        }
      }

      if (isEditMode) {
        const updateClinic = await ClinicManagementService.updateClinic(
          formData._id,
          formDataToSubmit
        );

        if (updateClinic?.data?.statusCode === 200) {
          showToast("success", "Clinic updated successfully!");
          navigate("/clinics-management");
        } else {
          showToast("error", "Failed to update clinic");
        }
      } else if (isAddMode) {
        const addClinic = await ClinicManagementService.addClinic(
          formDataToSubmit
        );
        if (addClinic?.data?.statusCode === 200) {
          showToast(
            "success",
            addClinic?.data?.message || "Clinic added successfully!"
          );
          navigate("/clinics-management");
        } else {
          showToast(
            "error",
            addClinic?.data?.message || "Failed to add clinic"
          );
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        showToast("error", error.response.data.message);
      } else {
        showToast("error", "Something went wrong!");
      }
      console.error(error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          {viewMode
            ? "View Clinic Details"
            : isEditMode
            ? "Edit Clinic Details"
            : "Add New Clinic"}
        </Typography>

        {/* Profile image upload section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            position: "relative",
            mb: 3,
          }}
        >
          <Avatar
            alt="Profile Image"
            src={
              profileImage || formData?.profilePicture?.path || "/default-avatar.jpg"
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
                right: "-10px", // Moves it further right
                bgcolor: "background.paper",
                borderRadius: "50%",
                border: "2px solid #fff",
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

        <Formik
          key={formKey}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting }) => (
            console.log("formik error", errors),
            (
              <Form>
                <Grid container spacing={3}>
                  {/* Existing form fields go here */}
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="firstName"
                      label="First Name"
                      fullWidth
                      disabled={viewMode}
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="lastName"
                      label="Last Name"
                      fullWidth
                      disabled={viewMode}
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="email"
                      label="Email"
                      fullWidth
                      disabled={viewMode}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="userName"
                      label="User Name"
                      fullWidth
                      disabled={viewMode}
                      error={touched.userName && Boolean(errors.userName)}
                      helperText={touched.userName && errors.userName}
                    />
                  </Grid>

                  {/* <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="mobile"
                    label="Mobile"
                    fullWidth
                    disabled={viewMode}
                    error={touched.mobile && Boolean(errors.mobile)}
                    helperText={touched.mobile && errors.mobile}
                  />
                </Grid> */}

                  <Grid item xs={12} sm={6}>
                    <Field name="mobile">
                      {({ field, form }) => {
                        let phoneValue = field.value ? String(field.value) : "";
                        if (phoneValue && !phoneValue.startsWith("+")) {
                          phoneValue = `+${phoneValue}`;
                          form.setFieldValue("mobile", phoneValue); // Set formatted value
                        }

                        // Ensure the number has a '+' prefix
                        if (phoneValue && !phoneValue.startsWith("+")) {
                          phoneValue = "+" + phoneValue;
                        }

                        return (
                          <>
                            {/* <PhoneInput
                              disabled={viewMode}
                              international
                              defaultCountry="AU"
                              value={phoneValue}
                              onChange={(value) => {
                                form.setFieldValue("mobile", value || "");
                                form.setFieldTouched("mobile", true, false); 
                                if (!value || isValidPhoneNumber(value)) {
                                  form.setFieldError("mobile", "");
                                } else {
                                  form.setFieldError(
                                    "mobile",
                                    "Invalid phone number"
                                  ); // Set error
                                }
                              }}
                              style={{
                                fontSize: "16px",
                                height: "57px",
                                borderRadius: "4px",
                                padding: "10px",
                                border: "1px solid #ccc",
                                width: "100%",
                                borderColor:
                                  form.touched.mobile && form.errors.mobile
                                    ? "red"
                                    : "#ccc",
                              }}
                            /> */}

                            <PhoneInput
                              disabled={viewMode}
                              international
                              country={selectedCountry}
                              value={phoneValue}
                              onChange={(value, country) => {
                                const dialCode = country?.dialCode
                                  ? `+${country.dialCode}`
                                  : "";
                                if (!value || value.trim() === "") {
                                  setPhoneValue(dialCode); 
                                } else {
                                  setPhoneValue(value);
                                }
                                form.setFieldValue("mobile", value || "");
                                form.setFieldTouched("mobile", true, false);
                                if (country?.countryCode) {
                                  setSelectedCountry(
                                    country.countryCode.toUpperCase()
                                  );
                                }
                                if (!value || isValidPhoneNumber(value)) {
                                  form.setFieldError("mobile", "");
                                } else {
                                  form.setFieldError(
                                    "mobile",
                                    "Invalid phone number"
                                  );
                                }
                              }}
                              onKeyDown={(e) => {
                                if (
                                  e.key === " " &&
                                  phoneValue.length ===
                                    `+${selectedCountry}`.length
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              style={{
                                fontSize: "16px",
                                height: "57px",
                                borderRadius: "4px",
                                padding: "10px",
                                border: "1px solid #ccc",
                                width: "100%",
                                borderColor:
                                  form.touched.mobile && form.errors.mobile
                                    ? "red"
                                    : "#ccc",
                              }}
                            />
                            {form.touched.mobile && form.errors.mobile && (
                              <Typography color="error" fontSize="12px">
                                {form.errors.mobile}
                              </Typography>
                            )}
                          </>
                        );
                      }}
                    </Field>
                  </Grid>
                  {/* <Grid item xs={12} sm={6}>
                    <Field name="mobile">
                      {({ field, form }) => {
                        let phoneValue = field.value ? String(field.value) : "";

                        // Ensure the number has a '+' prefix
                        if (phoneValue && !phoneValue.startsWith("+")) {
                          phoneValue = "+" + phoneValue;
                        }

                        return (
                          <PhoneInput
                            international
                            defaultCountry="AU" // Set a default country
                            value={phoneValue}
                            onChange={(value) => {
                              // Ensure value is saved with `+` in the database
                              form.setFieldValue("mobile", value || "");
                            }}
                            style={{
                              fontSize: "16px",
                              height: "40px",
                              borderRadius: "4px",
                              padding: "10px",
                              border: "1px solid #ccc",
                              width: "100%",
                            }}
                            error={Boolean(
                              form.touched.mobile && form.errors.mobile
                            )}
                            helperText={
                              form.touched.mobile && form.errors.mobile
                            }
                          />
                        );
                      }}
                    </Field>
                  </Grid> */}

                  {/* <Grid item xs={12} sm={6}>
                  <Field name="mobile">
                    {({ field, form }) => {
                      const phoneValue = field.value ? String(field.value) : "";

                      return (
                        <TextField
                          label="Mobile Number"
                          fullWidth
                          disabled={viewMode}
                          InputProps={{
                            inputComponent: PhoneInput,
                            inputProps: {
                              ...field,
                              international: true,
                              defaultCountry: "AU",
                              value: field.value,
                              onChange: (value) =>
                                form.setFieldValue("mobile", value),
                              style: {
                                fontSize: "16px", // Adjust font size
                                height: "40px", // Match the height of existing input boxes
                                borderRadius: "4px",
                                padding: "10px",
                                border: "1px solid #ccc",
                                width: "100%",
                              },
                            },
                          }}
                          error={Boolean(
                            form.touched.mobile && form.errors.mobile
                          )}
                          helperText={form.touched.mobile && form.errors.mobile}
                        />
                      );
                    }}
                  </Field>
                </Grid> */}

                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="clinicName"
                      label="Clinic Name"
                      fullWidth
                      disabled={viewMode}
                      error={touched.clinicName && Boolean(errors.clinicName)}
                      helperText={touched.clinicName && errors.clinicName}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="bio"
                      label="Bio"
                      fullWidth
                      multiline
                      rows={3}
                      disabled={viewMode}
                      error={touched.bio && Boolean(errors.bio)}
                      helperText={touched.bio && errors.bio}
                    />
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 4,
                  }}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate("/clinics-management")}
                  >
                    {viewMode ? "Back" : "Cancel"}
                  </Button>
                  {viewMode ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={switchToEditMode}
                    >
                      Edit
                    </Button>
                  ) : (
                    <Button type="submit" variant="contained" color="primary">
                      {isEditMode ? "Save" : "Save"}
                    </Button>
                  )}
                </Box>
              </Form>
            )
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default ClinicForm;
