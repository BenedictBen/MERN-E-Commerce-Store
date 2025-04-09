"use client";
import Image from "next/image";
import React from "react";

const OtherProductList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-col-2 lg:grid-cols-5 justify-center gap-4 mt-4">
      {[
        {
          id: 1,
          name: "Watches",
          image: "/home/homev2-watches-1-300x300.jpg",
          bottom: "See More",
          link: "/shop",
        },
        {
          id: 2,
          name: "Toys & Games",
          image: "/home/homev2-toysgames-1-300x300.jpg",
          bottom: "See More",
          link: "/shop",
        },
        {
          id: 3,
          name: "Jewelry",
          image: "/home/homev2-jewelry-1-300x300.jpg",
          bottom: "See More",
          link: "/shop",
        },
        {
          id: 4,
          name: "Appliances",
          image: "/home/sports.jpg",
          bottom: "See More",
          link: "/shop",
        },
        {
          id: 5,
          name: "Sports",
          image: "/home/homev2-appliances-1-300x300.jpg",
          bottom: "See More",
          link: "/shop",
        },
      ].map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center gap-4 w-full"
        >
          <img src={item.image} alt="product images" className="w-full !px-6" />
          <div>
            <h3 className="text-center">{item.name}</h3>
            <button className="!text-sm underline text-center">
              {item.bottom}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OtherProductList;
