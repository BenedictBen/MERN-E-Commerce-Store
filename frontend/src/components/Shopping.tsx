
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Filter } from "./svgs";
import FilterShop from "@/components/FilterShop";
import AddToCartDialog from "./AddToCartDialog";
import QuickViewDialog from "./QuickViewDialog";
import AddToCartDialogTablet from "./AddToCartDialogTablet";
import QuickViewDialogTablet from "./QuickViewDialogTablet";
import { AiOutlineHeart } from "react-icons/ai";
import { Icon, Spinner } from "@chakra-ui/react";
import Image from "next/image";
import SwiperImage from "./SwiperImage";
import { transformFlashDealData } from "@/lib/types";
import {
  brands,
  colors,
  storageCapacities,
  processorTypes,
  sizes,
  priceRanges,
  customerRatings,
} from "@/lib/filters";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/slices/wishlistSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";
import { toast } from "react-toastify";

// Add this helper function near the top of your component
const getProductCategoryId = (product: Product) => {
  return typeof product.category === 'string' 
    ? product.category 
    : product.category?._id;
};

// Add these utility functions
const getStableProductId = (product: Product): string => {
  // Prefer _id if available, fall back to id, then generate a fallback
  return product._id || String(product.id || `temp-${Math.random().toString(36).substring(2, 9)}`);
};

const getNumericId = (productId: string): number => {
  // Create a consistent numeric ID from the string ID
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    const char = productId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};



interface Product {
  _id: string;
  id?: number | string;
  name: string;
  price: number;
  oldPrice?: number;
  category?: {
    _id: string;
    main: string;
    sub?: string;
  };
  details?: {
    manufacturer?: {
      name: string;
    };
    specs?: {
      processor?: string;
    };
  };
  variants?: {
    colors?: Array<{ name: string }>;
    storage?: Array<{ value: string }>;
    sizes?: Array<string | { name: string }>;
  };
  ratings?: {
    average?: number;
    count?: number;
  };
  images?: Array<{ url: string; alt?: string; isPrimary?: boolean }>;
}

interface Category {
  _id: string;
  main: string;
  sub?: string;
}

interface ShoppingProps {
  initialProducts?: Product[];
  initialCategories?: Category[];
  initialCategoryId?: string;
}


const Shopping: React.FC<ShoppingProps> = ({
  initialProducts = [],
  initialCategories = [],
  initialCategoryId,
}) => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // State management
  const [sortOption, setSortOption] = useState("default");
  const [isLoading, setIsLoading] = useState(false);
   // Add these new states for search
   const [searchResults, setSearchResults] = useState<Product[]>([]);
   const [searchError, setSearchError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>(() => {
    console.log('Initial categories prop:', initialCategories); // Debug log
    
    // If initialCategories is empty, try to fetch them
    if (!initialCategories || initialCategories.length === 0) {
      console.warn('No initial categories received');
      return [];
    }
    
    return initialCategories.map(c => ({
      _id: c._id || String(Math.random()),
      main: c.main || 'Uncategorized',
      sub: c.sub || ''
    }));
  });

  const [products, setProducts] = useState<Product[]>(() => {
    return initialProducts.map(p => {
      const category = p.category 
        ? { 
            _id: p.category._id, 
            main: p.category.main || 'Uncategorized',
            sub: p.category.sub 
          }
        : (initialCategoryId ? { 
            _id: initialCategoryId, 
            main: 'Uncategorized' 
          } : undefined);
      
      return {
        ...p,
        category,
        images: p.images?.length ? p.images : [{ 
          url: '/shop/vr000.webp', 
          alt: p.name, 
          isPrimary: true 
        }]
      };
    });
  });
  

  // Add this useEffect to handle cases where initialCategories might be empty
useEffect(() => {
  if (categories.length === 0 && initialCategories.length > 0) {
    console.log('Updating categories from initialCategories');
    setCategories(initialCategories.map(c => ({
      _id: c._id || String(Math.random()),
      main: c.main || 'Uncategorized',
      sub: c.sub || ''
    })));
  }
}, [initialCategories]);
  // Get current category from URL or props
  const categoryId = params.categoryId 
    ? decodeURIComponent(params.categoryId as string)
    : initialCategoryId;

  const [filters, setFilters] = useState<Record<string, string[]>>({
    category: categoryId ? [categoryId] : [],
    brand: [],
    color: [],
    storageCapacity: [],
    processorType: [],
    size: [],
    priceRange: [],
    customerRating: [],
  });

  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);


  useEffect(() => {
    if (categories.length === 0) {
      const fetchCategories = async () => {
        try {
          const res = await fetch('/api/auth/categories');
          const data = await res.json();
          setCategories(data.map((c: any) => ({
            _id: c._id,
            main: c.main || 'Uncategorized',
            sub: c.sub
          })));
        } catch (error) {
          console.error('Failed to fetch categories', error);
        }
      };
      fetchCategories();
    }
  }, []);

