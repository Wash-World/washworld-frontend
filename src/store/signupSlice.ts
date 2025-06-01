// store/signupSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { LAN_IP } from "../constants/env";
import {
  ProfileValues,
  ProfileErrors,
  PaymentValues,
  PaymentErrors,
} from "../utils/validators"; // <-- adjust path if yours differs

export interface SignupState {
  membership_id?: number;
  assigned_location_api_id?: string;
  all_locations?: boolean;
  
   // Profile object: matches ProfileValues
  profile: ProfileValues;

  // Validation errors for both profile & payment fields
  validationErrors: Partial<ProfileErrors & PaymentErrors>;

  // Payment object: matches PaymentValues
  payment: PaymentValues;
  
  status: "idle" | "pending" | "success" | "error";
  error?: string;
}

const initialState: SignupState = {
  status: "idle",
  validationErrors: {}, // No errors at the start

  profile: {
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirm: "",
    mobile_num: "",
    carplate: "",
  }, // Profile object exists but fields unset

    payment: {
    card_owner: "",
    card_number: "",
    expiry_date: "",
    cvv: "",
  },
};

// Async thunk to submit full signup DTO to backend
export const submitSignup = createAsyncThunk(
  "signup/submit",
  async (_, thunkAPI) => {
    // Select current signup state
    const state = (thunkAPI.getState() as any).signup as SignupState;

    // Build DTO matching CreateUserDto with nested fields flattened
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
  }
);

const signupSlice = createSlice({
  name: "signup",
  initialState,
 reducers: {
    //Update a single profile field and clear its validation error
    updateProfileField(
      state,
      action: PayloadAction<{ field: keyof NonNullable<SignupState['profile']>; value: string }>
    ) {
    const { field, value } = action.payload;
      state.profile[field] = value;
      delete state.validationErrors[field];
    },
    //Update a single PaymentValues field and clear its error:
    updatePaymentField(
      state,
      action: PayloadAction<{ field: keyof PaymentValues; value: string }>
    ) {
      const { field, value } = action.payload;
      state.payment[field] = value;
      delete state.validationErrors[field];
    },


     // Bulk‐set validationErrors (ProfileErrors & PaymentErrors)
    setValidationErrors(
      state,
      action: PayloadAction<Partial<ProfileErrors & PaymentErrors>>
    ) {
      state.validationErrors = action.payload;
    },

    // Bulk-set plan details
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

    //Reset entire signup slice to initial state
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

export const {
  updateProfileField,
  updatePaymentField,
  setValidationErrors,
  setPlan,
  resetSignup,
} = signupSlice.actions;

export default signupSlice.reducer;