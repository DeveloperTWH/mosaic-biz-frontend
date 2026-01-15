export interface VendorStage1Payload {
  businessName: string;

  isMinorityOwned: boolean;
  minorityCategories?: string[];

  hasEIN: boolean;
  einNumber?: string;
  ssnLast9?: string;

  hasBusinessLicense: boolean;

  ownershipType?: string;
  yearsInBusiness?: string;

  isFranchise?: boolean;
  franchiseName?: string | null;

  businessType: "product" | "service" | "food";
  usesThirdPartyBooking?: boolean;
  hasPhysicalLocation?: boolean;

  website?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;

  primaryContactName?: string;
  primaryContactDesignation?: string;

  contactEmail?: string;
  secondaryBusinessEmail?: string;
  contactPhone?: string;

  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };

  employeesCount?: "0-1" | "2-5" | "6-10" | "10+";

  minorityProofDocuments?: { url: string; verified: false }[];
  taxDocuments?: { url: string; verified: false }[];
  businessLicenseDocuments?: { url: string; verified: false }[];

  acceptedTerms?: boolean;
  declarationAccepted?: boolean;
}
