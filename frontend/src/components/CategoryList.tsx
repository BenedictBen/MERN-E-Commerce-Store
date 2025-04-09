"use client";

import { useState } from "react";
import { CategoryItem } from "./categoryData";
import Link from "next/link";
import Image from "next/image";
import { GoChevronRight } from "react-icons/go";

interface HoverInfoProps {
  items: CategoryItem[];
}

const CategoryList: React.FC<HoverInfoProps> = ({ items }) => {
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const hoveredItem = items.find((item) => item.id === hoveredItemId);

  return (
    <div className="flex h-[500px] w-full relative p-6">
      {/* Categories List - Left Side */}
      <div>
        <ul 
        
        className="flex flex-col gap-6 divide-y divide-gray-900 ">
          {items.map((item) => (
            <li
              key={item.id}
              className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-6 "
              onMouseEnter={() => setHoveredItemId(item.id)}
            >
              {item.icon && (
                <span className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden">
                  {item.icon}
                </span>
              )}
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 flex-shrink-0 object-cover rounded-full"
                />
              )}
              <span className="text-gray-700 font-medium truncate">
                {item.name}
              </span>
              <GoChevronRight  className="w-5 h-5"/>
            </li>
          ))}
        </ul>
       
      </div>

      {/* Hover Content - Right Side */}
      {hoveredItem && (
        <div
          className="absolute left-full top-0 ml-2 w-[800px] h-full bg-white shadow-lg rounded-r-lg overflow-hidden"
          onMouseEnter={() => setHoveredItemId(hoveredItem.id)}
          onMouseLeave={() => setHoveredItemId(null)}
        >
          <div className="h-full flex flex-col">
            <div className="flex flex-1 !px-6 !py-6">
              {/* Left: Sub Categories */}
              {hoveredItem.subItems?.length && (
                <div className="w-1/2 pr-4">
                  <div className="flex flex-col gap-3">
                    {hoveredItem.subItems.map((subItem, index) => (
                      <Link
                        key={index}
                        href={subItem.href}
                        className="p-3 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-gray-700 hover:text-primary-600 text-sm">
                          {subItem.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Right: Featured Images */}
              {hoveredItem.images?.length && (
                <div className="w-1/2 pl-4 border-l border-gray-100">
                  <div className="grid grid-cols-2 gap-4 p-6">
                    {hoveredItem.images.map((image, index) => (
                      <Link
                        key={index}
                        href={image.href}
                        className="group relative flex flex-col items-center overflow-hidden"
                      >
                        {hoveredItem.id === 0 || hoveredItem.id === 8 ? (
                          // Circular container for id 0 or 8
                          <div className="w-24 h-24 relative rounded-full overflow-hidden">
                            <Image
                              src={image.src}
                              alt={image.alt}
                              width={96}
                              height={96}
                              className="object-cover transition-transform group-hover:scale-105"
                              quality={100}
                            />
                          </div>
                        ) : (
                          // Square container (a bit larger) with overlay text
                          <div className="w-52 h-52 relative overflow-hidden">
                            <Image
                              src={image.src}
                              alt={image.alt}
                              width={224}
                              height={224}
                              className="object-cover transition-transform group-hover:scale-105"
                              quality={100}
                            />
                            <div className="absolute inset-0 left-8 bottom-4 flex flex-col justify-end bg-transparent bg-opacity-50 p-2">
                              <h4 className="text-sm text-white">
                                {image.title}
                              </h4>
                              {image.subTitle && (
                                <p className="text-xs text-white underline">
                                  {image.subTitle}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        {/* For circular images, if you still want text below */}
                        {(hoveredItem.id === 0 || hoveredItem.id === 8) && (
                          <div className="mt-2 text-center">
                            <h4 className="font-medium text-gray-800">
                              {image.title}
                            </h4>
                            {image.subTitle && (
                              <p className="text-sm text-gray-600 mt-1">
                                {image.subTitle}
                              </p>
                            )}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Button Section */}
            {hoveredItem.buttonLabel && (
              <div className="mt-6">
                <Link
                  href="#"
                  className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors inline-block"
                >
                  {hoveredItem.buttonLabel}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
