"use client";

import React from "react";

// Named export for HeaderIcon
export interface MyIconProps extends React.SVGProps<SVGSVGElement> {}

export const HeaderIcon: React.FC<MyIconProps> = (props) => {
  return (
    <svg
      width="24"
      height="24"
      aria-hidden="true"
      role="img"
      focusable="false"
      viewBox="0 0 32 32"
      {...props} // allows you to pass additional props like className, style, etc.
    >
      <path d="M8.8 6.4c1.328 0 2.4 1.072 2.4 2.4s-1.072 2.4-2.4 2.4-2.4-1.072-2.4-2.4 1.072-2.4 2.4-2.4zM8.8 3.2c-3.088 0-5.6 2.512-5.6 5.6s2.512 5.6 5.6 5.6 5.6-2.512 5.6-5.6-2.512-5.6-5.6-5.6v0z" />
      <path d="M23.2 6.4c1.328 0 2.4 1.072 2.4 2.4s-1.072 2.4-2.4 2.4-2.4-1.072-2.4-2.4 1.072-2.4 2.4-2.4zM23.2 3.2c-3.088 0-5.6 2.512-5.6 5.6s2.512 5.6 5.6 5.6 5.6-2.512 5.6-5.6-2.512-5.6-5.6-5.6v0z" />
      <path d="M8.8 20.8c1.328 0 2.4 1.072 2.4 2.4s-1.072 2.4-2.4 2.4-2.4-1.072-2.4-2.4 1.072-2.4 2.4-2.4zM8.8 17.6c-3.088 0-5.6 2.512-5.6 5.6s2.512 5.6 5.6 5.6 5.6-2.512 5.6-5.6-2.512-5.6-5.6-5.6v0z" />
      <path d="M23.2 20.8c1.328 0 2.4 1.072 2.4 2.4s-1.072 2.4-2.4 2.4-2.4-1.072-2.4-2.4 1.072-2.4 2.4-2.4zM23.2 17.6c-3.088 0-5.6 2.512-5.6 5.6s2.512 5.6 5.6 5.6 5.6-2.512 5.6-5.6-2.512-5.6-5.6-5.6v0z" />
    </svg>
  );
};

// Named export for DealIcon
export const DealIcon: React.FC<MyIconProps> = (props) => {
  return (
    <span
      className="inline-flex items-center justify-center w-8 h-8 menu-item-icon menu-icon-item--svg menu-icon-item--has-background"
      style={{ backgroundColor: "#ff276f", color: "#ffffff" }}
    >
      <svg viewBox="0 0 32 32" fill="currentColor" className="w-full h-full">
        <path 
          fill="currentColor"
          d="M8.8 6.4c1.328 0 2.4 1.072 2.4 2.4s-1.072 2.4-2.4 2.4-2.4-1.072-2.4-2.4 1.072-2.4 2.4-2.4zM8.8 3.2c-3.088 0-5.6 2.512-5.6 5.6s2.512 5.6 5.6 5.6 5.6-2.512 5.6-5.6-2.512-5.6-5.6-5.6v0z"
        />
        <path 
          fill="currentColor"
          d="M23.2 20.8c1.328 0 2.4 1.072 2.4 2.4s-1.072 2.4-2.4 2.4-2.4-1.072-2.4-2.4 1.072-2.4 2.4-2.4zM23.2 17.6c-3.088 0-5.6 2.512-5.6 5.6s2.512 5.6 5.6 5.6 5.6-2.512 5.6-5.6-2.512-5.6-5.6-5.6v0z"
        />
        <path 
          fill="currentColor"
          d="M3.668 26.069l22.401-22.401 2.263 2.263-22.401 22.401-2.263-2.263z"
        />
      </svg>
    </span>
  );
};


