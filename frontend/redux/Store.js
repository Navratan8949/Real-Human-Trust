import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import siteContentReducer from "./features/siteContentSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    siteContent: siteContentReducer,
  },
});

export default store;
