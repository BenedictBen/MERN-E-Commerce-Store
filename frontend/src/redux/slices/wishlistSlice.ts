import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WishlistItem {
  productId: string; 
  name: string;
  price: number;
  image?: string;
  images?: Array<{ url: string }>;  // New array format for multiple images
  slug?: string;
}

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<WishlistItem>) {
      const newItem = action.payload;

      // Check if item already exists in the wishlist
      // Only check by productId
      const existingItem = state.items.find(item => 
        item.productId === newItem.productId
      );

      if (!existingItem) {
        state.items.push(newItem);
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      const productId  = action.payload;
      // Only remove by productId
      state.items = state.items.filter(item => 
        item.productId !== productId
      );
    },
    clearWishlist(state) {
      state.items = [];
    },
    
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
