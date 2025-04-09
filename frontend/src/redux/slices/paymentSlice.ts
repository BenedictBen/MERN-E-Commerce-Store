import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaymentItem {
  id: string; // Changed from string to number
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface PaymentState {
  id: string | null; // Added ID field for the payment itself
  orderId: string | null;
  amount: number;
  currency: string;
  items: PaymentItem[];
  paymentMethod: string;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  } | null;
  status: 'idle' | 'processing' | 'success' | 'failed';
  error: string | null;
  metadata?: {  // Add this optional property
    paymentGateway?: string;
    reference?: string;
    [key: string]: any;
  };
  createdAt?: string; // Optional timestamp
  updatedAt?: string; // Optional timestamp
}

const initialState: PaymentState = {
  id: null,
  orderId: null,
  amount: 0,
  currency: 'USD',
  items: [],
  paymentMethod: '',
  shippingAddress: null,
  status: 'idle',
  error: null
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentInfo: (state, action: PayloadAction<{
      id: string;
      orderId: string;
      amount: number;
      items: PaymentItem[];
      paymentMethod: string;
      shippingAddress: PaymentState['shippingAddress'];
    }>) => {
      state.id = action.payload.id;
      state.orderId = action.payload.orderId;
      state.amount = action.payload.amount;
      state.items = action.payload.items;
      state.paymentMethod = action.payload.paymentMethod;
      state.shippingAddress = action.payload.shippingAddress;
      state.status = 'processing';
      state.error = null;
      state.createdAt = new Date().toISOString();
    },
    paymentSuccess: (state, action: PayloadAction<{ paymentId: string }>) => {
      state.id = action.payload.paymentId;
      state.status = 'success';
      state.error = null;
      state.updatedAt = new Date().toISOString();
    },
    paymentFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.status = 'failed';
      state.error = action.payload.error;
      state.updatedAt = new Date().toISOString();
    },
    resetPayment: (state) => {
      return initialState; // Complete reset
    },
    updatePaymentStatus: (state, action: PayloadAction<{
      status: PaymentState['status'];
      error?: string;
      metadata?: PaymentState['metadata'];  // Add this
    }>) => {
      state.status = action.payload.status;
      if (action.payload.error) {
        state.error = action.payload.error;
      }
      state.updatedAt = new Date().toISOString();
    }
  }
});

export const { 
  setPaymentInfo, 
  paymentSuccess, 
  paymentFailed, 
  resetPayment,
  updatePaymentStatus
} = paymentSlice.actions;

export default paymentSlice.reducer;