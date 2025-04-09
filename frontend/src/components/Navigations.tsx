"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigations = () => {
  const pathname = usePathname(); // Get the current URL path

  return (
    <div>
      <nav className="flex gap-4 text-black lg:text-white flex-col lg:flex-row">
        {[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
        ].map((item) => {
          const isActive =
            pathname === item.path ||
            (pathname.startsWith(item.path) && item.path !== "/");

          return (
            <Link key={item.name} href={item.path} passHref>
              <button
                className={`${
                  isActive ? "!text-[#77C053]" : "!text-black lg:!text-white"
                }`}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  color: isActive ? "#77C053" : "#fff",
                }}
              >
                {item.name}
              </button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Navigations;
