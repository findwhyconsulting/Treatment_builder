import React, { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import showToast from "../../src/Utils/Toast/ToastNotification";
import { userLogin } from "../../src/API/Auth/UserLogin";
import { userlogin } from "../../src/Redux/Slice/Auth/AuthSlice";

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

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  //Validation schema
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter valid email address")
      .required("Email is required")
      .matches(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i,
        "Please enter valid email address"
      )
      .matches(/^$|^\S+.*/, "Only blankspaces is not valid."),
    password: Yup.string()
      .required("Password is required")
      .matches(/^$|^\S+.*/, "Only blankspaces is not valid."),
  });

  //Handle submit
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      // remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      if (!values.email || !values.password) {
        showToast("error", "Please enter a valid email address or password")
      }
      const data = {
        email: values.email,
        password: values.password,
      };

      try {
        const response = await userLogin(data);
        if (response?.statusCode === 200) {
          showToast("success", "Login successful");
          dispatch(userlogin(response?.data));
          formik.resetForm();
          navigate("/dashboard");
        } else {
          showToast("error", response?.message || "Something went wrong");
        }
      } catch (error) {
        showToast("error", "An unexpected error occurred");
      }
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } =
    formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
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
              placeholder="Email"
              autoComplete="email"
              type="email"
              label="Email Address"
              {...getFieldProps("email")}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />

            <TextField
              fullWidth
              // autoComplete="current-password"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              label="Password"
              {...getFieldProps("password")}
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
              {/* <FormControlLabel
                control={
                  <Checkbox
                    {...getFieldProps("remember")}
                    checked={values.remember}
                  />
                }
                label="Remember me"
              /> */}

              <Link
                component={RouterLink}
                variant="subtitle2"
                to="/forgotPassword"
                underline="hover"
              >
                Forgot password?
              </Link>
            </Stack>

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              {isSubmitting ? "loading..." : "Login"}
            </LoadingButton>
          </Box>
        </Box>
      </Form>
    </FormikProvider>
  );
};

export default LoginForm;
