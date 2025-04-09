"use client";

import React, { useState, useEffect } from "react";
import ProductReviewForm from "./ProductReviewForm";
import Image from "next/image";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const TabsComponents = ({
  product,
}: {
  product: {
    id: string;
    subTitle: string;
    subDescription: string;
    description: string;
    images: { url: string; alt: string }[];
    moreInfo?: string[];
    variants: { colors?: { name: string }[] };
    shipping: { weight: number; dimensions: string };
    ratings: {
      average: number;
      count: number;
      distribution: Record<number, number>;
    };
    reviews: Review[];
  };
}) => {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Description" },
    { id: "additional", label: "Additional Information" },
    { id: "reviews", label: `Reviews (${product.ratings.count})` },
    { id: "shipping", label: "Shipping & Returns" },
  ];

  const reviews = product.reviews || [];

  return (
    <div className="mt-8! border! border-gray-200! rounded!">
      {/* Tabs Header */}
      <div className="flex! border-b! border-gray-200! justify-center!">
        <div className="flex! justify-center! items-center! cursor-pointer">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-5! py-3! text-sm! font-medium! relative! ${
                activeTab === tab.id
                  ? "text-black! font-semibold! after:absolute! after:bottom-[-1px]! after:left-0! after:right-0! after:h-[2px]! after:bg-black!"
                  : "text-gray-500!"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs Content */}
      <div className="p-5! max-w-4xl! mx-auto!">
        {/* Description Tab */}
        {activeTab === "description" && (
          <div className="space-y-4!">
            <div className="flex justify-between gap-4 items-start">
              {/* Left-aligned subtitle */}
              <div className="flex flex-col flex-1! text-left! gap-3">
                <h3 className="text-3xl! font-semibold! flex-1!">
                  {product?.subTitle}
                </h3>
                <p className="text-gray-600!">{product?.subDescription}</p>
              </div>

              <div className="flex-1! text-left!">
                <p className="text-gray-700! mt-2!">{product?.description}</p>
              </div>
            </div>
            {/* Product Images */}
            <div className="grid! grid-cols-2! gap-4! mt-6!">
              {product.images.map(
                (image: { url: string; alt: string }, index: number) => (
                  <Image
                    key={index}
                    src={image.url}
                    alt={image.alt}
                    width={1200}
                    height={400}
                    className="w-full! h-auto! rounded! border! border-gray-200!"
                  />
                )
              )}
            </div>

            {/* More Info */}
            <div className="mt-6!">
              <h4 className="text-lg! font-semibold! mb-3!">
                More Information
              </h4>
              <ul className="list-disc! pl-5! space-y-2!">
                {(product.moreInfo || []).map((info: string, index: number) => (
                  <li key={index} className="text-gray-700!">
                    {info}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Additional Information Tab */}
        {activeTab === "additional" && (
          <div>
            <h3 className="text-xl! font-semibold! mb-4!">
              Additional Information
            </h3>
            <div className="grid! grid-cols-1! gap-4!">
              {/* Colors */}
              <div className="flex!">
                <span className="font-medium! w-32!">Color</span>
                <div className="flex! flex-wrap! gap-2!">
                  {product?.variants?.colors?.map(
                    (color: { name: string }, index: number) => (
                      <span key={index}>{color.name}</span>
                    )
                  )}
                </div>
              </div>

              {/* Weight */}
              <div className="flex!">
                <span className="font-medium! w-32!">Weight</span>
                <span>{product?.shipping?.weight} kg</span>
              </div>

              {/* Dimensions */}
              <div className="flex!">
                <span className="font-medium! w-32!">Dimensions</span>
                <span>{product?.shipping?.dimensions}</span>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="w-full">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              {/* Average Rating Section */}
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold">
                  {product?.ratings?.average}
                </span>
                <div className="text-yellow-400 text-xl">★★★★★</div>
                <span className="text-gray-500 text-sm">
                  {product?.ratings?.count} reviews
                </span>
              </div>

              {/* Rating Distribution Bars */}
              <div className="flex-1 w-full max-w-md">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center mb-2 w-full">
                    <span className="w-8">{star}★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded mx-2 overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded"
                        style={{
                          width: `${
                            (product.ratings.distribution[star] /
                              product.ratings.count) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="w-8 text-right text-gray-500">
                      {product.ratings.distribution[star]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            {reviews.length > 0 ? (
              <div className="!space-y-4 w-full !my-3">
                {reviews.map((review) => (
                  <div key={review.id} className="border p-4 rounded w-full">
                    <div className="flex items-center gap-2">
                      <span className="!font-semibold">{review.name}</span>
                      <span className="text-yellow-400">
                        {"★".repeat(review.rating)}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <span className="text-gray-500 !text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No written reviews yet.</p>
            )}

            {/* Review Form Component */}
            <ProductReviewForm productId={product.id} />
          </div>
        )}

        {/* Shipping & Returns Tab */}
        {activeTab === "shipping" && (
          <div className="space-y-6!">
            <div>
              <h3 className="text-xl! font-semibold! mb-3!">
                Shipping Details
              </h3>
              <p className="text-gray-700! mb-2!">
                <span className="font-medium!">Estimated ship dimensions:</span>{" "}
                11.5 inches length x 9.0 inches width x 2.0 inches height
              </p>
              <p className="text-gray-700! mb-2!">
                <span className="font-medium!">Estimated ship weight:</span>{" "}
                2.48 pounds
              </p>
              <p className="text-gray-700! mb-4!">
                We regret that this item cannot be shipped to PO Boxes.
              </p>
              <p className="text-gray-700!">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation
              </p>
            </div>

            <div>
              <h3 className="text-xl! font-semibold! mb-3!">Returns</h3>
              <p className="text-gray-700!">
                Not happy with a purchase? No problem. We've made returning
                items as easy as possible. And, most purchases can be returned
                for free. Learn more about our Returns Policy
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabsComponents;
