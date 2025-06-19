import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField, InputLabel } from "@mui/material";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  bgcolor: "background.paper",
  border: "2px solid #D3D3D3",
  boxShadow: 24,
  p: 4,
};

const ModalForm = ({
  open,
  handleClose,
  title,
  fields,
  validationSchema,
  onSubmit,
}) => {
  // Generate initial values from fields
  const initialValues = fields.reduce(
    (acc, field) => ({
      ...acc,
      [field.name]: field.defaultValue || "",
    }),
    {}
  );

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, actions) => {
      await onSubmit(values);
      actions.setSubmitting(false);
    },
  });

  const { errors, touched, handleSubmit, getFieldProps, isSubmitting } = formik;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="reusable-modal-title"
      aria-describedby="reusable-modal-description"
    >
      <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            id="reusable-modal-title"
            variant="h5"
            component="h2"
            color="#1976D2"
          >
            {title}
          </Typography>
        </Box>
        <Box sx={{ p: 4 }}>
          {fields.map((field) => (
            <Box key={field.name} sx={{ mb: 2 }}>
              <InputLabel htmlFor={field.name}>
                {field.label}{" "}
                {field.required && <span style={{ color: "red" }}> *</span>}
              </InputLabel>
              <TextField
                id={field.name}
                placeholder={field.placeholder}
                size="small"
                fullWidth
                type={field.type || "text"}
                {...getFieldProps(field.name)}
                error={Boolean(touched[field.name] && errors[field.name])}
                helperText={touched[field.name] && errors[field.name]}
                sx={{ mt: "6px" }}
              />
            </Box>
          ))}
          <Box
            sx={{
              display: "flex",
              gap: "20px",
              mt: "30px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              loading={isSubmitting}
            >
              Submit
            </LoadingButton>
            <Button type="button" variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

ModalForm.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      type: PropTypes.string,
      defaultValue: PropTypes.any,
      required: PropTypes.bool,
    })
  ).isRequired,
  validationSchema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ModalForm;
