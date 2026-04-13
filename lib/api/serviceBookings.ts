export type CreateServiceBookingInput = {
  serviceId: string;
  name: string;
  email: string;
  phone: string;
  services: string[];
  date: string;
  slot: string;
};

type ServiceBookingResponse = {
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

export async function createServiceBooking(input: CreateServiceBookingInput) {
  const token = getAuthToken();
  const response = await fetch(
    `${getApiBaseUrl()}/api/bookings/service/${input.serviceId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        phone: input.phone,
        services: input.services,
        date: input.date,
        slot: input.slot,
      }),
    }
  );

  const payload = (await response.json().catch(() => null)) as ServiceBookingResponse | null;

  if (response.status === 401) {
    throw new Error("Please sign in as a customer to book this service.");
  }

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || payload?.error || "Failed to submit booking request.");
  }

  return payload;
}
