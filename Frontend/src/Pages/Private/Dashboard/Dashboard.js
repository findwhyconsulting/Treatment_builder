import React, { useState, useEffect } from "react";
import { Box, Grid2, Typography } from "@mui/material";
import categoryIcon from "@iconify/icons-mdi/folder-multiple";
import drugIcon from "@iconify/icons-mdi/pill";
import programIcon from "@iconify/icons-mdi/clipboard-list-outline";
import AppWidgetCard from "./AppWidgetCard";
import { PieChart } from "@mui/x-charts/PieChart";
import "./Dashboard.css";
import { useSelector } from "react-redux";
import DashboardStatsService from "../../../Services/DashboardStats/DashbordStatsService";
import showToast from "../../../Utils/Toast/ToastNotification";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const loggedInUser = useSelector((state) => state?.user?.user);
  const [data, setData] = useState({});
  const [dashboard, setDashboard] = useState({});
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getDashboardConent = async () => {
    try {
      const dashboardConent = await DashboardStatsService.dashboardConent();

      if (dashboardConent?.data?.statusCode === 200) {
        setDashboard(dashboardConent?.data?.data);
      } else {
        showToast("error", dashboardConent?.data?.message);
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        return; 
      }
      showToast("error", "Something went wrong while loading Dashboard");
    }
  };

  const navigateToConcerns = async () => {
    navigate("/aesthetic-management");
  };

  const navigateToClinics = async () => {
    navigate("/clinics-management");
  };

  const navigateToConultations = async () => {
    showToast("warn", "To check consultations login to clinic");
  };

  const navigateToClinicConsultations = async () => {
    navigate("/consultations");
  };

  useEffect(() => {
    getDashboardConent();
  }, []);

  return (
    <>
      {loggedInUser?.role === "clinic" ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateRows: "auto 1fr",
            minHeight: "100vh",
            p: "0px !important",
          }}
        >
          <Box className="main_content_wrapper" component="main">
            <Typography
              className="Welcome_text_admin"
              variant="h6"
              gutterBottom
              sx={{ mb: "30px" }}
            >
              {getGreeting()}
              <span>
                {" "}
                {loggedInUser?.firstName} {loggedInUser?.lastName}
              </span>
            </Typography>
            <Grid2 container spacing={5}>
              <div onClick={navigateToConcerns}>
                <Grid2 item xs={12} sm={6} md={4}>
                  <AppWidgetCard
                    className="counter_card counter_card_cat"
                    title="Aesthetic Concerns"
                    total={
                      dashboard?.clinicAestheticConcernCount
                        ? dashboard?.clinicAestheticConcernCount
                        : 0
                    }
                    icon={categoryIcon}
                    // loading={isLoading}
                  />
                </Grid2>
              </div>
              <div onClick={navigateToClinicConsultations}>
                <Grid2 item xs={12} sm={6} md={4}>
                  <AppWidgetCard
                    className="counter_card counter_card_progarm"
                    title="Total Consultations"
                    total={
                      dashboard?.consulationsCounts
                        ? dashboard.consulationsCounts
                        : 0
                    }
                    icon={programIcon}
                    // loading={isLoading}
                  />
                </Grid2>
              </div>
            </Grid2>
          </Box>
        </Box>
      ) : (
        ""
      )}

      {loggedInUser?.role === "admin" ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateRows: "auto 1fr",
            minHeight: "100vh",
            p: "0px !important",
          }}
        >
          <Box className="main_content_wrapper" component="main">
            <Typography
              className="Welcome_text_admin"
              variant="h6"
              gutterBottom
              sx={{ mb: "30px" }}
            >
              {getGreeting()}
              <span>
                {" "}
                {loggedInUser?.firstName} {loggedInUser?.lastName}
              </span>
            </Typography>
            <Grid2 container spacing={5}>
              <div onClick={navigateToConcerns}>
                <Grid2 item xs={12} sm={6} md={4}>
                  <AppWidgetCard
                    className="counter_card counter_card_cat"
                    title="Aesthetic Concerns"
                    total={
                      dashboard?.masterAestheticConcernCount
                        ? dashboard?.masterAestheticConcernCount
                        : 0
                    }
                    icon={categoryIcon}
                    // loading={isLoading}
                  />
                </Grid2>
              </div>
              <div onClick={navigateToClinics}>
                <Grid2 item xs={12} sm={6} md={4}>
                  <AppWidgetCard
                    className="counter_card counter_card_drug"
                    title="Clinics"
                    total={dashboard?.clinicCount ? dashboard?.clinicCount : 0}
                    icon={drugIcon}
                    // loading={isLoading}
                  />
                </Grid2>
              </div>
              <div onClick={navigateToConultations}>
                <Grid2 item xs={12} sm={6} md={4}>
                  <AppWidgetCard
                    className="counter_card counter_card_drug"
                    title="Consultations"
                    total={
                      dashboard?.allConsulationsCounts
                        ? dashboard?.allConsulationsCounts
                        : 0
                    }
                    icon={drugIcon}
                    // loading={isLoading}
                  />
                </Grid2>
              </div>
            </Grid2>
          </Box>
        </Box>
      ) : (
        ""
      )}
    </>
  );
};

export default Dashboard;
