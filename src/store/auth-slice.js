import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  name: "",
  role: null,
  profile_img: null,
  uid: null
};

const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    authenticate(state, action) {
      state.isAuth = action.payload.isAuth;
    },

    userData(state, action) {
      state.name = action.payload.name;
      state.role = action.payload.role;
      state.profile_img = action.payload.profile_img;
      state.uid = action.payload.uid
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
