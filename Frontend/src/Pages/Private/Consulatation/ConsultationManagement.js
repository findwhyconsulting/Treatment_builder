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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import Pagination from "../../../Components/Pagination/Pagination";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import showToast from "../../../Utils/Toast/ToastNotification";
import { useSelector } from "react-redux";
import ConsultationService from "../../../Services/ConsultationServices/ConsultationService";

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

const ConsultationManagement = () => {
  const loggedInUser = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const [page, setPage] = useState(0);
  const [searchVal, setSearchVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20); // Rows per page dynamic change
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("desc");

  const fetchConsultations = async () => {
    try {
      setIsLoading(true);
      const data = {
        search: searchVal,
        sort: `${sortColumn}:${sortDirection}`,
        page: page + 1,
        limit: rowsPerPage,
      };

      const response = await ConsultationService.getConsultations(data);
      if (response?.data?.statusCode === 200) {
        const fetchedData = response?.data?.data?.data;
        console.log(
          fetchedData,
          "consultations data--------------------------------"
        );
        setFilteredData(fetchedData);
        setTotalRecords(response?.data?.data?.total);
      } else {
        setFilteredData({});
        showToast("error", response?.data?.message);
      }
    } catch {
      showToast("error", "Error while fetching body parts");
    } finally {
      setIsLoading(false);
    }
  };

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const formattedDate = new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Set to false for 24-hour format
  }).format(date);

  return `${formattedDate} at ${formattedTime}`;
};
  

  const toggleStatus = async (item) => {
    try {
      const updatedData = [...filteredData]; // Clone the current data
      const itemIndex = updatedData.findIndex((data) => data._id === item._id);

      if (itemIndex !== -1) {
        // Update the status locally for animation
        updatedData[itemIndex].status =
          updatedData[itemIndex].status === "active" ? "inactive" : "active";
        setFilteredData(updatedData);

        // Call the API to persist the change
        const currentStatus = updatedData[itemIndex].status;
        const params = { status: currentStatus };

        const updateStatus = await ConsultationService.editConsultation(
          item._id,
          params
        );

        if (updateStatus?.data?.statusCode === 200) {
          showToast("success", "Status updated!");
        } else {
          showToast("error", "Error while updating status");
          // Revert status in case of error
          updatedData[itemIndex].status =
            currentStatus === "active" ? "inactive" : "active";
          setFilteredData([...updatedData]);
        }
      }
    } catch (error) {
      showToast("error", "Failed to update status");
    }
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const handleSort = (column) => {
    setSortDirection(
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc"
    );
    setSortColumn(column);
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
    setPage(0);
  };

  const handleNavigation = (action, data) => {
    if (action === "View") {
      navigate(`/consultation-form/${data?._id}`, { state: { action, data } });
    }
    if (action === "Add") {
      navigate(`/consultation-form`, { state: { action } });
    }
    if (action === "Edit") {
      navigate(`/consultation-form/${data?._id}`, { state: { action, data } });
    }
  };

  const goToImagesAxis = () => {
    navigate("/images-axis");
  };

  const removeData = async (data) => {
    try {
      setIsLoading(true);
      let params = {
        isDeleted: true,
      };
      let remove = await ConsultationService.editConsultation(data._id, params);
      if (remove?.data?.statusCode === 200) {
        showToast("success", "Consultation deleted successfully");
      }
      fetchConsultations();
    } catch (error) {
      showToast("error", "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [searchVal, sortColumn, sortDirection, page, rowsPerPage]);

  return (
    <Box sx={{ display: "grid", gridTemplateRows: "auto 1fr" }}>
      <Box className="main_content_wrapper" component="main">
        <Typography variant="h6" gutterBottom>
          Consultations
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: "20px",
            mt: "10px",
            width: "100%",
          }}
        >
          {/* Search Field */}
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search patient"
            value={searchVal}
            onChange={handleSearchChange}
            sx={{ maxWidth: "400px" }}
          />

          {/* Button Section */}
          {/* <Box sx={{ display: "flex", gap: "10px" }}>
            <Button
              variant="contained"
              onClick={() => handleNavigation("Add", {})}
            >
              New Concern
            </Button>
          </Box> */}
        </Box>

        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell onClick={() => handleSort("firstName")}>
                  First Name{" "}
                  {sortColumn === "firstName" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort("lastName")}>
                  Last Name{" "}
                  {sortColumn === "lastName" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort("email")}>
                  Email{" "}
                  {sortColumn === "email" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </StyledTableCell>
                <StyledTableCell>Selected Package</StyledTableCell>
                <StyledTableCell>Phone</StyledTableCell>
                <StyledTableCell>Age Range</StyledTableCell>
                <StyledTableCell>Consultation Booked</StyledTableCell>
                <StyledTableCell>Booked on</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array.from({ length: rowsPerPage }).map((_, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell colSpan={7}>
                      <Skeleton animation="wave" />
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : filteredData?.length > 0 ? (
                filteredData.map((item, index) => (
                  <StyledTableRow key={index}>
                    {/* <StyledTableCell>{item.bodyType}</StyledTableCell>
                    <StyledTableCell>{item.part}</StyledTableCell> */}
                    <StyledTableCell>
                      {item?.firstName
                        ? item.firstName.charAt(0).toUpperCase() +
                          item.firstName.slice(1)
                        : ""}
                    </StyledTableCell>
                    <StyledTableCell>
                      {item?.lastName
                        ? item.lastName.charAt(0).toUpperCase() +
                          item.lastName.slice(1)
                        : ""}
                    </StyledTableCell>

                    <StyledTableCell>
                      {item?.email ? item.email : ""}
                    </StyledTableCell>
                    <StyledTableCell>
                      {item?.recommandation?.packageName
                        ? item?.recommandation?.packageName
                        : "-"}
                    </StyledTableCell>
                    <StyledTableCell>
                      {item?.phone ? item.phone : ""}
                    </StyledTableCell>
                    <StyledTableCell>
                      {item?.ageRange ? item.ageRange : ""}
                    </StyledTableCell>
                    <StyledTableCell>
                      {item?.isConsultationSaved ? "Yes" : "No"}
                    </StyledTableCell>
                    <StyledTableCell>
                      {item?.updatedAt
                        ? formatDate(item.updatedAt)
                        : "N/A"}
                    </StyledTableCell>

                    <StyledTableCell>
                      <Tooltip
                        title="View"
                        onClick={() => handleNavigation("View", item)}
                      >
                        <IconButton>
                          {/* <VisibilityIcon /> */}
                          <VisibilityIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                      {/* <Tooltip
                        title="Edit"
                        onClick={() => handleNavigation("Edit", item)}
                      >
                        <IconButton>
                          <EditIcon color="primary" />
                        </IconButton>
                      </Tooltip> */}
                      <Tooltip title="Delete" onClick={() => removeData(item)}>
                        <IconButton>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={7} align="center">
                    No Data Available
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

export default ConsultationManagement;
