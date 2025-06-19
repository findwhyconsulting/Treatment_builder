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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
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
import { useDispatch } from "react-redux";
import { isLoggedInAsClinic } from "../../../Redux/Slice/LoginAsClinic/LoginAsClinicSlice";
import { useSelector } from "react-redux";
import { setProfile } from "../../../Redux/Slice/Profile/ProfileSlice";
import authService from "../../../Services/Login/LoginService";
import PackageManagementService from "../../../Services/PackageManagement/PackageManagementService";

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

const PackageManagement = () => {
  const loggedInUser = useSelector((state) => state?.user?.user);

  const adminLoginAsClinic = useSelector(
    (state) => state?.adminSessionAsClinic
  );
  // console.log("adminLoginAsClinic___", adminLoginAsClinic);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [packagesData, setPackagesData] = useState([]);

  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchVal, setSearchVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState("priorityLevel");
  const [sortOrder, setSortOrder] = useState("asc");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [affectedBodyParts, setAffectedBodyParts] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  console.log(affectedBodyParts, "affectedBodyParts------------");

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const params = {
        search: searchVal,
        page: page + 1,
        limit: rowsPerPage,
        sort: `${sortField}:${sortOrder}`,
      };
      const response = await PackageManagementService.getPackages(params);
      if (response?.data?.statusCode === 200) {
        const fetchedData = response?.data?.data?.data || [];
        setPackagesData(fetchedData);
        setTotalRecords(response?.data?.data?.total || 0);
      } else {
        setPackagesData([]);
        setTotalRecords(0 || 0);
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        return;
      }
      showToast("error", "Error fetching clinics");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
    fetchPackages(field, newSortOrder);
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
  
  const handleDelete = async (item) => {
    try {

      setAffectedBodyParts([]);
      setItemToUpdate(null);
  
      console.log("Fetching affected body parts for:", item.packageName);
      const response = await PackageManagementService.affectedBodyParts(item._id);
  
      const affectedParts = response?.data?.data?.affectedBodyParts || [];  
      setDialogOpen(true); 
      setAffectedBodyParts(affectedParts); 
      setItemToUpdate(item); 
  
      if (affectedParts.length === 0) {
        await openUpdateStatusDialog(item); 
      }
    } catch (error) {
      console.error("Error checking body association before delete:", error);
      showToast("error", "Failed to fetch associated body parts");
    } finally {
      // setIsLoading(false);
    }
  };
  
  const handleDeletePackage = (item) => {
    setDeleteItem(item);
    handleDelete(item);
    // setDialogOpen(true);
  };
  

  const handleToggleStatus = async (item) => {
    try {
      // setIsLoading(true);

      const newStatus = item.status === "inactive" ? "active" : "inactive";

      if (newStatus === "active") {
        await updateStatus(item, newStatus);
        return;
      }

      setAffectedBodyParts([]);
      setItemToUpdate(null);

      console.log("Fetching affected body parts for:", item.packageName);
      const response = await PackageManagementService.affectedBodyParts(
        item._id
      );

      const affectedParts = response?.data?.data?.affectedBodyParts || [];

      console.log("API Response:", affectedParts);

      setAffectedBodyParts((prev) => [...affectedParts]);
      setItemToUpdate(item);

      if (affectedParts.length > 0) {
        setDialogOpen(true);
      } else {
        await openUpdateStatusDialog(item);
      }
    } catch (error) {
      console.error("Error fetching affected body parts:", error);
      showToast("error", "Failed to fetch associated body parts");
    } finally {
      // setIsLoading(false);
    }
  };

  const openUpdateStatusDialog = async (item) => {
    setItemToUpdate(item);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!deleteItem) return;

      await PackageManagementService.deletePackage(deleteItem._id, {
        isDeleted: true,
      });

      showToast("success", "Package deleted successfully");
      fetchPackages();
    } catch (error) {
      showToast("error", "Failed to delete item");
      console.error(error);
    } finally {
      setDialogOpen(false);
      setDeleteItem(null);
    }
  };

  const updateStatus = async (item) => {
    if (isUpdating) return;
    try {
      setIsUpdating(true);

      const updatedStatus = item.status === "active" ? "inactive" : "active";
      const response = await PackageManagementService.updatePackage(item._id, {
        status: updatedStatus,
      });

      if (response.data && response.data.data.affectedBodyParts) {
        setAffectedBodyParts(response.data.data.affectedBodyParts);
      } else {
        setAffectedBodyParts([]);
      }

      setPackagesData((prevData) =>
        prevData.map((pkg) =>
          pkg._id === item._id ? { ...pkg, status: updatedStatus } : pkg
        )
      );
      showToast("success", "Package updated successfully");
    } catch (error) {
      showToast("error", "Failed to update status");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmStatusChange = async () => {
    try {
      if (deleteItem) {
        // If deleteItem is set, perform deletion
        await handleConfirmDelete();
      } else if (itemToUpdate) {
        // If itemToUpdate is set, perform status update
        await updateStatus(itemToUpdate);
      }
    } catch (error) {
      console.error("Error in confirming action:", error);
    } finally {
      setDialogOpen(false);
    }
  };

  const handleCancelStatusChange = () => {
    setDialogOpen(false);
  };

  const handleNavigation = (action, item) => {
    const state = { action, packageData: item };
    console.log("state : ", state);

    if (action === "View") navigate(`/view-package/${item._id}`, { state });
    if (action === "Add") navigate(`/add-package`, { state });
    if (action === "Edit") navigate(`/edit-package/${item._id}`, { state });
  };

  useEffect(() => {
    fetchPackages();
  }, [searchVal, page, rowsPerPage]);

  return (
    <Box sx={{ display: "grid", gridTemplateRows: "auto 1fr" }}>
      <Box className="main_content_wrapper" component="main">
        <Typography variant="h6" gutterBottom>
          Package Management
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
            placeholder="Search packages"
            value={searchVal}
            onChange={handleSearchChange}
            sx={{ width: "34%" }}
          />
          {loggedInUser?.role === "admin" || loggedInUser?.role === "clinic" ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleNavigation("Add", {})}
            >
              New Package
            </Button>
          ) : (
            ""
          )}
        </Box>

        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell
                  onClick={() => handleSort("packageName")}
                  sx={{ cursor: "pointer" }}
                >
                  Package Name{" "}
                  {sortField === "packageName" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </StyledTableCell>

                <StyledTableCell>Description</StyledTableCell>

                <StyledTableCell
                  onClick={() => handleSort("priorityLevel")}
                  sx={{ cursor: "pointer" }}
                >
                  Priority{" "}
                  {sortField === "priorityLevel" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </StyledTableCell>

                <StyledTableCell
                  onClick={() => handleSort("status")}
                  sx={{ cursor: "pointer" }}
                >
                  Status{" "}
                  {sortField === "status" && (sortOrder === "asc" ? "▲" : "▼")}
                </StyledTableCell>

                <StyledTableCell
                  onClick={() => handleSort("amount")}
                  sx={{ cursor: "pointer" }}
                >
                  Amount{" "}
                  {sortField === "amount" && (sortOrder === "asc" ? "▲" : "▼")}
                </StyledTableCell>

                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <Dialog open={dialogOpen} onClose={handleCancelStatusChange}>
              <DialogTitle>Confirm Change</DialogTitle>
              <DialogContent>
                {Array.isArray(affectedBodyParts) &&
                affectedBodyParts.length > 0 ? (
                  <div>
                    <Typography variant="subtitle1" style={{ marginTop: 10 }}>
                      Disabling <strong>{itemToUpdate?.packageName},</strong>{" "}
                      will remove the package from below concerns
                    </Typography>
                    <List>
                      {affectedBodyParts.map((part, index) => (
                        <ListItem key={index} divider>
                          <ListItemText
                            primary={` ${index + 1}. Body Type: ${
                              part.bodyType
                            }, Part: ${part.part}`}
                            secondary={`Question: ${
                              part.question?.[0]?.text ||
                              "No question available"
                            }`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </div>
                ) : (
                  <Typography variant="subtitle1" style={{ marginTop: 10 }}>
                    No affected body parts to display.
                  </Typography>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelStatusChange} color="primary">
                  No
                </Button>
                <Button onClick={handleConfirmStatusChange} color="primary">
                  Yes
                </Button>
              </DialogActions>
            </Dialog>

            <TableBody>
              {isLoading ? (
                Array.from({ length: rowsPerPage }).map((_, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell colSpan={6}>
                      <Skeleton animation="wave" />
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : packagesData.length > 0 ? (
                packagesData.map((item) => (
                  <StyledTableRow key={item?._id}>
                    <StyledTableCell>
                      {item?.packageName?.length > 20
                        ? item.packageName.slice(0, 20) + "..."
                        : item.packageName}
                    </StyledTableCell>
                    <StyledTableCell>
                      {item?.description?.length > 50
                        ? item.description.slice(0, 50) + "..."
                        : item.description}
                    </StyledTableCell>
                    <StyledTableCell>{item?.priorityLevel}</StyledTableCell>
                    <StyledTableCell>
                      <Switch
                        checked={item.status === "active"}
                        onChange={() => {
                          console.log(item, "item data");
                          handleToggleStatus(item);
                        }}
                        color="primary"
                      />
                    </StyledTableCell>
                    <StyledTableCell>{item?.amount}</StyledTableCell>
                    <StyledTableCell>
                      <Tooltip title="View">
                        <IconButton
                          onClick={() => handleNavigation("View", item)}
                        >
                          <VisibilityIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleNavigation("Edit", item)}
                        >
                          <EditIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                      {/* {loggedInUser?.role === "admin" ? ( */}
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDeletePackage(item)}>
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
                  <StyledTableCell colSpan={6} align="center">
                    No Packages Available
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
export default PackageManagement;
