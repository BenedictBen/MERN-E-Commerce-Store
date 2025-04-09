"use client";

import {
  Drawer,
  Portal,
  Box,
  VStack,
  Text,
  HStack,
  CloseButton,
  Button,
} from "@chakra-ui/react";
import { Order } from "@/lib/types";
import { useState } from "react";

interface OrderDetailsDrawerProps {
  order: Order;
  children: React.ReactNode;
  onMarkDelivered: (orderId: string) => Promise<void>;
}

export const OrderDetailsDrawer = ({
  order,
  children,
  onMarkDelivered,
}: OrderDetailsDrawerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleMarkDelivered = async () => {
    setIsLoading(true);
    try {
      await onMarkDelivered(order._id);
      setIsOpen(false);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box onClick={() => setIsOpen(true)}>{children}</Box>
      <Drawer.Root open={isOpen} onOpenChange={({ open }) => setIsOpen(open)}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Order #{order._id.substring(0, 8)}</Drawer.Title>
                <Drawer.CloseTrigger
                  asChild
                  position="absolute"
                  right="2"
                  top="2"
                >
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Drawer.Header>
              <Drawer.Body>
                <VStack align="stretch">
                  {/* Shipping Section */}
                  <Box>
                    <Text fontWeight="bold" fontSize="lg" mb={3}>
                      Shipping
                    </Text>
                    <VStack align="stretch">
                      <Box>
                        <Text fontWeight="semibold">Order ID</Text>
                        <Text fontSize="sm" color="gray.600">
                          {order._id}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontWeight="semibold">Customer Name</Text>
                        <Text fontSize="sm">{order.user.username}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="semibold">Shipping Address</Text>
                        <Text fontSize="sm">
                          {order.shippingAddress.address}
                        </Text>
                        <Text fontSize="sm">
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.postalCode}
                        </Text>
                        <Text fontSize="sm">
                          {order.shippingAddress.country}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontWeight="semibold">Payment Method</Text>
                        <Text fontSize="sm">{order.paymentMethod}</Text>
                      </Box>
                    </VStack>
                  </Box>

                  <hr />

                  {/* Order Summary */}
                  <Box>
                    <Text fontWeight="bold" fontSize="lg" mb={3}>
                      Order Summary
                    </Text>
                    <VStack align="stretch">
                      {order.orderItems.map((item) => (
                        <HStack key={item._id} justify="space-between">
                          <HStack>
                            <Box>
                              <Text fontWeight="medium">{item.name}</Text>
                              <Text fontSize="sm" color="gray.600">
                                Qty: {item.qty}
                              </Text>
                            </Box>
                          </HStack>
                          <Text>${(item.qty * item.price).toFixed(2)}</Text>
                        </HStack>
                      ))}

                      <hr />

                      <HStack justify="space-between">
                        <Text>Subtotal</Text>
                        <Text>${order.itemsPrice.toFixed(2)}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>Shipping</Text>
                        <Text>${order.shippingPrice.toFixed(2)}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>Tax</Text>
                        <Text>${order.taxPrice.toFixed(2)}</Text>
                      </HStack>
                      <hr />

                      <HStack justify="space-between" fontWeight="bold">
                        <Text>Total</Text>
                        <Text>${order.totalPrice.toFixed(2)}</Text>
                      </HStack>
                    </VStack>
                  </Box>

                  <hr />

                  {/* Delivery Action */}
                  {!order.isDelivered && (
                    <Button
                      colorScheme="green"
                      onClick={handleMarkDelivered}
                      loadingText="Updating..."
                    >
                      Mark as Delivered
                    </Button>
                  )}
                </VStack>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
};
