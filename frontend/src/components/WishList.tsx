

"use client";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { Icon } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { toggleWishlist, addToCart } from "@/redux/slices/cartSlice";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { AiOutlineDelete } from "react-icons/ai";
import { selectWishlistItems } from "@/redux/slices/cartSlice"; // Import the new selector

const WishList = () => {
  const dispatch = useDispatch();

  const wishlistItems = useSelector(selectWishlistItems);
  const cartItems = useSelector((state: RootState) => state.cart.items);


  const handleRemoveFromWishlist = (productId: number) => {
    // Find the product in wishlist to get full data if needed
    const product = wishlistItems.find(item => item.id === productId);
    if (product) {
      dispatch(toggleWishlist({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        variants: product.variants,
        // Add required Product fields with defaults
        quantity: 1,
        details: {},
        ratings: { average: 0, count: 0 }
      }));
      toast.success("Removed from wishlist");
    }
  };

  const handleAddToCart = (product: any) => {
    const existingCartItem = cartItems.find(item => item.id === product.id);
    
    dispatch(
      addToCart({
        ...product,
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: existingCartItem ? existingCartItem.quantity + 1 : 1,
        image: product.image || product.images?.[0]?.url || "",
        variants: product.variants || {},
      })
    );
    
    toast.success(`${product.name} added to cart`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const isInStock = (product: any) => {
    return true; // Implement your actual stock check logic
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
          <h3 className="!text-xl md:!text-2xl !text-gray-600">
            Your wishlist is empty
          </h3>
          <Link
            href="/shop"
            className="!my-4 inline-block !px-6 !py-2 bg-[#6e2eff] !text-white rounded hover:!bg-[#9171db] transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            // const isItemInCart = cartItems.some(cartItem => cartItem.id === item.id);
            const isItemInCart = Array.isArray(cartItems) && cartItems.some(cartItem => cartItem.id === item.id);
            return (
              <div key={item.id} className="!border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-square">
                  <Image
                    src={item.image || "/placeholder-product.png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                <div className="!p-4">
                  <h3 className="!font-semibold !text-lg !mb-1 line-clamp-2">
                    {item.name}
                  </h3>

                  <div className="flex justify-between items-center !my-6">
                    <span className="text-lg font-bold">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className={`!text-sm !px-2 !py-1 rounded ${
                      isInStock(item) ? "!bg-green-100 !text-green-800" : "!bg-red-100 !text-red-800"
                    }`}>
                      {isInStock(item) ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={isItemInCart || !isInStock(item)}
                      className={`flex-1 !py-3 rounded cursor-pointer ${
                        isItemInCart
                          ? "!bg-[#6e2eff] !text-white cursor-not-allowed"
                          : isInStock(item)
                          ? "!bg-blue-500 !text-white hover:!bg-blue-600"
                          : "!bg-gray-200 !text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {isItemInCart ? "Added to Cart" : "Add to Cart"}
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="p-2 text-gray-500 hover:text-red-500 transition cursor-pointer"
                      aria-label="Remove from wishlist"
                    >
                      <AiOutlineDelete className="text-red-500" size={24} />
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