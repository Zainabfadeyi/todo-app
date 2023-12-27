// import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
// import { RootState } from "../store";

// interface IUser {
//    name?: string
// }

// export const initialState: IUser = {};

// const userSlice = createSlice({
//    name: "user",
//    initialState,
//    reducers: {
//       setUser(_, action: PayloadAction<IUser>) {
//          return action.payload;
//       },
//       setName(state, action: PayloadAction<string>) {
//          state.name = action.payload;
//       },
//       clearUser(_) {
//          return {}
//       }
//    },
// })
// export const { setUser, setName, clearUser } = userSlice.actions;
// export const getUser = (state: RootState) => state.user;
// export default userSlice.reducer;

// user.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from "../store";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface UserState {
  data: User | null;
}

const initialState: UserState = {
  data: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
    },
    clearUser: (state) => {
      state.data = null;
    },
    // Add more actions as needed
  },
});

export const { setUser, clearUser } = userSlice.actions;
export const getUser = (state: RootState) => state.user.data; // Assuming RootState is your root state type
export default userSlice.reducer;
