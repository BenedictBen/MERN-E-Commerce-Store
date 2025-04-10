// import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// interface StorageVariant {
//   value: string;
//   price?: number;
// }

// export interface ProductVariant {
//   color?: string | { name: string; code: string }[];
//   storage?: StorageVariant[] | string;
//   size?: string | string[];
//   plugType?: string;
//   bundle?: string;
//   finish?: string;
// }

// export interface Product {
//   id: number;
//   name: string;
//   price: number;
//   quantity: number;
//   image?: string;
//   slug?: string;
//   category?: {
//     main: string;
//     sub: string;
//   };
//   variants?: ProductVariant;
//   details?: {
//     manufacturer?: {
//       name: string;
//     };
//     specs?: any;
//   };
// }

// interface CartState {
//   items: Product[];
//   totalQuantity: number;
//   totalAmount: number;
//   wishlist: number[];
// }

// const initialState: CartState = {
//   items: [],
//   totalQuantity: 0,
//   totalAmount: 0,
//   wishlist: [],
// };

// // Updated helper function to handle partial product objects
// const getCartItemId = (item: Product | { id: number; variants?: ProductVariant }) => {
//   return `${item.id}-${JSON.stringify(item.variants || {})}`;
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addToCart(state, action: PayloadAction<Product>) {
//       const newItem = action.payload;
//       const cartItemId = getCartItemId(newItem);
      
//       const existingItem = state.items.find(item => 
//         getCartItemId(item) === cartItemId
//       );

//       if (existingItem) {
//         existingItem.quantity += newItem.quantity;
//       } else {
//         state.items.push({
//           ...newItem,
//           id: newItem.id,
//           name: newItem.name,
//           price: newItem.price,
//           quantity: newItem.quantity,
//           image: newItem.image,
//           slug: newItem.slug,
//           category: newItem.category,
//           variants: newItem.variants,
//           details: newItem.details
//         });
//       }
      
//       state.totalQuantity += newItem.quantity;
//       state.totalAmount += newItem.price * newItem.quantity;
//     },
//     removeFromCart(state, action: PayloadAction<{ id: number; variants?: ProductVariant }>) {
//       const { id, variants } = action.payload;
//       const cartItemId = getCartItemId({ id, variants });
      
//       const existingItemIndex = state.items.findIndex(
//         item => getCartItemId(item) === cartItemId
//       );
      
//       if (existingItemIndex >= 0) {
//         const existingItem = state.items[existingItemIndex];
//         state.totalQuantity -= existingItem.quantity;
//         state.totalAmount -= existingItem.price * existingItem.quantity;
//         state.items.splice(existingItemIndex, 1);
//       }
//     },
//     updateQuantity(
//       state,
//       action: PayloadAction<{ id: number; variants?: ProductVariant; quantity: number }>
//     ) {
//       const { id, variants, quantity } = action.payload;
//       const cartItemId = getCartItemId({ id, variants });
      
//       const existingItem = state.items.find(
//         item => getCartItemId(item) === cartItemId
//       );
      
//       if (existingItem) {
//         const quantityDiff = quantity - existingItem.quantity;
//         state.totalQuantity += quantityDiff;
//         state.totalAmount += existingItem.price * quantityDiff;
//         existingItem.quantity = quantity;
//       }
//     },
//     clearCart(state) {
//       state.items = [];
//       state.totalQuantity = 0;
//       state.totalAmount = 0;
//     },
//     toggleWishlist(state, action: PayloadAction<number>) {
//       const id = action.payload;
//       const index = state.wishlist.indexOf(id);
      
//       if (index === -1) {
//         state.wishlist.push(id);
//       } else {
//         state.wishlist.splice(index, 1);
//       }
//     },
//     loadCartFromStorage(state, action: PayloadAction<CartState>) {
//       return action.payload;
//     },
   
//     updateProductDetails(state, action: PayloadAction<Product>) {
//       const updatedProduct = action.payload;
//       const cartItemId = getCartItemId(updatedProduct);
      
//       const existingItem = state.items.find(
//         item => getCartItemId(item) === cartItemId
//       );
      
//       if (existingItem) {
//         Object.assign(existingItem, {
//           ...updatedProduct,
//           quantity: existingItem.quantity,
//         });
//       }
//     },
//   },
// });

// export const {
//   addToCart,
//   removeFromCart,
//   updateQuantity,
//   clearCart,
//   toggleWishlist,
//   loadCartFromStorage,
//   updateProductDetails,
// } = cartSlice.actions;

// export default cartSlice.reducer;


import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StorageVariant {
  value: string;
  price?: number;
}

export interface ProductVariant {
  color?: string | { name: string; code: string }[];
  storage?: StorageVariant[] | string;
  size?: string | string[];
  plugType?: string;
  bundle?: string;
  finish?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  images?: Array<{ url: string; alt?: string }>;
  slug?: string;
  category?: {
    main: string;
    sub: string;
  };
  variants?: ProductVariant;
  details?: {
    manufacturer?: {
      name: string;
    };
    specs?: any;
  };
  ratings?: {
    average: number;
    count: number;
  };
  oldPrice?: number;
}

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  variants?: ProductVariant;
}

