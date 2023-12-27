import { configureStore } from '@reduxjs/toolkit'
// import {
//    useSelector as useReduxSelector,
//    useDispatch as useReduxDispatch,
//    type TypedUseSelectorHook
// } from "react-redux"
import userReducer from "./slices/user.slice";
import authReducer from "./slices/authSlice"
export const store = configureStore({
  reducer: {
    auth:authReducer,
   user: userReducer
  },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
