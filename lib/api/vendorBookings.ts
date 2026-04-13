export type VendorListingType = "service" | "food";

export type VendorBooking = {
  _id: string;
  bookingType?: string;
  serviceTitle?: string;
  serviceId?: string;
  businessId?: string;
  status: string;
  paymentStatus?: string;
  paymentLink?: string;
  paymentRequestedAt?: string;
  vendorDecisionNote?: string;
  notes?: string;
  date?: string;
  time?: string;
  slot?: string;
  createdAt: string;
  updatedAt?: string;
  services?: string[];
  serviceItems?: string[];
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  customerId?: {
    _id?: string;
    name?: string;
    email?: string;
  };
};

type VendorBookingsResponse = {
  success?: boolean;
  bookings?: VendorBooking[];
  message?: string;
  error?: string;
};

type VendorBookingActionResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
}

function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function buildHeaders() {
  const token = getAuthToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getVendorBookingsBasePath(listingType: VendorListingType) {
  return `/api/bookings/vendor/${listingType}`;
}

function getBookingActionBasePath(listingType: VendorListingType, bookingId: string) {
  return `/api/bookings/${listingType}/${bookingId}`;
}

async function parseJson<T>(response: Response) {
  return (await response.json().catch(() => null)) as T | null;
}

export async function fetchVendorBookings(
  listingType: VendorListingType,
  businessId: string
) {
  const response = await fetch(
    `${getApiBaseUrl()}${getVendorBookingsBasePath(listingType)}?businessId=${encodeURIComponent(
      businessId
    )}`,
    {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(),
      cache: "no-store",
    }
  );

  const payload = await parseJson<VendorBookingsResponse>(response);

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || payload?.error || "Failed to load bookings.");
  }

  return Array.isArray(payload?.bookings) ? payload.bookings : [];
}

export async function requestVendorBookingPayment(
  listingType: VendorListingType,
  bookingId: string,
  payload: {
    paymentLink: string;
    note: string;
  }
) {
  const response = await fetch(
    `${getApiBaseUrl()}${getBookingActionBasePath(listingType, bookingId)}/request-payment`,
    {
      method: "PUT",
      credentials: "include",
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    }
  );

  const data = await parseJson<VendorBookingActionResponse>(response);

  if (!response.ok || data?.success === false) {
    throw new Error(data?.message || data?.error || "Failed to request payment.");
  }
}

export async function approveVendorBooking(
  listingType: VendorListingType,
  bookingId: string,
  note: string
) {
  const response = await fetch(
    `${getApiBaseUrl()}${getBookingActionBasePath(listingType, bookingId)}/approve`,
    {
      method: "PUT",
      credentials: "include",
      headers: buildHeaders(),
      body: JSON.stringify({ note }),
    }
  );

  const data = await parseJson<VendorBookingActionResponse>(response);

  if (!response.ok || data?.success === false) {
    throw new Error(data?.message || data?.error || "Failed to approve booking.");
  }
}

export async function rejectVendorBooking(
  listingType: VendorListingType,
  bookingId: string,
  note: string
) {
  const response = await fetch(
    `${getApiBaseUrl()}${getBookingActionBasePath(listingType, bookingId)}/reject`,
    {
      method: "PUT",
      credentials: "include",
      headers: buildHeaders(),
      body: JSON.stringify({ note }),
    }
  );

  const data = await parseJson<VendorBookingActionResponse>(response);

  if (!response.ok || data?.success === false) {
    throw new Error(data?.message || data?.error || "Failed to reject booking.");
  }
}
