import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice"; 
import paymentReducer from "./slices/paymentSlice";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ['user', 'isAuthenticated', 'isAdmin'], 
};

const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["items", "totalQuantity", "totalAmount", "wishlist"],
};

const wishlistPersistConfig = {
  key: "wishlist",
  storage,
  whitelist: ["items"], // Persisting only the wishlist items
};

const paymentPersistConfig = {
  key: "payment",
  storage,
  whitelist: ["id", "orderId", "amount", "items", "paymentMethod", "shippingAddress", "status"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedWishlistReducer = persistReducer(wishlistPersistConfig, wishlistReducer);
const persistedPaymentReducer = persistReducer(paymentPersistConfig, paymentReducer);
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    cart: persistedCartReducer,
    wishlist: persistedWishlistReducer, // Add wishlist reducer here
    payment: persistedPaymentReducer 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for redux-persist
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;