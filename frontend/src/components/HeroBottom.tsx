"use client"

import Image from "next/image";
import React from "react";

const HeroBottom = () => {
  return (
    <div className="!my-6 flex items-center justify-center flex-col lg:flex-row gap-4">
      {[
        {
          id: 1,
          image: "/home/homev2-new-arrivals.webp",
          title: "Work and Play",
          des: "Enjoy a 3-year guarantee included",
          sub: "new arrival",
          button: "Shop Now",
          discount: "From $399",
          bg: "#20894d",
          href: "/electronic",
        },
        {
          id: 2,
          image: "/home/home-clearance.webp",
          title: "Kitchen Bundle",
          des: "Get up to 15% off Kitchen Appliances",
          sub: "clearance",
          button: "Shop Now",
          discount: "Save 15%",
          bg: "#1d2128",
          href: "/home-garden",
        },
        {
          id: 3,
          image: "/home/homev2-featured.webp",
          title: "Hygienic Saving",
          des: "Your best shave, or your money back",
          sub: "featured",
          button: "Shop Now",
          discount: "Up to 25% ",
          bg: "#6b6619",
          href: "/electronic",
        },
      ].map((item, index) => (
        <div
          key={index}
          className={`relative flex flex-col lg:flex-row gap-2 ${
            item.id === 1
              ? "[color:#20894d]" // Green for ID 1
              : item.id === 2
              ? "[color:#1d2128]" // Dark for ID 2
              : item.id === 3
              ? "[color:#6b6619]" // Yellow for ID 3
              : "text-black" // Default fallback
          }`}
        >
          <div className="relative !px-2 flex transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
            {/* <Image src={item.image} alt="images" width={400} height={300} /> */}
            <img
    src={item.image}
    alt="images"
    
    className="w-full"
  />
          </div>

          <div className="flex flex-col gap-2 absolute top-4 left-6">
            <p className={`!text-xs uppercase !font-bold `}>{item.sub}</p>
            <h1 className="!text-lg !font-bold">{item.title}</h1>
            <p className="max-w-44">{item.des}</p>
            <button className="!text-left !text-xs !uppercase !font-bold">{item.button}</button>
          </div>
          <div
            className={`absolute top-2 right-3 rounded-full w-16 h-16  text-white`}
            style={{ backgroundColor: item.bg }}
          >
            <p className="text-center !p-3 ">{item.discount}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroBottom;
