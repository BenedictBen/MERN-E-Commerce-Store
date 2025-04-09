import React from "react";
import HeroSwiper from "./HeroSwiper";
import Image from "next/image";
import Services from "./Services";
import HeroBottom from "./HeroBottom";

const HeroSection = () => {
  return (
    <div>
      <div className="flex items-center justify-between gap-4 mx-0 lg:!mx-[25px]">
        <div className="w-full lg:w-2/3 mt-0 lg:mt-[25px]">
          <HeroSwiper />
        </div>

        <div
          className="hidden lg:flex gap-6 flex-col w-1/3 mt-4"
          style={{ marginTop: "16px" }}
        >
          <div className="relative p-4">
            
            <div className="transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
            <Image
              src="/home/home-Newarrivals.webp"
              alt=""
              width={500}
              height={550}
              
            />

            </div>
            <div className="absolute top-6 left-4 p-2 flex gap-3 flex-col">
              <p
                className="uppercase font-bold"
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                new arrivals
              </p>
              <h1
                className="font-bold text-3xl"
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                }}
              >
                Stay Comfy
              </h1>
              <p className="w-44">A collection of premium organic pieces</p>
              <button
                className="underline text-left font-bold cursor-pointer"
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                Shop Now
              </button>
            </div>
          </div>

          <div className="relative p-4 ">
           <div className="transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">

            <Image
              src="/home/home-featured.webp"
              alt="Smart Toothbrush"
              width={500}
              height={550}
            />
           </div>
            <div className="absolute top-6 left-4 p-2 flex gap-3 flex-col">
              <p 
              className="uppercase font-bold"
              style={{
                fontSize: "12px",
                fontWeight: "bold",
              }}
              >Featured</p>
              <h1
              className="font-bold text-3xl"
              style={{
                fontSize: "28px",
                fontWeight: "bold",
              }}
              >Smart Toothbrush</h1>
              <p className="w-44">
                A brush that knows you, an app that shows you.
              </p>
              <button
                className="underline text-left font-bold cursor-pointer"
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <Services />
      <HeroBottom/>
    </div>
  );
};

export default HeroSection;
