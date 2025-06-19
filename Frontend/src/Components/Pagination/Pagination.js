// Updated Pagination Component
import React from "react";
import {
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const Pagination = ({
  count,
  rowsPerPage,
  page,
  onChangePage,
  onRowsPerPageChange,
}) => {
  const totalPages = Math.ceil(count / rowsPerPage);

  const handlePageChange = (newPage) => {
    onChangePage(newPage);
  };

  const renderPaginationItems = () => {
    const paginationItems = [];
    const gap = 0.6; // Adjust the gap size as needed

    // Define the maximum number of buttons to display directly
    const maxVisibleButtons = 5;

    // If total pages are less than or equal to the maximum visible buttons, display all buttons directly
    if (totalPages <= maxVisibleButtons) {
      for (let i = 0; i < totalPages; i++) {
        paginationItems.push(
          <Button
            key={i}
            onClick={() => handlePageChange(i)}
            variant={i === page ? "contained" : "outlined"}
            color="primary"
            sx={{ margin: gap }}
          >
            {i + 1}
          </Button>
        );
      }
    } else {
      const visiblePages = [];
      const startPage = Math.max(
        0,
        Math.min(
          page - Math.floor(maxVisibleButtons / 2),
          totalPages - maxVisibleButtons
        )
      );
      const endPage = Math.min(totalPages, startPage + maxVisibleButtons);

      for (let i = startPage; i < endPage; i++) {
        visiblePages.push(i);
      }

      if (startPage > 0) {
        paginationItems.push(
          <Button
            key="start"
            onClick={() => handlePageChange(0)}
            variant="outlined"
            color="primary"
            sx={{ margin: gap }}
          >
            1
          </Button>
        );
        if (startPage > 1) {
          paginationItems.push(
            <Button
              key="ellipsis-start"
              variant="outlined"
              disabled
              sx={{ margin: gap }}
            >
              ...
            </Button>
          );
        }
      }

      visiblePages.forEach((i) => {
        paginationItems.push(
          <Button
            key={i}
            onClick={() => handlePageChange(i)}
            variant={i === page ? "contained" : "outlined"}
            color="primary"
            sx={{ margin: gap }}
          >
            {i + 1}
          </Button>
        );
      });

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          paginationItems.push(
            <Button
              key="ellipsis-end"
              variant="outlined"
              disabled
              sx={{ margin: gap }}
            >
              ...
            </Button>
          );
        }
        paginationItems.push(
          <Button
            key="end"
            onClick={() => handlePageChange(totalPages - 1)}
            variant="outlined"
            color="primary"
            sx={{ margin: gap }}
          >
            {totalPages}
          </Button>
        );
      }
    }

    return paginationItems;
  };

  return (
    <Box
      sx={{
        marginTop: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <FormControl size="small" sx={{ minWidth: 120 }}>
        {/* <InputLabel id="rows-per-page-label">Rows per page</InputLabel> */}
        <Select
          labelId="rows-per-page-label"
          value={rowsPerPage}
          onChange={onRowsPerPageChange}
        >
          {[5, 10, 15, 20].map((rows) => (
            <MenuItem key={rows} value={rows}>
              {rows}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box>{renderPaginationItems()}</Box>
    </Box>
  );
};

export default Pagination;
