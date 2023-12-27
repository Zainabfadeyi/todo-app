// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
   id:string;
   firstName:string;
   lastName:string;
   email:string
   role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const loadState = (): AuthState | undefined => {
  try {
    const serializedState = localStorage.getItem('authState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state: AuthState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('authState', serializedState);
  } catch (err) {
    // Handle errors while saving state
  }
};

const initialState: AuthState = loadState() || {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      saveState(state);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      saveState(state);
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
