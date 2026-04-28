# System Components Audit

Updated: 2026-04-01

## Overall Assessment

The project already has the core shape of a phone and accessories ecommerce system.

- Frontend customer flow: present
- Admin flow: present
- Product catalog and detail pages: present
- Cart and checkout: present
- Payment integration: present
- Promotion and content modules: present

Current maturity: good demo / good MVP, not yet a fully rounded production retail system.

## Components Already Present

### Customer-facing

- Homepage and promotional landing sections
- Product listing with filtering and sorting
- Product detail page
- Product gallery and specs section
- Cart page
- Checkout page
- Order success page
- Order detail page
- Wishlist
- Blog listing and blog detail
- Policy pages
- Contact page
- Appointment / consultation booking page

### Commerce / backend

- Product API
- Category API
- Order API
- Voucher API
- Flash sale API
- Wishlist API
- Blog API
- Appointment API
- Auth API
- VNPAY integration
- Inventory services
- Seed data for phones, tablets, accessories, audio, watches

### Admin

- Admin dashboard
- Product management
- Order management
- Blog management
- Review management
- Promotion management
- Appointment management

## Components That Are Still Missing Or Weak

### Important for a stronger retail website

- Customer account center
  - No dedicated profile page
  - No full order history page for signed-in users
- Category management UI in admin
  - Backend category API exists, but admin category screen is not wired in the app routes
- Product review submission UI
  - Admin review screen exists, but public customer review creation is still weak / incomplete
- Search suggestions and quick search UX
  - Search works, but there is no autocomplete, recent search, or hot keyword module
- Product comparison
  - Useful for phones, currently missing as a real feature
- Recently viewed products
  - Missing
- Better after-sales flow
  - No dedicated warranty / repair request page
  - No RMA style return request flow
- Rich order tracking
  - Order detail exists, but no public order lookup workflow for guest users

### Important for operations

- Category merchandising tools
  - No visible admin controls for home section curation, featured collections, or hero banners
- Media management
  - Product image coverage improved, but still partially curated by code mapping
- Analytics
  - No visible reporting for conversion, top products, abandoned carts, or revenue trends
- SEO controls
  - No visible SEO editor for title, meta description, schema, or slug governance in admin

## Components Still Using Fallback Or Needing Cleanup

- Some product images still rely on fallback coverage
- Legacy naming from the old interior/furniture context still appears in a few backend enums and comments
- There are signs of mixed project history, so consistency cleanup would still help

## Recommendation

If the goal is to make this feel "professional" and user-friendly fast, the next best set of upgrades is:

1. Add a customer account area with order history and account details.
2. Add admin category management and homepage merchandising controls.
3. Add customer review submission on product detail pages.
4. Add compare / recently viewed for phone shopping behavior.
5. Add guest order lookup and better warranty / return support flows.
6. Continue replacing remaining fallback product images with curated real assets.
