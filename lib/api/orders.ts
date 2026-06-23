import { ApiClientError, getUserSafeMessage } from "./errors";
import {
  getCheckoutVendorEligibilityMessage,
  isVendorEligibilityCheckoutError,
  logCheckoutEligibilityFailure,
} from "@/lib/marketplace/businessEligibility";
import { apiRequest } from "./httpClient";

export type OrderLineItem = {
  productId: string;
  variantId: string;
  size: string;
  quantity: number;
  price: number;
};

export type ShippingAddress = {
  fullName?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  [key: string]: unknown;
};

export type InitiateOrderPayload = {
  items: OrderLineItem[];
  shippingAddress: ShippingAddress;
  userNote?: string;
  selectedDeliverySpeed?: string;
};

export type InitiateOrderResult = {
  orderId: string;
  groupOrderId?: string;
  clientSecret?: string;
};

export async function initiateOrder(payload: InitiateOrderPayload): Promise<InitiateOrderResult> {
  const body = await apiRequest<InitiateOrderResult>("/api/orders/initiate", {
    method: "POST",
    body: payload,
  });

  if (!body?.orderId) {
    throw new ApiClientError({
      kind: "malformed",
      message: "Order initiation response was missing orderId.",
      payload: body as import("./errors").ApiErrorPayload,
    });
  }

  return body;
}

export function getUserSafeOrderErrorMessage(
  error: unknown,
  options?: { vendorName?: string }
): string {
  if (error instanceof ApiClientError) {
    if (error.kind === "forbidden" || error.kind === "validation") {
      const raw = error.message || "";
      if (isVendorEligibilityCheckoutError(raw)) {
        logCheckoutEligibilityFailure({
          message: raw,
          businessName: options?.vendorName ?? null,
          source: "orders.initiate",
        });
        return getCheckoutVendorEligibilityMessage(raw, options?.vendorName);
      }

      if (error.kind === "forbidden") {
        return error.message || "Checkout is not available for this account.";
      }

      return error.message || "Please review your cart and shipping details.";
    }
    if (error.kind === "paymentPending") {
      return error.message || "Payment is still processing for a prior step.";
    }
  }

  return getUserSafeMessage(error, "Failed to initiate order. Please try again.");
}
