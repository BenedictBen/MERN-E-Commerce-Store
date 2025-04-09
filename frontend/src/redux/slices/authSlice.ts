import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearCart } from './cartSlice';
import { clearWishlist } from "./wishlistSlice";

interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isAdmin = action.payload.isAdmin;
      state.loading = false;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    registerStart(state) {
      state.loading = true;
      state.error = null;
    },
    registerSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isAdmin = action.payload.isAdmin;
      state.loading = false;
      state.error = null;
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.error = null;
    },
  },
});
// Create a thunk action that combines logout with clearing cart/wishlist
export const logoutUser = () => (dispatch: any) => {
  dispatch(authSlice.actions.logout());
  dispatch(clearCart());
  dispatch(clearWishlist());
};

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;