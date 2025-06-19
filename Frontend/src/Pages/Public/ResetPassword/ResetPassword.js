import React from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Stack,
  Link,
} from "@mui/material";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import showToast from "../../../Utils/Toast/ToastNotification";
import authService from "../../../Services/Login/LoginService";

const RootStyle = styled("div")({
  background: "rgb(249, 250, 251)",
  height: "100vh",
  display: "grid",
  placeItems: "center",
});

const HeadingStyle = styled(Box)({
  textAlign: "center",
});

const ContentStyle = styled("div")({
  maxWidth: 480,
  padding: 25,
  margin: "auto",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  background: "#fff",
});

// Easing for animation
let easing = [0.6, -0.05, 0.01, 0.99];
const animate = {
  opacity: 1,
  y: 0,
  transition: {
    duration: 0.6,
    ease: easing,
    delay: 0.16,
  },
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the token from the query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required")
      .matches(/^$|^\S+.*/, "Only blank spaces are not valid."),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const onSubmit = async (values) => {
    const data = {
      password: values.password,
      confirmPassword: values.confirmPassword,
      token: token,
    };
    try {
      const response = await authService.resetPassword(data);
      if (response?.data?.statusCode === 200) {
        showToast("success", response?.data?.message);
        navigate("/");
      } else {
        showToast("error", response?.data?.message || "Something went wrong");
      }
    } catch (error) {
      showToast("error", "An unexpected error occurred");
    }
  };

  return (
    <RootStyle>
      <Container maxWidth="sm">
        <ContentStyle>
          <HeadingStyle component={motion.div} {...animate}>
            <img src="/static/logo.svg" alt="Logo" width="150" />
            <Typography sx={{ color: "text.secondary", mb: 5 }}>
              Reset your password
            </Typography>
          </HeadingStyle>

          <Formik
            initialValues={{
              password: "",
              confirmPassword: "",
            }}
            validationSchema={ResetPasswordSchema}
            onSubmit={onSubmit}
          >
            {({
              values,
              handleChange,
              handleBlur,
              errors,
              touched,
              isSubmitting,
            }) => (
              <Form>
                <Box
                  component={motion.div}
                  animate={{
                    transition: {
                      staggerChildren: 0.55,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}
                    component={motion.div}
                    initial={{ opacity: 0, y: 40 }}
                    animate={animate}
                  >
                    <TextField
                      fullWidth
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="New Password"
                      placeholder="Enter new password"
                      type="password"
                      error={Boolean(touched.password && errors.password)}
                      helperText={touched.password && errors.password}
                    />
                    <TextField
                      fullWidth
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      type="password"
                      error={Boolean(
                        touched.confirmPassword && errors.confirmPassword
                      )}
                      helperText={
                        touched.confirmPassword && errors.confirmPassword
                      }
                    />
                  </Box>

                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={animate}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                      sx={{ my: 2 }}
                    >
                      <Link
                        component="button"
                        variant="subtitle2"
                        onClick={() => navigate("/")}
                        underline="hover"
                      >
                        Back to Login
                      </Link>
                    </Stack>

                    <LoadingButton
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "loading..." : "Reset Password"}
                    </LoadingButton>
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
};

export default ResetPassword;
