import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Container,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import bodyManagementService from "../../../Services/BodyManagementService/BodyManagementService";
import showToast from "../../../Utils/Toast/ToastNotification";
import "./AddForm.css";
import { useSelector } from "react-redux";

const ConcernForm = () => {
  const loggedInUser = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();
  const location = useLocation();
  const { action, data } = location.state || {};
  const [viewMode, setViewMode] = useState(action === "View");
  const [formKey, setFormKey] = useState(0);
  const [availableParts, setAvailableParts] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [newPart, setNewPart] = useState("");
  const [bodyType, setBodyType] = useState(data?.bodyType || "");
  const [imagePartType, setImagePartType] = useState("");

  const [packages, setPackages] = useState([]);
  const imagePartOptions = {
    face: ["upperFace", "midFace", "lowerFace"],
    body: ["upperBody", "midBody", "lowerBody"],
  };

  // Predefined parts for face image part types
  const predefinedFaceParts = {
    upperFace: ["Forehead", "Eyebrows", "Glabella", "Eyes", "Crows feet", "Temples"],
    midFace: ["Nose", "Cheekbones", "Cheeks", "Laser-labial folds"],
    lowerFace: ["Lips", "Chin", "Jaw", "Perioral (mouth)"]
  };

  const isEditMode = !viewMode && action === "Edit";
  const isAddMode = action === "Add";

  const initialValues = {
    bodyType: data?.bodyType || "",
    part: data?.part || "",
    imagePartType: data?.imagePartType || "",
    question: data?.question?.map((q) => ({
      text: q.text || "",
      packageNumber: q.packageIds?.map((pkg) => pkg.packageName) || [],
    })) || [{ text: "", packageNumber: [] }],
  };

  const validationSchema = Yup.object().shape({
    bodyType: Yup.string()
      .required("Body Type is required")
      .oneOf(["face", "body"], "Body Type must be either Face or Body"),
    part: Yup.string().required("Part is required"),
    imagePartType: Yup.string()
      .required("Image Part Type is required")
      .oneOf(
        [
          "upperFace",
          "midFace",
          "lowerFace",
          "upperBody",
          "midBody",
          "lowerBody",
        ],
        "Invalid Image Part Type"
      ),
    question: Yup.array()
      .of(
        Yup.object().shape({
          text: Yup.string()
            .required("Question text is required")
            .min(3, "Question must be at least 3 characters")
            .max(200, "Question must be less than 200 characters"),
          packageNumber: Yup.array()
            .of(Yup.string())
            .min(1, "At least one package must be selected")
            .required("Packages are required for each question"),
        })
      )
      .min(1, "At least one question is required"),
  });

  const fetchParts = async (type) => {
    try {
      const response = await bodyManagementService.getParts({ search: type });
      if (response?.data?.statusCode === 200) {
        setAvailableParts(response.data.data.data);
      }
    } catch (error) {
      showToast("error", "Failed to load parts data");
      console.error(error);
    }
  };

  // Get available parts based on bodyType and imagePartType
  const getAvailableParts = () => {
    if (bodyType === "face" && imagePartType && predefinedFaceParts[imagePartType]) {
      // For face types, return predefined parts based on imagePartType
      return predefinedFaceParts[imagePartType].map((part, index) => ({
        _id: `predefined_${imagePartType}_${index}`,
        part: part,
        bodyType: bodyType,
        isPredefined: true
      }));
    } else if (bodyType === "body") {
      // For body types, return parts from database
      return availableParts;
    } else {
      return [];
    }
  };

  const capitalize = (text) => {
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getAllPackages = async () => {
    try {
      let data = {
        status: "active",
      };
      const getPackages = await bodyManagementService.getPackagesList(data);
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
    if (bodyType) fetchParts(bodyType);
    getAllPackages();
  }, [bodyType]);

  const handleBodyTypeChange = (event, setFieldValue) => {
    const selectedBodyType = event.target.value;
    setBodyType(selectedBodyType);
    setImagePartType(""); // Reset imagePartType on bodyType change
    setFieldValue("bodyType", selectedBodyType);
    setFieldValue("imagePartType", ""); // Reset imagePartType in form
  };

  const handleDialogOpen = (part = null) => {
    setEditingPart(part);
    setNewPart(part ? part.part : "");
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingPart(null);
    setNewPart("");
  };

  const handleAddOrEditPart = async () => {
    console.log("is in or not");

    if (!newPart) {
      showToast("error", "Part name is required!");
      return;
    }

    try {
      if (editingPart) {
        const responseEdit = await bodyManagementService.updatePart(
          editingPart._id,
          {
            bodyType,
            part: newPart,
          }
        );
        if (responseEdit?.data?.statusCode === 200) {
          showToast("success", "Part updated successfully!");
        } else {
          showToast(
            "error",
            responseEdit?.data?.message || "Failed to update part"
          );
        }
      } else {
        console.log("add concern");

        const responseAdd = await bodyManagementService.addPart({
          bodyType,
          part: newPart,
        });
        console.log(responseAdd);

        if (responseAdd?.data?.statusCode === 200) {
          showToast("success", "Part added successfully!");
        } else {
          showToast(
            "error",
            responseAdd?.data?.message || "Failed to Add part"
          );
        }
      }
      fetchParts(bodyType);
      handleDialogClose();
    } catch (error) {
      showToast("error", "Failed to process request");
      console.error(error, "erous request");
    }
  };

  const handleDeletePart = async (part) => {
    try {
      let remove = await bodyManagementService.updatePart(part._id, {
        isDeleted: true,
      });
      if (remove?.data?.statusCode === 200) {
        showToast("success", "Part deleted successfully!");
      }
      fetchParts(bodyType);
    } catch (error) {
      showToast("error", "Failed to delete part");
      console.error(error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        bodyType: values.bodyType,
        part: values.part,
        imagePartType: values.imagePartType,
        question: values.question.map(({ text, packageNumber }) => ({
          text,
          packageIds: packageNumber.map((pkgName) => {
            const pkg = packages.find((pkg) => pkg.packageName === pkgName);
            return pkg?._id || null;
          }),
        })),
      };

      if (isEditMode) {
        const response = await bodyManagementService.updatePartDetails(
          data._id,
          payload
        );
        if (response?.data?.statusCode === 200) {
          showToast("success", "Concern updated successfully!");
          navigate("/aesthetic-management");
        } else if (response?.data?.statusCode === 226) {
          showToast("error", `Duplicate entry found for part: ${payload.part}`);
        } else {
          showToast(
            "error",
            response?.data?.message || "Failed to update concern"
          );
        }
      } else if (isAddMode) {
        const response = await bodyManagementService.addBodyAndPartData(
          payload
        );
        if (response?.data?.statusCode === 200) {
          showToast("success", "Concern added successfully!");
          navigate("/aesthetic-management");
        } else if (response?.data?.statusCode === 226) {
          showToast("error", `Duplicate entry found for part: ${payload.part}`);
        } else {
          showToast(
            "error",
            response?.data?.message || "Failed to add concern"
          );
        }
      }
    } catch (error) {
      showToast("error", "Failed to process request");
    } finally {
      setSubmitting(false);
    }
  };

  const switchToEditMode = () => {
    setViewMode(false); // Disable view mode
    setFormKey((prevKey) => prevKey + 1); // Force re-initialization of Formik
    navigate(`/edit-concern/${data._id}`, {
      state: { action: "Edit", data },
    });
  };

  return (
    <Box
      className="concern-box"
      sx={{ display: "grid", gridTemplateRows: "auto 1fr", mt: "80px" }}
    >
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Paper elevation={4} sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            {viewMode
              ? "View Concern"
              : isEditMode
              ? "Edit Concern"
              : "Add New Concern"}
          </Typography>
          <Formik
            key={formKey}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched, isSubmitting, values, setFieldValue }) => (
              <Form>
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel>Body Type</InputLabel>
                  <Field
                    as={Select}
                    name="bodyType"
                    label="Body Type"
                    value={values.bodyType}
                    onChange={(e) => handleBodyTypeChange(e, setFieldValue)}
                    disabled={viewMode}
                    error={touched.bodyType && Boolean(errors.bodyType)}
                    renderValue={(selected) => capitalize(selected)}
                  >
                    <MenuItem value="face">Face</MenuItem>
                    <MenuItem value="body">Body</MenuItem>
                  </Field>
                </FormControl>

                {values.bodyType && (
                  <>
                    <FormControl fullWidth margin="normal" variant="outlined">
                      <InputLabel>Image Part Type</InputLabel>
                      <Field
                        as={Select}
                        name="imagePartType"
                        label="Image Part Type"
                        value={values.imagePartType}
                        onChange={(e) => {
                          const selectedImagePartType = e.target.value;
                          setImagePartType(selectedImagePartType);
                          setFieldValue("imagePartType", selectedImagePartType);
                        }}
                        disabled={viewMode} // Disable if bodyType is not selected
                        error={
                          touched.imagePartType && Boolean(errors.imagePartType)
                        }
                      >
                        {(imagePartOptions[values.bodyType] || []).map(
                          (option) => (
                            <MenuItem key={option} value={option}>
                              {capitalize(option)}
                            </MenuItem>
                          )
                        )}
                      </Field>
                      {touched.imagePartType && errors.imagePartType && (
                        <Typography color="error">
                          {errors.imagePartType}
                        </Typography>
                      )}
                    </FormControl>
                    <FormControl fullWidth margin="normal" variant="outlined">
                      <InputLabel>Body Part</InputLabel>
                      <Field
                        as={Select}
                        name="part"
                        label="Body Part"
                        value={values.part}
                        onChange={(e) => setFieldValue("part", e.target.value)}
                        renderValue={(selected) => capitalize(selected)}
                        disabled={viewMode}
                        error={touched.part && Boolean(errors.part)}
                      >
                        {/* Show Add Part button only for body types */}
                        {bodyType === "body" && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              mt: 2,
                              p: 1,
                            }}
                          >
                            <Button
                              startIcon={<AddCircle />}
                              onClick={() => handleDialogOpen()}
                              disabled={!bodyType}
                              size="small"
                            >
                              Add New Part
                            </Button>
                          </Box>
                        )}
                        {getAvailableParts().map((part) => (
                          <MenuItem key={part._id} value={part.part}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%", // Ensure full width for proper alignment
                              }}
                            >
                              <Typography sx={{ flexGrow: 1 }}>
                                {part.part}
                              </Typography>
                              {/* Show edit/delete buttons only for body parts (not predefined face parts) */}
                              {!part.isPredefined && (
                                <Box
                                  sx={{
                                    marginLeft: "auto", // Push the icons to the right
                                    display: "flex",
                                    gap: 1, // Space between icons
                                    alignItems: "center",
                                  }}
                                >
                                  <IconButton
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent dropdown close
                                      handleDialogOpen(part);
                                    }}
                                    size="small"
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    color="error"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent dropdown close
                                      handleDeletePart(part);
                                    }}
                                    size="small"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                              )}
                            </Box>
                          </MenuItem>
                        ))}
                      </Field>
                    </FormControl>
                  </>
                )}

                <FieldArray
                  name="question"
                  render={({ push, remove }) => (
                    <div>
                      {values.question.map((question, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            mb: 3,
                          }}
                        >
                          {/* Question Field */}
                          <Field
                            as={TextField}
                            name={`question[${index}].text`}
                            label={`Question ${index + 1}`}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            disabled={viewMode}
                            sx={{ flex: 2 }}
                            error={
                              touched.question?.[index]?.text &&
                              Boolean(errors.question?.[index]?.text)
                            }
                            helperText={
                              touched.question?.[index]?.text &&
                              errors.question?.[index]?.text
                            }
                          />

                          {/* Packages Selection Field */}
                          <FormControl
                            fullWidth
                            margin="normal"
                            sx={{ flex: 3 }}
                            error={
                              touched.question?.[index]?.packageNumber &&
                              Boolean(errors.question?.[index]?.packageNumber)
                            }
                          >
                            <InputLabel id={`package-select-${index}`}>
                              Select Packages
                            </InputLabel>
                            <Select
                              multiple
                              label="Select Packages"
                              name={`question[${index}].packageNumber`}
                              value={
                                values.question[index]?.packageNumber?.filter(
                                  (pkgName) =>
                                    packages.some(
                                      (pkg) =>
                                        pkg.packageName === pkgName &&
                                        pkg.status === "active" &&
                                        !pkg.isDeleted
                                    )
                                ) || []
                              }
                              onChange={(e) => {
                                if (!viewMode) {
                                  const selectedPackages = e.target.value;
                                  const filteredPackages =
                                    selectedPackages.filter((pkgName) =>
                                      packages.some(
                                        (pkg) =>
                                          pkg.packageName === pkgName &&
                                          pkg.status === "active" &&
                                          !pkg.isDeleted
                                      )
                                    );
                                  setFieldValue(
                                    `question[${index}].packageNumber`,
                                    filteredPackages
                                  );
                                }
                              }}
                              renderValue={(selected) =>
                                selected.length
                                  ? selected.join(", ")
                                  : "No package selected"
                              }
                              labelId={`package-select-${index}`}
                              disabled={viewMode}
                              sx={{
                                "& .MuiSelect-select": {
                                  whiteSpace: "normal",
                                  wordBreak: "break-word",
                                  minHeight: "40px",
                                  height: "auto",
                                  padding: "8px 14px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  backgroundColor: viewMode
                                    ? "#f5f5f5"
                                    : "inherit",
                                },
                              }}
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxWidth: "100%",
                                    width: "auto",
                                    maxHeight: 300,
                                  },
                                },
                              }}
                            >
                              {packages.length > 0 ? (
                                packages
                                  .filter(
                                    (pkg) =>
                                      pkg.status === "active" && !pkg.isDeleted
                                  ) 
                                  .map((pkg) => (
                                    <MenuItem
                                      key={pkg._id}
                                      value={pkg.packageName}
                                    >
                                      <Checkbox
                                        checked={values.question[
                                          index
                                        ]?.packageNumber?.includes(
                                          pkg.packageName
                                        )}
                                      />
                                      <Typography>{pkg.packageName}</Typography>
                                    </MenuItem>
                                  ))
                              ) : (
                                <MenuItem disabled>
                                  <Typography>
                                    No active packages available
                                  </Typography>
                                </MenuItem>
                              )}
                            </Select>

                            {touched.question?.[index]?.packageNumber &&
                              errors.question?.[index]?.packageNumber && (
                                <Typography color="error">
                                  {errors.question[index]?.packageNumber}
                                </Typography>
                              )}
                          </FormControl>
                          {/* <FormControl
                            fullWidth
                            margin="normal"
                            sx={{ flex: 3 }}
                            error={
                              touched.question?.[index]?.packageNumber &&
                              Boolean(errors.question?.[index]?.packageNumber)
                            }
                          >
                            <InputLabel id={`package-select-${index}`}>
                              Select Packages
                            </InputLabel>
                            <Select
                              multiple
                              label="Select Packages"
                              name={`question[${index}].packageNumber`}
                              value={
                                values.question[index]?.packageNumber || []
                              }
                              onChange={(e) => {
                                const selectedPackages = e.target.value;
                                setFieldValue(
                                  `question[${index}].packageNumber`,
                                  selectedPackages
                                );
                              }}
                              renderValue={(selected) =>
                                selected.length
                                  ? selected.join(", ") // Display selected package names
                                  : "No package selected"
                              }
                              labelId={`package-select-${index}`}
                              disabled={viewMode}
                            >
                              {packages.length > 0 ? (
                                packages.map((pkg) => (
                                  <MenuItem
                                    key={pkg._id}
                                    value={pkg.packageName}
                                  >
                                    <Checkbox
                                      checked={values.question[
                                        index
                                      ]?.packageNumber?.includes(
                                        pkg.packageName
                                      )}
                                    />
                                    <Typography>{pkg.packageName}</Typography>
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem disabled>
                                  <Typography>No packages available</Typography>
                                </MenuItem>
                              )}
                            </Select>

                            {touched.question?.[index]?.packageNumber &&
                              errors.question?.[index]?.packageNumber && (
                                <Typography color="error">
                                  {errors.question[index]?.packageNumber}
                                </Typography>
                              )}
                          </FormControl> */}

                          {/* Remove Question Button */}
                          {!viewMode && values.question.length > 1 && (
                            <IconButton
                              color="error"
                              onClick={() => remove(index)}
                              sx={{ alignSelf: "center" }}
                            >
                              <RemoveCircle />
                            </IconButton>
                          )}
                        </Box>
                      ))}

                      {/* Add Question Button */}
                      {!viewMode && (
                        <Button
                          variant="outlined"
                          startIcon={<AddCircle />}
                          onClick={() =>
                            push({
                              text: "",
                              packageNumber: [], // Initialize empty packageNumber
                            })
                          }
                          sx={{ mt: 2 }}
                        >
                          Add Question
                        </Button>
                      )}
                    </div>
                  )}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 4,
                  }}
                >
                  {viewMode ? (
                    <>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate("/aesthetic-management")}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={switchToEditMode}
                      >
                        Edit
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate("/aesthetic-management")}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                      >
                        {/* {isEditMode ? "Edit Concern" : "Add Concern"} */}
                        {isEditMode ? "Save" : "Save"}
                      </Button>
                    </>
                  )}
                </Box>
              </Form>
            )}
          </Formik>
          <Dialog open={dialogOpen} onClose={handleDialogClose}>
            <DialogTitle>
              {editingPart ? "Edit Part" : "Add New Part"}
            </DialogTitle>
            <DialogContent>
              <TextField
                label="Part Name"
                value={newPart}
                onChange={(e) => setNewPart(e.target.value)}
                fullWidth
                margin="dense"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddOrEditPart}
              >
                {/* {editingPart ? "Edit" : "Add"} */}
                {editingPart ? "Save" : "Save"}
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </Box>
  );
};

export default ConcernForm;
