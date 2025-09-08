"use client";

import { useBusinessStore } from "@/app/store/businessStore";
import { fetchBusinessBySlug } from "../utils/fetchBusiness";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import LoadingPage from "../components/LoadingPage";
import NotFoundPage from "../components/NotFoundPage";
import { SquarePen } from "lucide-react";
import Image from "next/image";
import { api } from "@/lib/api";
import { toast } from "react-toastify";

type Interval = "day" | "week" | "month" | "year";
type SubStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | "canceled"
  | "paused";

type SubscriptionSummary = {
  id: string; // Stripe subscription id
  planId: string;
  planName: string;
  price: number; // major units
  currency: string; // e.g. USD
  interval: Interval;
  intervalCount: number;
  status: SubStatus;
  currentPeriodEnd: string; // ISO
  cancelAtPeriodEnd: boolean;
};

const currencyFmt = (amount: number, currency = "USD") =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);

const Page = () => {
  const { businessid } = useParams();
  const { business, setBusiness, clearBusiness } = useBusinessStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<any>(null);
  const [gender, setGender] = useState<string | null>(null);

  // --- Subscription state
  const [subLoading, setSubLoading] = useState(false);
  const [subActioning, setSubActioning] = useState(false);
  const [sub, setSub] = useState<SubscriptionSummary | null>(null);

  const customerId = useMemo(() => business?.stripeCustomerId ?? null, [business?.stripeCustomerId]);

  const apiBase = useMemo(() => process.env.NEXT_PUBLIC_API_BASE_URL || "", []);

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    const userGender = localStorage.getItem("user_gender");
    // if you need to check login state, use your real auth; kept minimal here
    setGender(userGender);
  }, []);

  useEffect(() => {
    setProfile({
      firstName: "Marlin",
      lastName: "Doe",
      email: "marlindoe@gmail.com",
      contactNumber: "123 456 7890",
      language: "English",
      minorityType: "Indian",
      address: {
        addressLine: "Lorem Ipsum Dolor Sit Amet",
        city: "Toronto",
        country: "Canada",
        postalCode: "M5V 3L9",
      },
    });

    if (!businessid) return;

    const loadBusiness = async () => {
      setIsLoading(true);
      try {
        if (business && business.slug === businessid) return;
        if (business && business.slug !== businessid) clearBusiness();

        const fetchedBusiness = await fetchBusinessBySlug(businessid as string);
        setBusiness(fetchedBusiness);
      } catch (error) {
        console.error("Error loading business:", error);
        setError("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    loadBusiness();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessid]);

  // --- Load current subscription for this business
  // const loadSubscription = useCallback(async () => {
  //   if (!business?._id) return;
  //   setSubLoading(true);
  //   try {
  //     const { data } = await api.get<{ success: boolean; subscription: SubscriptionSummary | null }>(
  //       "/api/subscriptions/current",
  //       { params: { businessId: business._id } }
  //     );
  //     setSub(data?.subscription ?? null);
  //   } catch (e: any) {
  //     toast.error(e?.response?.data?.message || "Failed to load subscription");
  //     setSub(null);
  //   } finally {
  //     setSubLoading(false);
  //   }
  // }, [business?._id]);

  // useEffect(() => {
  //   loadSubscription();
  // }, [loadSubscription]);

  // --- Load current subscription for this BUSINESS
  const loadSubscription = useCallback(async () => {
    if (!business?._id) return;
    setSubLoading(true);
    try {
      const { data } = await api.get<{ success: boolean; subscription: SubscriptionSummary | null }>(
        `${apiBase}/api/subscriptions/current`,
        { params: { businessId: business._id } }
      );
      setSub(data?.subscription ?? null);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load subscription");
      setSub(null);
    } finally {
      setSubLoading(false);
    }
  }, [apiBase, business?._id]);


  useEffect(() => {
    if (business?._id) loadSubscription();
  }, [business?._id, loadSubscription]);



  const cancelAtEnd = async () => {
    if (!business?._id || !sub) return;
    if (!confirm("Cancel at the end of the current period? You will retain access until it ends.")) return;
    setSubActioning(true);
    try {
      await api.post(`${apiBase}/api/subscriptions/${sub.id}/cancel`, {
        atPeriodEnd: true,
        businessId: business._id,
      });
      toast.success("Your plan will cancel at period end.");
      await loadSubscription();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Could not schedule cancellation");
    } finally {
      setSubActioning(false);
    }
  };

  const cancelNow = async () => {
    if (!business?._id || !sub) return;
    if (!confirm("Cancel immediately? You may lose access right away.")) return;
    setSubActioning(true);
    try {
      await api.post(`${apiBase}/api/subscriptions/${sub.id}/cancel`, {
        atPeriodEnd: true,
        businessId: business._id,
      });
      toast.success("Subscription canceled.");
      await loadSubscription();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Could not cancel subscription");
    } finally {
      setSubActioning(false);
    }
  };

  const resume = async () => {
    if (!business?._id || !sub) return;
    setSubActioning(true);
    try {
      await api.post(`${apiBase}/api/subscriptions/${sub.id}/resume`, { businessId: business._id });
      toast.success("Cancellation removed. Your plan will continue to renew.");
      await loadSubscription();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Could not resume subscription");
    } finally {
      setSubActioning(false);
    }
  };

  const openBillingPortal = async () => {
    if (!business?._id) {
      toast.error("Business not loaded.");
      return;
    }
    setSubActioning(true);
    try {
      const { data } = await api.post<{ url: string }>(
        `${apiBase}/api/billing-portal/session`,
        { businessId: business._id },
        { withCredentials: true }
      );
      if (data?.url) {
        window.open(data.url, "_blank", "noopener,noreferrer");
      } else {
        toast.error("Could not open billing portal");
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Could not open billing portal");
    } finally {
      setSubActioning(false);
    }
  };



  if (isLoading) return <LoadingPage />;
  if (error) return <NotFoundPage />;

  return (
    <div className="flex h-screen bg-[#EBEAE2]">
      <Sidebar
        businessName={business?.businessName}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar setIsSidebarOpen={setIsSidebarOpen} />

        <main className="flex-1 p-4 space-y-6 overflow-y-auto lg:p-6">
          <div className="grid items-start grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Side */}
            <div className="space-y-6 lg:col-span-2">
              {/* Personal Info */}
              <section className="p-4 bg-white rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold heading">Personal Information</h2>
                  <button className="flex gap-2 text-sm text-blue-600 hover:underline text-[14px] items-center">
                    <SquarePen size={14} /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                  <p><strong>First Name :</strong> {profile?.firstName}</p>
                  <p><strong>Last Name :</strong> {profile?.lastName}</p>
                  <p><strong>Email Address :</strong> {profile?.email}</p>
                  <p><strong>Contact Number :</strong> {profile?.contactNumber}</p>
                  <p><strong>Language :</strong> {profile?.language}</p>
                  <p><strong>Minority Type :</strong> {profile?.minorityType}</p>
                </div>
              </section>

              {/* Address */}
              <section className="p-4 bg-white rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold heading">Address</h2>
                  <button className="flex gap-2 text-sm text-blue-600 hover:underline text-[14px] items-center">
                    <SquarePen size={14} /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                  <p><strong>Address :</strong> {profile?.address.addressLine}</p>
                  <p><strong>City :</strong> {profile?.address.city}</p>
                  <p><strong>Country :</strong> {profile?.address.country}</p>
                  <p><strong>Postal Code :</strong> {profile?.address.postalCode}</p>
                </div>
              </section>

              {/* Business Info */}
              <section className="p-4 bg-white rounded-lg shadow">
                <h2 className="pb-2 mb-4 text-lg font-semibold border-b heading">Business Information</h2>

                {/* Inner Card */}
                <div className="flex flex-col md:flex-row p-4 bg-[#FAFAFA] border rounded-lg">
                  {/* Left Side */}
                  <div className="flex flex-col items-center justify-between w-full text-center border-r md:w-1/4 md:pr-4">
                    {/* Logo */}
                    <div className="relative flex flex-col items-center">
                      {business?.logo ? (
                        <img
                          src={business.logo}
                          alt={business.businessName}
                          className="object-contain w-16 h-16 border"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-16 h-16 text-xl font-bold text-gray-700 bg-gray-200 rounded-full">
                          {business?.businessName?.[0] || "B"}
                        </div>
                      )}
                      <div className="flex items-center justify-center mt-2 text-sm text-custom-yellow">
                        ★★★★☆ <span className="ml-1 text-gray-600">{4.5}</span>
                      </div>
                    </div>

                    {/* Edit Business Button */}
                    <button className="flex items-center gap-1 px-3 py-1 mt-4 text-sm text-white bg-orange-500 rounded hover:bg-orange-600">
                      <SquarePen className="w-4 h-4" />
                      <span>Edit Business</span>
                    </button>
                  </div>

                  {/* Right Side - Business Details */}
                  <div className="w-full mt-4 space-y-2 text-sm md:w-3/4 md:pl-4 md:mt-0">
                    <p><strong>Business Name</strong> : {business?.businessName}</p>
                    <p><strong>Description</strong> : {business?.description}</p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <p><strong>Licence Number</strong> : {business?.slug}</p>
                      <p><strong>Business Type</strong> : {business?.listingType}</p>
                      <p><strong>Business Email Address</strong> : {business?.email}</p>
                      <p><strong>Business Contact Number</strong> : {business?.phone}</p>
                      <p><strong>Address</strong> : {business?.address.street}</p>
                      <p><strong>City</strong> : {business?.address.city}</p>
                      <p><strong>State</strong> : {business?.address.state}</p>
                      <p><strong>Country</strong> : {business?.address.country}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Subscription & Billing */}
              <section className="p-4 bg-white rounded-lg shadow">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold heading">Subscription & Billing</h2>
                  <button
                    onClick={openBillingPortal}
                    disabled={subActioning || !business?._id}
                    className="px-3 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    Open Billing Portal
                  </button>
                </div>

                {subLoading ? (
                  <p className="text-sm text-gray-500">Loading subscription…</p>
                ) : !sub ? (
                  <div className="text-sm text-gray-600">
                    <p>No active subscription found.</p>
                    {/* If you have a plan chooser route, link it here */}
                    {/* <Link href={`/partners/${business?.slug}/choose-plan`} className="text-indigo-600 hover:underline">Choose a plan</Link> */}
                  </div>
                ) : (
                  <>
                    <dl className="grid gap-3 text-sm md:grid-cols-2">
                      <div>
                        <dt className="text-gray-500">Plan</dt>
                        <dd className="font-medium">{sub.planName}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Price</dt>
                        <dd className="font-medium">
                          {currencyFmt(sub.price, sub.currency)}{" "}
                          {sub.intervalCount > 1
                            ? `every ${sub.intervalCount} ${sub.interval}s`
                            : `per ${sub.interval}`}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Status</dt>
                        <dd className="font-medium capitalize">
                          {sub.status.replace("_", " ")}
                          {sub.cancelAtPeriodEnd && " (will cancel at period end)"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Renews / Ends</dt>
                        <dd className="font-medium">
                          {new Date(sub.currentPeriodEnd).toLocaleString()}
                        </dd>
                      </div>
                    </dl>

                    <p className="mt-3 text-xs text-gray-500">
                      Subscriptions are auto-renewing by default via Stripe. You can manage your card and invoices in the Billing Portal.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-4">
                      {!sub.cancelAtPeriodEnd && sub.status !== "canceled" && (
                        <>
                          <button
                            onClick={cancelAtEnd}
                            disabled={subActioning}
                            className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                          >
                            Cancel at period end
                          </button>
                          <button
                            onClick={cancelNow}
                            disabled={subActioning}
                            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
                          >
                            Cancel now
                          </button>
                        </>
                      )}

                      {sub.cancelAtPeriodEnd && sub.status !== "canceled" && (
                        <button
                          onClick={resume}
                          disabled={subActioning}
                          className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50"
                        >
                          Resume subscription
                        </button>
                      )}
                    </div>
                  </>
                )}
              </section>

              {/* Buttons */}
              <div className="flex gap-4">
                <button className="px-4 py-2 text-white bg-orange-600 rounded hover:bg-orange-700">
                  Save Changes
                </button>
                <button className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">
                  Delete Profile
                </button>
              </div>
            </div>

            {/* Right Side Profile Card */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded-lg shadow">
              <div className="relative">
                <div className="p-[2px] rounded-full bg-white border border-custom-blue">
                  <Image
                    src={gender === "female" ? "/female-avatar.png" : "/male-avatar.png"}
                    width={80}
                    height={80}
                    alt="Profile"
                    className="border border-gray-300 rounded-full"
                  />
                </div>
              </div>
              <h3 className="mt-3 text-lg font-semibold">
                {profile?.firstName} {profile?.lastName}
              </h3>
              <p className="text-sm text-gray-600">{profile?.email}</p>
              <p className="text-sm text-gray-600">
                {profile?.address.city}, {profile?.address.country}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
