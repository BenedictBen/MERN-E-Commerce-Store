"use client";

import { useForm } from "react-hook-form";
import { countries } from "./Countries"; // We'll define this next
import { useEffect, useState } from "react";

type FormData = {
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  country: string;
  orderNotes?: string;
};

type BillingFormProps = {
  onShippingAddress: (data: FormData) => void;
  onValidationChange: (isValid: boolean) => void; // Add this prop
};

export default function BillingForm({ onShippingAddress, onValidationChange }: BillingFormProps){
  // const {
  //   register,
  //   handleSubmit,
  //   watch,
  //   formState: { errors },
  // } = useForm<FormData>();

  // // Watch specific fields instead of all fields
  // const address = watch("address");
  // const city = watch("city");
  // const postalCode = watch("postalCode");
  // const phone = watch("phone");
  // const country = watch("country");
  // const orderNotes = watch("orderNotes");

  // const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // useEffect(() => {
  //   if (saveTimeout) clearTimeout(saveTimeout);

  //   const timeout = setTimeout(() => {
  //     const hasData = address || city || postalCode || phone || country;
      
  //     if (hasData) {
  //       onShippingAddress({
  //         address,
  //         city,
  //         postalCode,
  //         phone,
  //         country,
  //         orderNotes
  //       });
  //     }
  //   }, 500);

  //   setSaveTimeout(timeout);

  //   return () => {
  //     if (saveTimeout) clearTimeout(saveTimeout);
  //   };
  // }, [address, city, postalCode, phone, country, orderNotes]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange", // Validate on change
  });

  // Watch all fields for changes
  const formValues = watch();

  useEffect(() => {
    // Notify parent component about validation changes
    onValidationChange(isValid);
  }, [isValid, onValidationChange]);

  useEffect(() => {
    const hasData = 
      formValues.address || 
      formValues.city || 
      formValues.postalCode || 
      formValues.phone || 
      formValues.country;
    
    if (hasData) {
      onShippingAddress(formValues);
    }
  }, [formValues, onShippingAddress]);

  const onSubmit = (data: FormData) => {
    onShippingAddress(data);
    console.log("Shipping Address:", data);
  };



  return (
    <div>
      <h2 className="!font-semi-bold !text-lg lg:!text-2xl !my-6">
        Billing details
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
        <div className="flex flex-col gap-4">
          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 "
            >
              Address *
            </label>
            <input
              id="address"
              type="text"
              {...register("address", { required: "Address is required" })}
              className={`mt-1 py-3! block w-full border-gray-300! shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm focus:outline-none ${
                errors.address ? "border-red-500 " : ""
              }`}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600 ">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 "
            >
              City *
            </label>
            <input
              id="city"
              type="text"
              {...register("city", { required: "City is required" })}
              className={`mt-1 py-3! block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm focus:outline-none ${
                errors.city ? "border-red-500 " : ""
              }`}
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600 ">
                {errors.city.message}
              </p>
            )}
          </div>

          {/* Postal Code */}
          <div>
            <label
              htmlFor="postalCode"
              className="block text-sm font-medium text-gray-700 "
            >
              Postal Code *
            </label>
            <input
              id="postalCode"
              type="text"
              {...register("postalCode", {
                required: "Postal code is required",
              })}
              className={`mt-1 py-3! block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm focus:outline-none ${
                errors.postalCode ? "border-red-500 " : ""
              }`}
            />
            {errors.postalCode && (
              <p className="mt-1 text-sm text-red-600 ">
                {errors.postalCode.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 "
            >
              Phone *
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
                  message: "Please enter a valid phone number",
                },
              })}
              className={`mt-1 py-3! block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm focus:outline-none ${
                errors.phone ? "border-red-500 " : ""
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 ">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 "
            >
              Country *
            </label>
            <select
              id="country"
              {...register("country", { required: "Country is required" })}
              className={`mt-1 py-3! block w-full rounded-md border-gray-300 shadow-sm outline-none focus:outline-none sm:text-sm ${
                errors.country ? "border-red-500 " : ""
              }`}
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="mt-1 text-sm text-red-600 ">
                {errors.country.message}
              </p>
            )}
          </div>

          {/* Order Notes */}
          <div>
            <label
              htmlFor="orderNotes"
              className="block text-sm font-medium text-gray-700 "
            >
              Order Notes (optional)
            </label>
            <textarea
              id="orderNotes"
              rows={4}
              {...register("orderNotes")}
              className="mt-1 py-3! block w-full rounded-md !border-gray-300 shadow-sm outline-none focus:outline-none sm:text-sm "
            />
          </div>

          {/* <button 
    type="submit" 
    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
  >
    Save Address
  </button> */}
        
        </div>
      </form>
    </div>
  );
}
