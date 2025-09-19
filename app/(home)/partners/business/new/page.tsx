'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

// ADD
import { getPlaceDetails } from '@/lib/googlePlaces';



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
  taxId: string;                     // Business EIN / Tax ID
  businessLicenseNumber: string;     // Business Licence
  isFranchise: boolean;     // Optional
  franchiseLocation?: string;      // Select Franchise Locations (as labels for now)
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
  taxId: '',
  businessLicenseNumber: '',
  isFranchise: false,
  franchiseLocation: '',
};


const _debounce = (fn: (...a: any[]) => void, ms = 250) => {
  let t: any;
  return (...a: any[]) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
};

// Easing: cubic-bezier(0.16, 1, 0.3, 1) — nice ease-out
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const stepVariants: Variants = {
  initial: { opacity: 0, x: 24 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.22, ease: EASE_OUT, type: "tween" },
  },
  exit: {
    opacity: 0,
    x: -24,
    transition: { duration: 0.18, ease: EASE_OUT, type: "tween" },
  },
};

const imageVariants: Variants = {
  initial: { opacity: 0, x: -12 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    x: -12,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
};

// ADD
const planListVariants: Variants = {
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const planCardVariants: Variants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.22, ease: EASE_OUT, type: 'tween' } },
};



const inputBase =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 outline-none " +
  "focus:ring-4 focus:ring-orange-100 focus:border-orange-300 transition placeholder:text-gray-400";
