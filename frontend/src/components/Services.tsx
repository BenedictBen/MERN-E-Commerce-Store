import { Icon } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

const Services = () => {
  return (
    <div
      className="grid w-full gap-6 !my-12"
      style={{
        marginTop: "20px",
        marginBottom: "20px",
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 my-6">
        {[
          {
            icon: "/home/fast-free-ship.svg",
            label: "Fast, Free Shipping",
            sub: "On orders over $50",
          },
          {
            icon: "/home/next-day.svg",
            label: "Next Day Delivery",
            sub: "Free – spend over $99",
          },
          {
            icon: "/home/low-price.svg",
            label: "Low Price Guarantee",
            sub: "We offer competitive prices",
          },
          {
            icon: "/home/satisfaction.svg",
            label: "Satisfaction Guarantee",
            sub: "We Guarantee Our Products",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-start !px-8 lg:px-0 lg:justify-center gap-4"
          >
            {/* Icon on the left */}
            <Image src={item.icon} width={40} height={40} alt="service-img" />

            {/* Text on the right */}
            <div className="flex flex-col">
              <p className="text-lg font-semibold">{item.label}</p>
              <p className="text-sm text-gray-600">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
