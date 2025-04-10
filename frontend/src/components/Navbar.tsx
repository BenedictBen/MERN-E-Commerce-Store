"use client";

import Image from "next/image";
import React from "react";
import HomeSidebar from "./HomeSidebar";
import { SearchBar } from "./SearchBar";
import UserMenu from "./UserMenu";
import Navigations from "./Navigations";
import Cart from "./Cart";
import { AiOutlineHeart } from "react-icons/ai";
import Tablet_Mobile from "./Tablet_Mobile";
import { Circle } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";
import { selectWishlistCount } from "@/redux/slices/cartSlice"; 

const Navbar = () => {
  // const wishlist = useSelector((state: RootState) => state.cart.wishlist);
  const wishlistCount = useSelector(selectWishlistCount);

  return (
    <div className="lg:px-12">
      <div className="bg-[var(--navbarBg)] w-full h-44 lg:h-36">
        {/* Mobile/Tablet Header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Tablet_Mobile />
              <Image src="/home/CASB.png" width={100} height={100} alt="logo" />
            </div>
            {/* Cart with right spacing */}
            <button className="flex items-center gap-2 !pe-6 cursor-pointer">
              {" "}
              {/* Added important padding-right */}
              <Cart />
            </button>
          </div>
          {/* Mobile Search Bar */}
          <div className="px-4 ">
            <div className="mx-auto w-full md:flex md:justify-center">
              {" "}
              {/* Changed container */}
              <SearchBar />
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between w-full py-4">
          {/* Left Section - Logo */}
          <div className="flex-1">
            <Image src="/home/CASB.png" width={100} height={100} alt="logo" />
          </div>

          {/* Center Section - Search + Icons */}
          <div className="flex items-center justify-center gap-6 flex-1">
            <HomeSidebar />

            <div className="w-full max-w-xl flex-grow">
              <SearchBar />
            </div>
          </div>

          {/* Right Section - Actions with spacing */}
          <div className="flex items-center justify-end gap-6 flex-1 !pe-6">
            {" "}
            {/* Added right padding */}
            <div className="flex-none">
              <UserMenu />
            </div>
            <Link href="/wishlist">
              <button className="relative flex items-center justify-center cursor-pointer">
                {wishlistCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-[#6e2eff] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </div>
                )}
                <AiOutlineHeart className="text-white text-2xl" size={20} />
              </button>
            </Link>
            <button className="flex items-center gap-2 pe-4 cursor-pointer">
              {" "}
              {/* Added right padding */}
              <Cart />
            </button>
          </div>
        </div>
        <div className="hidden lg:flex items-center justify-center">
          <Navigations />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
