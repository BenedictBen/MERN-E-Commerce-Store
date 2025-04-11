"use client";
import {
  Button,
  CloseButton,
  Dialog,
  Icon,
  Portal,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { BsCart2 } from "react-icons/bs";
import { Deals } from "@/lib/types";
import SwiperImage from "./SwiperImage";
import Image from "next/image";
import Link from "next/link";

interface QuickViewDialogTabletProps {
  product: Deals;
}

const QuickViewDialogTablet: React.FC<QuickViewDialogTabletProps> = ({
  product,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [number, setNumber] = useState<number>(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumber(Number(e.target.value));
  };

  return (
    <Dialog.Root size="full" motionPreset="slide-in-bottom">
      <Dialog.Trigger asChild>
        <Icon
          onClick={(e) => {
            e.stopPropagation();
          }}
          as={AiOutlineEye}
          size="md"
          color="white"
          className=" rounded-full h-6 w-6 cursor-pointer "
        />
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body>
              <div className="flex items-center justify-center flex-col w-full">
                <div className="w-1/2 flex  justify-center">
                  <SwiperImage
                    data={product.images.map((img, index) => ({
                      ...img,
                      id: index,
                    }))}
                    slidesPerView={1}
                    renderSlide={(img) => (
                      <div className="flex justify-center">
                        <Image
                          src={img.url}
                          alt={img.alt || product.name}
                          width={500}
                          height={500}
                          layout="responsive"
                          objectFit="cover"
                        />
                      </div>
                    )}
                  />
                </div>
                <div className=" flex flex-col gap-2 w-1/2">
                  <div className="">
                    <button className="!bg-[#ff311c] !px-3 !py-1.5 rounded-full !text-white">
                      Sale
                    </button>
                  </div>

                  <h1 className="!text-sm !font-bold">{product.name}</h1>
                  <div className="flex gap-2">
                    <p>in </p>

                    <p className="!font-bold">{product.category?.sub || ""}</p>
                  </div>

                  <div className="flex !items-center !justify-start gap-2 !mt-1 w-full">
                    <div className="flex !items-center !justify-start !text-left gap-0.5">
                      {[...Array(5)].map((_, index) => {
                        const rating = product.ratings.average || 0;
                        return (
                          <svg
                            key={index}
                            className={`w-3 h-3 ${
                              rating >= index + 1
                                ? "text-yellow-400"
                                : rating >= index + 0.5
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        );
                      })}
                    </div>
                    <span className="!text-xs text-gray-600 !text-left">
                      ({product.ratings.count || 0} reviews)
                    </span>
                  </div>
                  <div className="">
                    <h3 className="!text-lg font-bold">₵{product.price}</h3>
                    <div className="flex flex-col gap-2 items-start justify-start">
                      <div className="flex flex-col gap-2 items-start justify-start">
                        <p className="!text-xs line-through">
                          ₵{product.oldPrice}
                        </p>
                        <p className="!text-red-500">Save: ₵5.00(11%)</p>
                      </div>
                      <p className="text-[#18bd98]">Available in Stock</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center !w-full !h-10 !border-2 !border-gray-600 !rounded-full !hover:border-black !hover:border-2 !space-x-2">
                    <button className="flex items-center justify-center !border-2 !h-6 !w-6 !rounded-full !hover:border-black cursor-pointer">
                      -
                    </button>
                    <input
                      type="number"
                      value={number}
                      onChange={handleChange}
                      className="appearance-none !w-12 !text-center !border-none !outline-none"
                    />
                    <button className="flex items-center justify-center !border-2 !h-6 !w-6 !rounded-full !hover:border-black !hover:border-2 cursor-pointer">
                      +
                    </button>
                  </div>

                  <div className="!flex !flex-col !gap-4 !mt-3 !w-full !items-stretch">
                    <Link href="/">
                      <button className="!w-full !px-4 lg:!px-6 !py-2 lg:!py-4 !bg-[#6e2eff] !text-white !rounded-full !hover:bg-blue-700 !cursor-pointer">
                        Add to cart
                      </button>
                    </Link>
                    <Link href="/">
                      <button className="!w-full !px-4 lg:!px-6 !py-2 lg:!py-4 !bg-white !border-2 !border-[#6e2eff] !text-[#6e2eff] !rounded-full !hover:bg-green-700 !cursor-pointer">
                        Buy Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default QuickViewDialogTablet;
