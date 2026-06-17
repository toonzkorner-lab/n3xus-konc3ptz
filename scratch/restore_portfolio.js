const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Restoring Galactic Nights portfolio item...');
  
  const description = `# Galactic Nights E-Commerce Platform

Galactic Nights is a state-of-the-art, high-performance e-commerce engine designed for digital creator storefronts and next-gen merchants. Built from the ground up to support instant transaction processing, high-density traffic, and a stunning cyberpunk aesthetic, the platform blends cutting-edge web architecture with immersive user experiences.

---

## 🌌 Core Features

### 1. High-Performance Digital Storefront
* **Dynamic Catalog**: Real-time filtering, product searching, and dynamic category switching.
* **Instant Cart & Checkout**: High-fidelity side-cart panel supporting real-time tax, quantity adjustments, and automatic discount coupon validation.
* **Cyberpunk UI/UX**: Immersive dark mode styled with interactive glassmorphism components, custom glowing buttons, and smooth micro-animations.

### 2. Automated Stripe Payment Infrastructure
* **Secure Payment Flows**: Secure checkout sessions routed directly via Stripe's encrypted API.
* **Webhook Provisioning**: Automatic post-payment webhook listeners that instantly generate client projects, invoice records, and client access dashboards upon successful checkout.
* **Customer Portal**: Integrated self-service customer portal allowing users to manage subscription billing, download invoices, and update billing credentials on demand.

### 3. Encrypted Client Portal & Dashboards
* **Admin Control Center**: Comprehensive dashboard allowing full CRUD control over products, services, portfolio items, coupons, and client messages.
* **Interactive Message Hub**: Private real-time messaging interface between clients and the development team.
* **Secure WebAuthn & Passwordless Login**: Passkey support for lightning-fast, high-security administrator authentication.

---

## 🛠️ Technical Stack & Architecture

### Frontend & Rendering
* **Framework**: Next.js 16 (Turbopack compiler) utilizing dynamic page rendering (\`force-dynamic\`) to bypass static caching bottlenecks.
* **Styling**: Optimized CSS Variable design system for absolute control over variables, themes, responsive grids, and custom animation keyframes.
* **State & Navigation**: Next.js App Router for server-side and client-side optimization.

### Backend & Database
* **Database**: High-concurrency PostgreSQL hosted on **Neon Tech** with connection pooling.
* **ORM**: Prisma ORM for structured migration pipelines, type-safe queries, and schema reliability.
* **Authentication**: NextAuth.js configured with secure JWT session tokens and role-based permissions (ADMIN, OWNER, USER).

### Storage & Serverless hosting
* **Static Assets**: **Vercel Blob Storage** integrated with a client-side direct upload pipeline to bypass 4.5 MB serverless execution limits, allowing upload of media and files up to 500 MB.
* **Hosting**: Vercel Edge Serverless functions.

---

## 🎨 Design Philosophy
Galactic Nights challenges traditional e-commerce designs by utilizing a high-density, dark-mode cosmic theme. Implementing rich gradients (cyan to purple), subtle backlighting, custom scrollbars, and reduced-motion fallbacks, it delivers a visually striking interface without compromising loading performance or core SEO standards.`;

  await prisma.portfolioItem.upsert({
    where: { slug: "galactic-nights" },
    update: {
      description,
      shortDesc: "A complete e-commerce solution built from the ground up for a boutique digital agency."
    },
    create: {
      title: "Galactic Nights E-Commerce Platform",
      slug: "galactic-nights",
      category: "E-Commerce",
      tags: JSON.stringify(["Next.js", "Stripe", "Prisma"]),
      images: JSON.stringify(["/design-seo.png"]), // Using a fallback image
      shortDesc: "A complete e-commerce solution built from the ground up for a boutique digital agency.",
      description
    }
  });

  console.log('Restored successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
