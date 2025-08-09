This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

src/
├── app/ # Next.js App Router pages
│ ├── (auth)/ # Route groups
│ │ ├── signin/
│ │ └── signup/
│ ├── (admin)/
│ │ ├── admin/
│ │ │ ├── dashboard/
│ │ │ ├── products/
│ │ │ ├── orders/
│ │ │ └── analytics/
│ ├── (store)/ # Customer-facing routes
│ │ ├── products/
│ │ ├── cart/
│ │ └── checkout/
│ ├── layout.tsx
│ ├── page.tsx
│ └── globals.css
│
├── features/ # Feature-based modules
│ ├── auth/ # Authentication feature
│ │ ├── components/
│ │ │ ├── signin-form.tsx
│ │ │ ├── signup-form.tsx
│ │ │ ├── forgot-password-form.tsx
│ │ │ └── auth-guard.tsx
│ │ ├── hooks/
│ │ │ ├── use-auth.ts
│ │ │ ├── use-signin.ts
│ │ │ └── use-signup.ts
│ │ ├── services/
│ │ │ ├── auth-service.ts
│ │ │ └── auth-api.ts
│ │ ├── types/
│ │ │ └── auth.types.ts
│ │ ├── utils/
│ │ │ ├── validation.ts
│ │ │ └── auth-helpers.ts
│ │ └── index.ts # Feature exports
│ │
│ ├── products/ # Product management feature
│ │ ├── components/
│ │ │ ├── product-card.tsx
│ │ │ ├── product-list.tsx
│ │ │ ├── product-filters.tsx
│ │ │ ├── product-search.tsx
│ │ │ ├── product-form.tsx
│ │ │ ├── product-gallery.tsx
│ │ │ └── product-reviews.tsx
│ │ ├── hooks/
│ │ │ ├── use-products.ts
│ │ │ ├── use-product-filters.ts
│ │ │ └── use-product-search.ts
│ │ ├── services/
│ │ │ ├── product-service.ts
│ │ │ └── product-api.ts
│ │ ├── types/
│ │ │ └── product.types.ts
│ │ ├── utils/
│ │ │ ├── product-helpers.ts
│ │ │ └── price-formatters.ts
│ │ └── index.ts
│ │
│ ├── cart/ # Shopping cart feature
│ │ ├── components/
│ │ │ ├── cart-drawer.tsx
│ │ │ ├── cart-item.tsx
│ │ │ ├── cart-summary.tsx
│ │ │ └── add-to-cart-button.tsx
│ │ ├── hooks/
│ │ │ ├── use-cart.ts
│ │ │ └── use-cart-persistence.ts
│ │ ├── services/
│ │ │ └── cart-service.ts
│ │ ├── types/
│ │ │ └── cart.types.ts
│ │ ├── utils/
│ │ │ └── cart-calculations.ts
│ │ └── index.ts
│ │
│ ├── orders/ # Order management feature
│ │ ├── components/
│ │ │ ├── order-list.tsx
│ │ │ ├── order-details.tsx
│ │ │ ├── order-status.tsx
│ │ │ ├── order-tracking.tsx
│ │ │ └── order-history.tsx
│ │ ├── hooks/
│ │ │ ├── use-orders.ts
│ │ │ └── use-order-tracking.ts
│ │ ├── services/
│ │ │ ├── order-service.ts
│ │ │ └── order-api.ts
│ │ ├── types/
│ │ │ └── order.types.ts
│ │ ├── utils/
│ │ │ └── order-helpers.ts
│ │ └── index.ts
│ │
│ ├── checkout/ # Checkout process feature
│ │ ├── components/
│ │ │ ├── checkout-form.tsx
│ │ │ ├── payment-form.tsx
│ │ │ ├── shipping-form.tsx
│ │ │ ├── order-summary.tsx
│ │ │ └── checkout-steps.tsx
│ │ ├── hooks/
│ │ │ ├── use-checkout.ts
│ │ │ └── use-payment.ts
│ │ ├── services/
│ │ │ ├── checkout-service.ts
│ │ │ └── payment-service.ts
│ │ ├── types/
│ │ │ └── checkout.types.ts
│ │ ├── utils/
│ │ │ └── checkout-validation.ts
│ │ └── index.ts
│ │
│ ├── admin/ # Admin dashboard feature
│ │ ├── components/
│ │ │ ├── dashboard/
│ │ │ │ ├── analytics-chart.tsx
│ │ │ │ ├── stats-cards.tsx
│ │ │ │ └── recent-activity.tsx
│ │ │ ├── layout/
│ │ │ │ ├── admin-sidebar.tsx
│ │ │ │ ├── admin-header.tsx
│ │ │ │ └── admin-layout.tsx
│ │ │ ├── products/
│ │ │ │ ├── product-table.tsx
│ │ │ │ ├── product-form.tsx
│ │ │ │ └── bulk-actions.tsx
│ │ │ ├── orders/
│ │ │ │ ├── order-table.tsx
│ │ │ │ └── order-management.tsx
│ │ │ └── users/
│ │ │ ├── user-table.tsx
│ │ │ └── user-management.tsx
│ │ ├── hooks/
│ │ │ ├── use-admin-stats.ts
│ │ │ ├── use-admin-products.ts
│ │ │ └── use-admin-orders.ts
│ │ ├── services/
│ │ │ ├── admin-service.ts
│ │ │ └── analytics-service.ts
│ │ ├── types/
│ │ │ └── admin.types.ts
│ │ ├── utils/
│ │ │ └── admin-helpers.ts
│ │ └── index.ts
│ │
│ ├── user/ # User profile feature
│ │ ├── components/
│ │ │ ├── profile-form.tsx
│ │ │ ├── address-book.tsx
│ │ │ ├── wishlist.tsx
│ │ │ └── account-settings.tsx
│ │ ├── hooks/
│ │ │ ├── use-profile.ts
│ │ │ └── use-wishlist.ts
│ │ ├── services/
│ │ │ └── user-service.ts
│ │ ├── types/
│ │ │ └── user.types.ts
│ │ └── index.ts
│ │
│ └── analytics/ # Analytics feature
│ ├── components/
│ │ ├── analytics-dashboard.tsx
│ │ ├── revenue-chart.tsx
│ │ └── conversion-metrics.tsx
│ ├── hooks/
│ │ └── use-analytics.ts
│ ├── services/
│ │ └── analytics-service.ts
│ ├── types/
│ │ └── analytics.types.ts
│ └── index.ts
│
├── shared/ # Shared/common components and utilities
│ ├── components/ # Reusable UI components
│ │ ├── ui/ # Base UI components (shadcn/ui)
│ │ │ ├── button.tsx
│ │ │ ├── input.tsx
│ │ │ ├── modal.tsx
│ │ │ ├── card.tsx
│ │ │ ├── table.tsx
│ │ │ └── ...
│ │ ├── layout/ # Layout components
│ │ │ ├── header.tsx
│ │ │ ├── footer.tsx
│ │ │ ├── sidebar.tsx
│ │ │ └── navigation.tsx
│ │ ├── forms/ # Form components
│ │ │ ├── form-field.tsx
│ │ │ ├── form-error.tsx
│ │ │ ├── search-input.tsx
│ │ │ └── file-upload.tsx
│ │ ├── feedback/ # Feedback components
│ │ │ ├── loading-spinner.tsx
│ │ │ ├── error-boundary.tsx
│ │ │ ├── toast.tsx
│ │ │ └── empty-state.tsx
│ │ └── data-display/ # Data display components
│ │ ├── data-table.tsx
│ │ ├── pagination.tsx
│ │ ├── stats-card.tsx
│ │ └── badge.tsx
│ │
│ ├── hooks/ # Shared custom hooks
│ │ ├── use-local-storage.ts
│ │ ├── use-debounce.ts
│ │ ├── use-api.ts
│ │ ├── use-pagination.ts
│ │ └── use-toast.ts
│ │
│ ├── services/ # Shared services
│ │ ├── api/
│ │ │ ├── client.ts
│ │ │ ├── endpoints.ts
│ │ │ └── interceptors.ts
│ │ ├── storage/
│ │ │ ├── local-storage.ts
│ │ │ └── session-storage.ts
│ │ └── notifications/
│ │ └── notification-service.ts
│ │
│ ├── utils/ # Shared utility functions
│ │ ├── formatters/
│ │ │ ├── currency.ts
│ │ │ ├── date.ts
│ │ │ └── number.ts
│ │ ├── validators/
│ │ │ ├── email.ts
│ │ │ ├── password.ts
│ │ │ └── form-validation.ts
│ │ ├── helpers/
│ │ │ ├── array-helpers.ts
│ │ │ ├── object-helpers.ts
│ │ │ └── string-helpers.ts
│ │ └── constants/
│ │ ├── api-endpoints.ts
│ │ ├── app-config.ts
│ │ └── validation-rules.ts
│ │
│ ├── types/ # Shared TypeScript types
│ │ ├── api.types.ts
│ │ ├── common.types.ts
│ │ └── global.types.ts
│ │
│ └── styles/ # Shared styles
│ ├── globals.css
│ ├── components.css
│ └── utilities.css
│
├── lib/ # Core library functions
│ ├── auth.ts # Authentication configuration
│ ├── database.ts # Database connection
│ ├── validation.ts # Validation schemas
│ ├── utils.ts # Core utilities (cn function, etc.)
│ └── constants.ts # Application constants
│
├── providers/ # Context providers
│ ├── auth-provider.tsx
│ ├── cart-provider.tsx
│ ├── theme-provider.tsx
│ └── query-provider.tsx
│
├── middleware.ts # Next.js middleware
├── next.config.js # Next.js configuration
├── tailwind.config.js # Tailwind configuration
├── tsconfig.json # TypeScript configuration
└── package.json # Dependencies and scripts
