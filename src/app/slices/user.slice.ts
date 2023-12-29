
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
  },
});

export const { setUser, clearUser } = userSlice.actions;
export const getUser = (state: RootState) => state.user.data; // Assuming RootState is your root state type
export default userSlice.reducer;
