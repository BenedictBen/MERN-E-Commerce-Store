"use client"

import { Table } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface OrderItem {
  name: string
  qty: number
  price: number
  // Add other properties if needed
}

interface Order {
  _id: string
  createdAt: string
  totalPrice: number
  paymentMethod: string
  shippingPrice: number
  orderItems: OrderItem[]
  // Add other properties from your order object if needed
}

const CheckOutSuccess = () => {
  const [order, setOrder] = useState<Order | null>(null)
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/payments/orders/${orderId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch order')
        }
        const data: Order = await response.json()
        setOrder(data)
      } catch (error) {
        console.error('Error fetching order:', error)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center w-full px-4 lg:px-12">
        <h2 className="font-bold text-4xl mt-4">Checkout</h2>
        <div>Loading order details...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center w-full px-4 lg:px-12">
        <h2 className="font-bold text-4xl mt-4">Checkout</h2>
        <div>
          <h4 className="text-center my-4">
            Thank you. Your order has been received.
          </h4>
          <div>
            <Table.Root size="sm">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Order number:</Table.ColumnHeader>
                  <Table.ColumnHeader>Date:</Table.ColumnHeader>
                  <Table.ColumnHeader>Total:</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end">Payment method:</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>{order._id.slice(-8)}</Table.Cell>
                  <Table.Cell>{formatDate(order.createdAt)}</Table.Cell>
                  <Table.Cell>${order.totalPrice.toFixed(2)}</Table.Cell>
                  <Table.Cell textAlign="end">{order.paymentMethod}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </div>
        </div>
        <div className="w-full mt-6">
          <h3 className="text-left text-xl font-semibold">Order details</h3>
          <div className="mt-4 space-y-4">
            {order.orderItems.map((item: OrderItem, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <h4>{item.name} ×{item.qty}</h4>
                  <span className="flex gap-1 text-sm">
                    <p>Vendor:</p>
                    <p>Zone Shop</p>
                  </span>
                </div>
                <h4>${item.price.toFixed(2)}</h4>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2">
            <div className="flex justify-between">
              <h3>Shipping</h3>
              <span className="text-right">
                <p>${order.shippingPrice.toFixed(2)}</p>
                <p className="text-sm">via Flat rate</p>
              </span>
            </div>
            <div className="flex justify-between">
              <h3>Payment method</h3>
              <p>{order.paymentMethod}</p>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <h3>Total:</h3>
              <p>${order.totalPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckOutSuccess