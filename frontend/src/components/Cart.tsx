

"use client";
import {
  CloseButton,
  Drawer,
  Portal,
  Flex,
  Circle,
  Box,
} from "@chakra-ui/react";
import { BsCart3 } from "react-icons/bs";
import CartList from "./CartList";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import React, {useEffect} from "react";
import { usePathname } from "next/navigation";

const Cart = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const cartQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity
  );

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Fix: Proper type for onOpenChange
  const handleOpenChange = (details: { open: boolean }) => {
    setIsOpen(details.open);
  };

  return (
    <Drawer.Root 
      size="md"
      open={isOpen}
      onOpenChange={handleOpenChange} // Now correctly typed
    >
      <Drawer.Trigger asChild>
        <Box position="relative" cursor="pointer">
          <Flex className="items-center justify-center gap-2">
            <Box position="relative">
              <BsCart3 color="white" size={20} />
              {cartQuantity > 0 && (
                <Circle
                  size="5"
                  bg="#ff5951"
                  position="absolute"
                  top="-2"
                  right="-2"
                  fontSize="xs"
                  fontWeight="bold"
                >
                  <p className="text-white">{cartQuantity}</p>
                </Circle>
              )}
            </Box>
            <h2 className="text-white">Cart</h2>
          </Flex>
        </Box>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Shopping Cart</Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <CloseButton 
                  size="sm" 
                  position="absolute" 
                  right="4" 
                  top="4"
                  onClick={() => setIsOpen(false)}
                />
              </Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body>
              <CartList onAction={() => setIsOpen(false)} />
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default Cart;