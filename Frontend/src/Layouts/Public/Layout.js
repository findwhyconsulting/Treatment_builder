import React from "react";
import { Outlet } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
// import "./Layout.css";
import Navbar from "../../Components/Navbar/Navbar";
import Dashboard from "../../Pages/Private/Dashboard/Dashboard";
import PublicFooter from "../../Components/PublicFooter/PublicFooter";
import PublicHeader from "../../Components/PublicHeader/PublicHeader";
import { Style } from  "./Layout.css";
const Layout = () => {
  return (
    <div className="wrapper">
      <PublicHeader />
      <div className="layout">
        <div className="outlet">
          <Outlet />
        </div>
      </div>
      <PublicFooter/>
    </div>
  );
};

export default Layout;
