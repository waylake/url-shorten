import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { loginUser, getUserInfo } from "../api/authApi";
import { RootState } from "./store";

interface User {
  id: string;
  username: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem("token"),
  user: null,
  token: localStorage.getItem("token"),
};

export const login = createAsyncThunk<
  { token: string; user: User },
  { email: string; password: string },
  { state: RootState }
>("auth/login", async ({ email, password }) => {
  const response = await loginUser(email, password);
  localStorage.setItem("token", response.token);
  return response;
});

export const fetchUser = createAsyncThunk<User, void, { state: RootState }>(
  "auth/fetchUser",
  async (_, { getState }) => {
    const { auth } = getState();
    if (!auth.token) throw new Error("No token found");
    return await getUserInfo(auth.token);
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
