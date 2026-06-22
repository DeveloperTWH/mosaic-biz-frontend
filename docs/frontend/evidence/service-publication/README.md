# Service publication evidence — Issue #185

Screenshots for the acceptance pack should be captured during manual smoke against a backend with the Model A publication contract deployed.

## Expected files

| File | Viewport | Scenario |
|------|----------|----------|
| `desktop-inventory-draft.png` | 1280×800 | Inventory row showing Draft status |
| `desktop-inventory-published.png` | 1280×800 | Published service with View Public action |
| `desktop-create-child-fields.png` | 1280×800 | Create form with full child service fields |
| `mobile-create-draft-390.png` | 390×844 | Save Draft on create form |
| `mobile-inventory-actions-390.png` | 390×844 | Stacked publish/unpublish row actions |
| `desktop-public-listing.png` | 1280×800 | Service visible on `/services` |
| `desktop-vendor-profile.png` | 1280×800 | `/vendor-profile/service-vendor/:id` loads |

## Capture checklist

1. Partner inventory create → Save Draft → confirm Draft badge, no public link.
2. Publish valid service → confirm Published badge + public list + vendor profile.
3. Unpublish → confirm Draft + public 404.

Reference: [FRONTEND_SERVICE_PUBLICATION_FLOW.md](../../FRONTEND_SERVICE_PUBLICATION_FLOW.md)
