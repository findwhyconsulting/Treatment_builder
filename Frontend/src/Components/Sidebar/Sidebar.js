import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import EnhancedEncryptionRoundedIcon from "@mui/icons-material/EnhancedEncryptionRounded";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import QuizIcon from "@mui/icons-material/Quiz";
import ChatIcon from "@mui/icons-material/Chat";
import BusinessIcon from "@mui/icons-material/Mediation";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MedicationIcon from "@mui/icons-material/Medication";
import ProgramIcon from "@mui/icons-material/School";
import CategoryIcon from "@mui/icons-material/Category";
import DetailsIcon from "@mui/icons-material/Details";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import drugIcon from "@iconify/icons-mdi/pill";
import programIcon from "@iconify/icons-mdi/clipboard-list-outline";
import FolderSharedIcon from '@mui/icons-material/FolderShared';

const drawerWidth = 240;

const Sidebar = () => {
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
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText secondary="Aesthetic Concerns" />
        </ListItem>

        <ListItem button component={Link} to="/clinics-management">
          <ListItemIcon>
            <ManageAccountsIcon />
          </ListItemIcon>
          <ListItemText secondary="Clinics" />
        </ListItem>

        <ListItem button component={Link} to="/packages-management">
          <ListItemIcon>
            <FolderSharedIcon />
          </ListItemIcon>
          <ListItemText secondary="Packages" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
