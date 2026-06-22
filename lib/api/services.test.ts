import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createEmptyChildService,
  getInventoryStatus,
  getInventoryStatusDetail,
  getInventoryStatusLabel,
  getPublicationSuccessMessage,
  getPublicServiceUrl,
  normalizeChildFromApi,
  parseDurationToMinutes,
  parseServiceMutationResponse,
  serializeServiceChildren,
  serializeServicePayload,
  validateServiceForPublish,
} from "./services";
import type { ServiceFormState } from "./services";

const baseForm: ServiceFormState = {
  title: "Salon Services",
  description: "Professional salon services",
  price: 25,
  duration: "30 min",
  services: [
    {
      name: "Haircut",
      description: "Standard cut",
      durationMinutes: 30,
      price: 25,
    },
  ],
  categories: [{ categoryId: "cat1", subcategoryIds: [] }],
  coverImage: "https://example.com/cover.jpg",
  images: [],
  videos: [],
  features: ["Walk-ins welcome"],
  amenities: [{ label: "WiFi", available: true }],
  businessHours: [{ day: "Monday", hours: "09:00 - 17:00" }],
  location: { type: "Point", coordinates: [-76.2, 36.8] },
  contact: { phone: "555", email: "a@b.com", address: "123 Main" },
  faq: [{ question: "Q", answer: "A" }],
  maxBookingsPerSlot: 1,
  isPublished: false,
};

describe("parseDurationToMinutes", () => {
  it("parses minute strings", () => {
    assert.equal(parseDurationToMinutes("30 min"), 30);
    assert.equal(parseDurationToMinutes("1 hour"), 60);
  });
});

describe("serializeServiceChildren", () => {
  it("never sends name-only children", () => {
    const children = serializeServiceChildren([{ name: "Cut", description: "", durationMinutes: 0, price: 0 }], {
      price: 40,
      duration: "45 min",
    });

    assert.equal(children.length, 1);
    assert.equal(children[0].name, "Cut");
    assert.equal(children[0].durationMinutes, 45);
    assert.equal(children[0].price, 40);
  });

  it("filters empty child names", () => {
    const children = serializeServiceChildren([
      { name: "  ", description: "", durationMinutes: 30, price: 10 },
      { name: "Color", description: "", durationMinutes: 60, price: 80 },
    ]);
    assert.equal(children.length, 1);
    assert.equal(children[0].name, "Color");
  });
});

describe("serializeServicePayload", () => {
  it("sets isPublished from publish flag", () => {
    const draft = serializeServicePayload(baseForm, { businessId: "biz1", publish: false });
    const published = serializeServicePayload(baseForm, { businessId: "biz1", publish: true });

    assert.equal(draft.isPublished, false);
    assert.equal(published.isPublished, true);
    assert.equal(draft.businessId, "biz1");
    assert.equal(published.services[0].price, 25);
  });
});

describe("parseServiceMutationResponse", () => {
  it("reads service and publication metadata", () => {
    const result = parseServiceMutationResponse({
      success: true,
      service: {
        _id: "svc1",
        title: "Salon",
        isPublished: true,
      } as never,
      publication: {
        isPublished: true,
        isPubliclyVisible: true,
        publicEligibility: "eligible",
      },
    });

    assert.equal(result.service._id, "svc1");
    assert.equal(result.publication?.isPubliclyVisible, true);
  });
});

describe("getInventoryStatus", () => {
  it("returns draft for unpublished services", () => {
    assert.equal(getInventoryStatus({ isPublished: false } as never), "draft");
  });

  it("returns published_ineligible when business inactive", () => {
    assert.equal(
      getInventoryStatus({
        isPublished: true,
        publication: {
          isPublished: true,
          isPubliclyVisible: false,
          publicEligibility: "business_inactive",
        },
      } as never),
      "published_ineligible"
    );
  });
});

describe("getPublicationSuccessMessage", () => {
  it("uses draft copy for unpublished saves", () => {
    const message = getPublicationSuccessMessage(
      { service: { _id: "1", isPublished: false } as never },
      { publish: false }
    );
    assert.match(message.toast, /Draft saved/i);
  });

  it("does not claim public visibility when probe fails", () => {
    const message = getPublicationSuccessMessage(
      {
        service: { _id: "1", isPublished: true } as never,
        publication: { isPublished: true, isPubliclyVisible: true },
      },
      { publish: true, publicVisible: false }
    );
    assert.match(message.toast, /could not be verified/i);
  });

  it("confirms public visibility when verified", () => {
    const message = getPublicationSuccessMessage(
      {
        service: { _id: "1", isPublished: true } as never,
        publication: { isPublished: true, isPubliclyVisible: true },
      },
      { publish: true, publicVisible: true }
    );
    assert.match(message.toast, /visible to customers/i);
  });
});

describe("validateServiceForPublish", () => {
  it("requires child price and duration", () => {
    const errors = validateServiceForPublish({
      ...baseForm,
      services: [{ ...createEmptyChildService(), name: "Cut", price: 0, durationMinutes: 0 }],
    });

    assert.ok(errors["services.0.price"]);
    assert.ok(errors["services.0.durationMinutes"]);
  });
});

describe("normalizeChildFromApi", () => {
  it("maps legacy duration strings to minutes", () => {
    const child = normalizeChildFromApi({ name: "Spa", duration: "90 minutes", price: 50 });
    assert.equal(child.durationMinutes, 90);
    assert.equal(child.price, 50);
  });
});

describe("getInventoryStatusLabel", () => {
  it("labels draft and published states", () => {
    assert.equal(getInventoryStatusLabel("draft"), "Draft");
    assert.equal(getInventoryStatusLabel("published"), "Published");
  });
});

describe("getInventoryStatusDetail", () => {
  it("returns nextAction when present", () => {
    const detail = getInventoryStatusDetail({
      isPublished: true,
      publication: {
        isPublished: true,
        isPubliclyVisible: false,
        publicEligibility: "business_inactive",
        nextAction: "Activate your business profile to publish listings.",
      },
    } as never);

    assert.match(detail || "", /Activate your business profile/i);
  });

  it("returns null for publicly visible published services", () => {
    const detail = getInventoryStatusDetail({
      isPublished: true,
      publication: {
        isPublished: true,
        isPubliclyVisible: true,
      },
    } as never);

    assert.equal(detail, null);
  });
});

describe("getPublicServiceUrl", () => {
  it("uses vendor-profile service route", () => {
    assert.equal(getPublicServiceUrl("abc123"), "/vendor-profile/service-vendor/abc123");
  });
});
