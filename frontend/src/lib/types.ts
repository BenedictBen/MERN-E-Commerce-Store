// Define interface for each image object
export interface Image {
  url: string;
  alt: string;
  isPrimary: boolean;
}

// Define interfaces for variants
export interface ColorVariant {
  name: string;
  code: string;
  stock: number;
  images: string[]; 
}

export interface StorageVariant {
  value: string;
  priceAdjustment: number;
}

export interface Category {
  main: string;
  sub: string;
  tags: string[];
}

export interface SimilarProduct {
  id: number;
  slug: string;
  name: string;
  price: number;
  category: string;
  link: string;
  image: string;
  rating: number;
}

export interface Variants {
  colors?: ColorVariant[];
  storage?: StorageVariant[];
  plugTypes?: {
      name: string;
      code: string;
      stock: number;
      images: string[];
  }[];
  bundles?: {
      name: string;
      code: string;
      stock: number;
      priceAdjustment: number;
      includes?: string[];
      images?: string[];
  }[];
  sizes?: Array<{
      name: string;
      code?: string;
      stock?: number;
      weightRange?: string;
  } | string>;
  finishes?: {
      name: string;
      code: string;
      stock: number;
      images: string[];
  }[];
  configurations?: {
      name: string;
      code: string;
      priceAdjustment: number;
      images: string[];
  }[];
  accessories?: {
      name: string;
      code: string;
      priceAdjustment: number;
  }[];
}

export interface Manufacturer {
  name: string;
  website?: string;
  warranty?: string;
}

export interface Ratings {
  average: number;
  count: number;
  distribution?: {
      "5": number;
      "4": number;
      "3": number;
      "2": number;
      "1": number;
  };
}

export interface Inventory {
  stock: number;
  sku: string;
  restockDate: string;
  location: string;
}

export interface Shipping {
  weight: number;
  dimensions: string;
  freeShipping: boolean;
  whiteGlove?: boolean;
  expressDelivery?: boolean;
}

export interface Metadata {
  createdAt: string;
  updatedAt: string;
  staffPick: boolean;
}

export interface Details {
  specs: {
      [key: string]: any;
      display?: string;
      processor?: string;
      storage?: string;
      cameras?: {
          rear?: string[];
          front?: string;
      };
      battery?: string;
      material?: string;
      fabricWeight?: string;
      careInstructions?: string;
      certifications?: string[];
      input?: string;
      output?: string;
      efficiency?: string;
      weight?: string;
      safetyCertifications?: string[];
      capacity?: string;
      annualEnergyUse?: string;
      voltage?: string;
      waterFilter?: string;
      tech?: string[];
      dimensions?: string;
      weightCapacity?: string;
      mattressSize?: string;
      connection?: string;
      compatibility?: string[];
      cableLength?: string;
      pieceCount?: number;
      scale?: string;
      recommendedAge?: string;
      materials?: string;
      weatherRating?: string;
      handOrientation?: string;
      upperMaterial?: string;
      midsole?: string;
      outsole?: string;
      closure?: string;
  };
  features: string[];
  manufacturer: Manufacturer;
}

// Define the main Deals interface following the JSON naming convention.
export interface Deals {
  id: number;
  slug: string;
  name: string;
  price: number;
  oldPrice: number;
  category: Category;
  images: Image[];
  variants: Variants;
  details: Details;
  ratings: Ratings;
  inventory: Inventory;
  shipping: Shipping;
  similarProducts: SimilarProduct[];
  metadata: Metadata;
  description: string;
  subTitle?: string;
  subDescription?: string;
  moreInfo?: string[];
}

// Helper function to get the first available variant type
const getFirstVariantType = (variants: Variants): string => {
  if (variants.colors && variants.colors.length > 0) return 'colors';
  if (variants.storage && variants.storage.length > 0) return 'storage';
  if (variants.plugTypes && variants.plugTypes.length > 0) return 'plugTypes';
  if (variants.bundles && variants.bundles.length > 0) return 'bundles';
  if (variants.sizes && variants.sizes.length > 0) return 'sizes';
  if (variants.finishes && variants.finishes.length > 0) return 'finishes';
  if (variants.configurations && variants.configurations.length > 0) return 'configurations';
  if (variants.accessories && variants.accessories.length > 0) return 'accessories';
  return 'colors'; // default
};

