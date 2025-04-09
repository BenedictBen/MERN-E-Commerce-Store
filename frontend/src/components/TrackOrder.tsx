"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export interface FormValues {
  order: string;
  billing: string;
}

const TrackOrder = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<FormValues>();

  const [trackingData, setTrackingData] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/orders/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for sending cookies
        body: JSON.stringify({
          orderId: data.order,
          billingEmail: data.billing,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to fetch tracking details");
      }

      const tracking = await res.json();
      setTrackingData(tracking);
    } catch (err: any) {
      setError(err.message);
      console.error("Tracking error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center !my-4 lg:!my-12">
      <div className="w-full max-w-2xl !p-6">
        <div className="flex flex-col gap-4 mb-3">
          <h1 className="text-center !text-lg lg:!text-2xl f!ont-semibold !my-4">
            Track Order
          </h1>
          <p className="text-center text-gray-600 !my-4">
            To track your order, please enter your Order ID (from your
            confirmation email) and the billing email you used during checkout.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="!space-y-4 !py-6 !px-6 !border"
        >
          <div className="flex flex-col gap-4 !w-full !max-w-md !mx-auto">
            <div className="relative">
              <label>Order ID</label>
              <input
                type="text"
                placeholder="Found in your order confirmation email."
                {...register("order", { required: "Order ID is required" })}
                className={`!border !p-5 w-full focus:!border-blue-600 focus:outline-none ${
                  watch("order")
                    ? "border-green-500"
                    : errors.order
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.order && (
                <p className="text-red-500 !text-sm !my-1">
                  {errors.order.message}
                </p>
              )}
            </div>

            <div className="relative">
              <label>Billing Email</label>
              <input
                type="email"
                placeholder="Email you used during checkout."
                {...register("billing", {
                  required: "Billing email is required",
                })}
                className={`!border !p-5 w-full focus:!border-blue-600 focus:outline-none ${
                  watch("billing")
                    ? "border-green-500"
                    : errors.billing
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.billing && (
                <p className="text-red-500 !text-sm !mt-1">
                  {errors.billing.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full !bg-[#6e2eff] !text-white !p-3 hover:!bg-[#8144ff] transition duration-200 !font-semibold cursor-pointer"
            >
              {loading ? "Tracking..." : "Track"}
            </button>
          </div>
        </form>

        {error && <p className="text-center !text-red-500 !my-4">{error}</p>}
        {trackingData && (
          <div className="!my-6 !p-4 !border rounded">
            <h2 className="!text-xl !font-bold">Tracking Details</h2>
            <p>
              <strong>Tracking Number:</strong>{" "}
              {trackingData.trackingNumber || "N/A"}
            </p>
            <p>
              <strong>Shipping Status:</strong>{" "}
              {trackingData.shippingStatus || "N/A"}
            </p>
            <p>
              <strong>Carrier:</strong> {trackingData.carrier || "N/A"}
            </p>
            <p>
              <strong>Estimated Delivery:</strong>{" "}
              {trackingData.estimatedDelivery
                ? new Date(trackingData.estimatedDelivery).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {trackingData.updatedAt
                ? new Date(trackingData.updatedAt).toLocaleString()
                : "N/A"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
