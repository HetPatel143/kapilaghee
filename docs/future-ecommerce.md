# Kapila Dairy Farm — Future E-commerce Architecture (Phase 2)

Status: Planning only — **not implemented in Phase 1**.
Last updated: 2026-08-18

This document explains how Phase 2 (online ordering) extends Phase 1 (brand + showcase + enquiry) without requiring a rewrite. Nothing described here is built now; it exists so Phase 1 is not designed in a way that blocks it.

## 1. Conceptual Model

```
Phase 1

Product
  ↓
Variant
  ↓
Enquiry


Phase 2

Product
  ↓
Variant
  ↓
Price / Stock
  ↓
Cart
  ↓
Checkout
  ↓
Payment
  ↓
Order
  ↓
Delivery
```

`Product` and `ProductVariant` are the load-bearing entities in both phases. Phase 1's `Enquiry` is the interim conversion path; Phase 2 replaces/augments it with `Cart → Checkout → Order`, without changing what a Product or Variant fundamentally is.

## 2. What Carries Forward Unchanged

- `Product` (id, name, slug, description, status) — no structural change needed.
- `ProductVariant` (id, productId, size, unit, status, sortOrder) — no structural change needed; this is exactly the entity Phase 2 attaches price/stock to.
- `Media`, `Document` — unchanged; product imagery and certificates are needed identically in a storefront.
- `BusinessSettings` — unchanged; still the source of contact/social info, now also potentially the source of shipping-origin address.
- `PageSection` (Home/Story/Process/Quality) — unchanged; a storefront still needs brand/story/quality content, arguably more than a showcase site does.
- `FAQ` — unchanged, likely extended with e-commerce-specific questions (shipping, returns) as new rows, not a new model.
- Public page routes (`/our-ghee`, `/our-ghee/[slug]`, etc.) — unchanged; they gain price display and an "Add to Cart" control instead of only "Enquire Now."
- Admin auth model — unchanged, though Phase 2 likely needs role separation (e.g., staff who can manage orders vs. an owner who manages settings/payments) — see §5.

## 3. What Gets Added

### ProductVariant — new nullable columns
```
price               decimal
compareAtPrice      decimal?
sku                 string?
stock               int?
inventoryStatus     enum(in_stock, low_stock, out_of_stock, preorder)
```
These are additive migrations (new nullable/defaulted columns), not a schema rewrite — existing Phase 1 rows remain valid.

### New entities
```
Customer
  id, name, email, phone, passwordHash?, createdAt
  (may start as guest-checkout-only, with accounts added later)

Address
  id, customerId, line1, line2, city, state, pincode, isDefault

Cart
  id, customerId? (nullable for guest carts / session-based), createdAt

CartItem
  id, cartId, variantId, quantity

Order
  id, orderNumber, customerId?, status, subtotal, discount, shipping, tax, total, createdAt

OrderItem
  id, orderId, variantId, quantity, unitPrice, lineTotal

Payment
  id, orderId, provider, status, amount, transactionRef, paidAt

Coupon
  id, code, type(percent|fixed), value, validFrom, validTo, usageLimit, status

Delivery
  id, orderId, courier?, trackingNumber?, status, dispatchedAt, deliveredAt
```

### Enquiry's role in Phase 2
`Enquiry` does not disappear — bulk/wholesale buyers (the FSSAI license explicitly lists "Wholesaler" as a licensed business type) will likely still want to enquire rather than check out a 15 kg tin through a standard cart flow. Phase 2 can keep both paths: self-serve cart/checkout for retail-sized orders, and Enquiry for bulk/wholesale, distinguished by variant or by an admin-configured threshold.

## 4. API Additions

Additive, not replacing, the Phase 1 API surface:
```
/api/public/cart              (GET/POST/PATCH — session or customer scoped)
/api/public/checkout          (POST — creates Order + Payment intent)
/api/public/orders/[id]       (GET — order status, for the purchasing customer)
/api/admin/orders             (list/manage)
/api/admin/coupons            (CRUD)
/api/admin/inventory          (stock adjustments)
/api/admin/deliveries         (CRUD/status updates)
/api/webhooks/payment         (payment provider callback)
```

## 5. Other Phase 2 Considerations (not designed in detail now, flagged for later)

- **Payments:** integration with an Indian payment gateway (e.g., Razorpay/Cashfree) supporting UPI, cards, netbanking — selection deferred to Phase 2 scoping.
- **Tax/invoicing:** GST handling on invoices, given this is a registered manufacturing/wholesale/retail business.
- **Roles:** introducing role-based admin access (owner vs. order-fulfillment staff) if the team managing orders grows beyond one person.
- **Shipping:** rate calculation and courier integration, relevant given the product is heavy (5 kg/15 kg tins) and shipping cost is a meaningful part of unit economics.
- **Inventory accuracy:** whether stock is tracked manually by the admin or synced from an external system (e.g., a physical POS) is a business-process question, not just a technical one, and should be scoped with the business before building it.

## 6. Migration Approach

When Phase 2 begins:
1. Add the new nullable columns to `ProductVariant` and the new entities above via Prisma migrations — Phase 1 data and pages continue to function unchanged during and after migration.
2. Introduce "Add to Cart" UI and price display only on variants that have a non-null `price` set — this allows the business to launch e-commerce for some variants (e.g., retail 1 kg) while keeping others (e.g., bulk 15 kg) enquiry-only, during a transitional period.
3. Extend, rather than replace, the admin navigation with Orders/Inventory/Coupons/Deliveries sections alongside the existing Products/Content/FAQs/Settings sections.

This is the specific reason Phase 1's data model (in `architecture.md` §4) defines `Product` and `ProductVariant` exactly as shown, and why Admin content is kept separate from design/layout: it is what allows Phase 2 to be additive rather than a rebuild.
