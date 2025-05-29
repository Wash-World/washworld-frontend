import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { LAN_IP } from "../constants/env";
import * as SecureStore from "expo-secure-store";

// LoginDTO is needed because we send data in from the component.
interface LoginDTO {
  email: string;
  password: string;
}

interface AuthState {
  user: any;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (dto: LoginDTO, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://${LAN_IP}:3000/auth/login`, {
        //Makes API call
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });

      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue(err.message || "Failed to login");
      }

      const data = await res.json(); // { user, access_token }
      console.log("Login response:", data);

      await SecureStore.setItemAsync("token", data.access_token); // Save token in SecureStore

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      //simple action that updates state.token in the Redux store
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user; // save user info in Redux
        state.token = action.payload.access_token; // save token in Redux
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
