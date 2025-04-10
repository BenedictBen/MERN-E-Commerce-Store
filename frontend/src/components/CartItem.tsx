"use client";
import { Flex, Image, Text, Box, Button } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "@/redux/slices/cartSlice";
import type { Product, ProductVariant  } from "@/redux/slices/cartSlice";
import { getProductImageUrl } from "@/lib/imageUtils";

interface CartItemProps {
  item: Product;
}

// Interface for color variant objects
interface ColorVariant {
  name?: string;
  code?: string;
  stock?: number;
}

const CartItem = ({ item }: CartItemProps) => {
  const dispatch = useDispatch();

 // Calculate subtotal from scratch as a fallback
 



  const handleRemove = () => {
    dispatch(removeFromCart({ 
      id: item.id, 
      variants: item.variants 
    }));
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ 
        id: item.id, 
        variants: item.variants, 
        quantity: newQuantity 
      }));
    } else {
      handleRemove();
    }
  };

  // Type-safe variant display formatter
  const renderVariantDisplay = (variants: ProductVariant | undefined) => {
    if (!variants) return null;

    return Object.entries(variants).map(([key, value]) => {
      // Skip if value is empty
      if (!value || (Array.isArray(value) && value.length === 0)) return null;

      // Handle color variants (array of objects)
      if (key === 'color' && Array.isArray(value)) {
        const colorValue = value[0] as ColorVariant;
        const colorName = colorValue?.name || colorValue?.code;
        return colorName ? (
          <Text key={key} fontSize="sm" color="gray.500">
            Color: {colorName}
          </Text>
        ) : null;
      }

      // Handle size variants (array of strings)
      if (key === 'size' && Array.isArray(value)) {
        return value.length > 0 ? (
          <Text key={key} fontSize="sm" color="gray.500">
            Size: {value[0]}
          </Text>
        ) : null;
      }

      // Handle simple string/number values
      if (typeof value === 'string' || typeof value === 'number') {
        return (
          <Text key={key} fontSize="sm" color="gray.500">
            {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
          </Text>
        );
      }

      // Handle object values with type safety
      if (typeof value === 'object' && value !== null) {
        const objectValue = value as Record<string, unknown>;
        const displayValue = objectValue.name || objectValue.code;
        return typeof displayValue === 'string' ? (
          <Text key={key} fontSize="sm" color="gray.500">
            {key.charAt(0).toUpperCase() + key.slice(1)}: {displayValue}
          </Text>
        ) : null;
      }

      return null;
    });
  };

  return (
    <Flex
      justify="space-between"
      align="center"
      p={4}
      borderBottomWidth="1px"
    >
      <Flex gap={4}>
        <Image
          src={getProductImageUrl(item.image)}
          alt={item.name}
          boxSize="80px"
          objectFit="cover"
        />
        <Box>
          <Text fontWeight="bold">{item.name}</Text>
          <Text color="gray.600">${item.price.toFixed(2)}</Text>
          
          {/* Clean variant display */}
          {item.variants && (
            <Box mt={1}>
              {renderVariantDisplay(item.variants)}
            </Box>
          )}

          <Flex align="center" mt={2}>
            <Button
              size="sm"
              onClick={() => handleQuantityChange(item.quantity - 1)}
            >
              -
            </Button>
            <Text mx={2}>{item.quantity}</Text>
            <Button
              size="sm"
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              +
            </Button>
          </Flex>
        </Box>
      </Flex>
      <Button variant="ghost" onClick={handleRemove}>
        Remove
      </Button>
    </Flex>
  );
};

export default CartItem;