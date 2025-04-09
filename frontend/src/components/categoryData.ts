// data/categoryData.ts
import React from "react";
import { DealIcon, NewIcon, CategoryIcon } from "./svgs";

export interface CategoryItem {
  id: number;
  name: string;
  icon?: React.ReactNode;
  image?: string;
  features?: string[]; // Made optional
  subItems?: Array<{ name: string; href: string }>;
  images?: Array<{
    src: string;
    title: string;
    subTitle: string;
    alt: string;
    href: string;
  }>;
  buttonLabel?: string;
}
 
export const categories: CategoryItem[] = [
  {
    id: 0,
    name: "Special Deals",
    icon: React.createElement(DealIcon),
    features: [], // Added empty array to satisfy interface
    subItems: [
      { name: "Deal of the Day", href: "/deals/deal-of-the-day" },
      { name: "Limited Time Offer", href: "/deals/limited-time" },
      { name: "Black Friday Sale", href: "/deals/black-friday" },
      { name: "Member Offers", href: "/deals/member-offers" },
      { name: "Outlet", href: "/deals/outlet" },
      { name: "Top Deals", href: "/deals/top-deals" },
      { name: "70% Off & Over – Final Sale", href: "/deals/final-sale" },
      { name: "Extra 20% off Clearance", href: "/deals/clearance" },
      { name: "Up to 40% off Lighting", href: "/deals/lighting" },
      { name: "40% off Baby seats", href: "/deals/baby-seats" },
      { name: "40% off Trays, Barware + Table Linens", href: "/deals/tableware" }
    ],
    images: [
      {
        src: "/home/home-Indoor.jpg",
        title: "Home & Garden",
          subTitle: "",
        alt: "home",
        href: "/home-garden"
      },
      {
        src: "/home/cats-electronics.jpg",
        title: "Electronics",
          subTitle: "",
        alt: "electronics",
        href: "/electronics"
      },
      {
        src: "/home/cats-fashion.jpg",
        title: "Fashion",
          subTitle: "",
        alt: "fashion",
        href: "/fashion"
      },
      {
        src: "/home/cats-sport.jpg",
        title: "Sports & Entertainment",
          subTitle: "",
        alt: "sports & entertainment",
        href: "/sports-entertainment"
      },
      {
        src: "/home/cats-mother.jpg",
        title: "Mother & Kids",
          subTitle: "",
        alt: "home",
        href: "/mother-kids"
      },
      {
        src: "/home/cats-toys.jpg",
        title: "Toys & Kids",
          subTitle: "",
        alt: "toys-kids",
        href: "/toys-kids"
      },
      
    ],
   
  },
  {
    id: 1,
    name: "What's New",
    icon: React.createElement(NewIcon),
    features: ["New Arrivals"
    ], 
    subItems: [
        { name: "Furniture New Arrivals", href: "/deals/deal-of-the-day" },
        { name: "Women's New Arrivals", href: "/deals/limited-time" },
        { name: "Kid's New Arrivals", href: "/deals/black-friday" },
        { name: "Men's New Arrivals", href: "/deals/member-offers" },
        { name: "Beauty New Arrivals", href: "/deals/outlet" },
        { name: "Home New Arrivals", href: "/deals/top-deals" },
        { name: "Health & Wellness", href: "/deals/final-sale" },
        { name: "Black History Month", href: "/deals/clearance" },
      ],
      images: [
        {
          src: "/home/home-Indoor.jpg",
          title: "Power Couple",
          subTitle: "Explore Now",
          alt: "home",
          href: "/home-garden"
        },
        {
          src: "/home/cats-electronics.jpg",
          title: "Sleep Better",
          subTitle: "Explore Now",
          alt: "electronics",
          href: "/electronics"
        },
        {
          src: "/home/cats-fashion.jpg",
          title: "Summer Beauty",
          subTitle: "Explore Now",
          alt: "fashion",
          href: "/fashion"
        },
        {
          src: "/home/cats-sport.jpg",
          title: "Lightweight Spring",
          subTitle: "Explore Now",
          alt: "sports & entertainment",
          href: "/sports-entertainment"
        },
        
      ],
  },
  {
    id: 2,
    name: "Home & Garden",
    image: "/home/home-garden.png",
    features: [], // Added required property
    subItems: [
        { name: "Sales", href: "/deals/deal-of-the-day" },
        { name: "Appliances", href: "/deals/limited-time" },
        { name: "Both", href: "/deals/black-friday" },
        { name: "Bedding", href: "/deals/member-offers" },
        { name: "Cleaning Supplies", href: "/deals/outlet" },
        { name: "Event & Party Supplies", href: "/deals/top-deals" },
        { name: "Furniture", href: "/deals/final-sale" },
        { name: "Garden Supplies", href: "/deals/clearance" },
        { name: "Home accessories", href: "/deals/lighting" },
        { name: "Home Decor", href: "/deals/baby-seats" },
        { name: "House Plants", href: "/deals/tableware" },
        { name: "Irons & Steamers", href: "/deals/tableware" },
        { name: "Kids Home", href: "/deals/tableware" },
        { name: "Kitchen & dining", href: "/deals/tableware" },
        { name: "Lamp & Lighting", href: "/deals/tableware" },
      ],
      images: [
        {
          src: "/home/menu-banner-home-garden-1.jpg",
          title: "Come and See The New Collection",
          subTitle: "Explore Now",
          alt: "menu-banner-home-garden-1",
          href: "/home-garden"
        },
        
      ],
  },
  {
    id: 3,
    name: "Electronics",
    image: "/home/electronics.png",
    features: [], // Added required property
    subItems: [
        { name: "Furniture New Arrivals", href: "/deals/deal-of-the-day" },
        { name: "Women's New Arrivals", href: "/deals/limited-time" },
        { name: "Kid's New Arrivals", href: "/deals/black-friday" },
        { name: "Men's New Arrivals", href: "/deals/member-offers" },
        { name: "Beauty New Arrivals", href: "/deals/outlet" },
        { name: "Home New Arrivals", href: "/deals/top-deals" },
        { name: "Health & Wellness", href: "/deals/final-sale" },
        { name: "Black History Month", href: "/deals/clearance" },
      ],
      images: [
        {
          src: "/home/home-Indoor.jpg",
          title: "Power Couple",
          subTitle: "Explore Now",
          alt: "home",
          href: "/home-garden"
        },
        {
          src: "/home/cats-electronics.jpg",
          title: "Sleep Better",
          subTitle: "Explore Now",
          alt: "electronics",
          href: "/electronics"
        },
        {
          src: "/home/cats-fashion.jpg",
          title: "Summer Beauty",
          subTitle: "Explore Now",
          alt: "fashion",
          href: "/fashion"
        },
        {
          src: "/home/cats-sport.jpg",
          title: "Lightweight Spring",
          subTitle: "Explore Now",
          alt: "sports & entertainment",
          href: "/sports-entertainment"
        },
        
      ],
  },
  {
    id: 4,
    name: "Fashion",
    image: "/home/fashion.png",
    features: [], // Added required property
    subItems: [
        { name: "Furniture New Arrivals", href: "/deals/deal-of-the-day" },
        { name: "Women's New Arrivals", href: "/deals/limited-time" },
        { name: "Kid's New Arrivals", href: "/deals/black-friday" },
        { name: "Men's New Arrivals", href: "/deals/member-offers" },
        { name: "Beauty New Arrivals", href: "/deals/outlet" },
        { name: "Home New Arrivals", href: "/deals/top-deals" },
        { name: "Health & Wellness", href: "/deals/final-sale" },
        { name: "Black History Month", href: "/deals/clearance" },
      ],
      images: [
        {
          src: "/home/home-Indoor.jpg",
          title: "Power Couple",
          subTitle: "Explore Now",
          alt: "home",
          href: "/home-garden"
        },
        {
          src: "/home/cats-electronics.jpg",
          title: "Sleep Better",
          subTitle: "Explore Now",
          alt: "electronics",
          href: "/electronics"
        },
        {
          src: "/home/cats-fashion.jpg",
          title: "Summer Beauty",
          subTitle: "Explore Now",
          alt: "fashion",
          href: "/fashion"
        },
        {
          src: "/home/cats-sport.jpg",
          title: "Lightweight Spring",
          subTitle: "Explore Now",
          alt: "sports & entertainment",
          href: "/sports-entertainment"
        },
        
      ],
  },
  {
    id: 5,
    name: "Sports & Entertainment",
    image: "/home/sports.png",
    features: [], // Added required property
    subItems: [
        { name: "Furniture New Arrivals", href: "/deals/deal-of-the-day" },
        { name: "Women's New Arrivals", href: "/deals/limited-time" },
        { name: "Kid's New Arrivals", href: "/deals/black-friday" },
        { name: "Men's New Arrivals", href: "/deals/member-offers" },
        { name: "Beauty New Arrivals", href: "/deals/outlet" },
        { name: "Home New Arrivals", href: "/deals/top-deals" },
        { name: "Health & Wellness", href: "/deals/final-sale" },
        { name: "Black History Month", href: "/deals/clearance" },
      ],
      images: [
        {
          src: "/home/home-Indoor.jpg",
          title: "Power Couple",
          subTitle: "Explore Now",
          alt: "home",
          href: "/home-garden"
        },
        {
          src: "/home/cats-electronics.jpg",
          title: "Sleep Better",
          subTitle: "Explore Now",
          alt: "electronics",
          href: "/electronics"
        },
        {
          src: "/home/cats-fashion.jpg",
          title: "Summer Beauty",
          subTitle: "Explore Now",
          alt: "fashion",
          href: "/fashion"
        },
        {
          src: "/home/cats-sport.jpg",
          title: "Lightweight Spring",
          subTitle: "Explore Now",
          alt: "sports & entertainment",
          href: "/sports-entertainment"
        },
        
      ],
  },
  {
    id: 6,
    name: "Toys & Games",
    image: "/home/toys.png",
    features: ["Toys"],
    subItems: [
        { name: "Furniture New Arrivals", href: "/deals/deal-of-the-day" },
        { name: "Women's New Arrivals", href: "/deals/limited-time" },
        { name: "Kid's New Arrivals", href: "/deals/black-friday" },
        { name: "Men's New Arrivals", href: "/deals/member-offers" },
        { name: "Beauty New Arrivals", href: "/deals/outlet" },
        { name: "Home New Arrivals", href: "/deals/top-deals" },
        { name: "Health & Wellness", href: "/deals/final-sale" },
        { name: "Black History Month", href: "/deals/clearance" },
      ],
      images: [
        {
          src: "/home/home-Indoor.jpg",
          title: "Power Couple",
          subTitle: "Explore Now",
          alt: "home",
          href: "/home-garden"
        },
        {
          src: "/home/cats-electronics.jpg",
          title: "Sleep Better",
          subTitle: "Explore Now",
          alt: "electronics",
          href: "/electronics"
        },
        {
          src: "/home/cats-fashion.jpg",
          title: "Summer Beauty",
          subTitle: "Explore Now",
          alt: "fashion",
          href: "/fashion"
        },
        {
          src: "/home/cats-sport.jpg",
          title: "Lightweight Spring",
          subTitle: "Explore Now",
          alt: "sports & entertainment",
          href: "/sports-entertainment"
        },
        
      ],
  },
  {
    id: 7,
    name: "Mother & Kids",
    image: "/home/mother.png", // Fixed duplicate image path
    features: [], // Added required property
    subItems: [
        { name: "Furniture New Arrivals", href: "/deals/deal-of-the-day" },
        { name: "Women's New Arrivals", href: "/deals/limited-time" },
        { name: "Kid's New Arrivals", href: "/deals/black-friday" },
        { name: "Men's New Arrivals", href: "/deals/member-offers" },
        { name: "Beauty New Arrivals", href: "/deals/outlet" },
        { name: "Home New Arrivals", href: "/deals/top-deals" },
        { name: "Health & Wellness", href: "/deals/final-sale" },
        { name: "Black History Month", href: "/deals/clearance" },
      ],
      images: [
        {
          src: "/home/home-Indoor.jpg",
          title: "Power Couple",
          subTitle: "Explore Now",
          alt: "home",
          href: "/home-garden"
        },
        {
          src: "/home/cats-electronics.jpg",
          title: "Sleep Better",
          subTitle: "Explore Now",
          alt: "electronics",
          href: "/electronics"
        },
        {
          src: "/home/cats-fashion.jpg",
          title: "Summer Beauty",
          subTitle: "Explore Now",
          alt: "fashion",
          href: "/fashion"
        },
        {
          src: "/home/cats-sport.jpg",
          title: "Lightweight Spring",
          subTitle: "Explore Now",
          alt: "sports & entertainment",
          href: "/sports-entertainment"
        },
        
      ],
  },
  {
    id: 8,
    name: "All Categories",
    icon: React.createElement(CategoryIcon),
    features: [], // Added required property
    subItems: [
        { name: "Furniture New Arrivals", href: "/deals/deal-of-the-day" },
        { name: "Women's New Arrivals", href: "/deals/limited-time" },
        { name: "Kid's New Arrivals", href: "/deals/black-friday" },
        { name: "Men's New Arrivals", href: "/deals/member-offers" },
        { name: "Beauty New Arrivals", href: "/deals/outlet" },
        { name: "Home New Arrivals", href: "/deals/top-deals" },
        { name: "Health & Wellness", href: "/deals/final-sale" },
        { name: "Black History Month", href: "/deals/clearance" },
      ],
      images: [
        {
          src: "/home/home-Indoor.jpg",
          title: "Power Couple",
          subTitle: "Explore Now",
          alt: "home",
          href: "/home-garden"
        },
        {
          src: "/home/cats-electronics.jpg",
          title: "Sleep Better",
          subTitle: "Explore Now",
          alt: "electronics",
          href: "/electronics"
        },
        {
          src: "/home/cats-fashion.jpg",
          title: "Summer Beauty",
          subTitle: "Explore Now",
          alt: "fashion",
          href: "/fashion"
        },
        {
          src: "/home/cats-sport.jpg",
          title: "Lightweight Spring",
          subTitle: "Explore Now",
          alt: "sports & entertainment",
          href: "/sports-entertainment"
        },
        
      ],
  }
];

// lib/fetchCategories.ts
export async function fetchCategories() {
  const res = await fetch("/api/auth/categories", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await res.json();
  return data.categories; // Assuming the response includes a `categories` array
}