import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Container,
  Paper,
  Grid,
  Checkbox,
  FormControlLabel,
  Avatar,
  ListItemText,
  List,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import showToast from "../../../Utils/Toast/ToastNotification";
import ConsultationService from "../../../Services/ConsultationServices/ConsultationService";
import { useSelector } from "react-redux";

const Form = () => {
  const loggedInUser = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    ageRange: "",
    hadAestheticTreatmentBefore: "",
    selectedImage: "",
    areasOfConcern: [],
  });
  console.log("formData : ", formData);

  const [errors, setErrors] = useState({});
  const [mode, setMode] = useState("View");

  useEffect(() => {
    if (location.state?.action) {
      setMode(location.state.action);
      if (location.state?.data && location.state.action === "Edit") {
        setFormData(location.state.data);
      }
      if (location.state?.data && location.state.action === "View") {
        setFormData(location.state.data);
      }
    }
  }, [location.state]);

  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "firstName" && value.length > 20) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        firstName: `First name cannot exceed ${20} characters`,
      }));
    } else if (name === "firstName" && value.length <= 20) {
      setErrors((prevErrors) => {
        const { firstName, ...rest } = prevErrors;
        return rest;
      });
    }

    if (name === "lastName" && value.length > 20) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        lastName: `Last name cannot exceed ${20} characters`,
      }));
    } else if (name === "lastName" && value.length <= 20) {
      setErrors((prevErrors) => {
        const { lastName, ...rest } = prevErrors;
        return rest;
      });
    }

    if (name === "email" && value.length > 50) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: `Email cannot exceed ${50} characters`,
      }));
    } else if (name === "email" && value.length <= 50) {
      setErrors((prevErrors) => {
        const { email, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      phone: value,
    });

    if (!value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: "Phone number is required",
      }));
    } else if (!/^[+][1-9][0-9]{10,14}$/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: "Phone number is invalid",
      }));
    } else if (value.length > 13) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: `Phone number cannot exceed ${13} characters`,
      }));
    } else {
      setErrors((prevErrors) => {
        const { phone, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName) {
      errors.firstName = "First name is required";
    }

    if (!formData.lastName) {
      errors.lastName = "Last name is required";
    }

    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else if (!/^[+][1-9][0-9]{10,14}$/.test(formData.phone)) {
      errors.phone = "Phone number is invalid";
    } else if (formData.phone.length > 13) {
      errors.phone = `Phone number cannot exceed ${13} characters`;
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }

    if (!formData.ageRange) {
      errors.ageRange = "Please select an age range";
    }

    // if (!formData.hadAestheticTreatmentBefore) {
    //   errors.hadAestheticTreatmentBefore =
    //     "Please select if you have had aesthetic treatment before";
    // }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      try {
        const data = {
          clinicId: loggedInUser?._id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          ageRange: formData.ageRange,
          hadAestheticTreatmentBefore: formData.hadAestheticTreatmentBefore,
        };

        let response;
        if (mode === "Edit") {
          response = await ConsultationService.editConsultation(
            formData._id,
            data
          );
        }

        if (response?.data?.statusCode === 200) {
          showToast(
            "success",
            mode === "Edit"
              ? "Consultation updated successfully!"
              : "Consultation added successfully!"
          );
          navigate("/consultations");
        } else {
          showToast(
            "error",
            `Failed to ${mode === "Edit" ? "update" : "add"} consultation`
          );
        }
      } catch (error) {
        showToast("error", "Something went wrong");
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          {mode === "View"
            ? "View Consultation"
            : mode === "Edit"
            ? "Edit Consultation"
            : ""}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "right", m: 6 }}>
          <Avatar
            alt="Selected Image"
            src={formData.selectedImage}
            sx={{ width: 100, height: 100 }}
          />
        </Box>

        {Object.keys(errors).length > 0 && (
          <Box sx={{ mb: 2 }}>
            <ul style={{ color: "red" }}>
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                label="First Name"
                fullWidth
                value={formData.firstName}
                onChange={handleFormDataChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                disabled={mode === "View"}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                label="Last Name"
                fullWidth
                value={formData.lastName}
                onChange={handleFormDataChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                disabled={mode === "View"}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              {/* <PhoneInput
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handlePhoneChange}
                international
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                disabled={mode === "View"}
              /> */}
                <PhoneInput
                  disabled={mode === "View"}
                  maxLength="16"
                  international
                  countryCallingCodeEditable={false}
                  value={formData.phone}
                  className="PhoneInput"
                  defaultCountry="AU"
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    width: "100%",
                    height: "57px",
                  }}
                />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                value={formData.email}
                onChange={handleFormDataChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={mode === "View"}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="ageRange"
                select
                fullWidth
                SelectProps={{ native: true }}
                value={formData.ageRange}
                onChange={handleFormDataChange}
                error={!!errors.ageRange}
                helperText={errors.ageRange}
                disabled={mode === "View"}
              >
                <option value="">Select Age Range</option>
                <option value="18-25">18-25</option>
                <option value="26-35">26-35</option>
                <option value="36-45">36-45</option>
                <option value="46-60">46-60</option>
                <option value="60+">60+</option>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              {formData.areasOfConcern.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6">Areas of Concern:</Typography>
                  <div>
                    {formData.areasOfConcern.map((area) => (
                      <div key={area._id}>
                        <strong>{area.partName}</strong>: {area.question}
                      </div>
                    ))}
                  </div>
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData?.hadAestheticTreatmentBefore == true}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hadAestheticTreatmentBefore: e.target.checked
                          ? true
                          : false,
                      })
                    }
                    disabled={mode === "View"}
                  />
                }
                label="Had Aesthetic Treatment Before?"
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/consultations")}
            >
              Cancel
            </Button>
            {mode !== "View" && (
              <Button type="submit" variant="contained" color="primary">
                {mode === "Edit" ? "Save" : ""}
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Form;