const labelBase = "text-sm font-medium text-gray-700 capitalize";
const cardBase = "rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-6 md:p-8 shadow-sm";


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

  // NEW: step constants
  const STEPS = ['basic', 'address', 'compliance', 'categories', 'plan'] as const;
  type Step = typeof STEPS[number];

  // NEW: step state
  const [step, setStep] = useState<Step>('basic');
  const stepIndex = STEPS.indexOf(step);

  // NEW: navigation
  const goNext = () => setStep(STEPS[Math.min(stepIndex + 1, STEPS.length - 1)]);
  const goBack = () => setStep(STEPS[Math.max(stepIndex - 1, 0)]);

  // NEW: lightweight per-step validator (no external libs)
  const validateStep = (s: Step) => {
    const f = formData;
    const errs: string[] = [];

    if (s === 'basic') {
      if (!f.businessName?.trim()) errs.push('Business name is required');
      if (!f.email?.trim()) errs.push('Email is required');
      if (!f.phoneNumber?.trim()) errs.push('Phone number is required');
      if (!f.listingType) errs.push('Listing type is required');
    }

    if (s === 'address') {
      if (!f.address?.trim()) errs.push('Address is required');
      if (!f.city?.trim()) errs.push('City is required');
      if (!f.state?.trim()) errs.push('State is required');
      if (!f.country?.trim()) errs.push('Country is required');
      if (!f.zipCode?.trim()) errs.push('ZIP/Postal code is required');
    }

    if (s === 'compliance') {
      if (!f.taxId?.trim()) errs.push('Tax ID is required');
      if (!f.businessLicenseNumber?.trim()) errs.push('Business licence is required');
      if (f.isFranchise && !f.franchiseLocation?.trim()) errs.push('Franchise location is required');
    }

    if (s === 'categories') {
      if (selectedCategories.length === 0) errs.push('Pick at least one category');
    }

    if (errs.length) toast.error(errs[0]); // show first error
    return errs.length === 0;
  };

  // NEW: step-aware submit handler
  const handleNext = () => {
    if (!validateStep(step)) return;

    if (step !== 'plan') {
      return goNext();
    }

    // Final step:
    if (!selectedPlanId) {
      toast.error(selectedTab === 'existing' ? 'Select an existing subscription' : 'Select a plan');
      return;
    }

    if (selectedTab === 'existing') {
      // No payment — create business with existing subscription
      return handleBusinessCreation();
    }

    // New plan — go to Stripe
    return handleSubmit();
  };


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


  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    setFormData((prev: any) => ({ ...prev, [name]: value }));

    if (name === "address") {
      if (!String(value).trim()) {
        setStreetSugs([]);
        setShowAddrSugs(false);
        return;
      }
      debouncedStreetAuto(String(value));
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
    if (!formData.isFranchise) {
      formData.franchiseLocation = '';
    }
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
      <div className="min-h-screen px-4 py-10 bg-white pb-28 sm:px-6 md:px-10 lg:px-20">
        <h1 className="mb-4 text-2xl font-semibold uppercase sm:text-3xl md:text-4xl heading">
          BUSINESS REGISTRATION
        </h1>
        <hr className="h-[2px] w-[100px] bg-green-900" />
        <hr className="h-[2px] w-[100px] bg-green-900 mt-[1px] mb-10" />
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          {/* Left Image Section */}
          <AnimatePresence mode="wait">
            {step !== "plan" && (
              <motion.div
                key="left-visual"
                variants={imageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="relative flex md:justify-start w-full lg:w-5/12 aspect-[4/3] pt-2 md:pt-6"
              >
                <div className="absolute top-[-10px] left-[-20px] w-[55%] sm:w-[60%] lg:w-[55%] h-[55%] sm:h-[60%] lg:h-[65%] bg-custom-yellow z-0 rounded-2xl" />
                <Image
                  src="/partners/registration-image.png"
                  alt="Business Registration"
                  width={500}
                  height={480}
                  className="relative z-10 object-contain w-full h-auto rounded-2xl shadow max-w-[420px] md:max-w-[520px]"
                />
              </motion.div>
            )}
          </AnimatePresence>


          {/* Right Form Section */}

          <div className="w-full mx-auto lg:w-7/12">

            {step !== "plan" && (
              <div className="relative mt-6 overflow-visible min-h-[500px]">
                <AnimatePresence mode="wait">
                  {step === "basic" && (
                    <motion.div
                      key="step-basic"
                      variants={stepVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className={`${cardBase} [will-change:transform] absolute inset-0 overflow-y-auto`}
                    >
                      <div className="mb-6">
                        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Basic Information</h2>
                        <p className="mt-1 text-sm text-gray-500">Tell customers who you are. You can edit this later.</p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {["businessName", "email", "phoneNumber"].map((field) => (
                          <div key={field} className="flex flex-col w-full">
                            <label htmlFor={field} className={labelBase}>
                              {field.replace(/([A-Z])/g, " $1")}
                            </label>
                            <input
                              name={field}
                              id={field}
                              value={(formData as any)[field]}
                              onChange={handleChange}
                              className={inputBase}
                              placeholder={
                                field === "businessName" ? "e.g., Mosaic Biz Hub"
                                  : field === "email" ? "you@business.com"
                                    : "+1 9XXXXXXXXX"
                              }
                              type={field === "email" ? "email" : "text"}
                            />
                          </div>
                        ))}

                        <div className="flex flex-col w-full">
                          <label htmlFor="listingType" className={labelBase}>Listing Type</label>
                          <select
                            name="listingType"
                            value={formData.listingType}
                            onChange={handleListingTypeChange}
                            className={inputBase}
                          >
                            <option value="">Select</option>
                            <option value="product">Products</option>
                            <option value="service">Services</option>
                            <option value="food">Foods</option>
                          </select>
                        </div>

                        <div className="flex flex-col w-full md:col-span-2">
                          <label htmlFor="description" className={labelBase}>Business Description</label>
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`${inputBase} min-h-[110px]`}
                            placeholder="What do you do? Highlight your value in 1–3 sentences."
                            rows={3}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>


                <AnimatePresence mode="wait">
                  {step === 'address' && (
                    <motion.div
                      layout
                      key="step-address"
                      variants={stepVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className={`${cardBase} [will-change:transform] overflow-visible`}
                    >
                      <div className="mb-6">
                        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Address</h2>
                        <p className="mt-1 text-sm text-gray-500">Add your business location details.</p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {['address', 'city', 'state', 'country', 'zipCode'].map((field) => (
                          <div
                            key={field}
                            className={`flex flex-col w-full ${field === 'address' ? 'relative md:col-span-2' : ''}`}
                          >
                            <label htmlFor={field} className={labelBase}>
                              {field.replace(/([A-Z])/g, ' $1')}
                            </label>

                            <input
                              name={field}
                              id={field}
                              value={(formData as any)[field]}
                              onChange={handleChange}
                              className={inputBase}
                              autoComplete={field === 'address' ? 'off' : undefined}
                              onFocus={() => field === 'address' && streetSugs.length && setShowAddrSugs(true)}
                              onBlur={() => field === 'address' && setTimeout(() => setShowAddrSugs(false), 150)}
                              placeholder={
                                field === 'address'
                                  ? 'Street, area, landmark'
                                  : field === 'city'
                                    ? 'City'
                                    : field === 'state'
                                      ? 'State'
                                      : field === 'country'
                                        ? 'Country'
                                        : 'ZIP / Postal code'
                              }
                            />

                            {field === 'address' && showAddrSugs && streetSugs.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
                                exit={{ opacity: 0, y: 6, transition: { duration: 0.15 } }}
                                className="absolute z-50 w-full mt-1 overflow-hidden bg-white border border-gray-200 shadow-lg rounded-xl top-full"
                              >
                                {streetSugs.map((sug, idx) => (
                                  <motion.button
                                    key={sug.placeId}
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => handlePickAddressSuggestion(sug)}
                                    title={sug.description}
                                    className="w-full px-3 py-2.5 text-left hover:bg-gray-50"
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0, transition: { duration: 0.15, delay: idx * 0.02 } }}
                                  >
                                    <div className="text-sm font-medium text-gray-800">
                                      {sug.structured_formatting.main_text || sug.description}
                                    </div>
                                    {sug.structured_formatting.secondary_text && (
                                      <div className="text-xs text-gray-500">
                                        {sug.structured_formatting.secondary_text}
                                      </div>
                                    )}
                                  </motion.button>
                                ))}
                              </motion.div>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>


                <AnimatePresence mode="wait">
                  {step === 'compliance' && (
                    <motion.div
                      key="step-compliance"
                      variants={stepVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className={`${cardBase} [will-change:transform] absolute inset-0 overflow-y-auto`}
                    >
                      <div className="mb-6">
                        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Compliance</h2>
                        <p className="mt-1 text-sm text-gray-500">Tax & licence details. Required for verification.</p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {['taxId', 'businessLicenseNumber'].map((field) => (
                          <div key={field} className="flex flex-col w-full">
                            <label htmlFor={field} className={labelBase}>
                              {field === 'taxId' ? 'Business EIN / Tax ID' : 'Business Licence'}
                            </label>
                            <input
                              name={field}
                              id={field}
                              value={(formData as any)[field]}
                              onChange={handleChange}
                              className={inputBase}
                              placeholder={field === 'taxId' ? 'e.g., 12-3456789' : 'e.g., BLN-2025-001'}
                            />
                          </div>
                        ))}

                        {/* <div className="flex items-center w-full gap-3 md:col-span-2">
                          <input
                            type="checkbox"
                            id="isFranchise"
                            name="isFranchise"
                            checked={!!formData.isFranchise}
                            onChange={handleChange}
                            className="w-4 h-4"
                          />
                          <label htmlFor="isFranchise" className={labelBase}>
                            Franchise (If any)
                          </label>
                        </div>

                        {formData.isFranchise && (
                          <div className="flex flex-col w-full md:col-span-2">
                            <label htmlFor="franchiseLocation" className={labelBase}>
                              Franchise Location
                            </label>
                            <input
                              id="franchiseLocation"
                              name="franchiseLocation"
                              value={formData.franchiseLocation || ''}
                              onChange={handleChange}
                              className={inputBase}
                              placeholder="e.g., Banjara Hills – Store #12"
                            />
                          </div>
                        )} */}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {step === 'categories' && (
                    <motion.div
                      key="step-categories"
                      variants={stepVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className={`${cardBase} [will-change:transform] absolute inset-0 overflow-y-auto`}
                    >
                      <div className="mb-6">
                        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Categories</h2>
                        <p className="mt-1 text-sm text-gray-500">Choose up to 5 categories that best fit your business.</p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex flex-col w-full md:col-span-2">
                          <label htmlFor="categories" className={labelBase}>
                            Business Categories
                          </label>

                          <select
                            id="selectCategory"
                            onChange={handleCategoryChange}
                            value=""
                            disabled={(selectedCategories.length >= 5) || !formData.listingType || pageLoading}
                            className={inputBase}
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

                          <div className="flex flex-row flex-wrap w-full gap-2 mt-4">
                            {selectedCategories.map((category, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-2 rounded-full bg-gray-100 text-gray-800 px-3 py-1.5 text-sm"
                              >
                                {category.name}
                                <button
                                  onClick={() => handleRemoveCategory(category)}
                                  className="text-gray-500 hover:text-red-600"
                                  aria-label={`Remove ${category.name}`}
                                >
                                  &times;
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            )}
          </div>
        </div>

        {/* ✅ Full-width Plan Section */}
        <AnimatePresence mode="wait">
          {step === 'plan' && (
            <motion.div
              key="step-plan"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full px-4 mt-5 mb-12 sm:px-6 md:px-10 lg:px-20"
            >
              <div className="flex items-start mb-6">
                {/* New Subscription Tab */}
                <motion.h2
                  key="new-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setSelectedTab("new")}
                  className={`mb-6 font-semibold text-gray-800 uppercase cursor-pointer ${selectedTab === "new"
                    ? "text-blue-600 font-bold text-2xl"
                    : "text-gray-400 text-[10px]"
                    }`}
                >
                  Choose a Plan
                </motion.h2>
                {userSubscriptions.length > 0 && (
                  <>
                    <span className="mx-3 text-2xl text-gray-600">/</span>


                    <motion.h2
                      key="existing-tab"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      onClick={() => setSelectedTab("existing")}
                      className={`mb-6 font-semibold text-gray-800 uppercase cursor-pointer ${selectedTab === "existing"
                        ? "text-blue-600 font-bold text-2xl"
                        : "text-gray-400 text-[10px]"
                        }`}
                    >
                      Existing Plan
                    </motion.h2>
                  </>
                )}
              </div>


              <motion.div
                className="flex flex-wrap justify-center w-full gap-6"
                variants={planListVariants}
                initial="initial"
                animate="animate"
              >

                {selectedTab === "existing" ? (
                  // Display existing subscriptions
                  userSubscriptions.map((sub: Subscription) => {
                    const isSelected = selectedPlanId === sub._id;

                    return (
                      <motion.div
                        key={sub._id}
                        variants={planCardVariants}
                        whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                        whileTap={{ scale: 0.98 }}
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
                      </motion.div>
                    );
                  })
                ) : (
                  // Display new subscription plans
                  plans.map((plan) => {
                    const isSelected = selectedPlanId === plan._id;

                    return (
                      <motion.div
                        key={plan._id}
                        variants={planCardVariants}
                        whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                        whileTap={{ scale: 0.98 }}
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
                      </motion.div>
                    );
                  })
                )}
              </motion.div>


              {/* Bottom Right Submit Button */}
              {/* <div className="flex justify-end mt-10">
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
            </div> */}

            </motion.div>
          )}
        </AnimatePresence>

        {/* PROGRESS */}
        <div className="flex items-center gap-2 my-4">
          {STEPS.map((s, i) => (
            <div key={s} className={`h-2 flex-1 rounded ${i <= stepIndex ? 'bg-orange-600' : 'bg-gray-200'}`} />
          ))}
        </div>

        {/* NAV BUTTONS */}
        <div className="flex justify-between mt-10">
          <button
            type="button"
            onClick={goBack}
            disabled={STEPS.indexOf(step) === 0}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded disabled:opacity-50"
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className="px-6 py-2 font-medium text-white bg-orange-600 rounded hover:bg-orange-700 disabled:opacity-50"
          >
            {step === 'plan'
              ? (loading
                ? (selectedTab === 'existing' ? 'Creating…' : 'Submitting…')
                : (selectedTab === 'existing' ? 'Create Business' : 'Submit & Pay'))
              : 'Next'}
          </button>
        </div>
      </div>

    </>
  );
}