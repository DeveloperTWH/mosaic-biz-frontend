# Add Service Page - Auto-Prefill Feature

## Overview
The add-service page now automatically fetches and prefills existing parent service data when the page loads. This allows users to only add child services without re-entering all the parent service details.

## How It Works

### On Page Load:
1. Fetches user's businesses
2. If a business exists, automatically calls `GET /api/services/business-service/:businessId`
3. If parent service data exists, prefills the form with:
   - Title
   - Description
   - Category & Subcategory
   - Cover Image & Gallery Images
   - Location
   - Business Hours
   - Booking Tool Link
4. Child services section remains empty for user to add new services

### User Experience:

#### Scenario 1: Parent Service Already Exists
- Form loads with all parent details prefilled
- Blue message appears: "✓ Parent service details loaded. Add child services below."
- User only needs to add child services
- Submit button shows "Add Child Services"
- On submit: Only adds child services (skips parent creation)

#### Scenario 2: No Parent Service Exists
- Form loads empty
- User fills all parent service details
- User can optionally add child services
- Submit button shows "Create Service"
- On submit: Creates parent service first, then adds child services

## API Flow

### Initial Load:
```
GET /api/business/my
  ↓
GET /api/services/business-service/:businessId
  ↓
Prefill form if service exists
```

### On Submit (Parent Exists):
```
POST /api/services/add-child-services
  ↓
Redirect to /partners/services
```

### On Submit (Parent Doesn't Exist):
```
POST /api/services/parent
  ↓
POST /api/services/add-child-services (if any)
  ↓
Redirect to /partners/services
```

## Code Changes

### `useServiceForm.ts`

1. **fetchInitialData()** - Enhanced to:
   - Fetch existing service data
   - Prefill form with parent service details
   - Transform business hours format from API to form format

2. **handleSubmit()** - Updated to:
   - Check if parent service exists
   - Skip parent creation if already exists
   - Only add child services when parent exists

### `page.tsx`

1. Added conditional message showing when data is prefilled
2. Dynamic submit button text based on whether parent exists
3. Changed "Clear Response" to "Cancel" for better UX

## Benefits

1. **Time Saving**: Users don't need to re-enter parent service details
2. **Error Prevention**: Reduces chance of creating duplicate parent services
3. **Better UX**: Clear indication when data is prefilled
4. **Flexible**: Works for both new and existing services

## Business Hours Transformation

API format:
```json
{
  "day": "Monday",
  "openTime": "09:00",
  "closeTime": "18:00",
  "isOpen": true
}
```

Form format:
```json
{
  "day": "Monday",
  "hours": "09:00 - 18:00",
  "closed": false
}
```

## Notes

- If API call fails (404), form loads empty - no error shown to user
- All fields remain editable even when prefilled
- Validation still applies to all required fields
- Child services are never prefilled (always start empty)
