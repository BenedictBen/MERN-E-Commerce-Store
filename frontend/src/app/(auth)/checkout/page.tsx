// "use client";
// import React, { useState } from "react";
// import BillingForm from "@/components/BillingForm";
// import CheckOutOrder from "@/components/CheckOutOrder";
// import { useSelector } from "react-redux";
// import type { RootState } from "@/redux/store";
// import Link from "next/link";

// type FormData = {
//   address: string;
//   city: string;
//   postalCode: string;
//   phone: string;
//   country: string;
//   orderNotes?: string;
// };

// const CheckOutPage = () => {
//   const { items: cartItems} = useSelector(
//     (state: RootState) => state.cart
//   );

//   const { items: wishlistItems } = useSelector(
//     (state: RootState) => state.wishlist
//   );

// // Combine cart and wishlist items for display
// const allItems = [...cartItems, ...wishlistItems];

//   const [shippingAddress, setShippingAddress] = useState<FormData>({
//     address: '',
//     city: '',
//     postalCode: '',
//     phone: '',
//     country: '',
//     orderNotes: ''
//   });
//   const [isBillingValid, setIsBillingValid] = useState(false);

//   const handleShippingAddress = (data: FormData) => {

//     setShippingAddress(data);
//   };

//   const handleValidationChange = (isValid: boolean) => {
//     setIsBillingValid(isValid);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center w-full! !px-4 lg:!px-12">
//       <h2 className="!font-bold !text-4xl !mt-4">Checkout</h2>

//       <div className="bg-[#ecfaf7] flex flex-col lg:flex-row items-start lg:items-center justify-start lg:justify-between w-full! !px-6 py-4!">
//       <div className="flex flex-col  w-full md:w-auto"> 
//     {allItems.map((item,index) => (
//       <div key={index} className="flex flex-col">
//         <p className="text-[#1ebf9b] !text-sm">
//           <>
//           {item.name}
//           {/* {wishlistItems.some(wishItem => wishItem.productId === item.id) && 
//                   <span className="text-xs text-gray-500 ml-2">(from wishlist)</span>} */}
//           </>

//         </p>
//       </div>
//     ))}
//   </div>
//     <Link href="/cart">
//         <button className="text-[#1ebf9b]! !border-2  !px-2 !py-3 text-sm! cursor-pointer">View cart</button>
        
//         </Link>
//       </div>

//       <div className="flex w-full flex-col lg:flex-row justify-center gap-4">
//         <div className="w-full lg:w-3/5">
//           <BillingForm onShippingAddress={handleShippingAddress}  onValidationChange={handleValidationChange}/>
//         </div>
//         <div className="w-full lg:w-2/5">
//           <CheckOutOrder shippingAddress={shippingAddress}  isBillingValid={isBillingValid}/>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckOutPage;


"use client";
import React, { useState, useEffect } from "react";
import BillingForm from "@/components/BillingForm";
import CheckOutOrder from "@/components/CheckOutOrder";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type FormData = {
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  country: string;
  orderNotes?: string;
};

// Define the Product type based on your cart slice
type Product = {
  id: number; // Changed to number to match your actual data
  quantity: number;
  name: string;
  price: number;
  // Add other Product properties as needed
};

// Define the WishlistItem type based on your wishlist slice
type WishlistItem = {
  productId: string;
  name: string;
  price: number;
  image?: string;
  images?: Array<{ url: string }>;
  slug?: string;
};

// Create a unified type for display items with id as string
type DisplayItem = {
  id: string; // Keep as string for consistency
  name: string;
  price: number;
  quantity: number;
  isFromWishlist?: boolean;
  // Add other common properties here
};

const CheckOutPage = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  
  const { items: cartItems } = useSelector(
    (state: RootState) => state.cart
  );

  const { items: wishlistItems } = useSelector(
    (state: RootState) => state.wishlist
  );

  const [displayItems, setDisplayItems] = useState<DisplayItem[]>([]);

  useEffect(() => {
    // Convert cart items to DisplayItem format with proper ID conversion
    const cartDisplayItems: DisplayItem[] = cartItems.map(item => ({
      id: item.id.toString(), // Convert number ID to string
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      isFromWishlist: false
    }));

    // If there's a productId in URL params (coming from wishlist)
    if (productId) {
      // Find the specific product in wishlist
      const wishlistProduct = wishlistItems.find(item => item.productId === productId);
      
      // If product exists in wishlist, add it to display items
      if (wishlistProduct) {
        const wishlistDisplayItem: DisplayItem = {
          id: wishlistProduct.productId,
          name: wishlistProduct.name,
          price: wishlistProduct.price,
          quantity: 1, // Default quantity for wishlist items
          isFromWishlist: true
        };
        setDisplayItems([...cartDisplayItems, wishlistDisplayItem]);
        return;
      }
    }
    
    setDisplayItems(cartDisplayItems);
  }, [productId, cartItems, wishlistItems]);

  const [shippingAddress, setShippingAddress] = useState<FormData>({
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    country: '',
    orderNotes: ''
  });
  
  const [isBillingValid, setIsBillingValid] = useState(false);

  const handleShippingAddress = (data: FormData) => {
    setShippingAddress(data);
  };

  const handleValidationChange = (isValid: boolean) => {
    setIsBillingValid(isValid);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full! !px-4 lg:!px-12">
      <h2 className="!font-bold !text-4xl !mt-4">Checkout</h2>

      <div className="bg-[#ecfaf7] flex flex-col lg:flex-row items-start lg:items-center justify-start lg:justify-between w-full! !px-6 py-4!">
        <div className="flex flex-col w-full md:w-auto"> 
          {displayItems.map((item, index) => (
            <div key={index} className="flex flex-col">
              <p className="text-[#1ebf9b] !text-sm">
                {item.name}
                {item.isFromWishlist && 
                  <span className="text-xs text-gray-500 ml-2">(from wishlist)</span>}
              </p>
            </div>
          ))}
        </div>
        <Link href="/cart">
          <button className="text-[#1ebf9b]! !border-2 !px-2 !py-3 text-sm! cursor-pointer">
            View cart
          </button>
        </Link>
      </div>

      <div className="flex w-full flex-col lg:flex-row justify-center gap-4">
        <div className="w-full lg:w-3/5">
          <BillingForm 
            onShippingAddress={handleShippingAddress}  
            onValidationChange={handleValidationChange}
          />
        </div>
        <div className="w-full lg:w-2/5">
          <CheckOutOrder 
            shippingAddress={shippingAddress}  
            isBillingValid={isBillingValid}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckOutPage;