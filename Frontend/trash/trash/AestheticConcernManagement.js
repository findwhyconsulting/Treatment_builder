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
  Modal,
  Paper,
} from "@mui/material";
import Navbar from "../../../Components/Navbar/Navbar";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import DeleteDialog from "../../../Components/DeleteDialog/DeleteDialog";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import Pagination from "../../../Components/Pagination/Pagination";
import bodyManagementService from "../../../Services/BodyManagementService/BodyManagementService";

// Styled Table Cell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: "8px 8px",
    height: "47px",
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

const AestheticConcernManagement = () => {
  const navigate = useNavigate();

  // State Management
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [searchVal, setSearchVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const rowsPerPage = 20;
  const [sortColumn, setSortColumn] = useState("part");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);

  // New states for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch Body Parts
  const fetchBodyParts = async () => {
    try {
      setIsLoading(true);
      const response = await bodyManagementService.listParts();
      const fetchedData = response.data.data.data;

      setData(fetchedData);
      setFilteredData(fetchedData);
      setTotalRecords(fetchedData.length);
    } catch (err) {
      toast.error("Failed to fetch body parts");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial Data Fetching
  useEffect(() => {
    fetchBodyParts();
  }, []);

  // Search and Filter Logic
  useEffect(() => {
    let result = [...data];

    // Search Filter
    if (searchVal) {
      result = result.filter(
        (item) =>
          item.part.toLowerCase().includes(searchVal.toLowerCase()) ||
          item.bodyType.toLowerCase().includes(searchVal.toLowerCase())
      );
    }

    // Sorting
    if (sortColumn) {
      result.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn])
          return sortDirection === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn])
          return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(result);
    setTotalRecords(result.length);
  }, [searchVal, sortColumn, sortDirection, data]);

  // Pagination Logic
  const slicedData = filteredData?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleEdit = (item) => {
    navigate("/edit-prog", { state: item });
  };

  const handleDelete = async () => {
    if (!selectedItemToDelete) return;

    try {
      // const deletData = await ;
      const updatedData = data.filter(
        (item) => item.id !== selectedItemToDelete.id
      );

      setData(updatedData);
      setFilteredData(updatedData);
      toast.success("Body Part removed successfully");
    } catch (error) {
      toast.error("Unable to delete body part");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedItemToDelete(null);
    }
  };

  const handleSort = (column) => {
    setSortDirection(
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc"
    );
    setSortColumn(column);
  };

  const handleAddNewConcern = () => {
    navigate("/add-concern");
  };

  return (
    <Box sx={{ display: "grid", gridTemplateRows: "auto 1fr" }}>
      <Navbar />
      <Sidebar />
      <Box className="main_content_wrapper" component="main">
        <Typography variant="h6" gutterBottom>
          Concern List
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            mb: "20px",
            mt: "10px",
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: "80%",
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
            }}
          >
            <Box sx={{ width: "34%", mr: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search body parts"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
            </Box>
          </Box>
          <Box>
            <Button variant="contained" onClick={handleAddNewConcern}>
              New Concern
            </Button>
          </Box>
        </Box>
        <TableContainer sx={{ width: "100%" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell onClick={() => handleSort("bodyType")}>
                  Body Part{" "}
                  {sortColumn === "bodyType" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort("part")}>
                  Part Name{" "}
                  {sortColumn === "part" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((val) => (
                  <StyledTableRow key={val} sx={{ height: "35px" }}>
                    {[1, 2, 3].map((cell) => (
                      <StyledTableCell key={cell}>
                        <Skeleton animation="wave" />
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                ))
              ) : slicedData?.length > 0 ? (
                slicedData?.map((item, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell
                      sx={{
                        whiteSpace: "nowrap",
                        maxWidth: "150px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item?.bodyType}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        whiteSpace: "nowrap",
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item?.part}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Tooltip title="View Questions">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleView(item)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Concern">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleEdit(item)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {/* <Tooltip title="Remove Activity">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => {
                            setSelectedItemToDelete(item);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip> */}
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={3} align="center">
                    {isLoading ? "Loading..." : "No Data Available"}
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
        />

        {/* <DeleteDialog
          open={isDeleteDialogOpen}
          handleClose={() => setIsDeleteDialogOpen(false)}
          handleConfirm={handleDelete}
          title="Delete Body Part"
          content="Are you sure you want to delete this body part?"
        /> */}

        {/* Modal for viewing item details */}
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            sx={{
              width: "500px",
              maxHeight: "80vh",
              overflow: "auto",
              p: 3,
              position: "relative",
            }}
          >
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
              }}
            >
              <CloseIcon />
            </IconButton>

            <Typography variant="h6" gutterBottom>
              Body Part Details
            </Typography>

            {selectedItem && (
              <Box>
                <Typography>
                  <strong>Question 1. </strong> {selectedItem.question[0]}
                </Typography>
                <Typography>
                  <strong>Question 2. </strong> {selectedItem.question[1]}
                </Typography>
                <Typography>
                  <strong>Question 3. </strong> {selectedItem.question[2]}
                </Typography>
                {/* Add more details as needed */}
                <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                  {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(selectedItem)}
                  >
                    Edit
                  </Button> */}
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Modal>
      </Box>
    </Box>
  );
};

export default AestheticConcernManagement;
