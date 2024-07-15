import { configureStore } from "@reduxjs/toolkit";
import urlReducer from "./urlSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    url: urlReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
