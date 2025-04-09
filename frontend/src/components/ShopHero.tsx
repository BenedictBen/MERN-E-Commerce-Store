"use client";

import Image from "next/image";
import React from "react";

interface ShopHeroProps {
  category?: string; // Add a category prop
}

const ShopHero: React.FC<ShopHeroProps> = ({ category = "Shop" }) => {
  return (
    <div className="!px-4 lg:!px-6 !py-6 relative">
      <div className="relative w-full flex justify-center mx-auto">
     
  <Image
    src="/shop/shop_header.jpg"
    alt="Shop Header"
    width={1200} 
    height={400}  
    className="object-cover w-full h-auto m-auto"
  />
      </div>
      <h1 className=" text-[#b96459] absolute left-16  top-16 md:top-24 lg:left-24 lg:top-36 !text-xl lg:!text-5xl !font-bold">
        {" "}
        {category}{" "}
      </h1>
    </div>
  );
};

export default ShopHero;
