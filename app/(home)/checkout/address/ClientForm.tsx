'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getLoggedInCustomer } from '@/utils/authUtils';

export default function CheckoutAddressPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get('type'); // 'cart' or 'buy'

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
  const [customerEmail, setCustomerEmail] = useState('');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const loggedIn = await getLoggedInCustomer();

      if (!loggedIn) {
        toast.error('You must be logged as Customer to continue');
        // router.replace(`/login?type=customer?redirect=/checkout/address${window.location.search}`);
        router.replace(`/login?type=customer`);
        return;
      }

      setAddress((prev) => ({
        ...prev,
        fullName: loggedIn.name || '',
        phone: loggedIn.mobile || '',
      }));
      setCustomerEmail(loggedIn.email || '');
    };

    checkLogin();
  }, []);

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
        const price = Number(searchParams.get('price') || '0');

        if (!productId || !variantId || !size || !quantity || !price) {
          toast.error('Invalid buy now parameters');
          return;
        }

        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/${productId}`);
          const product = res.data?.data;
          const variant = product.variants.find((v: any) => v.variantId === variantId);
          const img = variant?.images?.[0] || product.coverImage;

          setCartItems([
            {
              productId,
              variantId,
              size,
              quantity,
              price,
              image: img,
              title: product.title,
            },
          ]);
        } catch (err) {
          toast.error('Failed to fetch product for preview');
        }
      }
    };

    loadItems();
  }, [type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
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
      toast.success('Proceeding to payment...');
      router.push(`/checkout/payment?clientSecret=${clientSecret}&groupOrderId=${groupOrderId}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl p-6 mx-auto my-10 bg-white rounded shadow">
      <h2 className="mb-4 text-2xl font-semibold">Shipping Address</h2>


      {Object.keys(address).map((field) => (
        <div key={field} className="mb-4">
          <label className="block mb-1 capitalize">{field}</label>
          <input
            type="text"
            name={field}
            value={address[field as keyof typeof address]}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
      ))}

      <div className="mt-8">
        <h3 className="mb-3 text-lg font-semibold">Order Summary</h3>
        <ul className="space-y-4">
          {cartItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-4 pb-4 border-b">
              <img
                src={item.image}
                alt="Product"
                className="object-cover w-16 h-16 rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{item.title || `Product ID: ${item.productId}`}</p>
                <p className="text-sm text-gray-500">Size: {item.size}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => {
                      const updated = [...cartItems];
                      if (updated[idx].quantity > 1) {
                        updated[idx].quantity -= 1;
                        setCartItems(updated);
                      }
                    }}
                    className="px-2 py-1 text-sm font-bold text-white bg-red-500 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => {
                      const updated = [...cartItems];
                      updated[idx].quantity += 1;
                      setCartItems(updated);
                    }}
                    className="px-2 py-1 text-sm font-bold text-white bg-green-600 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="font-semibold">₹{item.price * item.quantity}</p>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full px-6 py-3 mt-6 text-white bg-indigo-600 rounded hover:bg-indigo-700"
      >
        {isLoading ? 'Submitting...' : 'Continue to Payment'}
      </button>
    </div>
  );
}
