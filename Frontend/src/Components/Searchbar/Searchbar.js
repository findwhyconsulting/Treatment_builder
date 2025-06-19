import React, { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({
  list = [],
  originalList = [],
  filterData,
  placeHolder = "Search...",
}) => {
  const [searchVal, setSearchVal] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchVal(value);

    if (value === "") {
      filterData(originalList);
    } else {
      const filteredData = list.filter(
        (data) =>
          data?.form_name?.toLowerCase().includes(value) ||
          data?.form_description?.toLowerCase().includes(value)
      );
      filterData(filteredData);
    }
  };

  return (
    <TextField
      size="small"
      type="search"
      placeholder={placeHolder}
      className="me-2"
      aria-label="Search"
      value={searchVal}
      onChange={handleSearch}
    />
  );
};

export default SearchBar;
