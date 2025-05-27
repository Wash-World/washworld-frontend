// # createStore, applyMiddleware, rootReducer
// store/index.ts

import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import signupReducer from "./signupSlice";

//
// 1) Create the store with your reducer(s)
//
export const store = configureStore({
  reducer: {
    signup: signupReducer,
    // you can add more slices here later
  },
});

//
// 2) Infer the `RootState` and `AppDispatch` types
//
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

//
// 3) Create typed hooks for components to use
//
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
