import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import authSlice from "./auth-slice";
import buildingSlice from "./building-slice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    buildingList: buildingSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
