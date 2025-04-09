"use client";

import { useState } from "react";
import { CloseButton, Drawer, Portal } from "@chakra-ui/react";
import { HiChevronRight, HiArrowLeft } from "react-icons/hi2";
import { CategoryItem } from "./categoryData";

interface MobileProps {
  subItems: { name: string; href: string }[];
}

const Tablet_MobileProducts: React.FC<MobileProps> = ({ subItems }) => {
  return (
    <Drawer.Root placement="start">
      <Drawer.Trigger asChild>
        <HiChevronRight className="cursor-pointer" size={24} color="black" />
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content rounded="md">
            <Drawer.Header className="flex items-center gap-4">
              {/* Back Button - Calls onClose to go back to the first drawer */}
              <HiArrowLeft
                className="cursor-pointer"
                size={24}
                // onClick={() => setIsChildOpen(false)}
              />
              <Drawer.Title>Go back to Menu</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              {subItems.length > 0 ? (
                <ul className="space-y-2">
                  {subItems.map((subItem, index) => (
                    <li key={index} className="p-2 border-b">
                      <a
                        href={subItem.href}
                        className="text-lg font-medium hover:underline"
                      >
                        {subItem.name}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No subcategories available.</p>
              )}
            </Drawer.Body>

            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default Tablet_MobileProducts;
