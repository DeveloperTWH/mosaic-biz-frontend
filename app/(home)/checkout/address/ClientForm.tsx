'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getLoggedInCustomer } from '@/utils/authUtils';
import { Minus, Plus } from 'lucide-react';

export default function CheckoutAddressPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get('type');

  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  });
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const loggedIn = await getLoggedInCustomer();

      if (!loggedIn) {
        toast.error('You must be logged in as a customer to continue');
        router.replace('/login?type=customer');
        return;
      }

      setAddress((prev) => ({
        ...prev,
        fullName: loggedIn.name || '',
        phone: loggedIn.mobile || '',
      }));
    };

    checkLogin();
  }, [router]);

  useEffect(() => {
    const loadItems = async () => {
      if (!type) {
        toast.error('Checkout type missing');
        return;
      }

      if (type === 'cart') {
        const stored = localStorage.getItem('cart');
        const items = stored ? JSON.parse(stored) : [];
        if (!items.length) toast.warn('Cart is empty');
        setCartItems(items);
      }

      if (type === 'buy') {
        const productId = searchParams.get('productId');
        const variantId = searchParams.get('variantId');
        const size = searchParams.get('size');
        const quantity = Number(searchParams.get('quantity') || '1');

        if (!productId || !variantId || !size || !quantity) {
          toast.error('Invalid buy now parameters');
          return;
        }

        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/${productId}`);
          const product = res.data?.data;

          const variant = product.variants.find((v: any) => v.variantId === variantId);
          if (!variant) return toast.error('Variant not found');

          const sizeObj = variant.sizes.find((s: any) => s.size === size);
          if (!sizeObj) return toast.error('Selected size not found');

          const stock = variant.sizes.find((s: any) => s.size === size);
          if (stock.stock <= 0 && !variant.allowBackorder) return toast.error('Not in Stock');

          const now = new Date();
          const validDiscount =
            sizeObj.salePrice && sizeObj.discountEndDate && new Date(sizeObj.discountEndDate) > now;
          const finalPrice = validDiscount ? Number(sizeObj.salePrice) : Number(sizeObj.price);

          const img = variant.images?.[0] || product.coverImage;

          setCartItems([
            {
              productId,
              variantId,
              size,
              quantity,
              price: finalPrice,
              image: img,
              title: product.title,
              color: variant.color,
              label: variant.label,
            },
          ]);
        } catch {
          toast.error('Failed to fetch product for preview');
        }
      }
    };

    loadItems();
  }, [type, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (cartItems.length === 0) return toast.error('No items to checkout');

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/initiate`,
        {
          items: cartItems,
          shippingAddress: address,
          userNote: '',
        },
        { withCredentials: true }
      );

      const { clientSecret, groupOrderId } = response.data;
      toast.success('Proceeding to payment…');
      router.push(`/checkout/payment?clientSecret=${clientSecret}&groupOrderId=${groupOrderId}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="commerce-shell market-content-safe-bottom">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="commerce-panel p-6 sm:p-8">
          <h1 className="font-poppins text-2xl font-semibold text-brand-navy">Checkout</h1>
          <p className="commerce-trust-note mt-2">
            Enter your shipping address, then continue to secure payment. You are not charged until you confirm
            payment on the next step.
          </p>

          <h2 className="commerce-text-label mt-8 text-lg">Shipping address</h2>
          <div className="mx-auto mt-3 h-0.5 w-16 bg-brand-gold" />

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="commerce-label" htmlFor="fullName">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={address.fullName}
                onChange={handleChange}
                className="commerce-input"
                autoComplete="name"
              />
            </div>
            <div>
              <label className="commerce-label" htmlFor="phone">
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={address.phone}
                onChange={handleChange}
                className="commerce-input"
                autoComplete="tel"
              />
            </div>

            <div className="md:col-span-2">
              <label className="commerce-label" htmlFor="addressLine1">
                Address line 1
              </label>
              <input
                id="addressLine1"
                type="text"
                name="addressLine1"
                value={address.addressLine1}
                onChange={handleChange}
                className="commerce-input"
                autoComplete="address-line1"
              />
            </div>

            <div className="md:col-span-2">
              <label className="commerce-label" htmlFor="addressLine2">
                Address line 2 <span className="font-normal text-brand-muted">(optional)</span>
              </label>
              <input
                id="addressLine2"
                type="text"
                name="addressLine2"
                value={address.addressLine2}
                onChange={handleChange}
                className="commerce-input"
                autoComplete="address-line2"
              />
            </div>

            <div>
              <label className="commerce-label" htmlFor="city">
                City
              </label>
              <input
                id="city"
                type="text"
                name="city"
                value={address.city}
                onChange={handleChange}
                className="commerce-input"
                autoComplete="address-level2"
              />
            </div>

            <div>
              <label className="commerce-label" htmlFor="state">
                State
              </label>
              <input
                id="state"
                type="text"
                name="state"
                value={address.state}
                onChange={handleChange}
                className="commerce-input"
                autoComplete="address-level1"
              />
            </div>

            <div>
              <label className="commerce-label" htmlFor="country">
                Country
              </label>
              <input
                id="country"
                type="text"
                name="country"
                value={address.country}
                onChange={handleChange}
                className="commerce-input"
                autoComplete="country-name"
              />
            </div>

            <div>
              <label className="commerce-label" htmlFor="pincode">
                ZIP / postal code
              </label>
              <input
                id="pincode"
                type="text"
                name="pincode"
                value={address.pincode}
                onChange={handleChange}
                className="commerce-input"
                autoComplete="postal-code"
              />
            </div>
          </div>

          <div className="mt-10 border-t border-dashboard-border-light pt-6">
            <h3 className="commerce-text-label text-lg">Order summary</h3>

            {cartItems.length === 0 ? (
              <p className="commerce-text-body mt-4">No items in this checkout session.</p>
            ) : (
              cartItems.map((item, idx) => (
                <div key={idx} className="commerce-panel-muted mb-4 mt-4 flex items-start justify-between gap-4 p-4">
                  <div className="flex min-w-0 gap-4">
                    <img
                      src={item.image || '/placeholder.png'}
                      alt={item.title || 'Product'}
                      className="h-24 w-20 shrink-0 rounded bg-surface-panel object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-brand-navy">{item.title || `Product ${item.productId}`}</p>
                      {item.color || item.label || item.size ? (
                        <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-brand-muted">
                          {item.color ? (
                            <span
                              className="inline-block h-4 w-4 rounded-full border border-dashboard-input-border"
                              style={{ backgroundColor: item.color }}
                              aria-hidden
                            />
                          ) : null}
                          {[item.label, item.size].filter(Boolean).join(' · ')}
                        </p>
                      ) : null}
                      <div className="mt-2 inline-flex items-center gap-2 rounded-md border border-dashboard-input-border px-2 py-1">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...cartItems];
                            if (updated[idx].quantity > 1) {
                              updated[idx].quantity -= 1;
                              setCartItems(updated);
                            }
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-brand-navy hover:border-brand-gold"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="min-w-[1.5rem] text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...cartItems];
                            updated[idx].quantity += 1;
                            setCartItems(updated);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-brand-navy hover:border-brand-gold"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 font-semibold text-brand-navy">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>

          <p className="commerce-trust-note mt-6">
            Payments are processed securely through Stripe. See our{' '}
            <a href="/privacy" className="text-brand-navy-light underline hover:text-brand-teal-dark">
              privacy policy
            </a>{' '}
            and{' '}
            <a href="/refund-return" className="text-brand-navy-light underline hover:text-brand-teal-dark">
              refunds &amp; returns
            </a>{' '}
            for more information.
          </p>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || cartItems.length === 0}
            className="mt-6 w-full rounded-lg bg-brand-navy-light px-6 py-3 font-semibold text-white transition hover:bg-brand-navy disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Submitting…' : 'Continue to payment'}
          </button>
        </div>
      </div>
    </div>
  );
}
