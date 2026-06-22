import { ApiClientError } from "./errors";
import { apiRequest, apiRequestEnvelope } from "./httpClient";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

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
  raw: unknown;
};

export const normalizeStripeConnectStatus = (payload: unknown): StripeConnectStatus => {
  const root = isObject(payload) ? payload : {};
  const source = isObject(root.data) ? root.data : root;
  const account = isObject(source.account) ? source.account : {};
  const requirements = isObject(source.requirements) ? source.requirements : {};

  const accountId =
    pickFirstString(
      source.accountId,
      source.stripeConnectAccountId,
      source.stripeAccountId,
      account.id
    ) || null;

  const accountLinkUrl =
    pickFirstString(
      source.url,
      source.link,
      source.accountLink,
      source.accountLinkUrl,
      account.url
    ) || null;

  const chargesEnabled = Boolean(
    pickFirstBoolean(source.chargesEnabled, account.charges_enabled, account.chargesEnabled)
  );
  const payoutsEnabled = Boolean(
    pickFirstBoolean(source.payoutsEnabled, account.payouts_enabled, account.payoutsEnabled)
  );
  const detailsSubmitted = Boolean(
    pickFirstBoolean(
      source.detailsSubmitted,
      account.details_submitted,
      account.detailsSubmitted,
      source.onboardingStatus === "completed"
    )
  );
  const explicitlyConnected = pickFirstBoolean(source.isConnected, source.connected, source.active);
  const onboardingStatus = pickFirstString(source.onboardingStatus, source.status) || null;
  const capabilities = isObject(source.capabilities)
    ? (source.capabilities as Record<string, string>)
    : {};

  return {
    accountId,
    accountLinkUrl,
    chargesEnabled,
    payoutsEnabled,
    detailsSubmitted,
    isConnected:
      explicitlyConnected ??
      (onboardingStatus === "completed" || (Boolean(accountId) && payoutsEnabled)),
    onboardingStatus,
    capabilities,
    currentlyDue: toStringArray(
      source.currentlyDue ?? requirements.currently_due ?? requirements.currentlyDue
    ),
    eventuallyDue: toStringArray(
      source.eventuallyDue ?? requirements.eventually_due ?? requirements.eventuallyDue
    ),
    disabledReason:
      pickFirstString(
        source.disabledReason,
        requirements.disabled_reason,
        requirements.disabledReason
      ) || null,
    raw: payload,
  };
};

function wrapConnectError(error: unknown, fallback: string): never {
  if (error instanceof ApiClientError) {
    throw error;
  }
  throw new ApiClientError({
    kind: "network",
    message: error instanceof Error ? error.message : fallback,
    cause: error,
    isJson: false,
  });
}

export async function loadActiveBusinessId(preferredId?: string | null): Promise<string> {
  if (preferredId?.trim()) {
    return preferredId.trim();
  }

  try {
    const body = await apiRequest<{ businesses?: Array<{ _id?: string; isActive?: boolean }> }>(
      "/api/business/my"
    );
    const businesses = Array.isArray(body?.businesses) ? body.businesses : [];

    const currentBusiness =
      businesses.find((item) => item.isActive) ?? businesses[0] ?? null;

    if (!currentBusiness?._id) {
      throw new ApiClientError({
        kind: "notFound",
        message: "No business found for this account",
        status: 404,
      });
    }

    return currentBusiness._id;
  } catch (error) {
    wrapConnectError(error, "Failed to load your business");
  }
}

export async function getBusinessConnectStatus(businessId: string): Promise<StripeConnectStatus> {
  try {
    const envelope = await apiRequestEnvelope(
      `/api/connect/${encodeURIComponent(businessId)}/status`,
      { bearer: true }
    );
    return normalizeStripeConnectStatus(envelope);
  } catch (error) {
    wrapConnectError(error, "Failed to load Stripe Connect status");
  }
}

export async function createBusinessConnectAccountLink(businessId: string): Promise<{ url: string; raw: unknown }> {
  try {
    const envelope = await apiRequestEnvelope(
      `/api/connect/${encodeURIComponent(businessId)}/account-link`,
      {
        method: "POST",
        bearer: true,
      }
    );

    if (!envelope) {
      throw new ApiClientError({
        kind: "malformed",
        message: "Stripe onboarding link was not returned by the server",
      });
    }

    const url =
      pickFirstString(
        (envelope as { url?: string }).url,
        (envelope as { link?: string }).link,
        (envelope as { accountLink?: string }).accountLink,
        (envelope as { accountLinkUrl?: string }).accountLinkUrl,
        (envelope.data as { url?: string } | undefined)?.url,
        (envelope.data as { link?: string } | undefined)?.link,
        (envelope.data as { accountLink?: string } | undefined)?.accountLink,
        (envelope.data as { accountLinkUrl?: string } | undefined)?.accountLinkUrl
      ) || null;

    if (!url) {
      throw new ApiClientError({
        kind: "malformed",
        message: "Stripe onboarding link was not returned by the server",
        payload: envelope,
      });
    }

    return { url, raw: envelope };
  } catch (error) {
    wrapConnectError(error, "Failed to create Stripe Connect account link");
  }
}
