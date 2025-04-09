interface RatingDistribution {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  }
  
  interface Ratings {
    distribution: RatingDistribution;
    average: number;
    count: number;
  }
  
  interface ColorVariant {
    _id: string;
    name: string;
    code: string;
    stock?: number;
    images?: string[];
    id: string;
  }
  
  interface StorageVariant {
    _id: string;
    value: string;
    priceAdjustment?: number;
    id: string;
  }
  
  interface SizeVariant {
    _id: string;
    name: string;
    code?: string;
    stock?: number;
    weightRange?: string;
    id: string;
  }
  
  interface FinishVariant {
    name: string;
    stock: number;
    priceAdjustment: number;
    images: string[];
  }
  
  interface Variants {
    colors?: ColorVariant[];
    storage?: StorageVariant[];
    sizes?: SizeVariant[];
    finishes?: FinishVariant[];
    plugTypes?: Array<{
      name: string;
      code: string;
      stock: number;
      images: string[];
    }>;
    bundles?: Array<{
      name: string;
      code: string;
      stock: number;
      priceAdjustment: number;
      includes?: string[];
    }>;
    accessories?: Array<{
      name: string;
      code: string;
      priceAdjustment: number;
    }>;
  }
  
  interface Image {
    url: string;
    alt: string;
    isPrimary: boolean;
    _id: string;
  }
  
  interface Product {
    _id: string;
    slug: string;
    name: string;
    image: string;
    brand: string;
    quantity: number;
    category: string | { _id: string; main: string; sub: string; } | undefined;
    description: string;
    price: number;
    oldPrice?: number;
    countInStock: number;
    subTitle?: string;
    subDescription?: string;
    moreInfo?: string[];
    images?: Image[];
    variants?: Variants;
    ratings: Ratings;
    reviews: any[]; // You might want to define a proper type for reviews
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
    totalStock?: number;
  }
  
  interface ProductListResponse {
    products: Product[];
    page: number;
    pages: number;
    hasMore: boolean;
  }
  
  interface CreateProductFormData {
    name: string;
    images: (File | string)[];  // Allow both File and string types for images
    brand: string;
    quantity: number;
    category: string;
    description: string;
    price: number;
    countInStock: number;
    // Add other fields as needed
  }

  interface CreateCategories {
    _id: string;
    main: string;
    sub: string;
    tags: [];
  }
  
  export type { Product, ProductListResponse, CreateProductFormData, CreateCategories };