// Update the search effect
// In your search effect, add these console.log statements:
useEffect(() => {
  if (!searchQuery) {
    setSearchResults([]);
    setSearchError(null);
    if (initialProducts.length > 0) {
      setProducts(initialProducts);
    }
    return;
  }

  const performSearch = (productsToSearch: Product[]) => {
    const query = searchQuery.toLowerCase().trim();
    return productsToSearch.filter(product => {
      return (
        product.name.toLowerCase().includes(query) ||
        (product.category && typeof product.category === 'object' && 
          (product.category.main.toLowerCase().includes(query) || 
           (product.category.sub && product.category.sub.toLowerCase().includes(query)))) ||
        (product.details?.manufacturer?.name?.toLowerCase().includes(query))
      );
    });
  };

  const fetchSearchResults = async () => {
    try {
      setIsLoading(true);
      setSearchError(null);
      
      const res = await fetch(`/api/auth/product?search=${encodeURIComponent(searchQuery.trim())}`);
      
       // Only throw error if response is truly empty
       if (!res.ok && res.status !== 404) {
        throw new Error('Failed to fetch search results');
      }
      
      const data = await res.json();
      let rawProducts = Array.isArray(data) ? data : data.products || [];
      
      // If API returns all products, filter them client-side
      if (rawProducts.length > 10) { // Arbitrary threshold
        console.log('API returned many products, applying client-side filtering');
        rawProducts = performSearch(rawProducts);
      }
      
      if (rawProducts.length === 0) {
        setSearchError('No products found matching your search');
        setSearchResults([]);
        return;
      }

      const transformedProducts = rawProducts.map((product: any) => ({
        ...transformFlashDealData(product),
        _id: product._id || transformFlashDealData(product).id,
        category: product.category,
        details: product.details,
        variants: product.variants,
        ratings: product.ratings
      }));
      
      setSearchResults(transformedProducts);
      setProducts(transformedProducts);
    } catch (error: any) {
      console.error("Search fetch error:", error);
      // Fallback to client-side search if API fails
      console.log('Falling back to client-side search');
      const filtered = performSearch(initialProducts);
      setSearchResults(filtered);
      setProducts(filtered);
      if (filtered.length === 0) {
        setSearchError('No products found matching your search');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const debounceTimer = setTimeout(fetchSearchResults, 500);
  return () => clearTimeout(debounceTimer);
}, [searchQuery, initialProducts]);

useEffect(() => {
  if (categoryId) {
    setFilters(prev => ({
      ...prev,
      category: [categoryId]
    }));

    // Check if we need to fetch products
    const shouldFetch = products.length === 0 || 
      !products.some(p => getProductCategoryId(p) === categoryId);

    if (shouldFetch) {
      const fetchCategoryProducts = async () => {
        try {
          setIsLoading(true);
          const res = await fetch(`/api/auth/categories/${encodeURIComponent(categoryId)}/products`);
          if (!res.ok) throw new Error('Failed to fetch category products');
          
          const data = await res.json();
          const rawProducts = data.products || [];
          
          const transformedProducts = rawProducts.map((product: any) => ({
            ...transformFlashDealData(product),
            _id: product._id,
            category: product.category || { _id: categoryId },
            details: product.details || {},
            variants: product.variants || {},
            ratings: product.ratings || { average: 0, count: 0 }
          }));
          
          setProducts(transformedProducts);
        } catch (error) {
          console.error("Category products fetch error:", error);
          toast.error("Failed to load category products");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchCategoryProducts();
    }
  }
}, [categoryId, products.length]);

  // Wishlist functions
  const getProductImages = (product: Product): Array<{ url: string }> => {
    // If product has images array with items, use that
    if (product.images?.length) {
      return product.images.map(img => ({ url: img.url }));
    }
    // Otherwise use fallback image
    return [{ url: '/shop/vr000.webp' }];
  };

  const isWishlisted = (productId: string) => {
    return wishlist.some(item => item.productId === productId);
  };
  
  const handleWishlistToggle = (product: Product) => {
    const productId = getStableProductId(product);
    
    if (isWishlisted(productId)) {
      dispatch(removeFromWishlist(productId));
      toast.success(`${product.name} removed from wishlist`);
    } else {
      dispatch(addToWishlist({
        productId,
        name: product.name,
        price: product.price,
        images: getProductImages(product),
      }));
      toast.success(`${product.name} added to wishlist`);
    }
  };


  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  const handleCategorySelection = (newCategoryId: string) => {
    // Update the URL to reflect the selected category
    router.push(`/shop/${encodeURIComponent(newCategoryId)}`);
    
    // Update filters to only include the new category
    setFilters(prev => ({
      ...prev,
      category: [newCategoryId]
    }));
    
    // Clear other filters when category changes
    setFilters(prev => ({
      category: [newCategoryId],
      brand: [],
      color: [],
      storageCapacity: [],
      processorType: [],
      size: [],
      priceRange: [],
      customerRating: [],
    }));
  };

  const handleFilterChange = (newFilters: Record<string, string[]>) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      category: [],
      brand: [],
      color: [],
      storageCapacity: [],
      processorType: [],
      size: [],
      priceRange: [],
      customerRating: [],
    });
    router.push("/shop");
  };

  // Filter products
  // const filteredProducts = useMemo(() => {
  //   return products.filter((product) => {
  //     // If no filters are applied, show all products
  //     const hasActiveFilters = Object.values(filters).some(filter => filter.length > 0);
  //     if (!hasActiveFilters) return true;

  //     // Category filter
  //     if (filters.category.length > 0) {
  //       const productCategoryId = typeof product.category === 'string' 
  //         ? product.category 
  //         : product.category?._id;
  //       if (!productCategoryId || !filters.category.includes(productCategoryId)) {
  //         return false;
  //       }
  //     }

  //     // Other filters
  //     return (
  //       (filters.brand.length === 0 ||
  //         (product.details?.manufacturer?.name &&
  //           filters.brand.includes(product.details.manufacturer.name))) &&
  //       (filters.color.length === 0 ||
  //         (product.variants?.colors &&
  //           product.variants.colors.some(
  //             (c) => c.name && filters.color.includes(c.name)
  //           ))) &&
  //       (filters.storageCapacity.length === 0 ||
  //         (product.variants?.storage &&
  //           product.variants.storage.some(
  //             (s) => s.value && filters.storageCapacity.includes(s.value)
  //           ))) &&
  //       (filters.processorType.length === 0 ||
  //         (product.details?.specs?.processor &&
  //           filters.processorType.includes(product.details.specs.processor))) &&
  //       (filters.size.length === 0 ||
  //         (product.variants?.sizes &&
  //           product.variants.sizes.some((s) =>
  //             typeof s === "object"
  //               ? s.name && filters.size.includes(s.name)
  //               : filters.size.includes(s)
  //           ))) &&
  //       (filters.priceRange.length === 0 ||
  //         filters.priceRange.some((range) => {
  //           if (!product.price) return false;
  //           switch (range) {
  //             case "0-50":
  //               return product.price <= 50;
  //             case "50-100":
  //               return product.price > 50 && product.price <= 100;
  //             case "100-200":
  //               return product.price > 100 && product.price <= 200;
  //             case "200-500":
  //               return product.price > 200 && product.price <= 500;
  //             case "500-1000":
  //               return product.price > 500 && product.price <= 1000;
  //             case "1000+":
  //               return product.price > 1000;
  //             default:
  //               return true;
  //           }
  //         })) &&
  //       (filters.customerRating.length === 0 ||
  //         (product.ratings?.average &&
  //           filters.customerRating.some(
  //             (rating) =>
  //               product.ratings?.average &&
  //               product.ratings.average >= parseFloat(rating)
  //           ))
  //     ));
  //   });
  // }, [products, filters]);

  // const filteredProducts = useMemo(() => {
  //   // If we're searching and have search results, filter those
  //   if (searchQuery && searchResults.length > 0) {
  //     return searchResults.filter((product) => {
  //       // If no filters are applied, show all search results
  //       const hasActiveFilters = Object.values(filters).some(filter => filter.length > 0);
  //       if (!hasActiveFilters) return true;
  
  //       // Category filter (same as original)
  //       if (filters.category.length > 0) {
  //         const productCategoryId = typeof product.category === 'string' 
  //           ? product.category 
  //           : product.category?._id;
  //         if (!productCategoryId || !filters.category.includes(productCategoryId)) {
  //           return false;
  //         }
  //       }
  
  //       // Other filters (same as original)
  //       return (
  //         (filters.brand.length === 0 ||
  //           (product.details?.manufacturer?.name &&
  //             filters.brand.includes(product.details.manufacturer.name))) &&
  //         (filters.color.length === 0 ||
  //           (product.variants?.colors &&
  //             product.variants.colors.some(
  //               (c) => c.name && filters.color.includes(c.name)
  //             ))) &&
  //         (filters.storageCapacity.length === 0 ||
  //           (product.variants?.storage &&
  //             product.variants.storage.some(
  //               (s) => s.value && filters.storageCapacity.includes(s.value)
  //             ))) &&
  //         (filters.processorType.length === 0 ||
  //           (product.details?.specs?.processor &&
  //             filters.processorType.includes(product.details.specs.processor))) &&
  //         (filters.size.length === 0 ||
  //           (product.variants?.sizes &&
  //             product.variants.sizes.some((s) =>
  //               typeof s === "object"
  //                 ? s.name && filters.size.includes(s.name)
  //                 : filters.size.includes(s)
  //             ))) &&
  //         (filters.priceRange.length === 0 ||
  //           filters.priceRange.some((range) => {
  //             if (!product.price) return false;
  //             switch (range) {
  //               case "0-50":
  //                 return product.price <= 50;
  //               case "50-100":
  //                 return product.price > 50 && product.price <= 100;
  //               case "100-200":
  //                 return product.price > 100 && product.price <= 200;
  //               case "200-500":
  //                 return product.price > 200 && product.price <= 500;
  //               case "500-1000":
  //                 return product.price > 500 && product.price <= 1000;
  //               case "1000+":
  //                 return product.price > 1000;
  //               default:
  //                 return true;
  //             }
  //           })) &&
  //         (filters.customerRating.length === 0 ||
  //           (product.ratings?.average &&
  //             filters.customerRating.some(
  //               (rating) =>
  //                 product.ratings?.average &&
  //                 product.ratings.average >= parseFloat(rating)
  //             ))
  //       ));
  //     });
  //   }
    
  //   // Otherwise, use the original products filtering logic (unchanged)
  //   return products.filter((product) => {
  //     const hasActiveFilters = Object.values(filters).some(filter => filter.length > 0);
  //     if (!hasActiveFilters) return true;
  
  //     if (filters.category.length > 0) {
  //       const productCategoryId = typeof product.category === 'string' 
  //         ? product.category 
  //         : product.category?._id;
  //       if (!productCategoryId || !filters.category.includes(productCategoryId)) {
  //         return false;
  //       }
  //     }
  
  //     return (
  //       (filters.brand.length === 0 ||
  //         (product.details?.manufacturer?.name &&
  //           filters.brand.includes(product.details.manufacturer.name))) &&
  //       (filters.color.length === 0 ||
  //         (product.variants?.colors &&
  //           product.variants.colors.some(
  //             (c) => c.name && filters.color.includes(c.name)
  //           ))) &&
  //       (filters.storageCapacity.length === 0 ||
  //         (product.variants?.storage &&
  //           product.variants.storage.some(
  //             (s) => s.value && filters.storageCapacity.includes(s.value)
  //           ))) &&
  //       (filters.processorType.length === 0 ||
  //         (product.details?.specs?.processor &&
  //           filters.processorType.includes(product.details.specs.processor))) &&
  //       (filters.size.length === 0 ||
  //         (product.variants?.sizes &&
  //           product.variants.sizes.some((s) =>
  //             typeof s === "object"
  //               ? s.name && filters.size.includes(s.name)
  //               : filters.size.includes(s)
  //           ))) &&
  //       (filters.priceRange.length === 0 ||
  //         filters.priceRange.some((range) => {
  //           if (!product.price) return false;
  //           switch (range) {
  //             case "0-50":
  //               return product.price <= 50;
  //             case "50-100":
  //               return product.price > 50 && product.price <= 100;
  //             case "100-200":
  //               return product.price > 100 && product.price <= 200;
  //             case "200-500":
  //               return product.price > 200 && product.price <= 500;
  //             case "500-1000":
  //               return product.price > 500 && product.price <= 1000;
  //             case "1000+":
  //               return product.price > 1000;
  //             default:
  //               return true;
  //           }
  //         })) &&
  //       (filters.customerRating.length === 0 ||
  //         (product.ratings?.average &&
  //           filters.customerRating.some(
  //             (rating) =>
  //               product.ratings?.average &&
  //               product.ratings.average >= parseFloat(rating)
  //           ))
  //     ));
  //   });
  // }, [products, filters, searchQuery, searchResults]);
 
  useEffect(() => {
    console.log('Search results updated:', searchResults);
  }, [searchResults]);

  const filteredProducts = useMemo(() => {
   // Use search results when available, otherwise use products
   const productsToFilter = searchQuery ? searchResults : products;

return productsToFilter.filter((product) => {
  // If no filters are applied, show all products
  const hasActiveFilters = Object.values(filters).some(filter => filter.length > 0);
    if (!hasActiveFilters) return true;

    // Category filter
    // Category filter
    if (filters.category.length > 0) {
      const productCategoryId = typeof product.category === 'string' 
        ? product.category 
        : product.category?._id;
      if (!productCategoryId || !filters.category.includes(productCategoryId)) {
        return false;
      }
    }
  
      // Other filters
      return (
        (filters.brand.length === 0 ||
          (product.details?.manufacturer?.name &&
            filters.brand.includes(product.details.manufacturer.name))) &&
        (filters.color.length === 0 ||
          (product.variants?.colors &&
            product.variants.colors.some(
              (c) => c.name && filters.color.includes(c.name)
            ))) &&
        (filters.storageCapacity.length === 0 ||
          (product.variants?.storage &&
            product.variants.storage.some(
              (s) => s.value && filters.storageCapacity.includes(s.value)
            ))) &&
        (filters.processorType.length === 0 ||
          (product.details?.specs?.processor &&
            filters.processorType.includes(product.details.specs.processor))) &&
        (filters.size.length === 0 ||
          (product.variants?.sizes &&
            product.variants.sizes.some((s) =>
              typeof s === "object"
                ? s.name && filters.size.includes(s.name)
                : filters.size.includes(s)
            ))) &&
        (filters.priceRange.length === 0 ||
          filters.priceRange.some((range) => {
            if (!product.price) return false;
            switch (range) {
              case "0-50": return product.price <= 50;
              case "50-100": return product.price > 50 && product.price <= 100;
              case "100-200": return product.price > 100 && product.price <= 200;
              case "200-500": return product.price > 200 && product.price <= 500;
              case "500-1000": return product.price > 500 && product.price <= 1000;
              case "1000+": return product.price > 1000;
              default: return true;
            }
          })) &&
        (filters.customerRating.length === 0 ||
          (product.ratings?.average &&
            filters.customerRating.some(
              (rating) =>
                product.ratings?.average &&
                product.ratings.average >= parseFloat(rating)
            ))
        )
      );
    });
  }, [products, filters, searchQuery, searchResults]);
 
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortOption) {
        case "latest":
          return a._id > b._id ? -1 : 1;
        case "price low":
          return (a.price || 0) - (b.price || 0);
        case "price high":
          return (b.price || 0) - (a.price || 0);
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortOption]);

  useEffect(() => {
    console.log('Current search state:', {
      searchQuery,
      searchResultsCount: searchResults.length,
      productsCount: products.length,
      filteredProductsCount: filteredProducts.length
    });
  }, [searchQuery, searchResults, products, filteredProducts]);

  return (
    <div className="px-4 lg:!px-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <Filter className="fill-current w-6 h-6 cursor-pointer" />
          <p className="text-gray-600">Filter</p>
        </div>
        <div className="hidden lg:block">
          <p className="text-gray-600">{filteredProducts.length} Results</p>
        </div>
        <div className="flex gap-2 items-center">
          <p >Sort by:</p>
          <select
            className="border border-gray-500 p-1 rounded"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="default">Default</option>
            <option value="latest">Latest</option>
            <option value="price low">Price: low to high</option>
            <option value="price high">Price: high to low</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="hidden lg:block lg:w-1/5">
          <FilterShop
            categories={categories}
            brands={brands}
            colors={colors}
            storageCapacities={storageCapacities}
            processorTypes={processorTypes}
            sizes={sizes}
            priceRanges={priceRanges}
            customerRatings={customerRatings}
            onFilterChange={handleFilterChange}
            onCategorySelect={handleCategorySelection}
            selectedFilters={filters}
            onClearFilters={handleClearFilters}
          />
        </div>


<div className="lg:w-4/5">
  {searchError ? (
    <div className="text-center py-10">
      <p className="text-gray-600 mt-2">{searchError}</p>
      <button
        onClick={() => {
          setSearchError(null);
          router.push('/shop');
        }}
        className="mt-4 !px-4 !py-2 !bg-purple-600 !text-white rounded hover:!bg-purple-700"
      >
        Back to Shop
      </button>
    </div>
  ) : (isLoading || (sortedProducts.length === 0 && categoryId)) ? (
    <div className="flex justify-center items-center h-64">
      <Spinner color="#6e2eff" size="xl" />
    </div>
  ) : sortedProducts.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedProducts.map((product) => {
        const transformedProduct = transformFlashDealData(product);
        
        return (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative group flex flex-col !items-center text-center border !p-5 transition-transform duration-300 transform hover:scale-105">
              <Link
                href={`/shop/product/${product._id || product.id || 'missing-id'}`}
                prefetch={false}
                className="w-full"
              >
                <div className="group relative w-full flex justify-center">
                  <SwiperImage
                    data={transformedProduct.images.map(
                      (img, index) => ({
                        ...img,
                        id: index,
                      })
                    )}
                    slidesPerView={1}
                    renderSlide={(img) => (
                      <div className="flex justify-center">
                        <Image
                          src={img.url}
                          alt={img.alt || transformedProduct.name}
                          width={200}
                          height={200}
                          layout="responsive"
                          objectFit="cover"
                        />
                      </div>
                    )}
                  />
                </div>

                <div className="flex flex-col items-start text-left gap-2 w-full">
                  <h1 className="text-md">{transformedProduct.name}</h1>
                  <span className="flex gap-2">
                    <p className="text-sm">
                      ${transformedProduct.price}
                    </p>
                    {transformedProduct.oldPrice && (
                      <p className="text-xs line-through">
                        ${transformedProduct.oldPrice}
                      </p>
                    )}
                  </span>
                  {transformedProduct.details?.manufacturer?.name && (
                    <p className="text-xs">
                      {transformedProduct.details.manufacturer.name}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-start gap-2 mt-1 w-full">
                  <div className="flex items-center justify-start text-left gap-0.5">
                    {[...Array(5)].map((_, index) => {
                      const rating =
                        transformedProduct.ratings?.average || 0;
                      return (
                        <svg
                          key={index}
                          className={`w-3 h-3 ${
                            rating >= index + 1
                              ? "text-yellow-400"
                              : rating >= index + 0.5
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292z" />
                        </svg>
                      );
                    })}
                  </div>
                  <span className="text-xs text-gray-600 text-left">
                    ({transformedProduct.ratings?.count || 0})
                  </span>
                </div>
              </Link>

              <div className="absolute top-44 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 w-full flex justify-center z-10">
                <div className="bg-gray-400 flex flex-row gap-3 items-center justify-center rounded-full h-6 w-24 lg:w-12 p-2">
                  <Icon
                    as={AiOutlineHeart}
                    size="md"
                    // color={isWishlisted(product._id) ? "red" : "white"}
                    color={isWishlisted(product._id) ? "red" : "white"}
                    className="rounded-full h-6 w-6 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlistToggle(product);
                    }}
                  />
                  <div className="block lg:hidden">
                    <QuickViewDialogTablet
                      product={transformedProduct}
                    />
                  </div>
                  <div className="block lg:hidden">
                    <AddToCartDialogTablet
                      product={transformedProduct}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
                <div className="flex flex-col gap-4 items-center justify-center w-full">
                  <AddToCartDialog product={transformedProduct} />
                  <QuickViewDialog product={transformedProduct} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="text-center py-10">
      <h3 className="text-lg font-medium">
        {searchQuery ? 'No search results found' : 'No products found'}
      </h3>
      <p className="text-gray-600 mt-2">
        {searchQuery 
          ? `We couldn't find any products matching "${searchQuery}"`
          : filters.category.length > 0
            ? "Try adjusting your filters"
            : "No products available in this category"}
      </p>
      <button
        onClick={handleClearFilters}
        className="mt-4 !px-4 !py-2 !bg-purple-600 !text-white rounded hover:!bg-purple-700"
      >
        {searchQuery ? 'Clear Search' : 'Clear Filters'}
      </button>
    </div>
  )}
</div>
      </div>
    </div>
  );
};

export default Shopping;

