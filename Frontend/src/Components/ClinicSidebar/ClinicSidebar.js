import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import InterpreterModeIcon from "@mui/icons-material/InterpreterMode";
import CategoryIcon from "@mui/icons-material/Category";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";
import FolderSharedIcon from "@mui/icons-material/FolderShared";

const drawerWidth = 240;

const ClinicSidebar = () => {
  const [open, setOpen] = useState(false);
  const handleAddCategory = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    // fetchCategoryOptions();
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          marginTop: "64px",
        },
      }}
    >
      <List>
        <ListItem button component={Link} to="/dashboard">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText secondary="Dashboard" />
        </ListItem>

        <ListItem button component={Link} to="/aesthetic-management">
          <ListItemIcon>
            <AccessibilityNewIcon />
          </ListItemIcon>
          <ListItemText secondary="Aesthetic Concerns" />
        </ListItem>

        <ListItem button component={Link} to="/consultations">
          <ListItemIcon>
            <InterpreterModeIcon />
          </ListItemIcon>
          <ListItemText secondary="Consultations" />
        </ListItem>

        <ListItem button component={Link} to="/packages-management">
          <ListItemIcon>
            <FolderSharedIcon />
          </ListItemIcon>
          <ListItemText secondary="Packages" />
        </ListItem>

        <ListItem button component={Link} to="/content-management">
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText secondary="My Content" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default ClinicSidebar;
