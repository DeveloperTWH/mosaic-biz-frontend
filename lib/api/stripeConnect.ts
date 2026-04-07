const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const jsonHeaders = {
  "Content-Type": "application/json",
};

const isObject = (value: unknown): value is Record<string, any> =>
  typeof value === "object" && value !== null;

const getAuthHeaders = () => {
  if (typeof window === "undefined") {
    return jsonHeaders;
  }

  const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
  if (!token) {
    return jsonHeaders;
  }

  return {
    ...jsonHeaders,
    Authorization: `Bearer ${token}`,
  };
};

const pickFirstString = (...values: unknown[]) =>
  values.find((value) => typeof value === "string" && value.trim().length > 0) as string | undefined;

const pickFirstBoolean = (...values: unknown[]) =>
  values.find((value) => typeof value === "boolean") as boolean | undefined;

const toStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

export type StripeConnectStatus = {
  accountId: string | null;
  accountLinkUrl: string | null;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  isConnected: boolean;
  onboardingStatus: string | null;
  capabilities: Record<string, string>;
  currentlyDue: string[];
  eventuallyDue: string[];
  disabledReason: string | null;
  raw: any;
};

export const normalizeStripeConnectStatus = (payload: any): StripeConnectStatus => {
  const source = isObject(payload?.data) ? payload.data : payload;
  const account = isObject(source?.account) ? source.account : {};
  const requirements = isObject(source?.requirements) ? source.requirements : {};

  const accountId =
    pickFirstString(
      source?.accountId,
      source?.stripeConnectAccountId,
      source?.stripeAccountId,
      account?.id
    ) || null;

  const accountLinkUrl =
    pickFirstString(
      source?.url,
      source?.link,
      source?.accountLink,
      source?.accountLinkUrl,
      account?.url
    ) || null;

  const chargesEnabled = Boolean(
    pickFirstBoolean(source?.chargesEnabled, account?.charges_enabled, account?.chargesEnabled)
  );
  const payoutsEnabled = Boolean(
    pickFirstBoolean(source?.payoutsEnabled, account?.payouts_enabled, account?.payoutsEnabled)
  );
  const detailsSubmitted = Boolean(
    pickFirstBoolean(
      source?.detailsSubmitted,
      account?.details_submitted,
      account?.detailsSubmitted,
      source?.onboardingStatus === "completed"
    )
  );
  const explicitlyConnected = pickFirstBoolean(source?.isConnected, source?.connected, source?.active);
  const onboardingStatus = pickFirstString(source?.onboardingStatus, source?.status) || null;
  const capabilities = isObject(source?.capabilities) ? source.capabilities : {};

  return {
    accountId,
    accountLinkUrl,
    chargesEnabled,
    payoutsEnabled,
    detailsSubmitted,
    isConnected: explicitlyConnected ?? onboardingStatus === "completed" ?? (Boolean(accountId) && payoutsEnabled),
    onboardingStatus,
    capabilities,
    currentlyDue: toStringArray(source?.currentlyDue ?? requirements?.currently_due ?? requirements?.currentlyDue),
    eventuallyDue: toStringArray(source?.eventuallyDue ?? requirements?.eventually_due ?? requirements?.eventuallyDue),
    disabledReason:
      pickFirstString(
        source?.disabledReason,
        requirements?.disabled_reason,
        requirements?.disabledReason
      ) || null,
    raw: payload,
  };
};

export async function getBusinessConnectStatus(businessId: string) {
  const response = await fetch(`${BASE_URL}/api/connect/${businessId}/status`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Failed to load Stripe Connect status");
  }

  return normalizeStripeConnectStatus(data);
}

export async function createBusinessConnectAccountLink(businessId: string) {
  const response = await fetch(`${BASE_URL}/api/connect/${businessId}/account-link`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Failed to create Stripe Connect account link");
  }

  const url =
    pickFirstString(
      data?.url,
      data?.link,
      data?.accountLink,
      data?.accountLinkUrl,
      data?.data?.url,
      data?.data?.link,
      data?.data?.accountLink,
      data?.data?.accountLinkUrl
    ) || null;

  if (!url) {
    throw new Error("Stripe onboarding link was not returned by the server");
  }

  return {
    url,
    raw: data,
  };
}
