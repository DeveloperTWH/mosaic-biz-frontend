# Service Creation Flow — Updated Implementation

**Location:** `app/(home)/partners/add-service/`  
**Related:** [add-service-prefill.md](add-service-prefill.md)

## Overview

Two-step process:

1. **Step 1:** Save parent service details (title, description, images, gallery, location, business hours, booking tool)
2. **Step 2:** Add child services (individual options with name, price, duration, description)

## API Endpoints Used

### 1. Create Parent Service

```
POST /api/service/parent
```

**Payload:**

```json
{
  "title": "Salon Services",
  "description": "Professional salon services",
  "categoryId": "category_id_here",
  "subcategoryId": "subcategory_id_here",
  "businessId": "business_id_here",
  "coverImage": "https://image-url.com/salon-cover.jpg",
  "images": ["https://image-url.com/salon-interior1.jpg"],
  "location": { "address": "123 Main Street, City" },
  "businessHours": [],
  "bookingToolLink": "https://booking-link.com"
}
```

### 2. Add Child Services

```
POST /api/services/add-child-services
```

**Payload:**

```json
{
  "businessId": "business_id_here",
  "childServices": [
    {
      "name": "Hair Cut",
      "price": 25,
      "duration": "30 minutes",
      "description": "Professional hair cutting service"
    }
  ]
}
```

### 3. Get Business Service with Child Services

```
GET /api/services/business-service/:businessId
```

Returns parent service with nested `services` array and `hasChildServices` flag.

## Files Modified

| File | Change |
|------|--------|
| `partners/add-service/hooks/useServiceForm.ts` | Two-step submit; title/description in form state |
| `partners/add-service/types/index.ts` | `title`, `description` on `ServiceFormData` |
| `partners/add-service/components/ServiceCategory.tsx` | Title and description fields |
| `partners/services/[serviceId]/page.tsx` | Fetch via business-service endpoint |

## User Flow

### Creating a New Service

1. Fill parent details (business, title, description, category, images, location, hours, booking link)
2. Optionally add child services via "+ Add Service"
3. Submit — parent saved first, then child services; redirect to services list

### Viewing/Editing

- Services list shows parent services
- View shows parent + child services
- Edit modal supports parent and child updates

## Notes

- Child services are optional
- Title, description, category, and subcategory are required
- Existing services continue to work with the updated flow
