// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
   id:string;
   firstName:string;
   lastName:string;
   email:string
   role: string;
   accessToken: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
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
  }
};

const initialState: AuthState = loadState() || {
  isAuthenticated: false,
  user: null,
  accessToken:null
};
export const inactivityLogout = () => (dispatch: any) => {
  dispatch(logout());
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.accessToken = action.payload.accessToken;
      saveState(state);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
    },
    reset: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      saveState(state);
    },
  },
});

export const { login, logout, reset} = authSlice.actions;
export default authSlice.reducer;
