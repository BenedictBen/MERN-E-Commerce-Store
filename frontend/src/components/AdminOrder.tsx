"use client";

import React, { useState, useEffect } from "react";
import { Box, IconButton,Spinner,Table } from "@chakra-ui/react";
import { FaEye } from "react-icons/fa";
import Image from "next/image";
import { Order } from "@/lib/types";
import { OrderDetailsDrawer } from "./OrderDetailsDrawer";


const AdminOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);


  const markOrderAsDelivered = async (orderId: string) => {
    try {
      const response = await fetch(`/api/auth/orders/${orderId}/deliver`, {
        method: "PUT",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      // Check if response is JSON first
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Server returned: ${text.substring(0, 100)}`);
      }
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || result.message || "Delivery update failed");
      }
  
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { 
          ...order, 
          isDelivered: true,
          deliveredAt: result.deliveredAt
        } : order
      ));
  
    } catch (error) {
      console.error("Delivery error:", error);
      throw error;
    }
  };
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/auth/orders`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const result = await response.json();
        console.log(result);
        setOrders(result.data); 
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching orders:", error.message);
        } else {
          console.error("Unexpected error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Box p={6}>
      {loading ? (
        <Spinner size="lg" color="#6e2eff"/>
      ): (
      <Table.Root size="lg">
        <Table.Header>
          <Table.Row className="!px-6">
            <Table.ColumnHeader>Image</Table.ColumnHeader>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Date</Table.ColumnHeader>
            <Table.ColumnHeader>Total</Table.ColumnHeader>
            <Table.ColumnHeader>Paid</Table.ColumnHeader>
            <Table.ColumnHeader>Delivered</Table.ColumnHeader>
            <Table.ColumnHeader></Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {orders.map((order) => (
            <Table.Row key={order._id}>
              <Table.Cell>
                <Image  src={order.orderItems[0]?.image} alt="OrderImage" width={40} height={40} />
              </Table.Cell>
              <Table.Cell className="!text-xs lg:!text-lg">{order.user.username}</Table.Cell>
              <Table.Cell className="!text-xs lg:!text-lg">{order._id}</Table.Cell>
              <Table.Cell className="!text-xs lg:!text-lg"> {new Date(order.createdAt).toLocaleDateString()}</Table.Cell>
              <Table.Cell className="!text-xs lg:!text-lg">${order.totalPrice.toFixed(2)}</Table.Cell>
              <Table.Cell>
                {order.isPaid ? (
                  <span className="bg-green-500 !text-white !px-2 !py-1 rounded">Paid</span>
                ) : (
                  <span className="bg-red-500 !text-white !px-2 !py-1 rounded">Not Paid</span>
                )}
              </Table.Cell>
              <Table.Cell>
                {order.isDelivered  ? (
                  <span className="bg-green-500 text-white !px-4 !py-1 rounded">Delivered</span>
                ) : (
                  <span className="bg-gray-400 text-black !px-4 !py-1 rounded">Pending</span>
                )}
              </Table.Cell>
              <Table.Cell>
              <OrderDetailsDrawer 
                  order={order} 
                  onMarkDelivered={markOrderAsDelivered}
                >
                 <IconButton aria-label="View Order">
                  <FaEye />
                </IconButton>
                </OrderDetailsDrawer>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      )}
    </Box>
  );
};

export default AdminOrder;
