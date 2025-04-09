"use client"
import React from "react";
import { Input, Popover, Portal, Text } from "@chakra-ui/react";
import { HeaderIcon, DealIcon } from "./svgs";
import CategoryList from "./CategoryList";
import { categories } from "./categoryData"; 

const HomeSidebar = () => {
  
  return (
    <div>
      <Popover.Root size="lg">
        <Popover.Trigger
          asChild
          className="border-2 border-white rounded-full p-2 flex-none cursor-pointer"
        >
          <HeaderIcon
            className="fill-current text-white w-6 h-6 cursor-pointer"
            cursor="pointer"
          />
        </Popover.Trigger>
        <Portal>
          <Popover.Positioner>
            <Popover.Content className="p-0">
              <Popover.Arrow className="!fill-white !shadow-lg"/>
              <Popover.Body className="p-0">
              <CategoryList items={categories} />
              </Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    </div>
  );
};

export default HomeSidebar;
