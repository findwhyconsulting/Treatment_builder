import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  IconButton,
  Button,
  TextField,
  Skeleton,
  Tooltip,
  Switch,
  Avatar,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import showToast from "../../../Utils/Toast/ToastNotification";
import Pagination from "../../../Components/Pagination/Pagination";
import { useNavigate } from "react-router-dom";
import ClinicManagementService from "../../../Services/ClinicManagement/ClinicManagementService";
import { useDispatch } from "react-redux";
import { isLoggedInAsClinic } from "../../../Redux/Slice/LoginAsClinic/LoginAsClinicSlice";
import { useSelector } from "react-redux";
import { setProfile } from "../../../Redux/Slice/Profile/ProfileSlice";
import authService from "../../../Services/Login/LoginService";

// Styled Table Cell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: "8px 8px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "8px 8px",
  },
}));

// Styled Table Row
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const ClinicManagement = () => {
  const adminLoginAsClinic = useSelector(
    (state) => state?.adminSessionAsClinic
  );
  // console.log("adminLoginAsClinic___", adminLoginAsClinic);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [clinicData, setClinicData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchVal, setSearchVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchClinics = async () => {
    try {
      setIsLoading(true);
      const params = {
        search: searchVal,
        role: "clinic",
        page: page + 1,
        limit: rowsPerPage,
      };
      const response = await ClinicManagementService.listClinics(params);
      const fetchedData = response?.data?.data?.data || [];
      setClinicData(fetchedData);
      setTotalRecords(response?.data?.data?.total || 0);
    } catch (error) {
      showToast("error", "Error fetching clinics");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(e.target.value);
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
    setPage(0);
  };

  const handleNavigation = (action, clinic) => {
    // console.log( 'action', action, 'clinic', clinic );

    const state = { action, clinic };
    if (action === "View") navigate(`/view-clinic/${clinic._id}`, { state });
    if (action === "Add") navigate(`/add-clinic`, { state });
    if (action === "Edit") navigate(`/edit-clinic/${clinic._id}`, { state });
  };

  const handleDeleteClinic = async (clinic) => {
    try {
      await ClinicManagementService.updateClinic(clinic._id, {
        isDeleted: true,
      });
      showToast("success", "Clinic deleted successfully");
      fetchClinics();
    } catch (error) {
      showToast("error", "Failed to delete clinic");
      console.error(error);
    }
  };

  const handleLoginClinic = async (clinic) => {
    try {
      const loginAsClinic = await ClinicManagementService.adminLoginToClinic(
        clinic
      );
      if (loginAsClinic?.data?.statusCode === 200) {
        // Set the clinic session state
        dispatch(isLoggedInAsClinic(loginAsClinic?.data?.data));

        // Fetch the profile data for the clinic session
        const profile = await authService.profile();
        if (profile?.data?.statusCode === 200) {
          dispatch(setProfile(profile?.data?.data));

          // Redirect to the clinic dashboard
          // navigate("/dashboard");
          window.location.href = "/dashboard";
        }

        showToast("success", loginAsClinic?.data?.message);
      } else {
        showToast("error", "Failed to login as clinic");
      }
    } catch (error) {
      showToast("error", "Something went wrong during login");
      console.error(error);
    }
  };

  const handleToggleStatus = async (clinic) => {
    try {
      // Toggle the status value
      const updatedStatus = clinic.status === true ? false : true;

      // Send the update request to the server
      await ClinicManagementService.updateClinic(clinic._id, {
        status: updatedStatus,
      });

      // Update the local state
      setClinicData((prevData) =>
        prevData.map((item) =>
          item._id === clinic._id ? { ...item, status: updatedStatus } : item
        )
      );

      // Show success notification
      showToast("success", `Clinic status updated successfully`);
    } catch (error) {
      showToast("error", "Failed to update clinic status");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, [searchVal, page, rowsPerPage]);

  return (
    <Box sx={{ display: "grid", gridTemplateRows: "auto 1fr" }}>
      <Box className="main_content_wrapper" component="main">
        <Typography variant="h6" gutterBottom>
          Clinic Management
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            mb: "20px",
            mt: "10px",
          }}
        >
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search clinics"
            value={searchVal}
            onChange={handleSearchChange}
            sx={{ width: "34%" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleNavigation("Add", {})}
          >
            New Clinic
          </Button>
        </Box>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell>Profile</StyledTableCell>
                <StyledTableCell>First Name</StyledTableCell>
                <StyledTableCell>Last Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Clinic Name</StyledTableCell>
                <StyledTableCell>Is Active</StyledTableCell>
                <StyledTableCell>Role</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array.from({ length: rowsPerPage }).map((_, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell colSpan={8}>
                      <Skeleton animation="wave" />
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : clinicData.length > 0 ? (
                clinicData.map((clinic) => (
                  <StyledTableRow key={clinic?._id}>
                    <StyledTableCell>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Avatar
                          alt="Profile Image"
                          src={clinic?.profilePicture?.path || "/default-avatar.jpg"}
                          sx={{ width: 40, height: 40 }}
                        />
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell>
                      {/* {clinic?.firstName} */}
                      {clinic?.firstName
                        ? clinic?.firstName.charAt(0).toUpperCase() +
                          clinic?.firstName.slice(1)
                        : ""}
                    </StyledTableCell>
                    <StyledTableCell>
                      {/* {clinic?.lastName} */}
                      {clinic?.lastName
                        ? clinic?.lastName.charAt(0).toUpperCase() +
                          clinic?.lastName.slice(1)
                        : ""}
                    </StyledTableCell>
                    <StyledTableCell>{clinic?.email}</StyledTableCell>
                    <StyledTableCell>{clinic?.userName}</StyledTableCell>
                    <StyledTableCell>
                      <Switch
                        checked={clinic?.status === true} // Adjust based on the status value
                        onChange={() => handleToggleStatus(clinic)}
                        color="primary"
                      />
                    </StyledTableCell>
                    <StyledTableCell>{clinic?.role}</StyledTableCell>
                    <StyledTableCell>
                      <Tooltip title="View">
                        <IconButton
                          onClick={() => handleNavigation("View", clinic)}
                        >
                          <VisibilityIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleNavigation("Edit", clinic)}
                        >
                          <EditIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDeleteClinic(clinic)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Login Clinic">
                        <IconButton
                          onClick={() => handleLoginClinic(clinic?._id)}
                        >
                          <VpnKeyIcon style={{ color: "rgb(32 211 29)" }} />
                        </IconButton>
                      </Tooltip>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={6} align="center">
                    No Clinics Available
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={totalRecords}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>
    </Box>
  );
};

export default ClinicManagement;
