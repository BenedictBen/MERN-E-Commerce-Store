// import { configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
// import authReducer from "./slices/authSlice";
// import cartReducer from "./slices/cartSlice";
// import wishlistReducer from "./slices/wishlistSlice"; 
// import paymentReducer from "./slices/paymentSlice";

// const authPersistConfig = {
//   key: "auth",
//   storage,
//   whitelist: ['user', 'isAuthenticated', 'isAdmin'], 
// };

// const cartPersistConfig = {
//   key: "cart",
//   storage,
//   whitelist: ["items", "totalQuantity", "totalAmount", "wishlist"],
// };

// const wishlistPersistConfig = {
//   key: "wishlist",
//   storage,
//   whitelist: ["items"], // Persisting only the wishlist items
// };

// const paymentPersistConfig = {
//   key: "payment",
//   storage,
//   whitelist: ["id", "orderId", "amount", "items", "paymentMethod", "shippingAddress", "status"],
// };

// const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
// const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
// const persistedWishlistReducer = persistReducer(wishlistPersistConfig, wishlistReducer);
// const persistedPaymentReducer = persistReducer(paymentPersistConfig, paymentReducer);
// export const store = configureStore({
//   reducer: {
//     auth: persistedAuthReducer,
//     cart: persistedCartReducer,
//     wishlist: persistedWishlistReducer, // Add wishlist reducer here
//     payment: persistedPaymentReducer 
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false, // Needed for redux-persist
//     }),
// });

// export const persistor = persistStore(store);

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import paymentReducer from "./slices/paymentSlice";

// Custom transform to clear cart/wishlist when user logs out
const authTransform = createTransform(
  // transform state on its way to being serialized
  (inboundState: any) => inboundState,
  // transform state being rehydrated
  (outboundState: any, key) => {
    if (key === 'cart' || key === 'wishlist') {
      const authState = JSON.parse(localStorage.getItem('persist:auth') || '{}');
      if (!authState.isAuthenticated || authState.isAuthenticated === 'false') {
        return key === 'cart' 
          ? { items: [], totalQuantity: 0, totalAmount: 0, wishlist: [] } 
          : { items: [] };
      }
    }
    return outboundState;
  },
  { whitelist: ['cart', 'wishlist'] }
);

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ['user', 'isAuthenticated', 'isAdmin'],
};

const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["items", "totalQuantity", "totalAmount", "wishlist"],
  transforms: [authTransform],
};

const wishlistPersistConfig = {
  key: "wishlist",
  storage,
  whitelist: ["items"],
  transforms: [authTransform],
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
    wishlist: persistedWishlistReducer,
    payment: persistedPaymentReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;