import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./slices/user.slice";
import authReducer from "./slices/authSlice"
import modalReducer from './slices/modalSlice';

export const store = configureStore({
  reducer: {
    auth:authReducer,
   user: userReducer,
   modal:modalReducer,
  },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

