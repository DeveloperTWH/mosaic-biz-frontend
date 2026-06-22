import type { Service, ServiceChild, ServicePublication } from "@/types/service";
import { ApiClientError } from "./errors";
import { apiRequest } from "./httpClient";
import { normalizeFieldErrors } from "./parseResponse";

export type { ServicePublication };

export type ServiceChildInput = {
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  image?: string;
  images?: string[];
};

export type ServiceCategoryInput = {
  categoryId: string | { _id: string; name?: string };
  subcategoryIds?: string[];
};

export type ServiceFormState = {
  title: string;
  description: string;
  price: number;
  duration: string;
  services: ServiceChildInput[];
  categories: ServiceCategoryInput[];
  coverImage: string;
  images: string[];
  videos: string[];
  features: string[];
  amenities: { label: string; available: boolean }[];
  businessHours: { day: string; hours: string }[];
  location: { type: "Point"; coordinates: [number, number] };
  contact: { phone: string; email: string; address: string; website?: string };
  faq: { question: string; answer: string }[];
  maxBookingsPerSlot: number;
  isPublished: boolean;
};

export type ServiceMutationPayload = Omit<ServiceFormState, "isPublished"> & {
  businessId: string;
  isPublished: boolean;
};

export type ServiceMutationResponse = {
  success?: boolean;
  message?: string;
  service?: Service;
  data?: { service?: Service; publication?: ServicePublication };
  publication?: ServicePublication;
};

export type ServiceMutationResult = {
  service: Service;
  publication?: ServicePublication;
  message?: string;
};

export type ServiceInventoryStatus =
  | "draft"
  | "published"
  | "published_ineligible"
  | "publication_failed";

export type PublicationSuccessMessage = {
  toast: string;
  detail?: string;
};

export type PrivateServicesListResponse = {
  success?: boolean;
  data: Service[];
  total: number;
  totalPages: number;
  unpublishedCount: number;
};

export type PublicListingVerification = {
  visible: boolean;
  status: number;
};

const DURATION_OPTIONS_MINUTES = [15, 30, 45, 60, 90, 120] as const;

export function parseDurationToMinutes(duration: unknown): number {
  if (typeof duration === "number" && Number.isFinite(duration)) {
    return Math.max(1, Math.round(duration));
  }
  if (typeof duration !== "string") return 60;
  const match = duration.match(/(\d+(\.\d+)?)/);
  if (!match) return 60;
  const value = parseFloat(match[1]);
  if (!Number.isFinite(value)) return 60;
  return /hour/i.test(duration) ? Math.max(1, Math.round(value * 60)) : Math.max(1, Math.round(value));
}

export function formatDurationFromMinutes(minutes: number): string {
  if (minutes >= 60 && minutes % 60 === 0) {
    const hours = minutes / 60;
    return hours === 1 ? "1 hour" : `${hours} hours`;
  }
  return `${minutes} min`;
}

export function normalizeChildFromApi(child: Partial<ServiceChild> & { duration?: string }): ServiceChildInput {
  const durationMinutes =
    typeof child.durationMinutes === "number" && child.durationMinutes > 0
      ? child.durationMinutes
      : parseDurationToMinutes(child.duration);

  return {
    name: String(child.name ?? "").trim(),
    description: String(child.description ?? "").trim(),
    durationMinutes,
    price: Number(child.price) || 0,
    image: child.image,
    images: child.images,
  };
}

export function serializeServiceChildren(
  children: ServiceChildInput[],
  parentFallback?: { price?: number; duration?: string }
): ServiceChildInput[] {
  const parentMinutes = parseDurationToMinutes(parentFallback?.duration);
  const parentPrice = Number(parentFallback?.price) || 0;

  return children
    .map((child) => {
      const name = String(child.name ?? "").trim();
      if (!name) return null;

      const durationMinutes =
        typeof child.durationMinutes === "number" && child.durationMinutes > 0
          ? Math.round(child.durationMinutes)
          : parentMinutes;

      const price =
        typeof child.price === "number" && child.price > 0
          ? child.price
          : parentPrice;

      const serialized: ServiceChildInput = {
        name,
        description: String(child.description ?? "").trim(),
        durationMinutes,
        price,
      };

      if (child.image?.trim()) serialized.image = child.image.trim();
      if (child.images?.length) serialized.images = child.images;

      return serialized;
    })
    .filter((entry): entry is ServiceChildInput => entry !== null);
}

export function normalizeCategoriesForPayload(
  categories: ServiceCategoryInput[]
): ServiceMutationPayload["categories"] {
  return categories.map((cat) => ({
    categoryId: typeof cat.categoryId === "string" ? cat.categoryId : cat.categoryId._id,
    subcategoryIds: cat.subcategoryIds ?? [],
  }));
}

