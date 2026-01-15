// lib/payload/vendorOnboardingPayload.ts

export function buildStage1Payload(step: string, formData: any) {
  switch (step) {
    case "basic":
      return {
        businessName: formData.businessName,
        businessType: formData.listingType,
        primaryContactName: formData.businessName,
        contactEmail: formData.email,
        contactPhone: formData.phoneNumber,
      };

    case "address":
      return {
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode,
        },
        hasPhysicalLocation: true,
      };

    case "compliance":
      return {
        hasEIN: true,
        einNumber: formData.taxId,
        hasBusinessLicense: true,
      };

    case "categories":
      return {
        businessType: formData.listingType,
        categories: formData.selectedCategories?.map((c: any) => c._id),
      };

    case "agreements":
      return {
        acceptedTerms: true,
        declarationAccepted: true,
      };

    default:
      return {};
  }
}
