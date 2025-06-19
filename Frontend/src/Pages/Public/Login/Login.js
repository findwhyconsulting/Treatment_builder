import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Link,
} from "@mui/material";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { Icon } from "@iconify/react";
import { useDispatch } from "react-redux";
import showToast from "../../../Utils/Toast/ToastNotification";
import { userlogin } from "../../../Redux/Slice/Auth/AuthSlice";
import authService from "../../../Services/Login/LoginService";
import { setProfile } from "../../../Redux/Slice/Profile/ProfileSlice";
import { logOutAsClinic } from "../../../Redux/Slice/LoginAsClinic/LoginAsClinicSlice";

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

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required")
      .matches(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i,
        "Please enter valid email address"
      )
      .matches(/^$|^\S+.*/, "Only blank spaces are not valid."),
    password: Yup.string()
      .required("Password is required")
      .matches(/^$|^\S+.*/, "Only blank spaces are not valid."),
  });

  const onSubmit = async (values) => {
    const data = {
      email: values.email,
      password: values.password,
    };

    const response = await authService.login(data);
    try {
      if (response?.data?.statusCode === 200) {
        dispatch(userlogin(response?.data?.data));
        dispatch(logOutAsClinic());
        const profile = await authService.profile();
        if (profile?.data?.statusCode === 200) {
          dispatch(setProfile(profile?.data?.data));
        }
        navigate("/dashboard");
        showToast("success", response?.data?.message);
      } else {
        showToast("error", response?.data?.message || "Something went wrong while Logging in");
        console.log(response, "else------session expired" );
      }
    } catch (error) {
      showToast("error", response?.data?.message || "An unexpected error occurred");
      console.log(response?.data?.message, "catch ------ session expired" );
    }
  };

  return (
    <RootStyle>
      <Container maxWidth="sm">
        <ContentStyle>
          <HeadingStyle component={motion.div} {...animate}>
            <img src="/static/logo.svg" alt="Logo" width="150" />
            <Typography sx={{ color: "text.secondary", mb: 5 }}>
              Login to your account
            </Typography>
          </HeadingStyle>

          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={LoginSchema}
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
                    <TextField
                      fullWidth
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Password"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      error={Boolean(touched.password && errors.password)}
                      helperText={touched.password && errors.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword((prev) => !prev)}
                            >
                              {showPassword ? (
                                <Icon icon="eva:eye-fill" />
                              ) : (
                                <Icon icon="eva:eye-off-fill" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
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
                      {/* Forgot Password Link */}
                      <Link
                        component={RouterLink}
                        variant="subtitle2"
                        to="/forgot-password"
                        underline="hover"
                      >
                        Forgot password?
                      </Link>
                    </Stack>

                    {/* Submit Button */}
                    <LoadingButton
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "loading..." : "Login"}
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

export default Login;
