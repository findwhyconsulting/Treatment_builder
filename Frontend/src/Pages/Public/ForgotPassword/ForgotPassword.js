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
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { Icon } from "@iconify/react";
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

const ForgotPassword = () => {
  const navigate = useNavigate();
  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required")
      .matches(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i,
        "Please enter valid email address"
      )
      .matches(/^$|^\S+.*/, "Only blank spaces are not valid."),
  });

  const onSubmit = async (values) => {
    const data = {
      email: values.email,
    };

    try {
      const response = await authService.forgotPassword(data);

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
            <Typography sx={{ color: "text.secondary" }}>
              Forgot your password? Don't Worry !
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 5 }}>
              Enter your email below
            </Typography>
          </HeadingStyle>

          <Formik
            initialValues={{
              email: "",
            }}
            validationSchema={ForgotPasswordSchema}
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
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Email Address"
                      placeholder="Email"
                      autoComplete="email"
                      type="email"
                      error={Boolean(touched.email && errors.email)}
                      helperText={touched.email && errors.email}
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
                      {isSubmitting
                        ? "loading..."
                        : "Request for verification..."}
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

export default ForgotPassword;
