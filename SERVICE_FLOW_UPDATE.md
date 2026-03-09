# Service Creation Flow - Updated Implementation

## Overview
The service creation flow has been updated to use a two-step process:
1. **Step 1**: Save parent service details (title, description, images, gallery, location, business hours, booking tool)
2. **Step 2**: Add child services (individual service options with name, price, duration, description)

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
  "images": [
    "https://image-url.com/salon-interior1.jpg",
    "https://image-url.com/salon-interior2.jpg"
  ],
  "location": {
    "address": "123 Main Street, City"
  },
  "businessHours": [...],
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
    },
    {
      "name": "Hair Spa",
      "price": 50,
      "duration": "60 minutes",
      "description": "Relaxing hair spa treatment"
    }
  ]
}
```

### 3. Get Business Service with Child Services
```
GET /api/services/business-service/:businessId
```

**Response:**
```json
{
  "message": "Business service retrieved successfully.",
  "service": {
    "_id": "64f8a1b2c3d4e5f6789012ab",
    "title": "Salon Services",
    "description": "Professional salon services",
    "categoryId": {...},
    "subcategoryId": {...},
    "businessId": {...},
    "coverImage": "https://image-url.com/salon-cover.jpg",
    "images": [...],
    "location": "123 Main Street, City",
    "businessHours": [...],
    "bookingToolLink": "https://booking-link.com",
    "services": [
      {
        "name": "Hair Cut",
        "price": 25,
        "duration": "30 minutes",
        "description": "Professional hair cutting"
      }
    ],
    "isPublished": false
  },
  "hasChildServices": true
}
```

## Files Modified

### 1. `/app/(home)/partners/add-service/hooks/useServiceForm.ts`
- Updated `handleSubmit` to use two-step API calls
- First creates parent service with all details
- Then adds child services if any exist
- Added `title` and `description` to initial form data

### 2. `/app/(home)/partners/add-service/types/index.ts`
- Added `title?: string` and `description?: string` to `ServiceFormData` interface

### 3. `/app/(home)/partners/add-service/components/ServiceCategory.tsx`
- Added "Service Title" input field (required)
- Added "Service Description" textarea field (required)
- Both fields appear before category selection

### 4. `/app/(home)/partners/services/[serviceId]/page.tsx`
- Updated to fetch service using new API endpoint
- Now uses `/api/services/business-service/:businessId` to get complete service with child services

## User Flow

### Creating a New Service

1. **Fill Parent Service Details:**
   - Select Business
   - Enter Service Title (e.g., "Salon Services")
   - Enter Service Description
   - Select Category and Subcategory
   - Upload Cover Image and Gallery Images
   - Set Location
   - Configure Business Hours
   - Add Booking Tool Link (optional)

2. **Add Child Services (Optional):**
   - Click "+ Add Service" button
   - For each service option, enter:
     - Service Name (e.g., "Hair Cut")
     - Service Description
     - Duration (select from dropdown)
     - Price

3. **Submit:**
   - Click "Create Service"
   - System saves parent service first
   - Then adds all child services
   - Redirects to services list

### Viewing/Editing Services

- Services list shows all parent services
- Click "View" to see service details including child services
- Click "Edit" to modify parent details and child services
- The edit modal allows adding/removing/updating child services

## Benefits of This Approach

1. **Separation of Concerns**: Parent service metadata is separate from individual service options
2. **Flexibility**: Can add/remove child services without affecting parent service
3. **Better Data Structure**: Cleaner API design with focused endpoints
4. **Easier Management**: Users can manage service options independently

## Notes

- Child services are optional - you can create a parent service without any child services
- The form validates that title, description, category, and subcategory are filled
- All existing services will continue to work with the updated flow
- The edit functionality supports both parent and child service updates
