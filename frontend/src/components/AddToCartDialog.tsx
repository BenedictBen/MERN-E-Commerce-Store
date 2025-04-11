"use client";

import { Deals } from "@/lib/types";
import {
  CloseButton,
  Dialog,
  Portal,
  Spinner,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import type { RootState } from "@/redux/store";
import { toast } from 'react-toastify';

interface AddToCartDialogProps {
  product: Deals;
}

const AddToCartDialog: React.FC<AddToCartDialogProps> = ({ product }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);

 // Find the current quantity of this product in the cart
 const currentItem = cart.items.find(item => item.id === product.id);
 const quantity = currentItem ? currentItem.quantity : 1; // Default to 1 if not found

  const subtotal = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleAddToCart = async () => {
    setIsLoading(true);
    
    try {
      // Create the product object with all available details
      const productToAdd = {
        id: product.id,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice,
        quantity: 1,
        image: product.images[0]?.url,
        slug: product.slug,
        category: product.category,
        variants: {
          ...product.variants,
          storage: product.variants.storage?.[0]?.value // Convert array to single string
        },
        details: {
          manufacturer: product.details.manufacturer,
          specs: product.details.specs
        },
        ratings: product.ratings,
        inventory: product.inventory
      };
      
      // Dispatch the action with full product details
      dispatch(addToCart(productToAdd));

      toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} of ${product.name} added to cart`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
       
      
      
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
           onClick={handleAddToCart}
          className="!w-full !px-4 lg:!px-6 !py-2 !bg-[#6e2eff] !text-white !rounded-full !hover:bg-blue-700 cursor-pointer"
        >
          {isLoading ? <Spinner size="sm" color="white" /> : "Add to cart"}
        </button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Successfully added to your cart</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body>
              <div className="hidden lg:block">
                <div className="flex w-full">
                  <div className="flex w-1/2">
                    <div>
                      <Image
                       src={product?.images?.[0]?.url}
                        width={100}
                        height={100}
                        alt=""
                      />
                    </div>
                    <div>
                      <div className="flex flex-col gap-2">
                        <h3 className="!w-xs !text-md">{product.name}</h3>
                        <div className="flex items-center gap-1">
                          <p className="!text-xs text-gray-500">Vendor:</p>
                          <p>{product.details.manufacturer.name}</p>
                        </div>
                        <div className="flex flex-col items-start gap-1">
                          <p className="!font-bold">₵{product.price}</p>
                          <div className="flex gap-2">
                            <p>QTY:</p>
                              <p>{quantity}</p> 
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-1/2">
                    <div className="flex justify-around">
                      <div className="flex">
                        <p>Subtotal</p>
                        <p>({cart.totalQuantity} items)</p>
                      </div>
                      <div>
                      <p>₵{subtotal.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <div className="!w-2/3 !bg-[#6329e5] rounded-full flex justify-center">
                      <Link href="/checkout">
                        <button className="!px-12 !py-6 !text-white cursor-pointer">
                          Checkout
                        </button>
                      
                      </Link>
                      </div>

                      <div>
                        <Link href="/cart">
                        
                        <button className="underline font-bold cursor-pointer">
                          View Cart
                        </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="border-t border-gray-300 !my-8" />
                <div>
                  <h1 className="!text-lg">You may also like</h1>
                  <div   className="flex flex-row items-center justify-center ">
                    {product.similarProducts.map((similar) => (
                      <div
                        key={similar.id}
                        className="flex flex-col items-center gap-4 justify-between cursor-pointer hover:border-2 hover:border-white hover:shadow-2xl !p-4"

                      >
                        <Link href={similar.link}>
                        
                        <Image
                          src={similar.image}
                          alt={similar.name}
                          width={150}
                          height={150}
                        />
                        <h1 className="text-left !w-[180px] text-lg font-bold">
                          {similar.name}
                        </h1>
                        <p className="text-left text-lg !font-bold">₵{similar.price}</p>
                        </Link>
                      </div>
                    ))}
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

export default AddToCartDialog;
