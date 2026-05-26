'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getLoggedInCustomer } from '@/utils/authUtils';
import BannerSection from '../../products/[productid]/Component/BannerSection';
import { Minus, Plus } from 'lucide-react';

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

        if (!productId || !variantId || !size || !quantity) {
          toast.error('Invalid buy now parameters');
          return;
        }

        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/${productId}`);
          const product = res.data?.data;

          const variant = product.variants.find((v: any) => v.variantId === variantId);
          if (!variant) return toast.error("Variant not found");

          const sizeObj = variant.sizes.find((s: any) => s.size === size);
          if (!sizeObj) return toast.error("Selected size not found");
          
          const stock = variant.sizes.find((s: any) => s.size===size);
          console.log(stock);
          
          if (stock.stock<=0 && !variant.allowBackorder) return toast.error("Not in Stock");

          const now = new Date();
          const validDiscount = sizeObj.salePrice && sizeObj.discountEndDate && new Date(sizeObj.discountEndDate) > now;
          const finalPrice = validDiscount ? Number(sizeObj.salePrice) : Number(sizeObj.price);

          const img = variant.images?.[0] || product.coverImage;

          setCartItems([
            {
              productId,
              variantId,
              size,
              quantity,
              price: finalPrice, // ✅ fetched from DB
              image: img,
              title: product.title,
              color: variant.color, // ✅ optional: show color in summary
              label: variant.label 
            },
          ]);
        } catch (err) {
          toast.error('Failed to fetch product for preview');
        }
      }
    };

    loadItems();
  }, [type]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
      console.log('[checkout] initiating order', {
        apiUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/initiate`,
        itemCount: cartItems.length,
        customerEmail,
        address,
        items: cartItems,
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/initiate`,
        {
          items: cartItems,
          shippingAddress: address,
          userNote: '',
        },
        { withCredentials: true }
      );

      console.log('[checkout] initiate response', response.data);

      const { clientSecret, groupOrderId } = response.data;
      toast.success('Proceeding to payment...');
      router.push(`/checkout/payment?clientSecret=${clientSecret}&groupOrderId=${groupOrderId}`);
    } catch (err: any) {
      console.error('[checkout] initiate failed', {
        message: err?.message,
        status: err?.response?.status,
        response: err?.response?.data,
      });
      toast.error(err?.response?.data?.message || 'Failed to create order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BannerSection heading={`Checkout`} imageUrl='/products/product.png' />
      <div className="relative z-10 -mt-[15%]">
        <div className="max-w-4xl p-8 mx-auto my-10 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold tracking-wide uppercase heading">
            Shipping Address
          </h2>
          <hr className="h-[2px] w-[120px] bg-green-900" />
          <hr className="h-[2px] w-[120px] bg-green-900 mt-[1px] mb-5" />
          <p className="mb-6 text-sm text-gray-600">
            Lorem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit. Praesent Vitae Libero
            Venenatis, Tristique Justo.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={address.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={address.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 text-sm font-medium">Address Line 1</label>
              <input
                type="text"
                name="addressLine1"
                value={address.addressLine1}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 text-sm font-medium">Address Line 2</label>
              <input
                type="text"
                name="addressLine2"
                value={address.addressLine2}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">City</label>
              <select
                name="city"
                value={address.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="">-- Choose City --</option>
                <option value="Kolkata">-- Kolkata --</option>
                {/* Your city options here */}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">State</label>
              <select
                name="state"
                value={address.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="">-- Choose State --</option>
                <option value="West Bengal">-- West Bengla --</option>
                {/* Your state options here */}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Country</label>
              <select
                name="country"
                value={address.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="">-- Choose Country --</option>
                <option value="India">India</option>
                {/* Your country options here */}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={address.pincode}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="pt-6 mt-10 border-t">
            <h3 className="mb-4 text-lg font-bold">Order Summery</h3>

            {cartItems.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between gap-4 mb-6">
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-cover w-20 h-24 rounded"
                  />
                  <div>
                    <p className="font-semibold">{item.title || `Product ID: ${item.productId}`}</p>
                    <p className="flex items-center gap-2 text-sm text-gray-500">Color : 
                      <span
                        className="inline-block w-4 h-4 border border-gray-300 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></span> | 
                      <span>{item.label}: {item.size}</span>
                    </p>
                    <div className="flex items-center gap-2 px-2 py-1 mt-2 border rounded w-fit">
                      <button
                        onClick={() => {
                          const updated = [...cartItems];
                          if (updated[idx].quantity > 1) {
                            updated[idx].quantity -= 1;
                            setCartItems(updated);
                          }
                        }}
                        className="text-lg font-bold"
                      >
                        <Minus size={16} className='transition hover:scale-150' />
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button
                        onClick={() => {
                          const updated = [...cartItems];
                          updated[idx].quantity += 1;
                          setCartItems(updated);
                        }}
                        className="text-lg font-bold"
                      >
                        <Plus size={16} className='hover:scale-150' />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-lg font-semibold">${item.price * item.quantity}</div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full px-6 py-3 mt-4 font-semibold text-white bg-[#03989e] rounded hover:bg-[#027b82] transition-all duration-300"
          >
            {isLoading ? 'Submitting...' : 'Continue To Payment'}
          </button>
        </div>
      </div>
    </>
  );
}
