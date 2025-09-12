'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
// ADD
import {
  getPlaceSuggestions,
  getPlaceDetails,
} from '@/lib/googlePlaces';



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
  zipCode: string;
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
  zipCode: '',
  logo: null,
  coverImage: null,
};


const _debounce = (fn: (...a: any[]) => void, ms = 250) => {
  let t: any;
  return (...a: any[]) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
};

const _newSession = () => crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);

interface _Sug {
  description: string;
  placeId: string;
  matched_substrings: any[]; // Array of matched substrings
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings: any[]; // Add this to match the expected type
  };
  terms: any[]; // Array of terms
  types: string[]; // Array of types
}




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

  const [addressSugs, setAddressSugs] = useState<_Sug[]>([]);
  const [showAddrSugs, setShowAddrSugs] = useState(false);
  const [streetSugs, setStreetSugs] = useState<_Sug[]>([]);
  const streetSessionRef = useRef<string>(_newSession());

  const fetchStreetAutocomplete = async (input: string) => {
    if (!input.trim()) {
      setStreetSugs([]);
      setShowAddrSugs(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/google-places`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      const list: _Sug[] = (data?.suggestions ?? [])
        .map((s: any) => ({
          description: s?.placePrediction?.text?.text ?? "",
          placeId: s?.placePrediction?.placeId,
          matched_substrings: s?.placePrediction?.text?.matches ?? [],
          place_id: s?.placePrediction?.placeId,
          structured_formatting: {
            main_text: s?.placePrediction?.structuredFormat?.mainText?.text ?? "",
            secondary_text: s?.placePrediction?.structuredFormat?.secondaryText?.text ?? "",
            main_text_matched_substrings: s?.placePrediction?.structuredFormat?.mainText?.matches ?? [],
          },
          terms: s?.placePrediction?.terms ?? [],
          types: s?.placePrediction?.types ?? [],
        }))
        .filter((x: _Sug) => x.description && x.placeId);

      setStreetSugs(list);
      setShowAddrSugs(list.length > 0); // Toggle the suggestions dropdown
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const debouncedStreetAuto = useMemo(() => _debounce(fetchStreetAutocomplete, 250), []);

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



  useEffect(() => {
    setSelectedCategories([]);
  }, [formData.listingType]);



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
      } finally {
        setPageLoading(false);  // Set pageLoading to false after fetch
      }
    };

    fetchPlans();
  }, []);

  let debounceTimeout: NodeJS.Timeout;

  const debounce = (callback: Function, delay: number) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => callback(), delay);
  };


  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));

    if (name === "address") {
      if (!value.trim()) {
        setStreetSugs([]);
        setShowAddrSugs(false);
        return;
      }
      debouncedStreetAuto(value); // Call debounced function
      setShowAddrSugs(true);
    }
  };

  // ADD
  const handlePickAddressSuggestion = async (pred: google.maps.places.AutocompletePrediction) => {
    const normalized = await getPlaceDetails(pred.place_id);
    setShowAddrSugs(false);
    setAddressSugs([]);

    if (!normalized) return;

    // Extract address without city, state, or country
    const addressParts = normalized.formatted.split(',');
    const streetAddress = addressParts.slice(0, addressParts.length - 3).join(',').trim(); // assuming the last 3 parts are city, state, and country

    setFormData(prev => ({
      ...prev,
      address: streetAddress || prev.address,
      city: normalized.city || prev.city,
      state: normalized.state || prev.state,
      country: normalized.country || prev.country,
      zipCode: normalized.postalCode || prev.zipCode,
    }));
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
              {['businessName', 'email', 'phoneNumber', 'address', 'city', 'state', 'country', 'zipCode'].map((field) => (
                <div key={field} className={`flex flex-col w-full ${field === 'address' ? 'relative md:col-span-2' : ''}`}>
                  <label htmlFor={field} className="text-sm font-medium text-gray-700 capitalize">
                    {field.replace(/([A-Z])/g, ' $1')}
                  </label>

                  <input
                    name={field}
                    id={field}
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded"
                    // ADD: keep the browser from showing its own suggestions
                    autoComplete={field === 'address' ? 'off' : undefined}
                    // ADD: reopen list on focus if suggestions exist
                    onFocus={() => field === 'address' && addressSugs.length && setShowAddrSugs(true)}
                    // ADD: delay closing so click can register
                    onBlur={() => field === 'address' && setTimeout(() => setShowAddrSugs(false), 150)}
                  />

                  {/* ADD: dropdown only for address */}
                  {field === "address" && showAddrSugs && streetSugs.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded shadow top-full">
                      {streetSugs.map((sug) => (
                        <button
                          key={sug.placeId} // Use placeId as key
                          type="button"
                          className="w-full px-3 py-2 text-left hover:bg-gray-50"
                          onMouseDown={(e) => e.preventDefault()} // prevent blur before click
                          onClick={() => handlePickAddressSuggestion(sug)}
                          title={sug.description}
                        >
                          {sug.structured_formatting.main_text || sug.description} {/* Correct usage */}
                          {sug.structured_formatting.secondary_text && (
                            <span className="block text-xs text-gray-500">
                              {sug.structured_formatting.secondary_text}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

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
                  Business Description
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
                  {getCategoriesForListingType()
                    .filter(category => !selectedCategories.some(selected => selected._id === category._id))
                    .map((category, index) => (
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