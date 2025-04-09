"use client";
import React, { useEffect, useState } from "react";
import CountdownTimer from "./CountDownTimer";
import SwiperSlider from "./SwiperSlider";
import Link from "next/link";
import { Deals, transformFlashDealData } from "@/lib/types";
import Image from "next/image";
import SwiperImage from "./SwiperImage";
import AddToCartDialog from "./AddToCartDialog";
import QuickViewDialog from "./QuickViewDialog";
import { AiOutlineHeart } from "react-icons/ai";
import { Icon } from "@chakra-ui/react";
import AddToCartDialogTablet from "./AddToCartDialogTablet";
import QuickViewDialogTablet from "./QuickViewDialogTablet";
import { addToWishlist, removeFromWishlist } from "@/redux/slices/wishlistSlice"
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from 'react-toastify';


// Define types for the API response
type Product = {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  images: Array<{
    url: string;
    alt?: string;
  }>;
  details: {
    manufacturer: {
      name: string;
    };
  };
  ratings: {
    average: number;
    count: number;
  };
  // Add other product properties as needed
};

type ApiResponse = 
  | Product[] // Case 1: Direct array of products
  | { products: Product[] } // Case 2: Object with products array
  | { success: boolean; products?: Product[]; error?: string }; 

const FlashDeals = () => {
  const [deals, setDeals] = useState<Deals[]>([]);

const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);

  const isWishlisted = (productId: number) =>
    wishlist.some((item: any) => item.id === productId);

  const handleWishlistToggle = (product: any) => {
    if (isWishlisted(product.id)) {
      dispatch(removeFromWishlist(product.id));
      toast.success(`${product.name} removed from wishlist`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      dispatch(addToWishlist(product));
      toast.success(`${product.name} added to wishlist`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

useEffect(() => {
  fetch("/api/auth/product")
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched product data:", data); // Debugging
      // Handle both cases: API returns an object with products or an array directly.
      const products = Array.isArray(data) ? data : data.products;
      if (!Array.isArray(products)) {
        console.error("Unexpected data format:", data);
        return;
      }
  const filtered = products.slice(0, 8);
// Shuffle the filtered products
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  setDeals(shuffled.map(transformFlashDealData));
    })
    .catch((error) => console.error("Error fetching product data:", error));
}, []);


  return (
    <div className="!my-16 !px-6">
      <div className="flex items-center justify-between">
        <h1 className="!text-lg lg:!text-2xl">Flash Deals</h1>
        <span className="flex gap-4 items-center justify-center">
          <div className="hidden lg:flex">
            <CountdownTimer />
          </div>
          <Link href="/shop">
            <button className="font-bold underline cursor-pointer text-md">
              See All Products
            </button>
          </Link>
        </span>
      </div>


<SwiperSlider
        data={deals}
        slidesPerView={1}
        renderSlide={(deal: Deals) => (
          <div key={deal.id} className="relative group flex flex-col items-center text-center border !p-5 transition-transform duration-300 transform hover:scale-105 hover:shadow-lg">
            <Link href={`/shop/product/${deal.id}`} prefetch={false} className="w-full">
              <div className="relative w-full flex justify-center group">
                <SwiperImage
                  data={deal.images.map((img, index) => ({
                    ...img,
                    id: index,
                  }))}
                  slidesPerView={1}
                  renderSlide={(img) => (
                    <div className="flex justify-center">
                      <Image
                        src={img.url}
                        alt={img.alt || deal.name}
                        width={500}
                        height={500}
                        layout="responsive"
                        objectFit="cover"
                      />
                    </div>
                  )}
                />
              </div>

              <div className="flex flex-col items-start text-left gap-2 w-full">
                <h1 className="text-md">{deal.name}</h1>
                <span className="flex gap-2">
                  <p className="text-sm">${deal.price}</p>
                  <p className="text-xs line-through">${deal.oldPrice}</p>
                </span>
                <p className="text-xs">{deal.details.manufacturer.name}</p>
              </div>

              <div className="flex items-center justify-start gap-2 !mt-1 w-full">
                <div className="flex items-center justify-start gap-0.5">
                  {[...Array(5)].map((_, index) => {
                    const rating = deal.ratings.average || 0;
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
                <span className="text-xs text-gray-600 text-left">
                  ({deal.ratings.count || 0})
                </span>
              </div>
            </Link>

            {/* Wishlist and mobile buttons */}
            <div className="absolute top-44 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 w-full flex justify-center z-10">
              <div className="bg-gray-400 flex flex-row gap-3 items-center justify-center rounded-full h-6 w-24 lg:w-12 p-2">
                <Icon 
                  as={AiOutlineHeart}
                  size="md"
                  color={isWishlisted(deal.id) ? "red" : "white"}
                  className="rounded-full h-6 w-6 cursor-pointer"
                  onClick={(e) => handleWishlistToggle(deal)}
                />

                <div className="block lg:hidden">
                  <QuickViewDialogTablet product={deal} />
                </div>
                <div className="block lg:hidden">
                  <AddToCartDialogTablet product={deal} />
                </div>
              </div>
            </div>

            {/* Desktop dialogs - outside of Link */}
            <div className="!mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
              <div className="flex flex-col gap-4 items-center justify-center w-full">
                <AddToCartDialog product={deal} />
                <QuickViewDialog product={deal} />
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default FlashDeals;
