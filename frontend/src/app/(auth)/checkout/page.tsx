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


// Combine cart and wishlist items for display
const allItems = [...cartItems];

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

