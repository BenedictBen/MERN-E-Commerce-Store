"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FormValues } from "@/lib/types";
import { useForm } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Icon } from "@chakra-ui/react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/redux/slices/authSlice";
import { toast } from "react-toastify";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<FormValues>();

  // const handleLogin = async (data: FormValues) => {
  //   dispatch(loginStart());
  //   setIsLoading(true); // Start loading
  //   try {
  //     const response = await fetch("/api/auth/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include", // Required for cookies
  //       body: JSON.stringify(data),
  //     });

  //     const result = await response.json();

  //     if (!response.ok) {
  //       // Use the error message from the backend if available
  //       const errorMessage = result.message || 
  //                          (response.status === 401 ? 'Invalid email or password' : 'Login failed');
  //       throw new Error(errorMessage);
  //     }

  //     dispatch(loginSuccess(result.user)); // Store all user data including isAdmin
  //     console.log("Login successful", result);
  //     // Success toast with smooth redirect
  //     toast.success(`Welcome back, ${result.user.name || result.user.email}!`, {
  //       position: "top-right",
  //       autoClose: 2000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //     });
  //     // Redirect based on admin status
  //     if (result) {
  //       router.push("/");
  //     }
  //   } catch (error) {
  //     // const message = error instanceof Error ? error.message : "Login failed";

  //     let errorMessage = "Login failed";
    
  //   if (error instanceof Error) {
  //     errorMessage = error.message;
      
  //     // Special handling for common error cases
  //     if (error.message.includes('credentials') || error.message.includes('Invalid')) {
  //       errorMessage = "Invalid email or password";
  //     }
  //   }

  //     dispatch(loginFailure(errorMessage));
  //     // Error toast with helpful message
  //     toast.error(errorMessage, {
  //       position: "top-right",
  //       autoClose: 5000, // Longer display for errors
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //     });
  //     console.error("Error logging in:", error);
  //   } finally {
  //     setIsLoading(false); // Stop loading
  //   }
  // };

  const handleLogin = async (data: FormValues) => {
    dispatch(loginStart());
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
  
      // First check if response is OK (200-299)
      if (response.ok) {
        const result = await response.json();
        
        // Validate the response structure
        if (!result.user) {
          throw new Error("Invalid response from server");
        }
  
        dispatch(loginSuccess(result.user));
        
        toast.success(`Welcome back, ${result.user.name || result.user.email}!`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
  
        router.push("/");
        return;
      }
  
      // Handle error responses
      let errorMessage = "Login failed";
      let result;
  
      try {
        // Try to parse error response as JSON
        result = await response.json();
        errorMessage = result.message || errorMessage;
        
        // Special handling for status codes
        if (response.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (response.status === 400) {
          errorMessage = "Please check your input and try again";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later";
        } else if (response.status === 504) {
          errorMessage = "Request timeout. Please check your connection";
        }
      } catch (e) {
        // If response isn't JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
  
      throw new Error(errorMessage);
  
    } catch (error) {
      // Handle network errors and other exceptions
      let displayMessage = "Login failed. Please try again.";
      
      if (error instanceof Error) {
        console.error("Login error:", error.message);
        
        // Special handling for specific error types
        if (error.message.includes("Failed to fetch")) {
          displayMessage = "Network error. Please check your connection.";
        } else if (error.message) {
          displayMessage = error.message;
        }
      }
  
      dispatch(loginFailure(displayMessage));
      
      toast.error(displayMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        toastId: 'login-error', // Prevent duplicate toasts
      });
  
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-6">
          <Image src="/home/CASB.png" width={120} height={120} alt="logo" />
          <h1 className="text-2xl font-bold mt-2 text-gray-700">Sign In</h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="!px-6 !py-3 w-full"
        >
          {/* Email Field */}
          <div className="relative !my-6">
            <label className="text-gray-700 font-medium !mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required!",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address!",
                },
              })}
              className={`border !p-3 !w-full sm:w-96 md:w-[400px] rounded-md bg-gray-200 focus:!border-blue-500 focus:!outline-none ${
                watch("email")
                  ? "!border-green-500"
                  : errors.email
                  ? "!border-red-500"
                  : "!border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 font-semibold">
                ❗ {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative !my-6">
            <label className="text-gray-700 font-medium !mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required!",
                // minLength: { value: 8, message: "At least 8 characters required!" },
                // pattern: {
                //   value:
                //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                //   message:
                //     "Must contain uppercase, lowercase, number & special character!",
                // },
              })}
              className={`border !p-3 !w-full sm:w-96 md:w-[400px] rounded-md bg-gray-200 focus:!border-blue-500 focus:!outline-none ${
                watch("password")
                  ? "!border-green-500"
                  : errors.password
                  ? "!border-red-500"
                  : "!border-gray-300"
              }`}
            />

            {/* Toggle Password Visibility */}
            <div
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-12 transform -translate-y-1/2 cursor-pointer"
            >
              <Icon
                as={showPassword ? AiFillEye : AiFillEyeInvisible}
                boxSize={6}
                className="!text-gray-500 hover:!text-gray-700"
              />
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1 font-semibold">
                ❗ {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="!w-full !bg-[#6e2eff] !text-white !p-3 rounded-md hover:!bg-[#8144ff] transition duration-200 !font-semibold cursor-pointer"
          >
            {isLoading ? "Signing in..." : " Sign In"}
          </button>
          <Link href="/signup">
            <p className="!my-2 !text-md !font-semi-bold underline text-center">
              New Customer? Create account
            </p>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
