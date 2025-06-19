import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { useSelector } from "react-redux";
import "./PrivateLayout.css";
import ClinicSidebar from "../../Components/ClinicSidebar/ClinicSidebar";

const PrivateLayout = () => {
  const loggedInUserRole = useSelector((state) => state?.user?.user?.role);
  const isLoggedInAsClinic = useSelector(
    (state) => state?.adminSessionAsClinic?.isLoggedInAsClinic
  );

  const showClinicSidebar =
    loggedInUserRole === "clinic" || isLoggedInAsClinic;

  return (
    <>
      <div>
        <div className="Header inner-header">
          <Navbar />
        </div>
        <div className="Main-Component">
          <div className="Sidebar">
            {showClinicSidebar ? <ClinicSidebar /> : <Sidebar />}
          </div>
          <div className="Outlet">
            <Outlet />
          </div>
        </div>
        <div className="Footer">{/* Footer Section Functionality */}</div>
      </div>
    </>
  );
};

export default PrivateLayout;