export function serializeServicePayload(
  form: ServiceFormState,
  options: { businessId: string; publish: boolean }
): ServiceMutationPayload {
  const services = serializeServiceChildren(form.services, {
    price: form.price,
    duration: form.duration,
  });

  return {
    title: form.title.trim(),
    description: form.description.trim(),
    price: Number(form.price) || 0,
    duration: form.duration.trim() || formatDurationFromMinutes(60),
    services,
    categories: normalizeCategoriesForPayload(form.categories),
    coverImage: form.coverImage,
    images: form.images,
    videos: form.videos,
    features: form.features,
    amenities: form.amenities,
    businessHours: form.businessHours,
    location: form.location,
    contact: form.contact,
    faq: form.faq,
    maxBookingsPerSlot: form.maxBookingsPerSlot,
    isPublished: options.publish,
    businessId: options.businessId,
  };
}

export function parseServiceMutationResponse(body: ServiceMutationResponse): ServiceMutationResult {
  const service = body.service ?? body.data?.service;
  if (!service?._id) {
    throw new ApiClientError({
      kind: "malformed",
      message: body.message || "Unexpected service response from server.",
      payload: body,
    });
  }

  return {
    service,
    publication: body.publication ?? body.data?.publication,
    message: body.message,
  };
}

export function getInventoryStatus(service: Service): ServiceInventoryStatus {
  const publication = service.publication;

  if (!service.isPublished) {
    return "draft";
  }

  if (publication?.publicBlockers?.length) {
    return "publication_failed";
  }

  if (
    publication?.publicEligibility === "business_inactive" ||
    (publication?.isPubliclyVisible === false && service.isPublished)
  ) {
    return "published_ineligible";
  }

  if (publication?.isPubliclyVisible === true || publication?.isPubliclyVisible === undefined) {
    return "published";
  }

  return "published_ineligible";
}

export function getInventoryStatusLabel(status: ServiceInventoryStatus): string {
  switch (status) {
    case "draft":
      return "Draft";
    case "published":
      return "Published";
    case "published_ineligible":
      return "Published but not publicly eligible";
    case "publication_failed":
      return "Publication failed";
    default:
      return "Unknown";
  }
}

export function getInventoryStatusClass(status: ServiceInventoryStatus): string {
  switch (status) {
    case "draft":
      return "bg-yellow-100 text-yellow-800";
    case "published":
      return "bg-green-100 text-green-700";
    case "published_ineligible":
      return "bg-amber-100 text-amber-800";
    case "publication_failed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function getInventoryStatusDetail(service: Service): string | null {
  const status = getInventoryStatus(service);
  if (status === "draft" || status === "published") {
    return null;
  }

  const publication = service.publication;
  if (publication?.nextAction?.trim()) {
    return publication.nextAction.trim();
  }
  if (publication?.publicBlockers?.length) {
    return publication.publicBlockers.join(" · ");
  }

  if (status === "published_ineligible") {
    return "Published, but not visible on the public marketplace yet.";
  }

  if (status === "publication_failed") {
    return "Publication could not be completed. Review requirements and try again.";
  }

  return null;
}

export function canShowPublicListingLink(service: Service): boolean {
  const status = getInventoryStatus(service);
  if (status !== "published") return false;
  if (service.publication?.isPubliclyVisible === false) return false;
  return true;
}

export function getPublicationSuccessMessage(
  result: ServiceMutationResult,
  options: { publish: boolean; publicVisible?: boolean }
): PublicationSuccessMessage {
  if (!options.publish) {
    return {
      toast: "Draft saved. This service is not visible to customers yet.",
    };
  }

  const publication = result.publication;

  if (
    publication?.publicEligibility === "business_inactive" ||
    (publication?.isPubliclyVisible === false && result.service.isPublished)
  ) {
    return {
      toast:
        "Your service was saved, but your business is not currently eligible for public display.",
      detail: publication?.nextAction || publication?.publicBlockers?.join(" "),
    };
  }

  if (options.publicVisible === false) {
    return {
      toast: "Service saved, but public listing could not be verified yet.",
      detail:
        publication?.nextAction ||
        publication?.publicBlockers?.join(" ") ||
        "Check publication requirements and try again.",
    };
  }

  return {
    toast: "Service published and visible to customers.",
  };
}

export function validateServiceForPublish(form: ServiceFormState): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.title.trim()) errors.title = "Title is required to publish.";
  if (!form.description.trim()) errors.description = "Description is required to publish.";

  if (!form.services.length) {
    errors.services = "Add at least one service option before publishing.";
  }

  form.services.forEach((child, index) => {
    if (!child.name?.trim()) {
      errors[`services.${index}.name`] = "Name is required.";
    }
    if (!child.durationMinutes || child.durationMinutes < 1) {
      errors[`services.${index}.durationMinutes`] = "Duration is required.";
    }
    if (!child.price || child.price <= 0) {
      errors[`services.${index}.price`] = "Price must be greater than 0.";
    }
  });

  return errors;
}

