import { Icon } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

const ServicesTwo = () => {
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
            icon: "/home/worldwide.svg",
            label: "Worldwide Delivery",
            sub: "200 countries and regions worldwide",
          },
          {
            icon: "/home/secure-payment.svg",
            label: "Secure Payment",
            sub: "Pay with popular and secure payment methods",
          },
          {
            icon: "/home/return-policy.svg",
            label: "60-day Return Policy",
            sub: "Merchandise must be returned within 60 days.",
          },
          {
            icon: "/home/help-center.svg",
            label: "24/7 Help Center",
            sub: "We'll respond to you within 24 hours",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-start !px-8 lg:px-0 lg:justify-center gap-4"
          >
            {/* Icon on the left */}
            <Image src={item.icon} width={60} height={60} alt="service-img" />

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

export default ServicesTwo;