export const NewIcon: React.FC<MyIconProps> = (props) => {
  return (
    <span
      className="inline-flex items-center justify-center w-8 h-8 menu-item-icon menu-icon-item--svg menu-icon-item--has-background"
      style={{ backgroundColor: "#ffba14", color: "#ffffff" }}
    >
      <svg viewBox="0 0 32 32" fill="currentColor" className="w-full h-full">
        <path
          fill="currentColor"
          d="M23.424 28.912c-0.24 0-0.48-0.064-0.704-0.176l-6.72-3.52-6.72 3.536c-0.496 0.272-1.12 0.224-1.584-0.112s-0.688-0.912-0.592-1.472l1.28-7.488-5.44-5.296c-0.4-0.4-0.544-0.992-0.368-1.536s0.64-0.944 1.216-1.024l7.504-1.088 3.36-6.8c0.256-0.528 0.768-0.848 1.344-0.848v0c0.576 0 1.088 0.32 1.344 0.832l3.36 6.8 7.504 1.088c0.56 0.08 1.04 0.48 1.216 1.024s0.032 1.136-0.384 1.536l-5.44 5.296 1.28 7.488c0.096 0.56-0.128 1.136-0.592 1.472-0.256 0.192-0.56 0.288-0.864 0.288zM16 22.016c0.24 0 0.48 0.064 0.704 0.176l4.72 2.48-0.896-5.264c-0.08-0.48 0.08-0.976 0.432-1.328l3.824-3.728-5.28-0.768c-0.496-0.064-0.912-0.384-1.136-0.816l-2.368-4.784-2.368 4.784c-0.224 0.448-0.64 0.752-1.136 0.816l-5.28 0.768 3.824 3.728c0.352 0.336 0.512 0.848 0.432 1.328l-0.896 5.264 4.72-2.48c0.224-0.128 0.464-0.176 0.704-0.176z"
        ></path>
      </svg>
    </span>
  );
};




export const CategoryIcon: React.FC<MyIconProps> = (props) => {
  return (
    <span
      className="inline-flex items-center justify-center w-8 h-8 menu-item-icon menu-icon-item--svg menu-icon-item--has-background"
      style={{ backgroundColor: "#1d2128", color: "#ffffff" }}
    >
      <svg viewBox="0 0 32 32" fill="currentColor" className="w-full h-full">
        <path
          fill="currentColor"
          d="M8.8 6.4c1.328 0 2.4 1.072 2.4 2.4s-1.072 2.4-2.4 2.4-2.4-1.072-2.4-2.4 1.072-2.4 2.4-2.4zM8.8 3.2c-3.088 0-5.6 2.512-5.6 5.6s2.512 5.6 5.6 5.6 5.6-2.512 5.6-5.6-2.512-5.6-5.6-5.6v0z"
        />
        <path
          fill="currentColor"
          d="M23.2 6.4c1.328 0 2.4 1.072 2.4 2.4s-1.072 2.4-2.4 2.4-2.4-1.072-2.4-2.4 1.072-2.4 2.4-2.4zM23.2 3.2c-3.088 0-5.6 2.512-5.6 5.6s2.512 5.6 5.6 5.6 5.6-2.512 5.6-5.6-2.512-5.6-5.6-5.6v0z"
        />
        <path
          fill="currentColor"
          d="M8.8 20.8c1.328 0 2.4 1.072 2.4 2.4s-1.072 2.4-2.4 2.4-2.4-1.072-2.4-2.4 1.072-2.4 2.4-2.4zM8.8 17.6c-3.088 0-5.6 2.512-5.6 5.6s2.512 5.6 5.6 5.6 5.6-2.512 5.6-5.6-2.512-5.6-5.6-5.6v0z"
        />
        <path
          fill="currentColor"
          d="M23.2 20.8c1.328 0 2.4 1.072 2.4 2.4s-1.072 2.4-2.4 2.4-2.4-1.072-2.4-2.4 1.072-2.4 2.4-2.4zM23.2 17.6c-3.088 0-5.6 2.512-5.6 5.6s2.512 5.6 5.6 5.6 5.6-2.512 5.6-5.6-2.512-5.6-5.6-5.6v0z"
        />
      </svg>
    </span>
  );
};

export const Filter: React.FC<MyIconProps> = (props) => {
  return (
    <span
      className="flex items-center justify-center w-6 h-6 text-gray-600 rounded"
    >
      <svg
        width="24"
        height="24"
        aria-hidden="true"
        role="img"
        focusable="false"
        viewBox="0 0 32 32"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path fill="currentColor" d="M8 14.4h3.2v-9.6h-3.2v3.2h-4.8v3.2h4.8z"></path>
        <path fill="currentColor" d="M24 17.6h-3.2v9.6h3.2v-3.2h4.8v-3.2h-4.8z"></path>
        <path fill="currentColor" d="M14.4 8h14.4v3.2h-14.4v-3.2z"></path>
        <path fill="currentColor" d="M3.2 20.8h14.4v3.2h-14.4v-3.2z"></path>
      </svg>
    </span>
  );
};

