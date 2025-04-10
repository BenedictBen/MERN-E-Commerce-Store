"use client";

import Image from "next/image";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { 
  setPaymentInfo, 
  updatePaymentStatus,
  paymentSuccess,
  paymentFailed 
} from "@/redux/slices/paymentSlice";

// Helper function to ensure proper image URL
const getImageUrl = (url: string | undefined): string => {
  if (!url) return '/shop/vr000.webp'; // Default fallback image
  
  // Handle absolute URLs
  if (url.startsWith('http') || url.startsWith('https')) return url;
  
  // Handle local development paths
  if (process.env.NODE_ENV === 'development') {
    if (url.startsWith('/uploads/')) return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
    if (url.startsWith('public/')) return `${process.env.NEXT_PUBLIC_API_URL}/${url}`;
  }
  
  // Handle production paths
  if (url.startsWith('/uploads/') || url.startsWith('/public/')) {
    return `${process.env.NEXT_PUBLIC_API_URL || ''}${url}`;
  }
  
  return url;
};


interface CheckOutOrderProps {
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    country: string;
    orderNotes?: string;
  };
  isBillingValid: boolean; // Add this prop
  
}

const CheckOutOrder = ({ shippingAddress, isBillingValid }: CheckOutOrderProps)  => {
  const router = useRouter();
  const { items, totalQuantity, totalAmount } = useSelector(
    (state: RootState) => state.cart
  );
const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  const dispatch = useDispatch();

  // Calculate subtotal from items
  const subtotal = items.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  // Shipping cost (example flat rate)
  const shippingCost = 10.00;
  const total = subtotal + shippingCost;


  const handlePayment = async () => {  

    try {
      setLoading(true);
      dispatch(updatePaymentStatus({ status: 'processing' }));
      // First create the order
      const orderData = await createOrder();

       // Dispatch payment info to Redux
       dispatch(setPaymentInfo({
        id: orderData._id, // Using the actual order ID from backend
        orderId: orderData._id,
        amount: total,
        items: items.map(item => ({
          id: item.id.toString(), // Convert to string
          productId: item.id.toString(), // Ensure string
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image || '', // Handle potential undefined
        })),
        paymentMethod,
        shippingAddress: {
          address: shippingAddress.address,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
          phone: shippingAddress.phone
        }
      }));
      
      // Then initialize payment
      const paymentData = await initializePayment(orderData._id);


         // Update payment status
         dispatch(updatePaymentStatus({ 
          status: 'processing',
          metadata: {
            paymentGateway: 'Paystack',
            reference: paymentData.reference
          }
        }));
      
      // Redirect to Paystack payment page
      window.location.href = paymentData.transaction.data.authorization_url;
    } catch (error: any) {
      console.error("Payment error:", error.message);
      // toast.error(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };
  
  const createOrder = async () => {
    try {
      const response = await fetch('/api/auth/payments/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderItems: items.map(item => ({
            product: item.id,
            name: item.name,
            qty: item.quantity,
            price: item.price,
            image: item.image,
          })),
          shippingAddress: shippingAddress,
          paymentMethod: 'Paystack',
        }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Order creation failed');
      }
  
      console.log("Order created successfully:", data);
      return data;
      
    } catch (error: any) {
      console.error("Order creation error:", error.message);
      throw error; // Re-throw to be caught in handlePayment
    }
  };
  
  const initializePayment = async (orderId: string) => {
    try {
      const response = await fetch('/api/auth/payments/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId,
        }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Payment initialization failed');
      }
  
      console.log("Payment initialization successful:", data);
      return data;
      
    } catch (error: any) {
      console.error("Payment initialization error:", error.message);
      throw error; // Re-throw to be caught in handlePayment
    }
  };
  

  return (
    <div className="">
      <h2 className="!font-semibold !text-lg lg:!text-2xl !my-6">
        Your order
      </h2>

      <div className="!py-4 !px-4 bg-[#fbfbfc]">
        <div className="">
          <p className="!font-semibold">Product</p>
          
          {/* Products List - Vertical Stack */}
          <div className="!space-y-4">
            {items.map((item,index) => (
              <div key={index} className="flex flex-col">
                <div className="flex items-center gap-4">
                  {item.image && (
                    <Image
                      src={getImageUrl(item.image)}
                      width={40}
                      height={40}
                      alt={item.name || "Product image"}
                      className="object-contain"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p>{item.name}</p>
                      <p>{item.quantity}x</p>
                    </div>
                    <p className="!text-sm text-gray-500">
                      Vendor: {item.details?.manufacturer?.name || "No vendor specified"}
                    </p>
                    <p className="text-right !font-medium">$ {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <hr className="!my-4" />
          
          {/* Shipping Information - Only shown once */}
          <div>
            <h3 className="font-semibold">
              Shipping: Standard
            </h3>
            <div className="flex justify-between text-gray-400 !my-2">
              <p>Flat rate:</p>
              <p>$ {shippingCost.toFixed(2)}</p>
            </div>
          </div>

          <hr className="!my-4" />
          
          {/* Order Totals */}
          <div className="!space-y-2">
            <div className="flex justify-between">
              <p>Subtotal:</p>
              <p>$ {subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping:</p>
              <p>$ {shippingCost.toFixed(2)}</p>
            </div>
            <div className="flex justify-between !font-semibold text-black">
              <p>Total</p>
              <p>$ {total.toFixed(2)}</p>
            </div>
          </div>
          {/* Payment Method Selection */}
        <div className="!my-6">
          <h3 className="!font-semibold !my-3">Payment Method</h3>
          <div className="!space-y-2">
            <label className="flex items-center !space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value="Paystack"
                checked={paymentMethod === 'Paystack'}
                onChange={() => setPaymentMethod('Paystack')}
                className="h-4 w-4 text-blue-600"
              />
              <span>Pay with Paystack</span>
            </label>
          </div>
        </div>

          {/* Place Order Button */}
        <button
          onClick={handlePayment}
          disabled={loading || !paymentMethod || !isBillingValid}
          className="!my-6 w-full !bg-[#6e2eff] !text-white !py-2 !px-4 rounded hover:!bg-[#906edd] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
        {!isBillingValid && (
        <p className="text-red-500 text-sm mt-2">
          Please complete all required billing information
        </p>
      )}
        </div>
      </div>
    </div>
  );
};

export default CheckOutOrder;


// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useSelector, useDispatch } from "react-redux";
// import type { RootState } from "@/redux/store";
// import {
//   setPaymentInfo,
//   updatePaymentStatus
// } from "@/redux/slices/paymentSlice";

// const getImageUrl = (url: string | undefined): string => {
//   if (!url) return "/shop/vr000.webp";
//   if (url.startsWith("http")) return url;
//   if (process.env.NODE_ENV === "development") {
//     if (url.startsWith("/uploads/")) return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
//     if (url.startsWith("public/")) return `${process.env.NEXT_PUBLIC_API_URL}/${url}`;
//   }
//   if (url.startsWith("/uploads/") || url.startsWith("/public/")) {
//     return `${process.env.NEXT_PUBLIC_API_URL || ""}${url}`;
//   }
//   return url;
// };

// interface CheckOutOrderProps {
//   shippingAddress: {
//     address: string;
//     city: string;
//     postalCode: string;
//     phone: string;
//     country: string;
//     orderNotes?: string;
//   };
//   isBillingValid: boolean;
// }

// const CheckOutOrder = ({
//   shippingAddress,
//   isBillingValid
// }: CheckOutOrderProps) => {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const searchParams = useSearchParams();

//   const fromWishlist = searchParams.get("fromWishlist") === "true";
//   const productId = searchParams.get("productId");

//   const cartItems = useSelector((state: RootState) => state.cart.items);
//   const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

//   let finalItems: {
//     id: string;
//     name: string;
//     price: number;
//     quantity: number;
//     image?: string;
//   }[] = [];

//   if (fromWishlist && productId) {
//   const wishlistItem = wishlistItems.find(item => item.productId === productId);
//   console.log("✅ Found wishlist item:", wishlistItem);

//     if (wishlistItem) {
//       finalItems = [{
//         id: wishlistItem.productId.toString(),
//         name: wishlistItem.name,
//         price: wishlistItem.price,
//         quantity: 1,
//         image: wishlistItem.images?.[0]?.url // ✅ safe access
//       }];
//     } else {
//       router.push("/wishlist");
//     }
//   } else {
//     finalItems = cartItems.map(item => ({
//       id: item.id.toString(),
//       name: item.name,
//       price: item.price,
//       quantity: item.quantity,
//       image: item.image
//     }));
//   }

//   const [loading, setLoading] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState("");

//   const subtotal = finalItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   const shippingCost = 10.0;
//   const total = subtotal + shippingCost;

//   const handlePayment = async () => {
//     try {
//       setLoading(true);
//       dispatch(updatePaymentStatus({ status: "processing" }));

//       const orderData = await createOrder();

//       dispatch(
//         setPaymentInfo({
//           id: orderData._id,
//           orderId: orderData._id,
//           amount: total,
//           items: finalItems.map(item => ({
//             id: item.id.toString(),
//             productId: item.id.toString(),
//             name: item.name,
//             quantity: item.quantity,
//             price: item.price,
//             image: item.image || ""
//           })),
//           paymentMethod,
//           shippingAddress
//         })
//       );

//       const paymentData = await initializePayment(orderData._id);

//       dispatch(
//         updatePaymentStatus({
//           status: "processing",
//           metadata: {
//             paymentGateway: "Paystack",
//             reference: paymentData.reference
//           }
//         })
//       );

//       window.location.href = paymentData.transaction.data.authorization_url;
//     } catch (error: any) {
//       console.error("Payment error:", error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createOrder = async () => {
//     const response = await fetch("/api/auth/payments/orders", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         orderItems: finalItems.map(item => ({
//           product: item.id,
//           name: item.name,
//           qty: item.quantity,
//           price: item.price,
//           image: item.image
//         })),
//         shippingAddress,
//         paymentMethod: "Paystack"
//       })
//     });

//     const data = await response.json();
//     if (!response.ok) {
//       throw new Error(data.message || "Order creation failed");
//     }

//     return data;
//   };

//   const initializePayment = async (orderId: string) => {
//     const response = await fetch("/api/auth/payments/pay", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ orderId })
//     });

//     const data = await response.json();
//     if (!response.ok) {
//       throw new Error(data.message || "Payment initialization failed");
//     }

//     return data;
//   };

//   return (
//     <div>
//       <h2 className="!font-semibold !text-lg lg:!text-2xl !my-6">Your order</h2>

//       <div className="!py-4 !px-4 bg-[#fbfbfc]">
//         <p className="!font-semibold">Product</p>
//         <div className="!space-y-4">
//           {finalItems.map((item, index) => (
//             <div key={index} className="flex flex-col">
//               <div className="flex items-center gap-4">
//                 {item.image && (
//                   <Image
//                     src={getImageUrl(item.image)}
//                     width={40}
//                     height={40}
//                     alt={item.name || "Product image"}
//                     className="object-contain"
//                   />
//                 )}
//                 <div className="flex-1">
//                   <div className="flex justify-between">
//                     <p>{item.name}</p>
//                     <p>{item.quantity}x</p>
//                   </div>
//                   <p className="text-right !font-medium">
//                     $ {(item.price * item.quantity).toFixed(2)}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <hr className="!my-4" />

//         <div>
//           <h3 className="font-semibold">Shipping: Standard</h3>
//           <div className="flex justify-between text-gray-400 !my-2">
//             <p>Flat rate:</p>
//             <p>$ {shippingCost.toFixed(2)}</p>
//           </div>
//         </div>

//         <hr className="!my-4" />

//         <div className="!space-y-2">
//           <div className="flex justify-between">
//             <p>Subtotal:</p>
//             <p>$ {subtotal.toFixed(2)}</p>
//           </div>
//           <div className="flex justify-between">
//             <p>Shipping:</p>
//             <p>$ {shippingCost.toFixed(2)}</p>
//           </div>
//           <div className="flex justify-between !font-semibold text-black">
//             <p>Total</p>
//             <p>$ {total.toFixed(2)}</p>
//           </div>
//         </div>

//         <div className="!my-6">
//           <h3 className="!font-semibold !my-3">Payment Method</h3>
//           <label className="flex items-center !space-x-2">
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="Paystack"
//               checked={paymentMethod === "Paystack"}
//               onChange={() => setPaymentMethod("Paystack")}
//               className="h-4 w-4 text-blue-600"
//             />
//             <span>Pay with Paystack</span>
//           </label>
//         </div>

//         <button
//           onClick={handlePayment}
//           disabled={loading || !paymentMethod || !isBillingValid}
//           className="!my-6 w-full !bg-[#6e2eff] !text-white !py-2 !px-4 rounded hover:!bg-[#906edd] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
//         >
//           {loading ? "Processing..." : "Place Order"}
//         </button>
//         {!isBillingValid && (
//           <p className="text-red-500 text-sm mt-2">
//             Please complete all required billing information
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CheckOutOrder;
