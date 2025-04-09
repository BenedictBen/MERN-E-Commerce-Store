'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';


export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  

  const reference = searchParams.get('reference');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (!reference || !orderId) {
      router.push('/');
      return;
    }

    const verifyPayment = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(
          `/api/auth/payments/verify?reference=${reference}&order_id=${orderId}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Payment verification failed');
        }

        if (data.success) {
          setPaymentStatus('success');
          toast.success('Payment successful!');
        } else {
          setPaymentStatus('failed');
          toast.error('Payment verification failed');
        }
      } catch (error: any) {
        setPaymentStatus('failed');
        toast.error(error.message || 'Error verifying payment');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [reference, orderId, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Payment Status</h1>
      
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          {paymentStatus === 'success' && (
            <div className="text-green-600">
              <h2 className="text-xl font-semibold mb-4">Payment Successful!</h2>
              <p>Your order #{orderId} has been paid successfully.</p>
              <button 
                onClick={() => router.push(`/orders/${orderId}`)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Order
              </button>
            </div>
          )}
          
          {paymentStatus === 'failed' && (
            <div className="text-red-600">
              <h2 className="text-xl font-semibold mb-4">Payment Failed</h2>
              <p>There was an issue processing your payment for order #{orderId}.</p>
              <button 
                onClick={() => router.push(`/checkout?order_id=${orderId}`)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          )}
          
          {paymentStatus === 'pending' && !loading && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Processing Payment...</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
}