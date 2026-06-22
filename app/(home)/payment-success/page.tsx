'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Suspense } from 'react';
import { removeFromCart } from '@/utils/cartUtils';
import AccountLoadingBlock from '@/components/ui/account-loading-block';

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
  const source = searchParams.get('source');

  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!paymentIntentId) return;

      try {
        console.log('[payment-success] fetching receipt details', {
          apiUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/retrieve-intent/${paymentIntentId}`,
          paymentIntentId,
          redirectStatus,
          source,
        });

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/retrieve-intent/${paymentIntentId}`,
          { credentials: 'include' }
        );
        const data = await res.json();

        console.log('[payment-success] retrieve-intent response', {
          status: res.status,
          ok: res.ok,
          data,
        });

        setPaymentData(data.paymentIntent);
        setOrders(data.orders || []);
      } catch (err) {
        console.error('[payment-success] failed to fetch payment details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [paymentIntentId]);

  useEffect(() => {
    console.log('[payment-success] page params', {
      paymentIntentId,
      redirectStatus,
      source,
    });

    const clearPurchasedCartItems = async () => {
      if (!paymentIntentId || redirectStatus !== 'succeeded' || source !== 'cart') {
        return;
      }

      const processedKey = `cart_checkout_cleared_${paymentIntentId}`;
      if (sessionStorage.getItem(processedKey) === 'true') {
        return;
      }

      const raw = sessionStorage.getItem('pending_cart_checkout_items');
      if (!raw) {
        sessionStorage.setItem(processedKey, 'true');
        return;
      }

      try {
        const items = JSON.parse(raw) as Array<{
          productId?: string;
          variantId?: string;
          size?: string;
        }>;

        const validItems = items.filter(
          (item) => item.productId && item.variantId && item.size
        );

        await Promise.allSettled(
          validItems.map((item) =>
            removeFromCart(
              String(item.productId),
              String(item.variantId),
              String(item.size)
            )
          )
        );
      } catch (error) {
        console.error('Failed to clear purchased cart items', error);
      } finally {
        sessionStorage.setItem(processedKey, 'true');
        sessionStorage.removeItem('pending_cart_checkout_items');
      }
    };

    clearPurchasedCartItems();
  }, [paymentIntentId, redirectStatus, source]);

  if (!paymentIntentId || redirectStatus !== 'succeeded') {
    return (
      <div className="commerce-shell market-content-safe-bottom py-12">
        <div className="commerce-panel mx-auto max-w-lg p-8 text-center">
          <h1 className="font-poppins text-xl font-semibold text-red-700">Payment not completed</h1>
          <p className="commerce-text-body mt-3">
            Your payment was cancelled or could not be confirmed. No charge was finalized.
          </p>
          <a
            href="/cart"
            className="mt-6 inline-block rounded-lg bg-brand-navy-light px-6 py-2 text-sm font-semibold text-white hover:bg-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            Return to cart
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="commerce-shell py-12">
        <AccountLoadingBlock label="Confirming your payment…" minHeight="min-h-[40vh]" />
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="commerce-shell market-content-safe-bottom py-12">
        <div className="commerce-panel mx-auto max-w-lg p-8 text-center">
          <h1 className="font-poppins text-xl font-semibold text-red-700">Unable to load receipt</h1>
          <p className="commerce-text-body mt-3">
            Payment may have succeeded but receipt details are unavailable. Check your email or order history.
          </p>
          <a
            href="/customer/order"
            className="mt-6 inline-block rounded-lg bg-brand-navy-light px-6 py-2 text-sm font-semibold text-white hover:bg-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            View my orders
          </a>
        </div>
      </div>
    );
  }

  const formattedAmount = (paymentData.amount / 100).toFixed(2);
  const date = new Date(paymentData.created * 1000).toLocaleString();

  return (
    <div className="commerce-shell market-content-safe-bottom py-8">
      <div className="commerce-panel mx-auto mt-4 max-w-4xl p-6 sm:p-8 print:mt-0 print:text-sm">
        <h1 className="font-poppins text-2xl font-semibold text-brand-navy sm:text-3xl">Payment confirmed</h1>
        <p className="commerce-trust-note mt-2">
          Your payment was received. Vendors will confirm fulfillment separately — this receipt does not mean your
          order has shipped yet.
        </p>

        <div className="mt-6 space-y-1 text-brand-navy">
          <p className="commerce-text-body">
            <strong className="text-brand-navy">Date:</strong> {date}
          </p>
          <p className="commerce-text-body">
            <strong className="text-brand-navy">Amount paid:</strong> ${formattedAmount}{' '}
            {paymentData.currency.toUpperCase()}
          </p>
          {paymentData.receipt_email ? (
            <p className="commerce-text-body">
              <strong className="text-brand-navy">Receipt email:</strong> {paymentData.receipt_email}
            </p>
          ) : null}
        </div>

        <hr className="my-6 border-dashboard-border-light" />

        {orders.map((order) => (
          <div key={order._id} className="mb-10">
            <div className="commerce-panel-muted divide-y overflow-hidden rounded-md">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-start justify-between gap-4 px-4 py-4 sm:flex-row sm:items-center"
                >
                  <div className="flex w-full items-center gap-4 sm:w-2/3">
                    {item.productId?.coverImage ? (
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded border border-dashboard-input-border bg-surface-panel">
                        <Image
                          src={item.productId.coverImage}
                          alt={item.productId.title}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : null}
                    <div>
                      <p className="font-semibold text-brand-navy">{item.productId.title}</p>
                      <p className="commerce-text-meta">
                        Size: {item.size}
                        {item.color ? ` · Color: ${item.color}` : ''}
                      </p>
                      <p className="commerce-text-meta">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="w-full text-right font-semibold text-brand-navy sm:w-1/3">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end font-semibold text-brand-navy">
              <span>Order total: ${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        ))}

        <div className="mt-6 flex flex-col items-center gap-3 print:hidden sm:flex-row sm:justify-center">
          <a
            href="/customer/order"
            className="inline-block rounded-lg bg-brand-navy-light px-6 py-2 text-sm font-semibold text-white hover:bg-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            View my orders
          </a>
          <a
            href="/"
            className="inline-block rounded-lg border border-dashboard-input-border px-6 py-2 text-sm font-semibold text-brand-navy hover:border-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}



export default function Page() {
  return (
    <Suspense fallback={<AccountLoadingBlock label="Loading confirmation…" minHeight="min-h-[40vh]" />}>
      <PaymentSuccessPage />
    </Suspense>
  );
}
