// app/cart/page.tsx
"use client";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import Link from "next/link";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/redux/slices/cartSlice";
import { Icon } from "@chakra-ui/react";
import { LuShoppingCart } from "react-icons/lu";
import type { ProductVariant } from "@/redux/slices/cartSlice";
import React from "react";
import Image from "next/image";

interface VariantObject {
  name?: string;
  value?: string;
  code?: string;
  priceAdjustment?: number;
  includes?: string[];
  images?: string[];
  stock?: number;
  weightRange?: string;
}

// Helper function to safely display variant values
// Update the displayVariant function to handle all variant types
const displayVariant = (
  variant:
    | string
    | number
    | VariantObject
    | VariantObject[]
    | string[]
    | undefined
): string => {
  if (!variant) return "";

  // Handle primitive types
  if (typeof variant === "string" || typeof variant === "number") {
    return variant.toString();
  }

  // Handle array case
  if (Array.isArray(variant)) {
    const firstItem = variant[0];
    if (!firstItem) return "";

    // Handle array of primitives
    if (typeof firstItem === "string" || typeof firstItem === "number") {
      return firstItem.toString();
    }

    // Handle array of objects
    return firstItem.name || firstItem.value || firstItem.code || "";
  }

  // Handle single object case
  return variant.name || variant.value || variant.code || "";
};

const CartPage = () => {
  const [selectedShipping, setSelectedShipping] = React.useState<'free' | 'flat'>('free')




  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector(
    (state: RootState) => state.cart
  );

  const manufacturerName = items[0]?.details?.manufacturer?.name || "";

  const handleQuantityChange = (
    id: number,
    variants: ProductVariant | undefined,
    newQuantity: number
  ) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, variants, quantity: newQuantity }));
    } else if (newQuantity === 0) {
      dispatch(removeFromCart({ id, variants }));
    }
  };

  const handleRemoveItem = (id: number, variants?: ProductVariant) => {
    dispatch(removeFromCart({ id, variants }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  // Calculate the total with shipping
const calculateTotalWithShipping = () => {
  const subtotal = totalAmount;
  const shippingCost = selectedShipping === 'flat' ? 10 : 0;
  return (subtotal + shippingCost).toFixed(2);
};

  // Mock shipping data
  const shipping = {
    method: "Free shipping",
    rate: "$10.00",
    address: "Kumasi, Ashanti, 00233, Ghana",
  };

  return (
    <div className="!max-w-6xl !mx-auto !px-4 !py-8">
      <h1 className="!text-3xl !font-bold !mb-8 !text-center">Cart</h1>

      <div className="!grid !grid-cols-1 lg:!grid-cols-3 !gap-8">
        {/* Left Column - Products */}
        <div className="lg:!col-span-2">
          <h2 className="!text-xl !font-semibold !mb-4">Products</h2>

          {items.length === 0 ? (
            <div className="!text-center !py-12">
              <Icon className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
                <LuShoppingCart />
              </Icon>
              <p className="!text-gray-500 !mb-4">Your cart is empty</p>
              <Link href="/shop" className="!text-blue-600 hover:!underline">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="!space-y-6">
              {items.map((item,index) => (
                <div key={index} className="!border-b !pb-6">
                  <div className="!flex !flex-col sm:!flex-row !gap-4">
                    <div className="!w-24 !h-24 !bg-gray-100 !rounded !flex !items-center !justify-center">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={1200}
                          height={400}
                          className="!w-full !h-full !object-contain"
                        />
                      ) : (
                        <span className="!text-gray-400">No image</span>
                      )}
                    </div>
                    <div className="!flex-1">
                      <h3 className="!font-medium">{item.name}</h3>
                      <div className="!text-sm !text-gray-600 !mt-1 !space-y-1">
                        {/* Storage Variant */}
                        {item.variants?.storage && (
                          <p>
                            Storage: {displayVariant(item.variants.storage)}
                          </p>
                        )}

                        {/* Size Variant */}
                        {item.variants?.size && (
                          <p>Size: {displayVariant(item.variants.size)}</p>
                        )}

                        {/* Color Variant */}
                        {item.variants?.color && (
                          <p>Color: {displayVariant(item.variants.color)}</p>
                        )}

                        {/* Plug Type Variant */}
                        {item.variants?.plugType && (
                          <p>
                            Plug Type: {displayVariant(item.variants.plugType)}
                          </p>
                        )}

                        {/* Vendor */}
                        <p>
                          Vendor:{" "}
                          {item.details?.manufacturer?.name || "TehchiSore"}
                        </p>
                      </div>
                      <div className="!my-3 !flex !items-center !justify-between">
                        <div className="!flex !items-center !border !rounded">
                          <button
                            className="!px-3 !py-1 hover:!bg-gray-100"
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.variants,
                                item.quantity - 1
                              )
                            }
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="!px-3">{item.quantity}</span>
                          <button
                            className="!px-3 !py-1 hover:!bg-gray-100"
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.variants,
                                item.quantity + 1
                              )
                            }
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <p className="!font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          className="!text-red-500 hover:!text-red-700 !text-sm cursor-pointer"
                          onClick={() =>
                            handleRemoveItem(item.id, item.variants)
                          }
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <div className="!my-6 !flex !flex-wrap !gap-4">
  

              <button
                className="!px-6 !py-2 !text-black hover:!bg-gray-200 !rounded !underline !transition !cursor-pointer"
                onClick={handleClearCart}
              >
                Clear Cart
              </button>
              
            </div>
          )}
        </div>

        {/* Right Column - Cart Totals */}
        {items.length > 0 && (
          <div className="!bg-gray-50 !p-6 !rounded-lg !h-fit !sticky !top-4">
            <h2 className="!text-xl !font-semibold !mb-4">Cart totals</h2>

            <div className="!space-y-4">
              <div className="!flex !justify-between">
                <span>Subtotal</span>
                <span className="!font-medium">${totalAmount.toFixed(2)}</span>
              </div>

              <hr className="!my-2" />

              <div className="!border-t !pt-4">
                <h3 className="!font-medium !mb-2">Shipping: {manufacturerName}</h3>
                <div className="!space-y-2">
                  <label className="!flex !items-center">
                  <input
        type="radio"
        name="shipping"
        className="!mr-2"
        checked={selectedShipping === 'free'}
        onChange={() => setSelectedShipping('free')}
      />
                    Free shipping
                  </label>
                  <label className="!flex !items-center">
                  <input
        type="radio"
        name="shipping"
        className="!mr-2"
        checked={selectedShipping === 'flat'}
        onChange={() => setSelectedShipping('flat')}
      />
                    Flat rate: $10.00
                  </label>
                </div>
              </div>

              <div className="!border-t !pt-4">
                <p className="!text-sm">
                  Shipping to {shipping.address}.{" "}
                  <button className="!text-blue-600 hover:!underline">
                    Change address
                  </button>
                </p>
              </div>
              <hr className="!my-3" />

              <div className="!border-t !pt-4 !flex !justify-between !font-bold !text-lg">
                <span>Total</span>
                <span>${calculateTotalWithShipping()}</span>
              </div>

              <Link
                href="/checkout"
                className="!block !w-full !bg-[#6e2eff] hover:!bg-[#5a25d6] !text-white !text-center !py-3 !px-4 !rounded !transition !mt-6"
              >
                Proceed to checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
