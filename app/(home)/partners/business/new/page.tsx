'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';


interface BusinessForm {
  businessName: string;
  description: string;
  email: string;
  phoneNumber: string;
  listingType: string;
  address: string;
  city: string;
  state: string;
  country: string;
  logo?: File | null;
  coverImage?: File | null;
}

interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  durationInDays: number;
  limits: {
    productListings: number;
    serviceListings: number;
    foodListings: number;
    imageLimit: number;
    videoLimit: number;
  };
  features: {
    analyticsDashboard?: boolean;
    marketingTools?: boolean;
    featuredPlacement?: boolean;
    supportLevel?: string;
    communityEventsAccess?: boolean;
    searchPriority?: boolean;
    listingPriority?: boolean;
    pushNotifications?: boolean;
    aiRecommendation?: boolean;
  };
}

const initialForm: BusinessForm = {
  businessName: '',
  description: '',
  email: '',
  phoneNumber: '',
  listingType: '',
  address: '',
  city: '',
  state: '',
  country: '',
  logo: null,
  coverImage: null,
};

export default function CreateNewBusinessPage() {
  const [formData, setFormData] = useState(initialForm);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/subscription-plans`);
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setPlans(data);
          setSelectedPlanId(data.sort((a, b) => a.price - b.price)[0]._id);
        } else {
          throw new Error();
        }
      } catch {
        const dummy: SubscriptionPlan[] = [
          {
            _id: '685281f61e1de765d6b297c0',
            name: 'Basic',
            price: 100,
            durationInDays: 30,
            limits: { productListings: 3, serviceListings: 1, foodListings: 1, imageLimit: 3, videoLimit: 0 },
            features: { analyticsDashboard: false, supportLevel: 'basic' },
          },
          {
            _id: '685281f61e1de765d6b297c01',
            name: 'Pro',
            price: 499,
            durationInDays: 90,
            limits: { productListings: 10, serviceListings: 5, foodListings: 2, imageLimit: 6, videoLimit: 1 },
            features: { analyticsDashboard: true, supportLevel: 'standard', marketingTools: true },
          },
          {
            _id: '685281f61e1de765d6b297c02',
            name: 'Pro Plus',
            price: 999,
            durationInDays: 180,
            limits: { productListings: 20, serviceListings: 10, foodListings: 5, imageLimit: 10, videoLimit: 3 },
            features: { analyticsDashboard: true, supportLevel: 'priority', marketingTools: true, aiRecommendation: true },
          },
        ];
        setPlans(dummy);
        setSelectedPlanId(dummy[0]._id);
      }
    };

    fetchPlans();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const body = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) body.append(key, value);
      });
      body.append('subscriptionPlanId', selectedPlanId);
      body.append('paymentId', 'TechwareHut1234');
      body.append('paymentStatus', 'COMPLETED');
      body.append('isApproved', 'true');
      console.log(body);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business`, {
        method: 'POST',
        body,
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Business registered successfully!');
        setTimeout(() => {
          window.location.href = '/partners';
        }, 2000);
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch {
       toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen px-4 py-10 bg-white sm:px-6 md:px-10 lg:px-20">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Left Image Section */}
          <div className="relative flex justify-center pt-2 sm:pt-10 lg:w-1/2">
            <div className="absolute top-[-20px] left-[-20px] w-[60%] h-[60%] bg-custom-yellow z-0" />
            <Image
              src="/partners/registration-image.png"
              alt="Business Registration"
              width={500}
              height={480}
              className="relative z-10 object-contain rounded-lg shadow"
            />
          </div>

          {/* Right Form Section */}
          <div className="w-full lg:w-1/2">
            <h1 className="mb-4 text-2xl font-semibold uppercase sm:text-3xl md:text-4xl heading">
              BUSINESS REGISTRATION
            </h1>
            <hr className="h-[2px] w-[100px] bg-green-900" />
            <hr className="h-[2px] w-[100px] bg-green-900 mt-[1px]" />

            <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
              {['businessName', 'email', 'phoneNumber', 'address', 'city', 'state', 'country'].map((field) => (
                <div key={field} className="flex flex-col w-full">
                  <label htmlFor={field} className="text-sm font-medium text-gray-700 capitalize">
                    {field.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    name={field}
                    id={field}
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded"
                  />
                </div>
              ))}

              <div className="flex flex-col w-full">
                <label htmlFor="listingType" className="text-sm font-medium text-gray-700">
                  Listing Type
                </label>
                <select
                  name="listingType"
                  value={formData.listingType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="">Select</option>
                  <option value="product">Products</option>
                  <option value="service">Services</option>
                  <option value="food">Foods</option>
                </select>
              </div>

              <div className="flex flex-col w-full md:col-span-2">
                <label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  rows={3}
                />
              </div>

              <div className="flex flex-col w-full">
                <label htmlFor="logo" className="text-sm font-medium text-gray-700">
                  Logo
                </label>
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>

              <div className="flex flex-col w-full">
                <label htmlFor="coverImage" className="text-sm font-medium text-gray-700">
                  Cover Image
                </label>
                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* ✅ Full-width Plan Section */}
      <div className="w-full px-4 mt-5 mb-12 sm:px-6 md:px-10 lg:px-20">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800 uppercase">Choose a Plan</h2>

        <div className="flex flex-wrap justify-center w-full gap-6">
          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan._id;

            return (
              <div
                key={plan._id}
                className={`cursor-pointer flex flex-col justify-between rounded-lg border shadow-sm transition-all p-10 hover:shadow-md xl:w-[30%] ${isSelected
                  ? 'bg-[#333333] text-white border-black'
                  : 'bg-white text-gray-800 border-gray-200'
                  }`}
                onClick={() => setSelectedPlanId(plan._id)}
              >
                {/* Plan Header */}
                <div>
                  <h3 className={`text-2xl font-bold text-center uppercase mb-1 ${isSelected ? 'text-orange-400' : 'text-gray-800'}`}>
                    {plan.name} Plan
                  </h3>
                  <p className={`text-sm text-center mb-4 ${isSelected ? 'text-gray-300' : 'text-gray-600'}`}>
                    Access powerful features with this plan.
                  </p>
                  <p className={`text-3xl text-center font-extrabold mb-4 ${isSelected ? 'text-white' : 'text-black'}`}>
                    ₹{plan.price}{' '}
                    <span className="text-base font-medium text-gray-400">
                      / {plan.durationInDays} Days
                    </span>
                  </p>

                  {/* Limits Summary */}
                  <ul className="mb-4 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✔</span>
                      Products: {plan.limits.productListings}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✔</span>
                      Services: {plan.limits.serviceListings}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✔</span>
                      Foods: {plan.limits.foodListings}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✔</span>
                      Media Limit: {plan.limits.imageLimit} images, {plan.limits.videoLimit} videos
                    </li>
                  </ul>

                  {/* Features */}
                  <div className="text-xs">
                    <strong className={`${isSelected ? 'text-orange-300' : 'text-orange-600'}`}>
                      Features:
                    </strong>
                    <ul className="mt-1 ml-5 space-y-1 list-disc">
                      {Object.entries(plan.features).map(
                        ([key, val]) =>
                          val && (
                            <li key={key}>
                              {key.replace(/([A-Z])/g, ' $1')} {typeof val === 'string' ? `(${val})` : ''}
                            </li>
                          )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Right Submit Button */}
        <div className="flex justify-end mt-10">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 font-medium text-white bg-orange-600 rounded hover:bg-orange-700"
          >
            {loading ? 'Submitting...' : 'Submit & Pay'}
          </button>
        </div>
      </div>

    </>
  );
}