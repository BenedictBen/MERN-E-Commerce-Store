"use client";
import React, { useEffect } from "react";
import { Accordion, Stack, Span, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";


interface FilterShopProps {
  categories: { _id: string; main: string }[];
  brands: string[];
  colors: string[];
  storageCapacities: string[];
  processorTypes: string[];
  sizes: string[];
  priceRanges: string[];
  customerRatings: string[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (filters: Record<string, string[]>) => void;
  onClearFilters: () => void;
  onCategorySelect: (categoryId: string) => void;
}

const FilterShop: React.FC<FilterShopProps> = ({
  categories,
  brands,
  colors,
  storageCapacities,
  processorTypes,
  sizes,
  priceRanges,
  customerRatings,
  onFilterChange,
  onCategorySelect,
  selectedFilters,
  onClearFilters
}) => {
  const router = useRouter();

  const handleCategorySelection = (categoryId: string) => {
    const newFilters = {
      ...selectedFilters,
      category: categoryId ? [categoryId] : []
    };

    // Update filters immediately
    onFilterChange(newFilters);

    // Update URL without reload
    if (categoryId) {
      router.push(`/shop/${encodeURIComponent(categoryId)}`, { scroll: false });
    } else {
      router.push('/shop', { scroll: false });
    }

    // Notify parent component
    if (categoryId) {
      onCategorySelect(categoryId);
    } else {
      // Clear other filters when selecting "All Categories"
      onFilterChange({
        ...newFilters,
        brand: [],
        color: [],
        storageCapacity: [],
        processorType: [],
        size: [],
        priceRange: [],
        customerRating: [],
      });
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === "category") {
      // Toggle category selection
      const newCategoryId = selectedFilters.category?.includes(value) ? '' : value;
      handleCategorySelection(newCategoryId);
      return;
    }

    // For other filters, maintain checkbox behavior
    const currentFilters = selectedFilters[filterType] || [];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(item => item !== value)
      : [...currentFilters, value];
    
    onFilterChange({
      ...selectedFilters,
      [filterType]: newFilters
    });
  };

    useEffect(() => {
    onFilterChange(selectedFilters);
  }, [selectedFilters, onFilterChange]);

  const handleClearFilters = () => {
    const resetFilters = {
      category: [],
      brand: [],
      color: [],
      storageCapacity: [],
      processorType: [],
      size: [],
      priceRange: [],
      customerRating: [],
    };
    onFilterChange(resetFilters);
    router.push('/shop', { scroll: false });
  };

  return (
    <>
      <Button onClick={handleClearFilters} colorScheme="blue" my={4}>
        Clear Filter
      </Button>

      <Accordion.Root multiple cursor="pointer">
        {/* Category Filter */}
        <Accordion.Item value="category" p={4}>
          <Accordion.ItemTrigger>
            <Span flex="1" fontWeight="bold">
              Category
            </Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <Stack align="flex-start" flex="1" gap="4">
                {categories.length === 0 ? (
                  <p className="text-sm text-gray-500">No categories available</p>
                ) : (
                  <>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="radio"
                        name="category"
                        checked={selectedFilters.category?.length === 0}
                        onChange={() => handleCategorySelection('')}
                      />
                      All Categories
                    </label>
                    {categories.map((category) => (
                      <label key={category._id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input
                          type="radio"
                          name="category"
                          checked={selectedFilters.category?.includes(category._id)}
                          onChange={() => handleCategorySelection(category._id)}
                        />
                        {category.main || 'Uncategorized'}
                      </label>
                    ))}
                  </>
                )}
              </Stack>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>

        {/* Brand Filter */}
        <Accordion.Item value="brand" p={4}>
          <Accordion.ItemTrigger>
            <Span flex="1" fontWeight="bold">
              Brand
            </Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <Stack align="flex-start" flex="1" gap="4">
                {brands.map((brand) => (
                  <label key={brand} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="checkbox"
                      value={brand}
                      checked={selectedFilters.brand.includes(brand)}
                      onChange={(e) => handleFilterChange("brand", e.target.value)}
                    />
                    {brand}
                  </label>
                ))}
              </Stack>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>

        {/* Color Filter */}
        <Accordion.Item value="color" p={4}>
          <Accordion.ItemTrigger>
            <Span flex="1" fontWeight="bold">
              Color
            </Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <Stack align="flex-start" flex="1" gap="4">
                {colors.map((color) => (
                  <label key={color} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="checkbox"
                      value={color}
                      checked={selectedFilters.color.includes(color)}
                      onChange={(e) => handleFilterChange("color", e.target.value)}
                    />
                    {color}
                  </label>
                ))}
              </Stack>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>

        {/* Storage Capacity Filter */}
        <Accordion.Item value="storageCapacity" p={4}>
          <Accordion.ItemTrigger>
            <Span flex="1" fontWeight="bold">
              Storage Capacity
            </Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <Stack align="flex-start" flex="1" gap="4">
                {storageCapacities.map((storage) => (
                  <label key={storage} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="checkbox"
                      value={storage}
                      checked={selectedFilters.storageCapacity.includes(storage)}
                      onChange={(e) => handleFilterChange("storageCapacity", e.target.value)}
                    />
                    {storage}
                  </label>
                ))}
              </Stack>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>

        {/* Processor Type Filter */}
        <Accordion.Item value="processorType" p={4}>
          <Accordion.ItemTrigger>
            <Span flex="1" fontWeight="bold">
              Processor Type
            </Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <Stack align="flex-start" flex="1" gap="4">
                {processorTypes.map((processor) => (
                  <label key={processor} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="checkbox"
                      value={processor}
                      checked={selectedFilters.processorType.includes(processor)}
                      onChange={(e) => handleFilterChange("processorType", e.target.value)}
                    />
                    {processor}
                  </label>
                ))}
              </Stack>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>

        {/* Size Filter */}
        <Accordion.Item value="size" p={4}>
          <Accordion.ItemTrigger>
            <Span flex="1" fontWeight="bold">
              Size
            </Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <Stack align="flex-start" flex="1" gap="4">
                {sizes.map((size) => (
                  <label key={size} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="checkbox"
                      value={size}
                      checked={selectedFilters.size.includes(size)}
                      onChange={(e) => handleFilterChange("size", e.target.value)}
                    />
                    {size}
                  </label>
                ))}
              </Stack>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>

        {/* Price Range Filter */}
        <Accordion.Item value="priceRange" p={4}>
          <Accordion.ItemTrigger>
            <Span flex="1" fontWeight="bold">
              Price Range
            </Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <Stack align="flex-start" flex="1" gap="4">
                {priceRanges.map((range) => (
                  <label key={range} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="checkbox"
                      value={range}
                      checked={selectedFilters.priceRange.includes(range)}
                      onChange={(e) => handleFilterChange("priceRange", e.target.value)}
                    />
                    {range}
                  </label>
                ))}
              </Stack>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>

        {/* Customer Rating Filter */}
        <Accordion.Item value="customerRating" p={4}>
          <Accordion.ItemTrigger>
            <Span flex="1" fontWeight="bold">
              Customer Rating
            </Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <Stack align="flex-start" flex="1" gap="4">
                {customerRatings.map((rating) => (
                  <label key={rating} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="checkbox"
                      value={rating}
                      checked={selectedFilters.customerRating.includes(rating)}
                      onChange={(e) => handleFilterChange("customerRating", e.target.value)}
                    />
                    {rating} Stars
                  </label>
                ))}
              </Stack>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    </>
  );
};

export default FilterShop;