interface CartState {
  items: Product[];
  totalQuantity: number;
  totalAmount: number;
  wishlist: WishlistItem[];  // Now stores minimal product data instead of just IDs
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  wishlist: [],
};

export const getCartItemId = (item: Product | { id: number; variants?: ProductVariant }) => {
  return `${item.id}-${JSON.stringify(item.variants || {})}`;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const newItem = action.payload;
      const cartItemId = getCartItemId(newItem);
      
      const existingItem = state.items.find(item => 
        getCartItemId(item) === cartItemId
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1;
      } else {
        state.items.push({
          ...newItem,
          quantity: newItem.quantity || 1,
        });
      }
      
      state.totalQuantity += newItem.quantity || 1;
      state.totalAmount += newItem.price * (newItem.quantity || 1);
    },
    removeFromCart(state, action: PayloadAction<{ id: number; variants?: ProductVariant }>) {
      const { id, variants } = action.payload;
      const cartItemId = getCartItemId({ id, variants });
      
      const existingItemIndex = state.items.findIndex(
        item => getCartItemId(item) === cartItemId
      );
      
      if (existingItemIndex >= 0) {
        const existingItem = state.items[existingItemIndex];
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.price * existingItem.quantity;
        state.items.splice(existingItemIndex, 1);
      }
    },
    updateQuantity(
      state,
      action: PayloadAction<{ id: number; variants?: ProductVariant; quantity: number }>
    ) {
      const { id, variants, quantity } = action.payload;
      const cartItemId = getCartItemId({ id, variants });
      
      const existingItem = state.items.find(
        item => getCartItemId(item) === cartItemId
      );
      
      if (existingItem) {
        const quantityDiff = quantity - existingItem.quantity;
        state.totalQuantity += quantityDiff;
        state.totalAmount += existingItem.price * quantityDiff;
        existingItem.quantity = quantity;
      }
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.wishlist = []; // Also clear wishlist when clearing cart
    },
    // Update your toggleWishlist reducer
toggleWishlist(state, action: PayloadAction<Product>) {
  const product = action.payload;
  const existingIndex = state.wishlist.findIndex(item => item.id === product.id);
  
  if (existingIndex === -1) {
    // Add minimal product data to wishlist
    state.wishlist.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.images?.[0]?.url,
      variants: product.variants
    });
  } else {
    state.wishlist.splice(existingIndex, 1);
  }
},
    loadCartFromStorage(state, action: PayloadAction<CartState>) {
      return action.payload;
    },
    updateProductDetails(state, action: PayloadAction<Product>) {
      const updatedProduct = action.payload;
      const cartItemId = getCartItemId(updatedProduct);
      
      const existingItem = state.items.find(
        item => getCartItemId(item) === cartItemId
      );
      
      if (existingItem) {
        Object.assign(existingItem, {
          ...updatedProduct,
          quantity: existingItem.quantity,
        });
      }
    },
  },
});

// Selectors
// Update your selectWishlistItems selector
export const selectWishlistItems = (state: { cart: CartState }) => {
  return state.cart.wishlist; // Now returns the stored wishlist items directly
};

export const selectWishlistCount = (state: { cart: CartState }) => {
  return state.cart.wishlist.length;
};

// export const selectIsInWishlist = (state: { cart: CartState }, productId: number) => {
//   return state.cart.wishlist.includes(productId);
// };

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleWishlist,
  loadCartFromStorage,
  updateProductDetails,
} = cartSlice.actions;

export default cartSlice.reducer;