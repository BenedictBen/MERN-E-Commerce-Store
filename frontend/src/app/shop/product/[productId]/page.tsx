"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  AiOutlineHeart,
  AiOutlinePrinter,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { Icon, Spinner  } from "@chakra-ui/react";
import SwiperImage from "@/components/SwiperImage";
import Link from "next/link";
import { BsCart3 } from "react-icons/bs";
import TabsComponents from "@/components/TabsComponents";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Color from "colorjs.io";
import { useDispatch } from "react-redux";
import { addToCart, updateQuantity } from "@/redux/slices/cartSlice";
import { toast } from "react-toastify";


  

const ProductDetailPage = () => {
  const { productId } = useParams(); 
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [number, setNumber] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);
  const dispatch = useDispatch();

  // ✅ Create a reference for the product section
  const productRef = useRef<HTMLDivElement>(null);

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

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images?.[0]?.url || "",
      slug: product.slug,
      category: product.category,
      variants: product.variants,
      details: product.details,
    };

    dispatch(addToCart(cartItem));

    toast.success(`${product.name} added to cart`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
  };
 // Helper function to ensure proper image URL
 const getImageUrl = (url: string) => {
  // 1. Handle empty/undefined URLs
  if (!url) return '/shop/vr000.webp';
  
  // 2. Return full URLs immediately
  if (url.startsWith('http')) return url;
  
  // 3. Normalize URL paths
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
  
  // 4. Special handling for protected paths
  const protectedPaths = ['/uploads/', '/public/'];
  if (protectedPaths.some(path => normalizedUrl.startsWith(path))) {
    return `${baseUrl}${normalizedUrl}`;
  }
  
  // 5. Default return for non-protected paths
  return url;
};


  useEffect(() => {
    if (!productId) return;

    fetch(`/api/auth/product/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        // Transform image URLs before setting the product
        if (data.images && Array.isArray(data.images)) {
          data.images = data.images.map((img: any) => ({
            ...img,
            url: getImageUrl(img.url || img) // Handle both object and string formats
          })); 
        }
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setProduct(null); // Ensure product is null to trigger the error UI
        setLoading(false);
      });
  }, [productId]);

  const handleShare = async () => {
    const productUrl = `${window.location.origin}/shop/product/${productId}`;

    try {
      // Web Share API (mobile devices)
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: "Check out this product!",
          url: productUrl,
        });
      }
      // Fallback for desktop browsers
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText(productUrl);
        alert("✅ Link copied to clipboard!");
      }
      // Final fallback
      else {
        // Create a temporary input element
        const input = document.createElement("input");
        input.value = productUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        alert("✅ Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Sharing failed:", error);
      alert("Sharing failed. Please manually copy the URL.");
    }
  };

  // ✅ Function to Convert OKLCH Colors to RGB (Fixes Undefined Function)
  const convertOklchToRgb = (colorStr: string): string => {
    if (!colorStr.includes("oklch")) return colorStr;

    try {
      const match = colorStr.match(/oklch\(([^)]+)\)/);
      if (!match) return "#ffffff";

      const values = match[1].split(/[\s,]+/).filter((v) => v.trim());
      if (values.length < 3) return "#ffffff";

      const [lightness, chroma, hue] = values.map((v) => parseFloat(v) || 0);

      const color = new Color("oklch", [lightness / 100, chroma, hue]);
      return color.to("srgb").toString({ format: "hex" });
    } catch (error) {
      console.warn(`Failed to convert color: ${colorStr}`, error);
      return "#ffffff";
    }
  };

  // ✅ Save As PDF Function
  const saveAsPDF = async () => {
    try {
      if (!productRef.current) {
        alert("Product section not available for PDF generation");
        return;
      }
  
   
  
      // 1. Create a temporary container
      const printContainer = document.createElement("div");
      printContainer.id = "pdf-print-container";
      Object.assign(printContainer.style, {
        position: "fixed",
        left: "0",
        top: "0",
        width: "100%",
        padding: "20px",
        backgroundColor: "white",
        zIndex: "10000",
        visibility: "hidden", // Will be made visible during capture
      });
  
      // 2. Deep clone the content
      const content = productRef.current.cloneNode(true) as HTMLElement;
  
      // Convert Next.js Images to regular img elements
      const nextImages = content.querySelectorAll("span[data-nextjs-img]");
      nextImages.forEach((imgContainer) => {
        const img = imgContainer.querySelector("img");
        if (img) {
          const src = img.getAttribute("src") || img.getAttribute("data-src");
          if (src) {
            const newImg = document.createElement("img");
            newImg.src = src.startsWith("/") ? `${window.location.origin}${src}` : src;
            newImg.style.width = "100%";
            newImg.style.height = "auto";
            imgContainer.parentNode?.replaceChild(newImg, imgContainer);
          }
        }
      });
  
      // Remove problematic elements
      const elementsToRemove = [
        "button",
        "a",
        "iframe",
        "video",
        "audio",
        "canvas",
        "svg",
      ];
      elementsToRemove.forEach((selector) => {
        content.querySelectorAll(selector).forEach((el) => el.remove());
      });
  
      printContainer.appendChild(content);
      document.body.appendChild(printContainer);
  
      // 3. Wait for resources to load
      await new Promise((resolve) => setTimeout(resolve, 500));
  
      // 4. Configure html2canvas with robust settings
      const options = {
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: false, // Changed to false for better security
        scrollX: 0,
        scrollY: 0,
        windowWidth: content.scrollWidth,
        windowHeight: content.scrollHeight,
        backgroundColor: "#FFFFFF",
        ignoreElements: (el: Element) => {
          const style = window.getComputedStyle(el);
          return style.display === "none" || style.visibility === "hidden";
        },
        onclone: (clonedDoc: Document) => {
          // Make everything visible
          clonedDoc.body.style.visibility = "visible";
          clonedDoc.body.style.opacity = "1";
          
          // Force standard fonts
          clonedDoc.body.style.fontFamily = "Arial, sans-serif";
          
          // Convert OKLCH colors if needed
          Array.from(clonedDoc.querySelectorAll("*")).forEach((el) => {
            const styles = window.getComputedStyle(el);
            ["color", "background-color", "border-color"].forEach((prop) => {
              const value = styles.getPropertyValue(prop);
              if (value.includes("oklch")) {
                (el as HTMLElement).style.setProperty(
                  prop,
                  convertOklchToRgb(value),
                  "important"
                );
              }
            });
          });
        },
      };
  
      // 5. Generate canvas with error handling
      console.log("Starting canvas generation...");
      const canvas = await html2canvas(content, options).catch((err) => {
        console.error("Canvas generation error:", err);
        throw new Error("Canvas generation failed. Please try again.");
      });
  
      if (!canvas) {
        throw new Error("Canvas generation returned empty");
      }
  
      // 6. Create PDF
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "mm",
        format: "a4",
      });
  
      const imgData = canvas.toDataURL("image/png", 1.0);
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${product.name.replace(/\s+/g, "_")}.pdf`);
  
    } catch (error) {
      console.error("PDF generation error:", error);
      alert(
        error instanceof Error 
          ? error.message 
          : "An unexpected error occurred during PDF generation"
      );
    } finally {
      // Clean up
      const container = document.getElementById("pdf-print-container");
      if (container) {
        document.body.removeChild(container);
      }
    
    }
  };

  if (loading)
    return (
      <p className="text-center !mt-10">
        <Spinner size="lg" color="#6e2eff" />
      </p>
    );
  if (!product || product.error)
    return <p className="text-center mt-10">Product not found</p>;

  const savings = product.oldPrice ? product.oldPrice - product.price : 0;

  return (
    <div
      ref={productRef}
      className="container! mx-auto! !px-4 !py-4 max-w-6xl w-full!"
    >
      {/* Breadcrumb */}
      <div className=" text-gray-500 mb-4 flex items-center justify-between !px-8">
        <span className="hidden !text-xs lg:flex items-center">
          <Link href="/" className="cursor-pointer">
            <p>Home &gt; </p>
          </Link>
          <Link href="" className="cursor-pointer">
            {product.category?.main || "Electronics"} &gt;
          </Link>

          <p className="!text-black">{product.name}</p>
        </span>

        <div className="flex justify-end gap-4 mb-6 ">
          <div>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-gray-600 hover:text-blue-500 cursor-pointer"
            >
              <AiOutlineShareAlt />
              <p className="!text-xs ">Share</p>
            </button>
          </div>
          <button
            onClick={saveAsPDF}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-500 cursor-pointer"
          >
            <AiOutlinePrinter />
            <p className="!text-xs ">Print</p>
          </button>
        </div>
      </div>

      {/* Share/Print buttons */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
        {/* Left: Product Images */}
        <div className="flex flex-col gap-4 ">
          {/* Main Swiper */}
          <div className="relative group overflow-hidden ">
            {product.images?.length > 0 ? (
              <SwiperImage
                data={product.images.map((img: any, index: number) => ({
                  ...img,
                  id: index,
                }))}
                slidesPerView={1}
                activeIndex={activeImageIndex}
                onSlideChange={(index) => setActiveImageIndex(index)}
                renderSlide={(img: any) => (
                  <div className="flex justify-center ">
                    <Image
                      src={img.url}
                      alt={img.alt || product.name}
                      width={100}
                      height={100}
                      layout="responsive"
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-110 "
                    />
                  </div>
                )}
              />
            ) : (
              <p className="text-center">No images available</p>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2 ">
              {product.images.map((img: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`border-2 rounded-md overflow-hidden transition-all duration-200 ${
                    activeImageIndex === index
                      ? "border-blue-500 "
                      : "border-transparent "
                  }`}
                >
                  <Image
                    src={getImageUrl(img.url)}
                    alt={img.alt || `${product.name} thumbnail ${index + 1}`}
                    width={100}
                    height={100}
                    className="object-cover w-full h-full "
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col gap-4 !mt-4">
          <h1 className="!text-2xl !font-bold ">{product.name}</h1>
          <div className="flex items-center gap-2 ">
            <span className="text-gray-600 flex flex-row gap-2 !text-xs ">
              in{" "}
              <p className="text-black !font-bold !text-xs">
                {product.category?.main || "Electronics"}
              </p>
            </span>
            <span className="text-gray-400 ">|</span>
            <span className="text-gray-600 !font-bold flex !text-xs">
              SKU: {product.inventory?.sku || "N/A"}
            </span>
            <span className="text-gray-400 ">|</span>
            <div className="flex items-center  ">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className={`w-4 h-4 ${
                    product.ratings?.average >= index + 1
                      ? "text-yellow-400 "
                      : "text-gray-300 "
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 !text-xs text-gray-600 ">
                {product.ratings?.average?.toFixed(2) || "0.00"} (
                {product.ratings?.count || 0} Reviews)
              </span>
            </div>
          </div>
          {/* Price Section */}
          <div className="my-4 ">
            <p className="!text-lg lg:!text-2xl !font-bold text-black ">
              ${product.price.toFixed(2)}
            </p>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-start lg:justify-between">
              {product.oldPrice && (
                <div className="flex items-center gap-2 ">
                  <p className="text-lg text-gray-500 line-through ">
                    ${product?.oldPrice.toFixed(2)}
                  </p>
                  <span className="text-green-600 ">
                    Save: ${savings.toFixed(2)}
                  </span>
                </div>
              )}
              <p
                className={`mt-1 !text-xs ${
                  product.inventory?.stock > 9
                    ? "text-green-600"
                    : product.inventory?.stock > 0
                    ? "text-orange-500"
                    : "text-red-600"
                }`}
              >
                {product.inventory?.stock > 9
                  ? "Available in stock"
                  : product.inventory?.stock > 0
                  ? "Limited stock available"
                  : "Out of stock"}
              </p>
            </div>
          </div>
          <hr />
         
          <div className="flex flex-col gap-4 mt-4 !w-full">
           
            <div className="flex items-center justify-center !w-full lg:!w-36 !h-16 !border-2 !border-gray-100 !hover:border-black !hover:border-2 !space-x-2">
              <button
                className="flex items-center justify-center !border-2 !h-6 !w-6 !rounded-full !hover:border-black cursor-pointer"
                onClick={handleDecrement}
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
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
                className="flex items-center justify-center !border-2 !h-6 !w-6 !rounded-full !hover:border-black !hover:border-2 cursor-pointer"
                onClick={handleIncrement}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col lg:flex-row flex-wrap gap-4 !w-full lg:!w-auto justify-start lg:justify-start items-start lg:items-center">
              <button
                className="flex flex-row gap-3 items-center !bg-[#6e2eff] hover:!bg-[#7143db] !w-44 !text-white !px-8 !py-4 !font-medium cursor-pointer"
                onClick={handleAddToCart}
              >
                <BsCart3 />
                Add to cart
              </button>
              <Link href="/checkout">
                <button className="!bg-white !border-2 !border-[#6e2eff] hover:!bg-[#439edb] !text-[#6e2eff] hover:!text-white !w-44 !px-8 !py-4 !font-medium cursor-pointer">
                  Buy Now
                </button>
              </Link>
            </div>
          </div>
          {/* Action Buttons */}
         
          {/* Secondary Actions */}
          <div  className="flex flex-wrap items-center lg:items-start justify-center lg:justify-start gap-6 mt-4 !text-sm w-full">
            <button className="flex items-center gap-2 text-gray-600 !hover:text-black cursor-pointer">
              <Icon as={AiOutlineHeart} size="md" />
              Add To Wishlist
            </button>
            <button className="flex items-center gap-2 text-gray-600 !hover:text-black cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Add To Compare
            </button>
          </div>
          {/* Store Info */}
          <div className="mt-8 !border-2 !p-5 flex items-center justify-between gap-2 shadow-lg bg-white !w-full">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
              <h3 className="font-medium mb-2 ">Store</h3>
              <span className=" !font-bold !text-sm">
                {product.details?.manufacturer?.name}
              </span>
            </div>
            <div className="flex items-center gap-2 ">
              <div className="flex items-center ">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`w-4 h-4 ${
                      (product?.store?.rating || 4.77) >= index + 1
                        ? "text-yellow-400 "
                        : "text-gray-300 "
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-sm text-gray-600 ">
                  {(product?.store?.rating || 4.77).toFixed(2)} (
                  {product?.store?.reviewCount || 31} Reviews)
                </span>
              </div>
            </div>
          </div>
          {/* Shipping Info */}
          <div className="!my-6 space-y-3 flex flex-col justify-start gap-4 !border-2 !p-5 shadow-lg bg-white !w-full">
            <div className="flex flex-col lg:flex-row items-center justify-start lg:justify-between gap-2 text-green-600 ">
              <div className="flex  items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 5.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 10l1.293-1.293zm4 0a1 1 0 010 1.414L13.586 10l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Free Shipping & Returns on this item</span>
              </div>
              <button className="text-blue-600 hover:underline ml-2 cursor-pointer">
                See Details
              </button>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-start lg:justify-between gap-2 text-gray-600 ">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>

                <span>Delivery within 3–5 working days</span>
              </div>
              <button className="text-blue-600 hover:underline ml-2 cursor-pointer">
                See Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <TabsComponents product={product} />
    </div>
  );
};

export default ProductDetailPage;