export function mapApiFieldErrorsToForm(
  fieldErrors: Record<string, string | string[]> | undefined
): Record<string, string> {
  if (!fieldErrors) return {};
  const mapped: Record<string, string> = {};
  for (const [key, value] of Object.entries(fieldErrors)) {
    mapped[key] = Array.isArray(value) ? value[0] ?? "Invalid value" : value;
  }
  return mapped;
}

export function mergeFieldErrors(
  ...sources: Array<Record<string, string> | undefined>
): Record<string, string> {
  return Object.assign({}, ...sources.filter(Boolean));
}

export function createEmptyChildService(): ServiceChildInput {
  return {
    name: "",
    description: "",
    durationMinutes: 30,
    price: 0,
  };
}

export { DURATION_OPTIONS_MINUTES };

export function mapServiceToFormState(service: Service): ServiceFormState {
  return {
    title: service.title || "",
    description: service.description || "",
    price: Number(service.price) || 0,
    duration: service.duration || "",
    services: service.services?.length
      ? service.services.map((child) => normalizeChildFromApi(child))
      : [createEmptyChildService()],
    categories: service.categories || [],
    coverImage: service.coverImage || "",
    images: service.images || [],
    videos: service.videos || [],
    features: service.features?.length ? service.features : [""],
    amenities: service.amenities?.length ? service.amenities : [],
    businessHours: service.businessHours?.length ? service.businessHours : [],
    location: service.location || { type: "Point", coordinates: [0, 0] },
    contact: {
      phone: service.contact?.phone || "",
      email: service.contact?.email || "",
      address: service.contact?.address || "",
      website: service.contact?.website || "",
    },
    faq: service.faq?.length ? service.faq : [{ question: "", answer: "" }],
    maxBookingsPerSlot: service.maxBookingsPerSlot || 1,
    isPublished: Boolean(service.isPublished),
  };
}

export async function createService(payload: ServiceMutationPayload): Promise<ServiceMutationResult> {
  const body = await apiRequest<ServiceMutationResponse>("/api/service", {
    method: "POST",
    body: payload,
    credentials: "include",
  });

  if (!body) {
    throw new ApiClientError({
      kind: "malformed",
      message: "Empty response from service create.",
    });
  }

  return parseServiceMutationResponse(body);
}

export async function updateService(
  serviceId: string,
  payload: ServiceMutationPayload
): Promise<ServiceMutationResult> {
  const body = await apiRequest<ServiceMutationResponse>(`/api/service/${serviceId}`, {
    method: "PUT",
    body: payload,
    credentials: "include",
  });

  if (!body) {
    throw new ApiClientError({
      kind: "malformed",
      message: "Empty response from service update.",
    });
  }

  return parseServiceMutationResponse(body);
}

export async function getServiceById(serviceId: string): Promise<Service> {
  const body = await apiRequest<{ service?: Service; data?: Service }>(`/api/service/${serviceId}`, {
    credentials: "include",
  });

  const service = (body as { service?: Service })?.service ?? (body as Service | null);
  if (!service || typeof service !== "object" || !("_id" in service)) {
    throw new ApiClientError({
      kind: "malformed",
      message: "Could not load service details.",
    });
  }

  return service;
}

export async function publishService(
  serviceId: string,
  form: ServiceFormState,
  businessId: string
): Promise<ServiceMutationResult> {
  const payload = serializeServicePayload(form, { businessId, publish: true });
  return updateService(serviceId, payload);
}

export async function unpublishService(
  serviceId: string,
  form: ServiceFormState,
  businessId: string
): Promise<ServiceMutationResult> {
  const payload = serializeServicePayload(form, { businessId, publish: false });
  return updateService(serviceId, payload);
}

export async function deleteService(serviceId: string): Promise<void> {
  await apiRequest(`/api/service/delete-service/${serviceId}`, {
    method: "DELETE",
    credentials: "include",
  });
}

export async function listPrivateServices(
  businessId: string,
  page = 1,
  limit = 10
): Promise<PrivateServicesListResponse> {
  const body = await apiRequest<PrivateServicesListResponse>(
    `/api/private/services/list?businessId=${encodeURIComponent(businessId)}&page=${page}&limit=${limit}`,
    { credentials: "include" }
  );

  if (!body || !Array.isArray(body.data)) {
    throw new ApiClientError({
      kind: "malformed",
      message: "Unexpected services list response.",
    });
  }

  return body;
}

export async function verifyPublicListing(serviceId: string): Promise<PublicListingVerification> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "")}/api/public/services/${serviceId}`,
      { credentials: "include" }
    );
    return { visible: res.ok, status: res.status };
  } catch {
    return { visible: false, status: 0 };
  }
}

export function extractFieldErrorsFromError(error: unknown): Record<string, string> {
  if (error instanceof ApiClientError) {
    return mapApiFieldErrorsToForm(error.fieldErrors ?? normalizeFieldErrors(error.payload ?? null));
  }
  return {};
}

export function getPublicServiceUrl(serviceId: string): string {
  return `/vendor-profile/service-vendor/${serviceId}`;
}
