


"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ShopHero from "@/components/ShopHero";
import Shopping from "@/components/Shopping";
import { transformFlashDealData } from "@/lib/types";
import { Spinner } from "@chakra-ui/react";

interface CategoryPageProps {
  params: {
    categoryId?: string;
  };
}

const CategoryPage = ({ params }: CategoryPageProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const categoryId = params.categoryId ? decodeURIComponent(params.categoryId) : undefined;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const endpoint = categoryId 
          ? `/api/auth/category/${encodeURIComponent(categoryId)}`
          : '/api/auth/product';

        const res = await fetch(endpoint);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        const data = await res.json();
        
        // Handle both response formats:
        // 1. For category endpoint: { success: true, products: [...] }
        // 2. For all products endpoint: { success: true, products: [...] } or direct array
        const productsData = data.products || data;
        const productsArray = Array.isArray(productsData) ? productsData : [];

        setProducts(productsArray.map(transformFlashDealData));
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
        
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">Sign up or Login to continue shopping</h3>
        <p className=" my-4 border-2 bg-blue-800 text-white">
          <a href="/signin">Login</a>
        </p>
      </div>
    );
  }

  return (
    <div>
      <ShopHero category={categoryId || "Shop"} />
      <Shopping initialProducts={products} />
    </div>
  );
};

export default CategoryPage;