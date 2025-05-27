// store/signupSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export interface SignupState {
  membership_id?: number;
  assigned_location_api_id?: string;
  all_locations?: boolean;
  profile?: {
    name: string;
    lastname: string;
    email: string;
    password: string;
    mobile_num: string;
    carplate: string;
  };
  payment?: {
    card_owner: string;
    card_number: string;
    expiry_date: string;
    cvv: string;
  };
  status: "idle" | "pending" | "success" | "error";
  error?: string;
}

const initialState: SignupState = { status: "idle" };

export const submitSignup = createAsyncThunk("signup/submit", async (_, thunkAPI) => {
  const state = (thunkAPI.getState() as any).signup as SignupState;
  const dto = {
    name: state.profile!.name,
    lastname: state.profile!.lastname,
    email: state.profile!.email,
    password: state.profile!.password,
    mobile_num: state.profile!.mobile_num,
    carplate: state.profile!.carplate,
    membership_id: state.membership_id!,
    assigned_location_api_id: state.assigned_location_api_id,
    all_locations: state.all_locations,
    card_owner: state.payment!.card_owner,
    card_number: state.payment!.card_number,
    expiry_date: state.payment!.expiry_date,
    cvv: state.payment!.cvv,
  };
  const LAN_IP = "10.58.131.25";
  const res = await fetch(`http://${LAN_IP}:3000/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }

  return (await res.json()) as any;
});

const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    setPlan(
      state,
      action: PayloadAction<{
        membership_id: number;
        assigned_location_api_id?: string;
        all_locations?: boolean;
      }>
    ) {
      Object.assign(state, action.payload);
    },
    setProfile(state, action: PayloadAction<SignupState["profile"]>) {
      state.profile = action.payload;
    },
    setPayment(state, action: PayloadAction<SignupState["payment"]>) {
      state.payment = action.payload;
    },
    resetSignup() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitSignup.pending, (state) => {
        state.status = "pending";
        state.error = undefined;
      })
      .addCase(submitSignup.fulfilled, (state) => {
        state.status = "success";
      })
      .addCase(submitSignup.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      });
  },
});

export const { setPlan, setProfile, setPayment, resetSignup } = signupSlice.actions;
export default signupSlice.reducer;
