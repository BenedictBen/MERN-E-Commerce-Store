

"use client";
import React from "react";
import { LuShoppingCart } from "react-icons/lu";
import { Icon, Box, Flex, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import CartItem from "./CartItem";
import Link from "next/link";


interface CartListProps {
  onAction?: () => void; // Add this line to define the prop
}
const CartList: React.FC<CartListProps> = ({ onAction }) => {
  const { items, totalQuantity, totalAmount } = useSelector(
    (state: RootState) => state.cart
  );

  // Calculate subtotal from scratch as a fallback
  const calculatedSubtotal = items.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  if (items.length === 0) {
    return (
      <Box 
      className="flex items-center justify-center h-full min-h-[400px]"
      onClick={(e) => e.stopPropagation()} 
      
      >
        <div className="flex items-center justify-center flex-col text-center space-y-4">
          <Icon className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
            <LuShoppingCart />
          </Icon>
          <div className="flex items-center flex-col gap-4">
            <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
              Your cart is empty
            </h1>
            <p style={{ fontSize: "16px", color: "#4B5563" }}>
              Explore our products and add items to your cart
            </p>
          </div>
        </div>
      </Box>
    );
  }

  return (
    <Box className="w-full flex flex-col" style={{ minHeight: "calc(100vh - 100px)" }}>
      {/* Cart Items List with scrollable area */}
      <Box className="flex-grow overflow-y-auto">
        <Flex direction="column" gap={4}>
          {items.map((item) => (
            <CartItem key={`${item.id}-${JSON.stringify(item.variants)}`} item={item} />
          ))}
        </Flex>
      </Box>

      {/* Fixed Cart Summary at Bottom */}
      <Box 
        mt={8} 
        borderTopWidth="1px" 
        pt={4}
        className="sticky bottom-0 bg-white"
      >
        <Flex justify="space-between" mb={2}>
          <Text fontWeight="bold">Subtotal:</Text>
          <Text>₵{Math.max(totalAmount, calculatedSubtotal).toFixed(2)}</Text>
        </Flex>
        <Flex justify="space-between" mb={4}>
          <Text fontWeight="bold">Total Items:</Text>
          <Text>{totalQuantity}</Text>
        </Flex>
        
        <Box mt={6}>
          <Link href="/checkout">
            <button
              className="w-full !py-4 !px-4 !text-white !bg-[#2a3aa2] hover:!bg-[#7584f0] cursor-pointer rounded-lg transition-colors duration-200"
              type="button"  
            >
              Proceed to Checkout
            </button>
          </Link>
          <Link href="/cart"> 
            <button className="w-full underline !py-3 cursor-pointer">View Cart</button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default CartList;