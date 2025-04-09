"use client";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { Icon } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { removeFromWishlist } from "@/redux/slices/wishlistSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import Image from "next/image";
import Link from "next/link";
import { getProductImageUrl } from "@/lib/imageUtils";
import { AiOutlineDelete } from "react-icons/ai";

const WishList = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleRemoveFromWishlist = (id: number) => {
    dispatch(removeFromWishlist(id));
  };

  const handleAddToCart = (product: any) => {
    dispatch(
      addToCart({
        ...product,
        quantity: 1, // Default quantity when adding to cart
      })
    );
  };

  const isInStock = (product: any) => {
    // You might want to replace this with actual stock check logic
    return true; // Assuming all items are in stock for this example
  };

  // Helper function to get the first available image
  const getFirstImage = (item: any) => {
    if (item.images && item.images.length > 0) {
      return item.images[0].url;
    }
    return item.image || "/shop/vr000.webp"; // Fallback to single image or default
  };

  return (
    <div className="container !mx-auto !px-4 !py-8">
      <div className="flex flex-col items-center !my-8">
        <h1 className="!text-2xl md:!text-4xl !font-bold !my-4">WISHLIST</h1>
        <Icon
          as={wishlistItems.length > 0 ? AiFillHeart : AiOutlineHeart}
          boxSize="60px"
          color={wishlistItems.length > 0 ? "red.500" : "gray.400"}
        />
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center !py-12">
          <h3 className="!text-xl md:!text-2xl text-gray-600">
            Looks like you don't have anything saved
          </h3>
          <Link
            href="/shop"
            className="!my-4 inline-block !px-6 !py-2 !bg-[#6e2eff] !text-white rounded hover:!bg-[#9171db] transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            const isItemInCart = cartItems.some(
              (cartItem) => cartItem.id === item.id
            );

            return (
              <div
                key={item.id}
                className="!border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <Link
                  href={`/shop/product/${item.id}`}
                  prefetch={false}
                  className="block"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={getProductImageUrl(item.images?.[0]?.url)}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                </Link>

                <div className="!p-4">
                  <Link href={`/shop/product/${item.id}`} prefetch={false}>
                    <h3 className="!font-semibold !text-lg !mb-1 hover:!text-blue-600 line-clamp-2">
                      {item.name}
                    </h3>
                  </Link>

                  <div className="flex justify-between items-center !my-3">
                    <span className="!text-lg !font-bold">
                      ${item.price.toFixed(2)}
                    </span>
                    <span
                      className={`!text-sm !px-2 !py-1 rounded ${
                        isInStock(item)
                          ? "!bg-green-100 !text-green-800"
                          : "!bg-red-100 !text-red-800"
                      }`}
                    >
                      {isInStock(item) ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={isItemInCart || !isInStock(item)}
                      className={`flex-1 !py-2 rounded ${
                        isItemInCart
                          ? "!bg-[#6e2eff]  !text-white cursor-not-allowed"
                          : isInStock(item)
                          ? "bg-black !text-white hover:bg-gray-800"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {isItemInCart ? "Added to Cart" : "Add to Cart"}
                    </button>

                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="Qp-2 text-gray-500 hover:text-red-500 transition cursor-pointer"
                      aria-label="Remove from wishlist"
                    >
                      <AiOutlineDelete className="!text-red-500" size={30} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishList;