export const transformFlashDealData = (data: any): Deals => {
  // Helper function to ensure proper image URL
  const getImageUrl = (url: string | undefined): string => {
    if (!url) return '/shop/vr000.webp'; // Default fallback image
    
    // Handle absolute URLs
    if (url.startsWith('http') || url.startsWith('https')) return url;
    
    // Handle local development paths
    if (process.env.NODE_ENV === 'development') {
      if (url.startsWith('/uploads/')) return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
      if (url.startsWith('public/')) return `${process.env.NEXT_PUBLIC_API_URL}/${url}`;
    }
    
    // Handle production paths
    if (url.startsWith('/uploads/') || url.startsWith('/public/')) {
      return `${process.env.NEXT_PUBLIC_API_URL || ''}${url}`;
    }
    
    return url;
  };

  // Normalize images handling for both API response formats
  let images: Image[] = [];
  
  // Case 1: Has full images array
  if (Array.isArray(data.images)) {
    images = data.images.map((img: any) => ({
      url: getImageUrl(img.url || img), // Handle both object and string formats
      alt: img.alt || data.name || 'Product image',
      isPrimary: img.isPrimary || false
    }));
  } 
  // Case 2: Has single primaryImage object (from your API response)
  else if (data.primaryImage) {
    images = [{
      url: getImageUrl(data.primaryImage.url),
      alt: data.primaryImage.alt || data.name || 'Product image',
      isPrimary: true
    }];
  }
  // Case 3: Has simple image string
  else if (data.image) {
    images = [{
      url: getImageUrl(data.image),
      alt: data.name || 'Product image',
      isPrimary: true
    }];
  }
  
  // Ensure we always have at least one image
  if (images.length === 0) {
    images.push({
      url: '/shop/vr000.webp',
      alt: 'Default product image',
      isPrimary: true
    });
  }

  // Normalize category data
  let category: Category;
  if (typeof data.category === 'string') {
    category = {
      main: data.category,
      sub: '',
      tags: []
    };
  } else if (data.category && data.category.main) {
    category = {
      main: data.category.main,
      sub: data.category.sub || '',
      tags: data.category.tags || []
    };
  } else {
    category = {
      main: 'Uncategorized',
      sub: '',
      tags: []
    };
  }

  return {
    id: data._id || data.id,
    slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, '-'),
    name: data.name || 'Unnamed Product',
    price: data.price || 0,
    oldPrice: data.oldPrice || Math.round((data.price || 0) * 1.1), // 10% markup if no oldPrice
    category: category,
    images: images,
    variants: data.variants || {},
    details: {
      specs: data.details?.specs || {},
      features: data.details?.features || [],
      manufacturer: {
        name: data.details?.manufacturer?.name || 
              data.brand || 
              data.details?.brand || 
              "Unknown Manufacturer",
        website: data.details?.manufacturer?.website,
        warranty: data.details?.manufacturer?.warranty
      }
    },
    ratings: {
      average: data.ratings?.average || 0,
      count: data.ratings?.count || 0,
      distribution: data.ratings?.distribution || {
        "5": 0,
        "4": 0,
        "3": 0,
        "2": 0,
        "1": 0
      }
    },
    inventory: {
      stock: data.inventory?.stock || data.quantity || 0,
      sku: data.inventory?.sku || data.sku || '',
      restockDate: data.inventory?.restockDate || '',
      location: data.inventory?.location || ''
    },
    shipping: {
      weight: data.shipping?.weight || 0,
      dimensions: data.shipping?.dimensions || '',
      freeShipping: data.shipping?.freeShipping || false,
      whiteGlove: data.shipping?.whiteGlove,
      expressDelivery: data.shipping?.expressDelivery
    },
    similarProducts: data.similarProducts || [],
    metadata: {
      createdAt: data.metadata?.createdAt || data.createdAt || '',
      updatedAt: data.metadata?.updatedAt || data.updatedAt || '',
      staffPick: data.metadata?.staffPick || false
    },
    description: data.description || '',
    subTitle: data['sub-title'] || data.subTitle || '',
    subDescription: data['sub-description'] || data.subDescription || '',
    moreInfo: data['more info'] || data.moreInfo || []
  };
};

export type FormValues = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  password: string;
  order: string;
  billing: string;
  contact: string;
  paymentDetails: string;
};

export interface Order {
  _id: string;
  orderItems: {
    image: string;
    name: string;
    qty: number;
    price: number;
    _id: string;
  }[];
  createdAt: string;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  user: {
    username: string;
    _id: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  shippingStatus: string;
  paystackReference?: string;
  paidAt?: string;
}