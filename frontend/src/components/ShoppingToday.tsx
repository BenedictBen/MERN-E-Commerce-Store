"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ShoppingToday = () => {
  return (
    <div>
      <div className="!my-6 flex items-center justify-center flex-col lg:flex-row gap-4">
        {[
          {
            id: 1,
            image: "/home/homev2-homegarden-1.jpg",
            title: "Home & Garden",
            des: "Furniture, Kitchen, Lighing and More!",
            button: "See More",

            bg: "#0f6f69",
            href: "/shop/Home%20%26%20Garden",
          },
          {
            id: 2,
            image: "/home/homev2-electronics-1.jpg",
            title: "Electronics",
            des: "TVs, Cell Phones, Laptops and More!",

            button: "See More",

            bg: "#0d4bb2",
            href: "/shop/Electronics",
          },
          {
            id: 3,
            image: "/home/homev2-fashion-1.jpg",
            title: "Fashion",
            des: "Clothing, Shoes, Accessories and More!",
            button: "See More",

            bg: "#9d1244",
            href: "/shop/Fashion",
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`relative flex flex-col lg:flex-row gap-2 ${
              item.id === 1
                ? "[color:#0f6f69]" // Green for ID 1
                : item.id === 2
                ? "[color:#0d4bb2]" // Dark for ID 2
                : item.id === 3
                ? "[color:#9d1244]" // Yellow for ID 3
                : "text-black" // Default fallback
            }`}
          >
            <div className="relative !px-2 flex transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
              {/* <Image src={item.image} alt="images" width={400} height={300} /> */}
              <Image src={item.image} alt="images" className="w-full" width={1200} height={400}/>
            </div>

            <div
              className={`absolute inset-2 flex flex-col gap-3 items-center justify-center text-center p-4 transform -translate-y-20`}
            >
              <h1 className="!text-lg lg:!text-4xl !font-bold">{item.title}</h1>
              <p className="">{item.des}</p>
              <Link href={item.href}>
                <button
                  className={`!text-left !text-xs !uppercase !font-bold !border-2 !rounded-full !px-4 !py-2 cursor-pointer ${
                    item.id === 1
                      ? "!border-[#0f6f69]"
                      : item.id === 2
                      ? "!border-[#0d4bb2]"
                      : item.id === 3
                      ? "!border-[#9d1244]"
                      : "!border-black"
                  }`}
                >
                  {item.button}
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoppingToday;
