"use client";
import React, { useState } from "react";
import BillingForm from "@/components/BillingForm";
import CheckOutOrder from "@/components/CheckOutOrder";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import Link from "next/link";

type FormData = {
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  country: string;
  orderNotes?: string;
};

const CheckOutPage = () => {
  const { items: cartItems} = useSelector(
    (state: RootState) => state.cart
  );

  const { items: wishlistItems } = useSelector(
    (state: RootState) => state.wishlist
  );

// Combine cart and wishlist items for display
const allItems = [...cartItems, ...wishlistItems];

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
      <div className="flex flex-col  w-full md:w-auto"> 
    {allItems.map((item,index) => (
      <div key={index} className="flex flex-col">
        <p className="text-[#1ebf9b] !text-sm">
          <>
          {item.name}
          {/* {wishlistItems.some(wishItem => wishItem.productId === item.id) && 
                  <span className="text-xs text-gray-500 ml-2">(from wishlist)</span>} */}
          </>

        </p>
      </div>
    ))}
  </div>
    <Link href="/cart">
        <button className="text-[#1ebf9b]! !border-2  !px-2 !py-3 text-sm! cursor-pointer">View cart</button>
        
        </Link>
      </div>

      <div className="flex w-full flex-col lg:flex-row justify-center gap-4">
        <div className="w-full lg:w-3/5">
          <BillingForm onShippingAddress={handleShippingAddress}  onValidationChange={handleValidationChange}/>
        </div>
        <div className="w-full lg:w-2/5">
          <CheckOutOrder shippingAddress={shippingAddress}  isBillingValid={isBillingValid}/>
        </div>
      </div>
    </div>
  );
};

export default CheckOutPage;

// "use client";
// import React, { useState, useEffect } from "react";
// import BillingForm from "@/components/BillingForm";
// import CheckOutOrder from "@/components/CheckOutOrder";
// import { useSelector } from "react-redux";
// import type { RootState } from "@/redux/store";
// import Link from "next/link";
// import { useSearchParams, useRouter } from "next/navigation";

// type FormData = {
//   address: string;
//   city: string;
//   postalCode: string;
//   phone: string;
//   country: string;
//   orderNotes?: string;
// };

// type DisplayItem = {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image?: string;
//   isFromWishlist?: boolean;
// };

// const CheckOutPage = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const fromWishlist = searchParams.get('fromWishlist');
//   const productId = searchParams.get('productId');
  
//   const { items: wishlistItems } = useSelector(
//     (state: RootState) => state.wishlist
//   );

//   const { items: cartItems } = useSelector(
//     (state: RootState) => state.cart
//   );

//   const [displayItems, setDisplayItems] = useState<DisplayItem[]>([]);

//   // useEffect(() => {
//   //   if (fromWishlist && productId) {
//   //     // Handle wishlist product flow
//   //     const wishlistItem = wishlistItems.find(item => item.productId === productId);
      
//   //     if (wishlistItem) {
//   //       setDisplayItems([{
//   //         id: wishlistItem.productId,
//   //         name: wishlistItem.name,
//   //         price: wishlistItem.price,
//   //         quantity: 1,
//   //         isFromWishlist: true
//   //       }]);
//   //     } else {
//   //       // If wishlist item not found, redirect back
//   //       router.push('/wishlist');
//   //     }
//   //   } else {
//   //     // Normal cart flow
//   //     const cartDisplayItems = cartItems.map(item => ({
//   //       id: item.id.toString(),
//   //       name: item.name,
//   //       price: item.price,
//   //       quantity: item.quantity,
//   //       isFromWishlist: false
//   //     }));
//   //     setDisplayItems(cartDisplayItems);
//   //   }
//   // }, [fromWishlist, productId, wishlistItems, cartItems, router]);


//   useEffect(() => {
//     console.log("Wishlist items from Redux:", wishlistItems);
//     console.log("URL params - fromWishlist:", fromWishlist, "productId:", productId);
  
//     // First check if we're coming from wishlist
//     if (fromWishlist === 'true') {
//       console.log("Processing wishlist checkout");
      
//       if (!productId) {
//         console.log("No productId, redirecting to wishlist");
//         router.push('/wishlist');
//         return;
//       }
  
//       const wishlistItem = wishlistItems.find(item => item.productId === productId);
//       console.log("Found wishlist item:", wishlistItem);
  
//       if (wishlistItem) {
//         console.log("Setting wishlist item for checkout");
//         setDisplayItems([{
//           id: wishlistItem.productId,
//           name: wishlistItem.name,
//           price: wishlistItem.price,
//           quantity: 1,
//           image: wishlistItem.images?.[0]?.url,
//           isFromWishlist: true
//         }]);
//         return;
//       } else {
//         console.log("Wishlist item not found, redirecting...");
//         router.push('/wishlist');
//         return;
//       }
//     }
  
//     // Fallback to cart items only if not from wishlist
//     console.log("Using cart items instead");
//     const cartDisplayItems = cartItems.map(item => ({
//       id: item.id.toString(),
//       name: item.name,
//       price: item.price,
//       quantity: item.quantity,
//       image: item.image,
//       isFromWishlist: false
//     }));
//     setDisplayItems(cartDisplayItems);
//   }, [fromWishlist, productId, wishlistItems, cartItems, router]);
  

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

//   useEffect(() => {
//     console.log("🧾 Final checkout items:", displayItems);
//   }, [displayItems]);
  
//   return (
//     <div className="flex flex-col items-center justify-center w-full! !px-4 lg:!px-12">
//       <h2 className="!font-bold !text-4xl !mt-4">Checkout</h2>

//       <div className="bg-[#ecfaf7] flex flex-col lg:flex-row items-start lg:items-center justify-start lg:justify-between w-full! !px-6 py-4!">
//         <div className="flex flex-col w-full md:w-auto"> 
//           {displayItems.map((item, index) => (
//             <div key={index} className="flex flex-col">
//               <p className="text-[#1ebf9b] !text-sm">
//                 {item.name}
//                 {item.isFromWishlist && 
//                   <span className="text-xs text-gray-500 ml-2">(from wishlist)</span>}
//               </p>
//             </div>
//           ))}
//         </div>
//         <Link href={displayItems.some(i => i.isFromWishlist) ? "/wishlist" : "/cart"}>
//           <button className="text-[#1ebf9b]! !border-2 !px-2 !py-3 text-sm! cursor-pointer">
//             {displayItems.some(i => i.isFromWishlist) ? "Back to Wishlist" : "View Cart"}
//           </button>
//         </Link>
//       </div>

//       <div className="flex w-full flex-col lg:flex-row justify-center gap-4">
//         <div className="w-full lg:w-3/5">
//           <BillingForm 
//             onShippingAddress={handleShippingAddress}  
//             onValidationChange={handleValidationChange}
//           />
//         </div>
//         <div className="w-full lg:w-2/5">
//           <CheckOutOrder 
//             shippingAddress={shippingAddress}  
//             isBillingValid={isBillingValid}
//           />
         
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckOutPage;