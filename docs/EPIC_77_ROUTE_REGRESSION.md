# Epic #77 Route / CTA / Footer Regression Checklist

**Epic:** #77 · **Issue:** #100  
**Last updated:** 2026-06-17

## Primary CTAs

| Surface | CTA | Target | Verified |
|---------|-----|--------|----------|
| Homepage Hero | Search | `/search` | Manual |
| Homepage | Shop products | `/products` | Manual |
| Product detail (mobile) | Add to cart / Buy now | cart / checkout | Manual |
| Service detail (mobile) | Book / Request appointment | booking form / external | Manual |
| Food detail (mobile) | Book a table | booking form / external | Manual |
| Become a vendor | Apply | `/partners/business/new` | Manual |
| Refer a vendor | Copy link | `/become-a-vendor` | Manual |
| Footer | Become a vendor | `/become-a-vendor` | Manual |
| Footer | Refer a vendor | `/refer-a-vendor` | Manual |
| Footer | Trust badges | `/consumer/trustbadge` | Manual |

## Redirect regression (post #90)

```bash
# Expect 308/301 to canonical routes
curl -I https://<preview>/products/foo/bar
curl -I https://<preview>/services/cat/svc123
curl -I https://<preview>/vendors/some-slug
```

## Footer link grep (local)

```bash
rg "href=\"/" app/(home)/Components/Footer.tsx
```

## Known non-canonical (intentionally redirected)

- `/products/[productid]/*` → `/product/[id]` or `/products`
- Mock service category pages under `/services/[id]` remain for category browse; detail mock redirects to vendor-profile

## API guardrails

- Homepage featured: `GET /api/featured-products` only
- Do not introduce `/api/products/featured`
