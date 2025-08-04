'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Suspense } from 'react';

interface PaymentData {
  amount: number;
  currency: string;
  status: string;
  created: number;
  receipt_email?: string;
  id: string;
}

interface OrderItem {
  productId: {
    title: string;
    coverImage?: string;
  };
  variantId: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  vendorId: string;
}

function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent');
  const redirectStatus = searchParams.get('redirect_status');

  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!paymentIntentId) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/retrieve-intent/${paymentIntentId}`,
          { credentials: 'include' }
        );
        const data = await res.json();

        setPaymentData(data.paymentIntent);
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Failed to fetch payment details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [paymentIntentId]);

  if (!paymentIntentId || redirectStatus !== 'succeeded') {
    return <div className="p-8 text-center text-red-600">Payment failed or invalid session</div>;
  }

  if (loading) {
    return <div className="p-8 text-center">Fetching payment details...</div>;
  }

  if (!paymentData) {
    return <div className="p-8 text-center text-red-600">Unable to load payment information</div>;
  }

  const formattedAmount = (paymentData.amount / 100).toFixed(2);
  const date = new Date(paymentData.created * 1000).toLocaleString();

  return (
    <div className="max-w-4xl p-8 mx-auto mt-10 bg-white border rounded shadow-md print:text-sm print:mt-0">
      <h1 className="mb-6 text-3xl font-bold text-green-700">🧾 Payment Receipt</h1>

      <div className="mb-6 space-y-1 text-gray-800">
        <p><strong>Payment ID:</strong> {paymentData.id}</p>
        <p><strong>Status:</strong> {paymentData.status}</p>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Amount Paid:</strong> ₹{formattedAmount} {paymentData.currency.toUpperCase()}</p>
        {paymentData.receipt_email && <p><strong>Receipt Email:</strong> {paymentData.receipt_email}</p>}
      </div>

      <hr className="my-6" />

      {orders.map((order, orderIndex) => (
        <div key={order._id} className="mb-10">
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            🧺 Order #{orderIndex + 1} <span className="ml-4 text-sm font-normal text-blue-600">Status: {order.status}</span>
          </h2>

          <div className="border divide-y rounded-md bg-gray-50">
            {order.items.map((item, i) => (
              <div key={i} className="flex flex-col items-start justify-between gap-4 px-4 py-4 sm:flex-row sm:items-center">
                <div className="flex items-center w-full gap-4 sm:w-2/3">
                  {item.productId?.coverImage && (
                    <div className="w-20 h-20 overflow-hidden border rounded">
                      <Image
                        src={item.productId.coverImage}
                        alt={item.productId.title}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{item.productId.title}</p>
                    <p className="text-sm text-gray-600">
                      Variant ID: {item.variantId}
                    </p>
                    <p className="text-sm text-gray-600">
                      Size: {item.size}, Color: {item.color}
                    </p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="w-full font-semibold text-right text-gray-700 sm:w-1/3">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-4 font-semibold text-gray-900">
            <span>Total: ₹{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      ))}

      <div className="mt-6 text-center print:hidden">
        <a href="/" className="inline-block px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
          Back to Home
        </a>
      </div>
    </div>
  );
}





export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <PaymentSuccessPage />
    </Suspense>
  );
}