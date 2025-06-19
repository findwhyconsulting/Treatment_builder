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
import Navbar from "../../../Components/Navbar/Navbar";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import Pagination from "../../../Components/Pagination/Pagination";
import bodyManagementService from "../../../Services/BodyManagementService/BodyManagementService";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import showToast from "../../../Utils/Toast/ToastNotification";
import { useSelector } from "react-redux";

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

const AestheticManagement = () => {
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

  const fetchBodyParts = async () => {
    try {
      setIsLoading(true);
      const data = {
        search: searchVal,
        sort: `${sortColumn}:${sortDirection}`,
        page: page + 1,
        limit: rowsPerPage,
      };
      const response = await bodyManagementService.listParts(data);
      const fetchedData = response?.data?.data?.data;
      setFilteredData(fetchedData);
      setTotalRecords(response?.data?.data?.total);
    } catch {
      showToast("error", "Error while fetching body parts");
    } finally {
      setIsLoading(false);
    }
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

        const updateStatus = await bodyManagementService.updatePartDetails(
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
      navigate(`/view-concern/${data?._id}`, { state: { action, data } });
    }
    if (action === "Add") {
      navigate(`/add-concern`, { state: { action } });
    }
    if (action === "Edit") {
      navigate(`/edit-concern/${data?._id}`, { state: { action, data } });
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
      let remove = await bodyManagementService.updatePartDetails(
        data._id,
        params
      );
      if (remove?.data?.statusCode === 200) {
        showToast("success", "Body part deleted successfully");
      }
      fetchBodyParts();
    } catch (error) {
      showToast("error", "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBodyParts();
  }, [searchVal, sortColumn, sortDirection, page, rowsPerPage]);

  return (
    <Box sx={{ display: "grid", gridTemplateRows: "auto 1fr" }}>
      <Box className="main_content_wrapper" component="main">
        <Typography variant="h6" gutterBottom>
          Concern List
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
            placeholder="Search body parts"
            value={searchVal}
            onChange={handleSearchChange}
            sx={{ maxWidth: "400px" }}
          />

          {/* Button Section */}
          {loggedInUser?.role === "admin" || loggedInUser?.role === "clinic" ?  (
            <Box sx={{ display: "flex", gap: "10px" }}>
              {/* <Button variant="contained" onClick={() => goToImagesAxis()}>
                        Images Details
                      </Button> */}
              <Button
                variant="contained"
                onClick={() => handleNavigation("Add", {})}
              >
                New Concern
              </Button>
            </Box>
          ) : (
            ""
          )}
        </Box>

        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell onClick={() => handleSort("bodyType")}>
                  Body Part{" "}
                  {sortColumn === "bodyType" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort("imagePartType")}>
                  Image Part Type{" "}
                  {sortColumn === "imagePartType" && 
                   (sortDirection === "asc" ? "▲" : "▼")}
                  </StyledTableCell>
                <StyledTableCell onClick={() => handleSort("part")}>
                  Part Name{" "}
                  {sortColumn === "part" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort("status")}>
                  Status{" "}
                  {sortColumn=== "status" && 
                  (sortDirection === "asc" ? "▲" : "▼")}
                  </StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array.from({ length: rowsPerPage }).map((_, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell colSpan={4}>
                      <Skeleton animation="wave" />
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : filteredData?.length > 0 ? (
                filteredData.map((item, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>
                      {item?.bodyType
                        ? item.bodyType.charAt(0).toUpperCase() +
                          item.bodyType.slice(1)
                        : ""}
                    </StyledTableCell>
                    <StyledTableCell>
                      {item.imagePartType
                       ? item.imagePartType.charAt(0).toUpperCase() +
                          item.imagePartType.slice(1) : ""}
                      </StyledTableCell>
                    <StyledTableCell>
                      {item?.part
                        ? item.part.charAt(0).toUpperCase() + item.part.slice(1)
                        : ""}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Switch
                        checked={item.status === "active"}
                        onChange={() => toggleStatus(item)}
                        color="primary"
                      />
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
                      <Tooltip
                        title="Edit"
                        onClick={() => handleNavigation("Edit", item)}
                      >
                        <IconButton>
                          {/* <EditIcon /> */}
                          <EditIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                      {/* {loggedInUser?.role === "admin" ? ( */}
                        <Tooltip
                          title="Delete"
                          onClick={() => removeData(item)}
                        >
                          <IconButton>
                            {/* <DeleteIcon /> */}
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      {/* ) : ( */}
                        {/* "" */}
                      {/* )} */}
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={4} align="center">
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

export default AestheticManagement;
