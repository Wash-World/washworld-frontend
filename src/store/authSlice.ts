import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LAN_IP } from "../constants/env";

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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });

      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue(err.message || "Failed to login");
      }

      return await res.json(); // This should be { user, token }
    } catch (error: any) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("Login success payload:", action.payload);
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.access_token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
