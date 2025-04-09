"use client";

import { Button, CloseButton, Dialog, Portal, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { Deals, Variants } from "@/lib/types";
import SwiperImage from "./SwiperImage";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart, ProductVariant } from "@/redux/slices/cartSlice";
import { toast } from "react-toastify";

interface QuickViewDialogProps {
  product: Deals;
}

const QuickViewDialog: React.FC<QuickViewDialogProps> = ({ product }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const dispatch = useDispatch();

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  // Add this utility function to transform variants
  const transformVariants = (variants: Variants): ProductVariant => {
    const result: ProductVariant = {};

    // Transform colors
    if (variants.colors?.length) {
      result.color = variants.colors[0].name || variants.colors[0].code;
    }

    // Transform storage
    if (variants.storage?.length) {
      result.storage = variants.storage[0].value;
    }

    // Transform sizes (handles both string and object variants)
    if (variants.sizes?.length) {
      const firstSize = variants.sizes[0];
      result.size = typeof firstSize === "string" ? firstSize : firstSize.name;
    }

    // Transform plug types
    if (variants.plugTypes?.length) {
      result.plugType = variants.plugTypes[0].name;
    }

    // Transform bundles
    if (variants.bundles?.length) {
      result.bundle = variants.bundles[0].name;
    }

    // Transform finishes
    if (variants.finishes?.length) {
      result.finish = variants.finishes[0].name;
    }

    return result;
  };

  // Then update your handleAddToCart function:
  const handleAddToCart = () => {
    setIsLoading(true);
    try {
      const cartVariants = product.variants
        ? transformVariants(product.variants)
        : undefined;

      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.images?.[0]?.url,
          category: product.category,
          variants: cartVariants,
          details: product.details,
        })
      );

      toast.success(
        `${quantity} ${quantity > 1 ? "items" : "item"} of ${
          product.name
        } added to cart`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog.Root size="xl" placement="top" motionPreset="slide-in-bottom">
      <Dialog.Trigger asChild>
        <button
          className="hidden lg:block !w-full !px-4 lg:!px-6 !py-2 !bg-white !border-2 !border-[#6e2eff] !text-[#6e2eff] !rounded-full !hover:bg-green-700 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {isLoading ? <Spinner size="sm" color="black" /> : "Quick View"}
        </button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.CloseTrigger />
          <Dialog.Content>
            <Dialog.Body>
              <div className="flex items-center justify-center w-full">
                <div className="w-1/2 flex justify-center">
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

                  <h1 className="!text-lg !font-bold">{product.name}</h1>
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
                  <div className="divider-y ">
                    <h3 className="!text-lg font-bold">${product.price}</h3>
                    <div className="flex flex-row gap-2 items-center justify-between">
                      <div className="flex flex-row gap-2 items-center">
                        <p className="!text-xs line-through">
                          ${product.oldPrice}
                        </p>
                        <p className="!text-red-500">Save: $5.00(11%)</p>
                      </div>
                      <p className="text-[#18bd98]">Available in Stock</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center !w-36 !h-16 !border-2 !border-gray-600 !rounded-full !hover:border-black !hover:border-2 !space-x-2">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="flex items-center justify-center !border-2 !h-6 !w-6 !rounded-full !hover:border-black cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="appearance-none !w-12 !text-center !border-none !outline-none"
                      min="1"
                    />
                    <button
                      onClick={handleIncrement}
                      className="flex items-center justify-center !border-2 !h-6 !w-6 !rounded-full !hover:border-black !hover:border-2 cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex flex-row items-center gap-4 !mt-3 !w-full">
                    <Link href="">
                      <button
                        onClick={handleAddToCart}
                        disabled={isLoading}
                        className="!w-full !px-4 lg:!px-6 lg:!py-4 !py-2 !bg-[#6e2eff] !text-white !rounded-full !hover:bg-blue-700 !cursor-pointer"
                      >
                        {isLoading ? <Spinner size="sm" /> : "Add to cart"}
                      </button>
                    </Link>
                    <Link href="/checkout">
                      <button className=" !w-full !px-4 lg:!px-6 lg:!py-4 !py-2 !bg-white !border-2 !border-[#6e2eff] !text-[#6e2eff] !rounded-full !hover:bg-green-700 !cursor-pointer">
                        Buy Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default QuickViewDialog;
