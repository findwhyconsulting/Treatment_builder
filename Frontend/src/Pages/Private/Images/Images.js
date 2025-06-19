import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Stack,
  MenuItem,
  Select,
  Typography,
  Box,
  IconButton,
  Grid,
  TextField,
  Paper,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageManagementService from "../../../Services/ImagesManagementService/ImageManagementService";
import bodyManagementService from "../../../Services/BodyManagementService/BodyManagementService";
import showToast from "../../../Utils/Toast/ToastNotification";
import "./Images.css";

const Images = () => {
  const [imageList, setImageList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [mouseCoordinates, setMouseCoordinates] = useState({ x: "", y: "" });
  const [regionName, setRegionName] = useState("");
  const [selectedDotIndex, setSelectedDotIndex] = useState(null);
  const [currentPartName, setCurrentPartName] = useState("");
  const [availableParts, setAvailableParts] = useState([]);
  const [selectedPartName, setSelectedPartName] = useState("");
  const [dashedLinePositions, setDashedLinePositions] = useState({
    upper: 33, // Default 33% from top
    mid: 66, // Default 66% from top
  });
  const imgRef = useRef(null);

  const getAllImages = async () => {
    try {
      const response = await ImageManagementService.getImages();
      if (response?.data?.statusCode === 200) {
        setImageList(response?.data?.data?.data || []);
      } else {
        showToast("error", "Images list fetching error");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      showToast("error", "Images fetching error");
    }
  };

  useEffect(() => {
    getAllImages();
    fetchParts(imageType);
  }, [imageType]);

  const fetchParts = async (type) => {
    try {
      const response = await bodyManagementService.getParts({ search: type });
      if (response?.data?.statusCode === 200) {
        setAvailableParts(response.data.data.data || []);
      }
    } catch (error) {
      showToast("error", "Failed to load parts data");
      console.error(error);
    }
  };

  const handleImageSelect = (image) => {
    setImageType(image?.type);
    setSelectedImage(image);
    setSelectedDotIndex(null);
    setCurrentPartName("");
    setMouseCoordinates({ x: "", y: "" });
    setSelectedPartName("");

    // Load dashed line positions from the database or fallback to defaults
    const { upper, mid } = image.dashedLinePositions || { upper: 33, mid: 66 };
    setDashedLinePositions({ upper, mid });
  };

  const coordinate = (event) => {
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      const x = Math.round(((event.clientX - rect.left) / rect.width) * 100);
      const y = Math.round(((event.clientY - rect.top) / rect.height) * 100);
      setMouseCoordinates({ x, y });
      setCurrentPartName("");
      setSelectedPartName("");
    }
  };

  const handleDotClick = (index) => {
    setSelectedDotIndex(index);
    const partName = selectedImage.parts[index]?.partName || "";
    setCurrentPartName(partName);
  };

  const handleLinePositionChange = (line, value) => {
    setDashedLinePositions((prev) => ({
      ...prev,
      [line]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      coordinates: mouseCoordinates,
      partName: selectedPartName,
      regionName,
      uniqueCode: selectedImage.uniqueCode,
    };

    try {
      const response = await ImageManagementService.updateImages(formData);
      if (response?.data?.statusCode === 200) {
        showToast("success", "Coordinates and part added successfully.");
        setRegionName("");
        setSelectedDotIndex(null);

        const refreshedImages = await ImageManagementService.getImages();
        setImageList(refreshedImages?.data?.data?.data || []);
        const updatedImage = refreshedImages?.data?.data?.data?.find(
          (img) => img.uniqueCode === selectedImage.uniqueCode
        );
        setSelectedImage(updatedImage);
      } else {
        showToast("error", "Failed to add coordinates and part.");
      }
    } catch (error) {
      console.error("Error submitting coordinates:", error);
      showToast("error", "Error submitting coordinates.");
    }
  };

  const saveDashedLinePositions = async () => {
    try {
      const updatedImage = {
        uniqueCode : selectedImage.uniqueCode,
        dashedLinePositions,
      };
      const response = await ImageManagementService.updateDashedPartInImage(updatedImage);
      if (response?.data?.statusCode === 200) {
        showToast("success", "Dashed line positions updated successfully.");
        getAllImages(); // Refresh images
      } else {
        showToast("error", "Failed to update dashed line positions.");
      }
    } catch (error) {
      console.error("Error updating dashed line positions:", error);
      showToast("error", "Error updating dashed line positions.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Select an Image
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {imageList.length > 0 ? (
          imageList.map((image) => (
            <Grid item key={image._id} xs={6} sm={4} md={2}>
              <Paper
                elevation={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 1,
                  cursor: "pointer",
                }}
                onClick={() => handleImageSelect(image)}
              >
                <img
                  src={image.imageUrl}
                  alt={image.uniqueCode}
                  style={{ width: "100%", borderRadius: 8 }}
                />
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography>No images available</Typography>
        )}
      </Grid>

      {selectedImage && (
        <Box>
          <Typography variant="h5" align="center" gutterBottom>
            Identify Your Goals
          </Typography>

          <Box
            sx={{
              position: "relative",
              width: 450,
              height: 450,
              margin: "30px auto",
              // border: "2px solid green",
              // borderRadius: 23,
            }}
          >
            <img
              ref={imgRef}
              src={selectedImage.imageUrl}
              alt="Selected Face"
              style={{ width: "100%", height: "100%" }}
              onClick={coordinate}
            />

            {/* Dashed lines */}
            <Box
              sx={{
                position: "absolute",
                top: `${dashedLinePositions.upper}%`,
                left: 0,
                width: "100%",
                height: 2,
                backgroundColor: "transparent",
                borderTop: "2px dashed black",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: `${dashedLinePositions.mid}%`,
                left: 0,
                width: "100%",
                height: 2,
                backgroundColor: "transparent",
                borderTop: "2px dashed black",
              }}
            />

            {/* Existing dots */}
            {selectedImage.parts?.map((part, index) => (
              <Box
                key={index}
                onClick={() => handleDotClick(index)}
                sx={{
                  position: "absolute",
                  top: `${part.coordinates.y}%`,
                  left: `${part.coordinates.x}%`,
                  width: 10,
                  height: 10,
                  backgroundColor:
                    selectedDotIndex === index ? "blue" : "black",
                  borderRadius: "50%",
                  cursor: "pointer",
                  boxShadow:
                    selectedDotIndex === index
                      ? "0 0 10px 2px rgba(0, 0, 255, 0.8)"
                      : "none",
                }}
              ></Box>
            ))}
          </Box>

          <Typography variant="h6" align="center" sx={{ mt: 3 }}>
            Adjust Dashed Line Positions
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label="Upper Line (%)"
                type="number"
                value={dashedLinePositions.upper}
                onChange={(e) =>
                  handleLinePositionChange("upper", Number(e.target.value))
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Mid Line (%)"
                type="number"
                value={dashedLinePositions.mid}
                onChange={(e) =>
                  handleLinePositionChange("mid", Number(e.target.value))
                }
                fullWidth
              />
            </Grid>
          </Grid>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={saveDashedLinePositions}
            >
              Save Dashed Line Positions
            </Button>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ my: 3 }}>
            <Typography variant="h6">Mouse Coordinates</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="X-coordinate"
                  value={mouseCoordinates.x}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Y-coordinate"
                  value={mouseCoordinates.y}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Part Name</Typography>
                <Select
                  value={selectedPartName}
                  onChange={(e) => setSelectedPartName(e.target.value)}
                  fullWidth
                >
                  {availableParts.map((part) => (
                    <MenuItem key={part._id} value={part.part}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Typography sx={{ flexGrow: 1 }}>
                          {part.part}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton size="small">
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Images;
