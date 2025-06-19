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
  MenuItem,
  Popover,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, FieldArray, Field } from "formik";
import * as Yup from "yup";
import showToast from "../../../Utils/Toast/ToastNotification";
import PackageManagementService from "../../../Services/PackageManagement/PackageManagementService";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import bodyManagementService from "../../../Services/BodyManagementService/BodyManagementService";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
const PackageForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { action, packageData } = location.state || {};
  const [packages, setPackages] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  // console.log(packages,"packages--")
  // console.log("packageData ::", packageData);

  const [formData, setFormData] = useState(packageData || {});
  const [viewMode, setViewMode] = useState(action === "View");
  const [selectedImages, setSelectedImages] = useState([]);
  // console.log("selectedImages : ", selectedImages);

  const isEditMode = !viewMode && action === "Edit";
  const isAddMode = action === "Add";

  const initialValues = {
    packageName: formData?.packageName || "",
    description: formData?.description || "",
    amount: formData?.amount || "",
    priorityLevel: formData?.priorityLevel || "",
    includes: formData?.includes || [""],
  };

  const validationSchema = Yup.object().shape({
    packageName: Yup.string().required("Package Name is required"),
    description: Yup.string()
      .required("Description is required")
      .max(500, "Description must be less than 500 characters"),
    amount: Yup.string()
      .typeError("Amount must be a string")
      .required("Amount is required"),
    priorityLevel: Yup.number()
      .required("Priority Level is required")
      .positive("Priority Level must be positive"),
    includes: Yup.array()
      .of(Yup.string().required("Include cannot be empty"))
      .min(1, "At least one Include is required"),
  });

  const handleRemoveImage = async (image, index) => {
    console.log("Removing image: ", image);
  
    // If the image is new (not saved in DB), remove it from state directly
    if (image.isNew) {
      setSelectedImages((prev) => prev.filter((_, i) => i !== index));
      return;
    }
  
    try {
      const response = await PackageManagementService.removeImage({
        packageId: packageData?._id,
        fileId: image?.file?._id,
      });
  
      console.log("API Response:", response);
  
      if (response?.data?.statusCode === 200) {
        showToast("success", "Image removed successfully!");
  
        // Remove the image from the state
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
      } else {
        showToast("error", "Failed to remove image");
      }
    } catch (error) {
      console.error("Error removing image:", error);
      showToast("error", "Something went wrong while removing the image!");
    }
  };
  

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleSubmit = async (values) => {
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("packageName", values.packageName);
      formDataToSubmit.append("description", values.description);
      formDataToSubmit.append("amount", values.amount);
      formDataToSubmit.append("priorityLevel", values.priorityLevel);
      // Append 'includes' as individual array items
      values.includes.forEach((include) => {
        formDataToSubmit.append("includes", include);
      });

      selectedImages.forEach((image) => {
        if (image.isNew) {
          formDataToSubmit.append("files", image.file);
        }
      });

      if (isEditMode) {
        try {
          const response = await PackageManagementService.updatePackage(
            formData._id,
            formDataToSubmit
          );
          if (response?.data?.statusCode === 200) {
            showToast("success", "Package updated successfully!");
            navigate("/packages-management");
          } else {
            showToast("error",response?.data?.message || "Failed to update package"
            );
          }
        } catch (error) {
          if (error.response) {
            showToast("error", error.response?.data?.message || "Something went wrong!");
          }
        }
      } else if (isAddMode) {
        try {
          const response = await PackageManagementService.addNewPackage(formDataToSubmit);
  
          if (response?.data?.statusCode === 200) {
            showToast("success", "Package added successfully!");
            navigate("/packages-management");
          } else {
            showToast("error", response?.data?.message || "Failed to add package");
          }
        } catch (error) {
          if (error.response) {
            showToast("error", error.response?.data?.message || "Something went wrong");
          }
        }
      }
    } catch (error) {
      showToast("error", "Something went wrong!");
    }
  };

  const getAllPackages = async () => {
    try {
      const getPackages = await bodyManagementService.getPackagesList();
      if (getPackages?.data?.statusCode === 200) {
        setPackages(getPackages.data.data.data);
      } else {
        showToast("error", "Failed to load packages data");
      }
    } catch (error) {
      showToast("error", "Something went wrong while loading packages data");
    }
  };

  useEffect(() => {
    getAllPackages();
    if (formData?.files) {
      setSelectedImages(
        formData.files.map((file) => ({
          file,
          isNew: false,
        }))
      );
    }
  }, [formData]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          {viewMode
            ? "View Package Details"
            : isEditMode
            ? "Edit Package Details"
            : "Add New Package"}
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="packageName"
                    label="Package Name"
                    fullWidth
                    disabled={viewMode}
                    error={touched.packageName && Boolean(errors.packageName)}
                    helperText={touched.packageName && errors.packageName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="amount"
                    label="Amount"
                    type="text"
                    fullWidth
                    disabled={viewMode}
                    error={touched.amount && Boolean(errors.amount)}
                    helperText={touched.amount && errors.amount}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="priorityLevel"
                    label="Priority Level"
                    fullWidth
                    disabled={viewMode}
                    error={
                      touched.priorityLevel && Boolean(errors.priorityLevel)
                    }
                    helperText={touched.priorityLevel && errors.priorityLevel}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* <Field
                    as={TextField}
                    name="referencePriority"
                    label="Priority Level List (For Reference)"
                    fullWidth
                    select
                    disabled={viewMode}
                    error={touched.referencePriority && Boolean(errors.referencePriority)}
                    helperText={touched.referencePriority && errors.referencePriority}
                  >
                    {packages.length > 0 ? (
                      packages
                        .filter((priority) => priority._id !== formData?._id) 
                        .sort((a, b) => a.priorityLevel - b.priorityLevel) 
                        .map((priority) => (
                          <MenuItem key={priority._id} value={priority.priorityLevel} disabled>
                            {priority.priorityLevel} - {priority.packageName}
                          </MenuItem>
                        ))
                    ) : (
                      <MenuItem disabled>No available priorities</MenuItem>
                    )}
                  </Field> */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <IconButton onClick={handleOpen}>
                      <ChecklistRtlIcon style={{ fontSize: "45px" }} />
                    </IconButton>
                    <Popover
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                      transformOrigin={{ vertical: "top", horizontal: "left" }}
                    >
                      <List>
                        {packages.length > 0 ? (
                          packages
                            .filter(
                              (priority) => priority._id !== formData?._id
                            )
                            .sort((a, b) => a.priorityLevel - b.priorityLevel)
                            .map((priority) => (
                              <ListItem key={priority._id}>
                                <ListItemText
                                  primary={`${priority.priorityLevel} - ${priority.packageName}`}
                                />
                              </ListItem>
                            ))
                        ) : (
                          <ListItem>
                            <ListItemText primary="No available priorities" />
                          </ListItem>
                        )}
                      </List>
                    </Popover>
                    <Typography variant="body1"> Priority List</Typography>
                  </div>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Field name="description">
                    {({ field, form }) => (
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Description
                        </Typography>
                        <textarea
                          {...field}
                          rows={4}
                          style={{
                            width: "100%",
                            border:
                              form.touched.description &&
                              form.errors.description
                                ? "1px solid red"
                                : "1px solid #ccc",
                            borderRadius: "4px",
                            placeholder: "Description",
                            padding: "8px",
                            fontSize: "16px",
                            resize: "vertical",
                          }}
                          disabled={viewMode}
                        />
                        {form.touched.description &&
                          form.errors.description && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{ display: "block", mt: 1 }}
                            >
                              {form.errors.description}
                            </Typography>
                          )}
                      </Box>
                    )}
                  </Field>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Includes
                  </Typography>
                  <FieldArray
                    name="includes"
                    render={(arrayHelpers) => {
                      // Ensure there's always at least one input field by adding an empty string if the array is empty
                      if (values.includes.length === 0) {
                        arrayHelpers.push("");
                      }

                      return (
                        <>
                          {values.includes.map((include, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                              }}
                            >
                              <TextField
                                fullWidth
                                value={include}
                                onChange={(e) =>
                                  setFieldValue(
                                    `includes.${index}`,
                                    e.target.value
                                  )
                                }
                                placeholder="Enter Include"
                                error={
                                  touched.includes &&
                                  errors.includes &&
                                  Boolean(errors.includes[index])
                                }
                                helperText={
                                  touched.includes &&
                                  errors.includes &&
                                  errors.includes[index]
                                }
                                disabled={viewMode}
                              />
                              {!viewMode && (
                                <IconButton
                                  onClick={() =>
                                    values.includes.length > 1
                                      ? arrayHelpers.remove(index)
                                      : showToast(
                                          "error",
                                          "At least one Include is required"
                                        )
                                  }
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              )}
                            </Box>
                          ))}
                          {!viewMode && (
                            <Button
                              startIcon={<AddCircleIcon />}
                              onClick={() => arrayHelpers.push("")}
                            >
                              Add Include
                            </Button>
                          )}
                        </>
                      );
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CameraAltIcon />}
                    disabled={viewMode}
                  >
                    Upload Images
                    <input
                      type="file"
                      multiple
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        const newImages = files.map((file) => ({
                          file,
                          isNew: true,
                        }));
                        setSelectedImages((prev) => [...prev, ...newImages]);
                      }}
                    />
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    {selectedImages.map((image, index) => (
                      <Box key={index} sx={{ position: "relative" }}>
                        <Avatar
                          src={
                            image.isNew
                              ? URL.createObjectURL(image.file)
                              : image.file.path
                          }
                          alt="Selected"
                          sx={{ width: 100, height: 100 }}
                          variant="square"
                        />
                        {!viewMode && (
                          <IconButton
                            // onClick={() =>
                            //   setSelectedImages((prev) =>
                            //     prev.filter((_, i) => i !== index)
                            //   )
                            // }
                            onClick={() => handleRemoveImage(image, index)}
                            sx={{
                              position: "absolute",
                              top: -15,
                              right: -15,
                            }}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                  </Box>
                  <label>
                    <label
                      className="advice-note"
                      style={{ color: "red", paddingRight: "10px" }}
                    >
                      Note*
                    </label>
                    Please select up to six images
                  </label>
                </Grid>
              </Grid>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/packages-management")}
                >
                  {viewMode ? "Back" : "Cancel"}
                </Button>
                {!viewMode && (
                  <Button type="submit" variant="contained" color="primary">
                    {isEditMode ? "Save" : "Add Package"}
                  </Button>
                )}
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default PackageForm;
