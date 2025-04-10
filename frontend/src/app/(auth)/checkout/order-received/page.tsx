"use client"
import { Table } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Spinner } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux/store'
import Image from 'next/image'
import { getProductImageUrl } from '@/lib/imageUtils'

interface OrderItem {
  name: string
  qty: number
  price: number
  image?: string
  product?: string
  _id?: string
}

interface Order {
  _id: string
  createdAt: string
  totalPrice: number
  paymentMethod: string
  shippingPrice: number
  taxPrice: number
  orderItems: OrderItem[]
  shippingAddress: {
    address: string
    city: string
    postalCode: string
    country: string
  }
  isPaid: boolean
  isDelivered: boolean
  paidAt?: string
  paymentResult?: {
    email_address?: string
    status?: string
  }
}

const CheckOutSuccess = () => {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

    // Get payment info from Redux (now persisted)
  const paymentInfo = useSelector((state: RootState) => state.payment)

  const reference = searchParams.get('reference') || searchParams.get('trxref')
  const urlOrderId = searchParams.get('orderId')

 // Priority: URL orderId > persisted orderId > metadata order_id
 const orderId = urlOrderId || 
 paymentInfo.orderId || 
 paymentInfo.metadata?.order_id

useEffect(() => {
  const fetchOrderData = async () => {
    try {
      setLoading(true);
      
      if (!reference && !orderId) {
        throw new Error('No payment reference or order ID found');
      }

      // Debugging: Log what we're sending
      console.log('Verifying payment with:', {
        reference,
        orderId
      });

      if (reference) {
        if (!orderId) {
          throw new Error('Order ID is required for payment verification');
        }
        
        const verifyResponse = await fetch(
          `/api/auth/payments/verify?reference=${reference}&order_id=${orderId}`
        );
        
        // Debugging: Log raw response
        console.log('Verification response status:', verifyResponse.status);
        const responseText = await verifyResponse.text();
        console.log('Raw verification response:', responseText);

        let verificationData;
        try {
          verificationData = JSON.parse(responseText);
        } catch (error) {
          throw new Error('Invalid JSON response from server');
        }

        if (!verifyResponse.ok) {
          throw new Error(
            verificationData.error || 
            verificationData.message || 
            `Payment verification failed with status ${verifyResponse.status}`
          );
        }

        if (!verificationData.order) {
          throw new Error('Order data missing in verification response');
        }

        setOrder(verificationData.order);
      } 
      else if (orderId) {
        const orderResponse = await fetch(`/api/orders/${orderId}`);
        
        if (!orderResponse.ok) {
          throw new Error('Failed to fetch order details');
        }

        const orderData = await orderResponse.json();
        setOrder(orderData);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error in payment verification:', err);
      setError(err instanceof Error ? err.message : 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  fetchOrderData();
}, [reference, orderId, router]);

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12">
        <div className="text-center">
          <Spinner size="xl" color="#6e2eff"/>
          <p className="mt-4 text-lg font-medium">Processing your order...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-2">Payment Verification Failed</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="text-left bg-red-100 p-3 rounded mb-4">
            <p className="text-sm font-mono break-all">
              Reference: {reference || 'Not available'}
            </p>
            <p className="text-sm font-mono break-all">
              Order ID: {orderId || 'Not available'}
            </p>
          </div>
          <button
            onClick={() => router.push('/orders')}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded mr-2"
          >
            View Orders
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-2xl font-bold text-yellow-700 mb-2">Order Not Found</h2>
          <p className="text-yellow-600 mb-4">We couldn't locate your order details.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen !py-12">
      <div className="!max-w-4xl !mx-auto !px-4 sm:!px-6 lg:!px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Order Header */}
          <div className="bg-indigo-700 !px-6 !py-8 text-center">
            <h1 className="!text-3xl font-bold !text-white">
              Order Confirmation
            </h1>
            <p className="!mt-2 text-indigo-100">
              Thank you for your purchase! Your order has been received and is
              being processed.
            </p>
            {order.isPaid && order.paidAt && (
              <p className="mt-2 text-indigo-100">
                Payment confirmed on {formatDate(order.paidAt)}
              </p>
            )}
          </div>

          {/* Order Summary */}
          <div className="!px-6 !py-8 !border-b border-gray-200">
            <h2 className="!text-xl !font-semibold !my-6">Order Summary</h2>

            <Table.Root size="sm" className="w-full">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Order #</Table.ColumnHeader>
                  <Table.ColumnHeader>Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Total</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end">
                    Status
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <span className="!font-mono">{order._id}</span>
                  </Table.Cell>
                  <Table.Cell>{formatDate(order.createdAt)}</Table.Cell>
                  <Table.Cell>{formatCurrency(order.totalPrice)}</Table.Cell>
                  <Table.Cell textAlign="end">
                    <span
                      className={`!px-2 !py-1 rounded-full !text-xs !font-medium ${
                        order.isPaid
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </div>

          {/* Order Details */}
          <div className="!px-6 !py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Order Items */}
              <div>
                <h3 className="!text-lg !font-medium !my-4">Order Items</h3>
                <div className="!space-y-4">
                  {order.orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start border-b border-gray-100 !pb-4"
                    >
                      {item.image && (
                        <Image
                          src={getProductImageUrl(item.image)}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded !mr-4"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                      </div>
                      <div className="font-medium">
                        {formatCurrency(item.price * item.qty)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Totals */}
              <div>
                <h3 className="!text-lg !font-medium !my-4">Order Totals</h3>
                <div className="!space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>
                      {formatCurrency(
                        order.orderItems.reduce(
                          (sum, item) => sum + item.price * item.qty,
                          0
                        )
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span>{formatCurrency(order.shippingPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span>{formatCurrency(order.taxPrice)}</span>
                  </div>
                  <div className="flex justify-between !border-t border-gray-200 !pt-3 !font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(order.totalPrice)}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="!mt-6">
                  <h4 className="!font-medium !mb-2">Payment Method</h4>
                  <p>{order.paymentMethod}</p>
                  {order.isPaid && (
                    <p className="!text-sm text-green-600 !mt-1">
                      Payment completed successfully
                    </p>
                  )}
                </div>

                {/* Shipping Address */}
                <div className="!mt-6">
                  <h4 className="!font-medium !mb-2">Shipping Address</h4>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Actions */}
          <div className="bg-gray-50 !px-6 !py-4 flex justify-end">
            <button
              onClick={() => router.push("/shop")}
              className="!bg-indigo-600 !hover:bg-indigo-700 !text-white !font-medium !py-2 !px-6 rounded cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckOutSuccess