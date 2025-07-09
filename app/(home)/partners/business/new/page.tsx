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
  productCategories?: string[];
  serviceCategories?: string[];
  foodCategories?: string[];
}

type Category = {
  _id: string;
  name: string;
};


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

interface Subscription {
  _id: string;
  userId: string;
  businessId: string | null; // Can be null initially
  subscriptionPlanId: SubscriptionPlan; // This is the full subscription plan
  paymentStatus: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
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
  const [pageLoading, setPageLoading] = useState(true);
  const [userSubscriptions, setUserSubscriptions] = useState<Subscription[]>([]);
  const [selectedTab, setSelectedTab] = useState("new"); // "new" or "existing"
  const [selectedCategories, setSelectedCategories] = useState<{ _id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);


  const [productCategories, setProductCategories] = useState<Category[]>([]);
  const [serviceCategories, setServiceCategories] = useState<Category[]>([]);
  const [foodCategories, setFoodCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`);
        const data = await response.json();
        console.log(data);

        // Check if the API response contains valid data fields
        if (response.ok && data?.success === true && data?.data) {
          // Store categories based on listingType
          setProductCategories(data.data.productCategories);
          setServiceCategories(data.data.serviceCategories);
          setFoodCategories(data.data.foodCategories);

          // Default to one of the categories or empty
          setCategories([]);
        } else {
          console.log('Error fetching categories: Invalid response structure');
          throw new Error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setPageLoading(false); // Set pageLoading to false after fetch
      }
    };

    if (formData.listingType) {
      fetchCategories(); // Fetch categories only when listingType is selected
    }
  }, [formData.listingType]); // Dependency on listingType

  const handleListingTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, listingType: e.target.value });
  };

  const getCategoriesForListingType = () => {
    if (formData.listingType === 'product') {
      return productCategories;
    } else if (formData.listingType === 'service') {
      return serviceCategories;
    } else if (formData.listingType === 'food') {
      return foodCategories;
    } else {
      return []; // Return empty if no valid listingType is selected
    }
  };
  ;
  // Only run once on component mount

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptionId = e.target.value;

    // Find the category object from the available categories based on the selected ID
    const selectedCategory = getCategoriesForListingType().find((category) => category._id === selectedOptionId);

    if (selectedCategory && !selectedCategories.some((category) => category._id === selectedCategory._id) && selectedCategories.length < 5) {
      setSelectedCategories([...selectedCategories, selectedCategory]);
    }
  };


  const handleRemoveCategory = (category: { _id: string; name: string }) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat._id !== category._id));
  };


  // Filter categories to remove the ones that are already selected
  const availableCategories = categories.filter(
    (item) => !selectedCategories.some((selectedCategory) => selectedCategory._id === item._id)
  );


  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/subscription-plans`);
        const data = await res.json();

        // Check if the response is ok and the data is an array
        if (res.ok && Array.isArray(data.data)) {
          // Set the fetched plans and select the plan with the lowest price
          setPlans(data.data);
          setSelectedPlanId(
            data.data.sort((a: SubscriptionPlan, b: SubscriptionPlan) => a.price - b.price)[0]._id
          );
        } else {
          console.log('Error: Invalid response data');
          throw new Error('Failed to fetch subscription plans');
        }

