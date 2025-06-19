import { createSlice } from "@reduxjs/toolkit";

export const clinicSessionLogin = createSlice({
  name: "clinic-session",
  initialState: {
    isLoggedInAsClinic: false,
    clinic: {},
  },
  reducers: {
    isLoggedInAsClinic(state, action) {
      state.isLoggedInAsClinic = true;
      state.clinic = action.payload;
    },
    logOutAsClinic(state) {
      state.isLoggedInAsClinic = false;
      state.clinic = {};
    },
  },
});

export const { isLoggedInAsClinic, logOutAsClinic } = clinicSessionLogin.actions;
export default clinicSessionLogin.reducer;
