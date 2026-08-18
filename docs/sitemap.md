# Kapila Dairy Farm — Sitemap

Status: Phase 1
Last updated: 2026-08-18

## Public Site

```
/                          Home
/our-ghee                  Our Ghee (product overview, all pack sizes)
/our-ghee/[slug]            Product Detail (per product, e.g. /our-ghee/a2-gir-cow-ghee)
/our-story                  Our Story
/our-process                 Our Process
/quality                     Quality & Purity
/faq                         FAQ
/contact                     Contact
```

### Relationships

```
Home (/)
 ├─ links to → Our Ghee (/our-ghee)
 ├─ links to → Our Story (/our-story)          [via "Why Kapila" / Story teaser]
 ├─ links to → Our Process (/our-process)      [via Process teaser]
 ├─ links to → Quality & Purity (/quality)     [via Quality teaser]
 ├─ links to → Contact (/contact)              [via Location section + final CTA]
 └─ "Enquire Now" CTA → Contact or enquiry action, everywhere

Our Ghee (/our-ghee)
 ├─ lists all active Products, each with active Variants (pack sizes)
 └─ each product card links to → Product Detail (/our-ghee/[slug])

Product Detail (/our-ghee/[slug])
 ├─ shows Product images, description, active Variants
 ├─ "Enquire Now" CTA → Contact (pre-filled with product/variant context where feasible)
 └─ breadcrumb back to → Our Ghee

Our Story (/our-story)
 └─ links to → Our Process, Quality & Purity (cross-navigation)

Our Process (/our-process)
 └─ links to → Quality & Purity

Quality & Purity (/quality)
 ├─ displays FSSAI license + lab test report (as documents/images)
 └─ links to → Contact (for enquiries about certification)

FAQ (/faq)
 └─ links to → Contact ("Still have a question?")

Contact (/contact)
 ├─ Address + Google Map embed
 ├─ Phone / WhatsApp / Email (rendered only if configured)
 ├─ Social links (rendered only if configured)
 └─ Enquiry form
```

Global navigation (header): Home · Our Ghee · Our Story · Our Process · Quality & Purity · FAQ · Contact, plus a persistent "Enquire Now" CTA button.

Footer (site-wide): business name, address, quick links to all public pages, social links (if configured), FSSAI license number (as a trust marker), copyright.

---

## Admin

```
/admin/login                 Admin Login
/admin                       Dashboard
/admin/products               Products (list)
/admin/products/[id]           Product edit (includes its Variants inline or linked)
/admin/products/[id]/variants   Product Variants management for that product
/admin/content/home            Homepage Content
/admin/content/story           Our Story Content
/admin/content/process         Our Process Content (steps)
/admin/content/quality         Quality & Purity Content
/admin/faqs                    FAQs
/admin/media                   Media Library
/admin/documents               Documents (FSSAI license, lab reports, etc.)
/admin/settings                Business Settings
```

### Relationships

```
Admin Login (/admin/login)
 └─ on success → Dashboard

Dashboard (/admin)
 ├─ summary counts (products, active variants, FAQs, pending enquiries if enquiry storage is built)
 └─ quick links to → Products, Content, FAQs, Media, Documents, Settings

Products (/admin/products)
 └─ → Product edit (/admin/products/[id])
        └─ → Variants management (/admin/products/[id]/variants)
              - variants reference Media for their own imagery only if needed; otherwise inherit product images

Content sections (Home / Story / Process / Quality)
 └─ each references Media (images) and, for Quality, Documents

FAQs (/admin/faqs)
 └─ standalone list, reorderable

Media (/admin/media)
 └─ shared image library referenced by Products, Content sections

Documents (/admin/documents)
 └─ shared document library referenced by Quality & Purity content (FSSAI license, lab reports, future certificates)

Business Settings (/admin/settings)
 └─ referenced by Contact page and site-wide footer
```

All `/admin/*` routes except `/admin/login` require an authenticated session; unauthenticated requests redirect to `/admin/login`.