        const userSubscriptionRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/subscriptions`, {
          method: 'GET',
          credentials: 'include',
        });

        const userSubscriptionData = await userSubscriptionRes.json();

        if (userSubscriptionRes.ok && Array.isArray(userSubscriptionData.subscriptions)) {
          console.log(userSubscriptionData.subscriptions);

          setUserSubscriptions(userSubscriptionData.subscriptions);
        } else {
          console.log('No subscriptions found for the user');
        }
      } catch (error) {
        console.error('Error fetching subscription plans:', error);

        // Fallback to dummy data
        const dummy = [
          {
            _id: '685281f61e1de765d6b297c0',
            name: 'Basic',
            price: 100,
            durationInDays: 30,
            limits: { productListings: 3, serviceListings: 1, foodListings: 1, imageLimit: 3, videoLimit: 0 },
            features: { analyticsDashboard: false, supportLevel: 'basic' },
          },
          {
            _id: '685281f61e1de765d6b297c1',
            name: 'Pro',
            price: 499,
            durationInDays: 90,
            limits: { productListings: 10, serviceListings: 5, foodListings: 2, imageLimit: 6, videoLimit: 1 },
            features: { analyticsDashboard: true, supportLevel: 'standard', marketingTools: true },
          },
          {
            _id: '685281f61e1de765d6b297c2',
            name: 'Pro Plus',
            price: 999,
            durationInDays: 180,
            limits: { productListings: 20, serviceListings: 10, foodListings: 5, imageLimit: 10, videoLimit: 3 },
            features: { analyticsDashboard: true, supportLevel: 'priority', marketingTools: true, aiRecommendation: true },
          },
        ];

        // Set the fallback dummy data and select the first plan as default
        setPlans(dummy);
        setSelectedPlanId(dummy[0]._id);
      } finally {
        setPageLoading(false);  // Set pageLoading to false after fetch
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

  // const handleSubmit = async () => {
  //   setLoading(true);
  //   try {
  //     const body = new FormData();
  //     Object.entries(formData).forEach(([key, value]) => {
  //       if (value) body.append(key, value);
  //     });
  //     body.append('subscriptionPlanId', selectedPlanId);
  //     body.append('paymentId', 'TechwareHut12342');
  //     body.append('paymentStatus', 'COMPLETED');
  //     body.append('isApproved', 'true');
  //     console.log(body);

  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business`, {
  //       method: 'POST',
  //       body,
  //       credentials: 'include',
  //     });
  //     const data = await res.json();
  //     if (res.ok) {
  //       toast.success('Business registered successfully!');
  //       setTimeout(() => {
  //         window.location.href = '/partners';
  //       }, 2000);
  //     } else {
  //       toast.error(data.message || 'Something went wrong');
  //     }
  //   } catch {
  //      toast.error('Network error');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async () => {
    setLoading(true);
    // setPageLoading(true);
    try {

      if (formData.listingType === 'product') {
        // Extract only the _id from selectedCategories for the backend
        formData.productCategories = selectedCategories.map((category) => category._id);
      } else if (formData.listingType === 'service') {
        formData.serviceCategories = selectedCategories.map((category) => category._id);
      } else if (formData.listingType === 'food') {
        formData.foodCategories = selectedCategories.map((category) => category._id);
      }
      // ➤ 1. Save Business Draft
      const draftRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          businessName: formData.businessName,
          email: formData.email,
          subscriptionPlanId: selectedPlanId,
          formData,  // send rest of the fields
        }),
      });

      const draftData = await draftRes.json();
      if (!draftRes.ok) {
        toast.error(draftData.message || 'Draft creation failed');
        setLoading(false);
        return;
      }

      const draftId = draftData.draftId;

      // ➤ 2. Create Stripe Checkout Session
      const stripeRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ draftId }),
      });

      const stripeData = await stripeRes.json();
      if (!stripeRes.ok) {
        toast.error(stripeData.message || 'Failed to create payment session');
        setLoading(false);
        return;
      }

      // ➤ 3. Redirect to Stripe
      window.location.href = stripeData.sessionUrl;

    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleBusinessCreation = async () => {
    if (selectedPlanId) {
      setLoading(true);
      try {
        const categoryIds = selectedCategories.map((category) => category._id);

        if (formData.listingType === 'product') {
          formData.productCategories = categoryIds;
        } else if (formData.listingType === 'service') {
          formData.serviceCategories = categoryIds;
        } else if (formData.listingType === 'food') {
          formData.foodCategories = categoryIds;
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business/retry-create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            subscriptionId: selectedPlanId,
            businessName: formData.businessName,
            formData,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          toast.success('Business created successfully!');
          // Redirect or show success message
          window.location.href = 'http://localhost:3000/partners';
        } else {
          toast.error(data.message || 'Error creating business');
        }
      } catch (error) {
        console.error(error);
        toast.error('Network error, please try again.');
      } finally {
        setLoading(false);
      }
    }
  };



  const Loader = () => (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent" />
    </div>
  );

  if (pageLoading) {
    return <Loader />; // Show loader until everything is loaded
  }


  return (
    <>
      <div className="min-h-screen px-4 py-10 bg-white sm:px-6 md:px-10 lg:px-20">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Left Image Section */}
          <div className="relative flex justify-center h-auto sm:h-[500px] lg:h-[710px] pt-2 sm:pt-10 lg:w-1/2">
            <div className="absolute top-[-10px] left-[-20px] w-[60%] sm:w-[70%] lg:w-[60%] h-[60%] sm:h-[70%] lg:h-[60%] bg-custom-yellow z-0" />
            <Image
              src="/partners/registration-image.png"
              alt="Business Registration"
              width={500}
              height={480}
              className="relative z-10 object-contain w-full h-auto rounded-lg shadow"
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
                  onChange={handleListingTypeChange}
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

              <div className="flex flex-col w-full md:col-span-2">
                <label htmlFor="categories" className="mb-2 text-sm font-medium text-gray-700">
                  Business Categories
                </label>

                {/* Dropdown for selecting categories */}
                <select
                  id="selectCategory"
                  onChange={handleCategoryChange}
                  value=""
                  disabled={(selectedCategories.length >= 5) || !formData.listingType || pageLoading}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select Category - Subcategory</option>
                  {getCategoriesForListingType().map((category, index) => (
                    <option key={index} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {/* Display selected categories as tags */}
                <div className="flex flex-row flex-wrap w-full gap-2 mt-4">
                  {selectedCategories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded-full"
                    >
                      <span>{category.name}</span>
                      <button
                        onClick={() => handleRemoveCategory(category)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* ✅ Full-width Plan Section */}
      <div className="w-full px-4 mt-5 mb-12 sm:px-6 md:px-10 lg:px-20">
        <div className="flex items-start mb-6">
          {/* New Subscription Tab */}
          <h2
            className={`mb-6 font-semibold text-gray-800 uppercase cursor-pointer ${selectedTab === "new" ? "text-blue-600 font-bold text-2xl" : "text-gray-400 text-[10px]"}`}
            onClick={() => setSelectedTab("new")}
          >
            Choose a Plan
          </h2>
          {userSubscriptions.length > 0 && (
            <>
              <span className="mx-3 text-2xl text-gray-600">/</span>


              <h2
                className={`mb-6 font-semibold text-gray-800 uppercase cursor-pointer ${selectedTab === "existing" ? "text-blue-600 font-bold text-2xl" : "text-gray-400 text-[10px]"}`}
                onClick={() => setSelectedTab("existing")}
              >
                Existing Plan
              </h2>
            </>
          )}
        </div>


        <div className="flex flex-wrap justify-center w-full gap-6">
          {selectedTab === "existing" ? (
            // Display existing subscriptions
            userSubscriptions.map((sub: Subscription) => {
              const isSelected = selectedPlanId === sub._id;

              return (
                <div
                  key={sub._id}
                  className={`cursor-pointer flex flex-col justify-between rounded-lg border shadow-sm transition-all p-10 hover:shadow-md xl:w-[30%] ${isSelected
                    ? "bg-[#333333] text-white border-black"
                    : "bg-white text-gray-800 border-gray-200"}`}
                  onClick={() => setSelectedPlanId(sub._id)}
                >
                  <div>
                    <h3 className={`text-2xl font-bold text-center uppercase mb-1 ${isSelected ? "text-orange-400" : "text-gray-800"}`}>
                      {sub.subscriptionPlanId?.name} Plan
                    </h3>
                    <p className={`text-sm text-center mb-4 ${isSelected ? "text-gray-300" : "text-gray-600"}`}>
                      Your existing plan
                    </p>
                    <p className={`text-3xl text-center font-extrabold mb-4 ${isSelected ? "text-white" : "text-black"}`}>
                      ${sub.subscriptionPlanId?.price}{" "}
                      <span className="text-base font-medium text-gray-400">
                        / {sub.subscriptionPlanId?.durationInDays} Days
                      </span>
                    </p>

                    {/* Limits Summary */}
                    <ul className="mb-4 space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✔</span>
                        Products: {sub.subscriptionPlanId?.limits.productListings}
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✔</span>
                        Services: {sub.subscriptionPlanId?.limits.serviceListings}
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✔</span>
                        Foods: {sub.subscriptionPlanId?.limits.foodListings}
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✔</span>
                        Media Limit: {sub.subscriptionPlanId?.limits.imageLimit} images, {sub.subscriptionPlanId?.limits.videoLimit} videos
                      </li>
                    </ul>

                    {/* Features */}
                    <div className="text-xs">
                      <strong className={`${isSelected ? "text-orange-300" : "text-orange-600"}`}>
                        Features:
                      </strong>
                      <ul className="mt-1 ml-5 space-y-1 list-disc">
                        {Object.entries(sub.subscriptionPlanId?.features || {}).map(
                          ([key, val]) =>
                            val && (
                              <li key={key}>
                                {key.replace(/([A-Z])/g, " $1")} {typeof val === "string" ? `(${val})` : ""}
                              </li>
                            )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            // Display new subscription plans
            plans.map((plan) => {
              const isSelected = selectedPlanId === plan._id;

              return (
                <div
                  key={plan._id}
                  className={`cursor-pointer flex flex-col justify-between rounded-lg border shadow-sm transition-all p-10 hover:shadow-md xl:w-[30%] ${isSelected
                    ? "bg-[#333333] text-white border-black"
                    : "bg-white text-gray-800 border-gray-200"}`}
                  onClick={() => setSelectedPlanId(plan._id)}
                >
                  <div>
                    <h3 className={`text-2xl font-bold text-center uppercase mb-1 ${isSelected ? "text-orange-400" : "text-gray-800"}`}>
                      {plan.name} Plan
                    </h3>
                    <p className={`text-sm text-center mb-4 ${isSelected ? "text-gray-300" : "text-gray-600"}`}>
                      Access powerful features with this plan.
                    </p>
                    <p className={`text-3xl text-center font-extrabold mb-4 ${isSelected ? "text-white" : "text-black"}`}>
                      ${plan.price}{" "}
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
                      <strong className={`${isSelected ? "text-orange-300" : "text-orange-600"}`}>
                        Features:
                      </strong>
                      <ul className="mt-1 ml-5 space-y-1 list-disc">
                        {Object.entries(plan.features).map(
                          ([key, val]) =>
                            val && (
                              <li key={key}>
                                {key.replace(/([A-Z])/g, " $1")} {typeof val === "string" ? `(${val})` : ""}
                              </li>
                            )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>



        {/* Bottom Right Submit Button */}
        <div className="flex justify-end mt-10">
          {selectedTab === "existing" ? (
            <button
              onClick={handleBusinessCreation}
              disabled={loading}
              className="px-6 py-2 font-medium text-white bg-orange-600 rounded hover:bg-orange-700"
            >
              {loading ? 'Retrying...' : 'Retry Business Creation'}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 font-medium text-white bg-orange-600 rounded hover:bg-orange-700"
            >
              {loading ? 'Submitting...' : 'Submit & Pay'}
            </button>
          )}
        </div>

      </div>

    </>
  );
}