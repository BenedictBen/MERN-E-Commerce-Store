import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  images?: Array<{ url: string }>; // New array format for multiple images
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
      const existingItem = state.items.find(item => item.id === newItem.id);

      if (!existingItem) {
        state.items.push(newItem);
      }
    },
    removeFromWishlist(state, action: PayloadAction<number>) {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
    },
    clearWishlist(state) {
      state.items = [];
    },
    
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
