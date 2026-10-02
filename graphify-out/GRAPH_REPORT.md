# Graph Report - ischeghuree  (2026-10-02)

## Corpus Check
- 251 files · ~163,063 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 2, .prisma 1)

## Summary
- 1391 nodes · 2922 edges · 82 communities (77 shown, 5 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 125 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2b33e4f3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- app/layout.tsx
- Project Skills Registry
- PageData
- dependencies
- app/page.tsx
- ProductForm.tsx
- axios.ts
- logAction
- express
- dependencies
- customOrder.controller.ts
- api
- sweetalert2
- compilerOptions
- compilerOptions
- super-admin/page.tsx
- devDependencies
- homepage/page.tsx
- getPageBySlug
- AdminForm.tsx
- PageCreationForm.tsx
- _OrderForm.tsx
- ChatManager.tsx
- Navbar.tsx
- media.controller.ts
- auth.middleware.ts
- ইচ্ছে ঘুড়ি — Ische Ghuree · Brand Data
- OrdersInbox.tsx
- skills.sh
- getSettings.ts
- backend/package.json
- app/[slug]/page.tsx
- scripts
- seed.ts
- frontend/package.json
- mailer.ts
- app.ts
- /graphify
- prisma.ts
- product.routes.ts
- What You Must Do When Invoked
- devDependencies
- ProductTable.tsx
- customer/orders/page.tsx
- server.ts
- page.routes.ts
- products/[slug]/page.tsx
- order-now/page.tsx
- Tailwind v4 + Dynamic Theme (ginag-frontend)
- theme.routes.ts
- about-us/page.tsx
- Prisma 7 + Supabase Workflow
- hero.routes.ts
- Changes — Ische Ghuree rebrand (2026-08-12)
- settings.routes.ts
- social.routes.ts
- Profile.tsx
- audit.controller.ts
- lucide-react
- IconRenderer
- scripts
- Next.js 16 App Router (ginag-frontend)
- cancellation-policy/page.tsx
- CustomOrder Model
- privacy-policy/page.tsx
- shipping-policy/page.tsx
- Nodemailer + Gmail Skill
- auth.controller.ts
- Ische Ghuree
- Prisma 7 (ginag-backend)
- Dream E-commerce Backend (README)
- Ginag Monorepo
- Cloudinary Media Pipeline (ginag-backend)
- Nodemailer + Gmail (backend)
- swiper.d.ts
- sitemap.ts
- next
- postcss.config.mjs
- utils.ts
- proxy.ts
- app/products/page.tsx
- global.d.ts

## God Nodes (most connected - your core abstractions)
1. `lucide-react` - 101 edges
2. `react` - 95 edges
3. `next` - 88 edges
4. `api` - 54 edges
5. `logAction()` - 48 edges
6. `express` - 40 edges
7. `getPageBySlug()` - 31 edges
8. `sweetalert2` - 27 edges
9. `useUserStore` - 24 edges
10. `PageData` - 23 edges

## Surprising Connections (you probably didn't know these)
- `Role-Based Access Control (Super Admin/Admin/Customer)` --semantically_similar_to--> `Next.js 16 App Router Conventions`  [INFERRED] [semantically similar]
  backend/README.md → .claude/skills/next-app-router/SKILL.md
- `dreamreload (create-next-app README)` --semantically_similar_to--> `Dream E-commerce Backend (README)`  [INFERRED] [semantically similar]
  frontend/README.md → backend/README.md
- `dreamreload (create-next-app README)` --conceptually_related_to--> `Ginag Frontend (Next 16 + React 19 + Tailwind v4)`  [AMBIGUOUS]
  frontend/README.md → CLAUDE.md
- `Dream E-commerce Backend (README)` --conceptually_related_to--> `Ginag Backend (Express 5 + Prisma 7 + Supabase)`  [AMBIGUOUS]
  backend/README.md → CLAUDE.md
- `Custom-Order Quote Flow` --semantically_similar_to--> `CustomOrder Model`  [INFERRED] [semantically similar]
  CHANGES.md → .claude/skills/prisma/SKILL.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Media Upload Pipeline Stages** — claude_skills_cloudinary_media_skill_multer_memory_storage, claude_skills_cloudinary_media_skill_converttowebp, claude_skills_cloudinary_media_skill_converttowebm, claude_skills_cloudinary_media_skill_cloudinary_streaming_upload, claude_skills_cloudinary_media_skill_media_model [EXTRACTED 1.00]
- **Ginag Project Skill Registry** — claude_skills_registry, graphify_skill_graphify, claude_skills_prisma_skill_prisma_7_workflow, claude_skills_nodemailer_gmail_skill_nodemailer_gmail, claude_skills_next_app_router_skill_next_app_router, claude_skills_tailwind_v4_theme_skill_theme_tokens, claude_skills_react_hook_form_zod_skill_schema_first_forms, claude_skills_cloudinary_media_skill_cloudinary_media_pipeline [EXTRACTED 1.00]
- **Custom Order Feature Flow** — changes_custom_order_flow, changes_checkout_branching, claude_skills_prisma_skill_customorder_model, claude_skills_react_hook_form_zod_skill_superrefine_conditional_validation, claude_skills_nodemailer_gmail_skill_renderorderconfirmation [INFERRED 0.85]

## Communities (82 total, 5 thin omitted)

### Community 0 - "app/layout.tsx"
Cohesion: 0.06
Nodes (38): ActiveTheme, ColorsPage(), hexToHsl(), hslToHex(), VARIABLE_LABELS, hindSiliguri, notoSerifBengali, revalidate (+30 more)

### Community 1 - "Project Skills Registry"
Cohesion: 0.23
Nodes (10): Ginag Frontend (Next 16 + React 19 + Tailwind v4), Shared Axios Instance (src/lib/axios.ts), Next.js 16 App Router Conventions, Frontend Provider Stack, Server vs Client Component Split, Project Skills Registry, Class-based Dark Mode, ThemeProvider (runtime CSS variables) (+2 more)

### Community 2 - "PageData"
Cohesion: 0.15
Nodes (16): CancellationTemplateProps, ContactTemplateProps, doesntQualifyItems, ExchangePolicyTemplateProps, qualifiesItems, dataCategories, PrivacyPolicyTemplateProps, ProcessTemplateProps (+8 more)

### Community 3 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, axios, date-fns, framer-motion, @hookform/resolvers, js-cookie, lucide-react, next (+17 more)

### Community 4 - "app/page.tsx"
Cohesion: 0.10
Nodes (23): CollectionRails, CollectionTiles, FAQSection, FeaturedProductBlock, GoogleReviewsSection, Home(), HowItWorks, StorySection (+15 more)

### Community 5 - "ProductForm.tsx"
Cohesion: 0.10
Nodes (26): CreateProductPage(), EditProductPage(), ProductRow, CreateProductPage(), EditProductPage(), ProductRow, AdditionalInfoPart(), AdditionalInfoPartProps (+18 more)

### Community 6 - "axios.ts"
Cohesion: 0.12
Nodes (23): AdminLayout(), UserDashboardPage(), UserLayout(), DashboardIndexPage(), AuditLog, AuditLogsPage(), SuperadminLayout(), LoginForm() (+15 more)

### Community 7 - "logAction"
Cohesion: 0.21
Nodes (19): logAction(), convertToWebP(), createAdminAccount(), createUser(), deleteUser(), getAdminByUsername(), getAllAdmins(), getAllUsers() (+11 more)

### Community 8 - "express"
Cohesion: 0.11
Nodes (22): adminSendMessage(), bulkUpdateSessionStatus(), getAllSessions(), getSessionHistory(), updateSessionStatus(), CachedReviews, getGoogleReviews(), globalSearch() (+14 more)

### Community 9 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, axios, bcrypt, bcryptjs, cloudinary, cookie-parser, cors, dotenv (+15 more)

### Community 10 - "customOrder.controller.ts"
Cohesion: 0.25
Nodes (13): createCustomOrder(), deleteCustomOrder(), DeliveryStatusValue, generateOrderNumber(), getCustomOrder(), isAdminUser(), listCustomOrders(), listMyCustomOrders() (+5 more)

### Community 11 - "api"
Cohesion: 0.18
Nodes (10): SuperAdminHeroPage(), MediaItem, HeroFormProps, HeroImage, HeroRecord, HeroManagement(), HeroManagementProps, HeroRecord (+2 more)

### Community 12 - "sweetalert2"
Cohesion: 0.18
Nodes (13): AdminCustomersPage(), Address, AddressType, initialFormState, AdminsPage(), Avatar(), RoleChips(), STATUS_STYLE (+5 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, ignoreDeprecations, module, moduleResolution, noEmitOnError, noImplicitAny (+9 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 15 - "super-admin/page.tsx"
Cohesion: 0.50
Nodes (4): ChartPoint, KPI(), Overview, SuperadminDashboardPage()

### Community 16 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, nodemon, prisma, ts-node, @types/bcrypt, @types/cookie-parser, @types/cors, @types/express (+8 more)

### Community 17 - "homepage/page.tsx"
Cohesion: 0.08
Nodes (43): BannerConfig, BannerMessageList(), CategoryBarConfig, ColorInput(), DEFAULTS, FaqConfig, FaqItem, FAQList() (+35 more)

### Community 18 - "getPageBySlug"
Cohesion: 0.18
Nodes (18): ExchangeContent(), ExchangePolicyPage(), generateMetadata(), FAQContent(), FAQPage(), generateMetadata(), generateMetadata(), ReturnRefundContent() (+10 more)

### Community 19 - "AdminForm.tsx"
Cohesion: 0.16
Nodes (16): AdminAddress, AdminForm(), AdminFormData, AdminFormSectionProps, AdminInitialData, ADDRESS_TYPES, AddressInput(), AddressInputProps (+8 more)

### Community 20 - "PageCreationForm.tsx"
Cohesion: 0.07
Nodes (32): MediaLibraryPage(), MediaLibraryPage(), GeneralSettingsPage(), SuperAdminHeroCreatePage(), SuperAdminHeroEditPage(), EMPTY, Field(), ImagePicker() (+24 more)

### Community 21 - "_OrderForm.tsx"
Cohesion: 0.20
Nodes (14): FieldError(), FieldLabel(), FormValues, KiteRibbon(), OrderForm(), OrderFormProps, RadioCard, RadioCardProps (+6 more)

### Community 22 - "ChatManager.tsx"
Cohesion: 0.18
Nodes (13): AdminMessagesPage(), AdminMessagesPage(), ChatBox(), ChatManager(), ChatTable(), ChatTableProps, ChatTableToolbar(), ChatTableToolbarProps (+5 more)

### Community 23 - "Navbar.tsx"
Cohesion: 0.09
Nodes (27): metadata, ShopCategory, ShopFilters, ShopPage(), ShopProduct, BasicInfoPart(), BasicInfoPartProps, CATEGORY_BAR_DEFAULTS (+19 more)

### Community 24 - "media.controller.ts"
Cohesion: 0.14
Nodes (15): storage, upload, convertFile(), convertToWebM(), convertToWebP(), createMedia(), deleteMedia(), getAllMedia() (+7 more)

### Community 25 - "auth.middleware.ts"
Cohesion: 0.17
Nodes (15): getChartData(), getDashboardOverview(), createCategory(), deleteCategory(), getCategories(), getCategoryBySlug(), updateCategory(), authorize() (+7 more)

### Community 26 - "ইচ্ছে ঘুড়ি — Ische Ghuree · Brand Data"
Cohesion: 0.05
Nodes (38): API overview (`src/routes/index.ts`), Environment variables (`.env.example`), Ische Ghuree — Backend API, Layout, Setup & run, Stack, Business Model Notes, Contact (+30 more)

### Community 27 - "OrdersInbox.tsx"
Cohesion: 0.14
Nodes (17): AdminOrdersPage(), SuperAdminOrdersPage(), CustomOrder, DELIVERY_STATUS_STYLE, DELIVERY_STATUSES, DeliveryDraft, DeliveryStatus, Field() (+9 more)

### Community 28 - "skills.sh"
Cohesion: 0.42
Nodes (12): err(), graphify_install(), graphify_status(), graphify_uninstall(), local_skills_install(), local_skills_status(), local_skills_uninstall(), log() (+4 more)

### Community 29 - "getSettings.ts"
Cohesion: 0.18
Nodes (11): ContactContent(), ContactPage(), generateMetadata(), generateMetadata(), manifest(), FeaturedProduct, FeaturedProductBlock(), ContactSettings (+3 more)

### Community 30 - "backend/package.json"
Cohesion: 0.07
Nodes (28): author, description, axios, @types/node, typescript, keywords, license, main (+20 more)

### Community 31 - "app/[slug]/page.tsx"
Cohesion: 0.18
Nodes (14): DynamicStorefrontPage(), generateMetadata(), PageBlock, PageBlockData, RESERVED, revalidate, RichTextBlock(), SplitBlock() (+6 more)

### Community 32 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, postinstall, prisma:generate, prisma:migrate, prisma:seed, prisma:seed:pages (+2 more)

### Community 33 - "seed.ts"
Cohesion: 0.18
Nodes (16): BRAND, buildFooterConfig(), buildHomepageConfig(), ensureMedia(), main(), MediaSpec, ProductSpec, seedCategories() (+8 more)

### Community 34 - "frontend/package.json"
Cohesion: 0.09
Nodes (21): eslintConfig, axios, @types/node, typescript, name, private, version, babel-plugin-react-compiler (+13 more)

### Community 35 - "mailer.ts"
Cohesion: 0.28
Nodes (12): BRAND, contactBlock(), DELIVERY_STATUS_LABELS, emailShell(), escapeHtml(), getTransporter(), ORDER_TYPE_LABELS, renderDeliveryStatusUpdate() (+4 more)

### Community 36 - "app.ts"
Cohesion: 0.15
Nodes (9): allowedOriginPatterns, allowedOrigins, globalErrorHandler(), apiLimiter, writeLimiter, router, cookie-parser, cors (+1 more)

### Community 37 - "/graphify"
Cohesion: 0.10
Nodes (18): AST Structural Extraction, Community Detection, Incremental --update Re-extraction, Parallel Semantic Extraction Subagents, For --cluster-only, For git commit hook, For /graphify add, For /graphify explain (+10 more)

### Community 38 - "prisma.ts"
Cohesion: 0.18
Nodes (10): adapter, globalForPrisma, adapter, pages, pool, prisma, dotenv, pg (+2 more)

### Community 39 - "product.routes.ts"
Cohesion: 0.15
Nodes (21): cleanPrice(), createProduct(), deleteProduct(), getProductBySlug(), getProductFilters(), getProducts(), HIDDEN_STATUSES, isAdminReq() (+13 more)

### Community 40 - "What You Must Do When Invoked"
Cohesion: 0.11
Nodes (19): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 0 - Clone GitHub repo(s) (only if a GitHub URL was given), Step 1 - Ensure graphify is installed, Step 2.5 - Transcribe video / audio files (only if video files detected), Step 2 - Detect files, Step 3 - Extract entities and relationships (+11 more)

### Community 41 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, babel-plugin-react-compiler, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @tanstack/react-query-devtools, @types/js-cookie (+6 more)

### Community 42 - "ProductTable.tsx"
Cohesion: 0.23
Nodes (10): ProductRow, ProductsManagementPage(), ProductRow, ProductsManagementPage(), AdminProduct, formatRange(), ProductTable(), ProductTableProps (+2 more)

### Community 43 - "customer/orders/page.tsx"
Cohesion: 0.18
Nodes (12): CustomerOrdersPage(), CustomOrder, DELIVERY_LABEL, DELIVERY_STATUS_STYLE, DELIVERY_TIMELINE, DeliveryPanel(), DeliveryStatus, DetailRow() (+4 more)

### Community 44 - "server.ts"
Cohesion: 0.23
Nodes (8): app, allowedOriginPatterns, allowedOrigins, isSocketOriginAllowed(), main(), setupChatSocket(), jsonwebtoken, socket.io

### Community 45 - "page.routes.ts"
Cohesion: 0.38
Nodes (8): createPage(), deletePage(), generateSlug(), getAllPages(), getPageBySlug(), isAdminReq(), updatePage(), router

### Community 46 - "products/[slug]/page.tsx"
Cohesion: 0.06
Nodes (43): fetchProduct(), fetchRelated(), generateMetadata(), ProductDetailsPage(), RelatedProduct, revalidate, SearchContent(), SearchPage() (+35 more)

### Community 47 - "order-now/page.tsx"
Cohesion: 0.33
Nodes (8): KiteMark(), KiteRibbon(), OrderHero(), OrderHeroData, buildProductPrefill(), metadata, OrderNowPage(), revalidate

### Community 48 - "Tailwind v4 + Dynamic Theme (ginag-frontend)"
Cohesion: 0.13
Nodes (13): Conditional required fields (Zod refinement), Existing reference forms, react-hook-form + Zod (ginag-frontend), Standard form skeleton, Theme-aware styling, Watching values for conditional UI, Adding a new token, Dark mode (+5 more)

### Community 49 - "theme.routes.ts"
Cohesion: 0.36
Nodes (8): createTheme(), deleteTheme(), getActiveTheme(), getAllThemes(), getPublicThemes(), toggleThemeProperty(), updateTheme(), router

### Community 50 - "about-us/page.tsx"
Cohesion: 0.43
Nodes (5): AboutContent(), AboutUsPage(), generateMetadata(), AboutTemplate(), AboutTemplateProps

### Community 51 - "Prisma 7 + Supabase Workflow"
Cohesion: 0.24
Nodes (8): Backend pnpm allowBuilds (prisma/sharp/ffmpeg-static/bcrypt), Ginag Backend (Express 5 + Prisma 7 + Supabase), Cloudinary Streaming Upload, convertToWebM (fluent-ffmpeg), convertToWebP (sharp), Media Model (Prisma), Multer Memory Storage, Prisma 7 + Supabase Workflow

### Community 52 - "hero.routes.ts"
Cohesion: 0.43
Nodes (6): createHeroSection(), deleteHeroSection(), getActiveHeroSections(), getAllHeroSections(), updateHeroSection(), router

### Community 53 - "Changes — Ische Ghuree rebrand (2026-08-12)"
Cohesion: 0.18
Nodes (10): Brand source, Changes — Ische Ghuree rebrand (2026-08-12), Dead code / dead config deleted, Known design decisions, Public-surface bug fixes, Required operator steps (deploy checklist), Schema (`backend/prisma/schema.prisma`), Seeds (+2 more)

### Community 54 - "settings.routes.ts"
Cohesion: 0.42
Nodes (7): getHomepageConfig(), getSettings(), isAdmin(), stripSecrets(), updateHomepageSection(), updateSettings(), router

### Community 55 - "social.routes.ts"
Cohesion: 0.43
Nodes (6): createSocialLink(), deleteSocialLink(), getAllSocialLinks(), getPublicSocialLinks(), updateSocialLink(), router

### Community 56 - "Profile.tsx"
Cohesion: 0.46
Nodes (4): page(), page(), page(), ProfilePage()

### Community 57 - "audit.controller.ts"
Cohesion: 0.48
Nodes (5): deleteAllAuditLogs(), deleteAuditLog(), getAuditLogById(), getAuditLogs(), router

### Community 58 - "lucide-react"
Cohesion: 0.14
Nodes (13): AdminDashboardPage(), KPI(), Overview, CustomerChatsPage(), AdminUser, PageInitialData, SessionData, ChatMessage (+5 more)

### Community 59 - "IconRenderer"
Cohesion: 0.06
Nodes (51): CategoriesPage(), metadata, revalidate, Category, fetchAllCategories(), fetchCategory(), fetchCategoryProducts(), generateMetadata() (+43 more)

### Community 60 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, upload

### Community 61 - "Next.js 16 App Router (ginag-frontend)"
Cohesion: 0.22
Nodes (8): Data fetching, File conventions, Metadata, Next.js 16 App Router (ginag-frontend), Project layout, Provider stack (top → bottom inside `<body>`), Server vs client components, Theme bootstrap (no flash)

### Community 62 - "cancellation-policy/page.tsx"
Cohesion: 0.60
Nodes (4): CancellationContent(), CancellationPolicyPage(), generateMetadata(), CancellationTemplate()

### Community 63 - "CustomOrder Model"
Cohesion: 0.25
Nodes (6): Checkout customOrder Branching, payment.ts Utilities (getPaymentConfig/getStripeClient/capturePaypalOrder), renderOrderConfirmation Template, CustomOrder Model, Dropped Commerce Models (Order/Cart/Wishlist/Coupon), superRefine Conditional Required Fields

### Community 64 - "privacy-policy/page.tsx"
Cohesion: 0.60
Nodes (4): generateMetadata(), PrivacyContent(), PrivacyPolicyPage(), PrivacyPolicyTemplate()

### Community 65 - "shipping-policy/page.tsx"
Cohesion: 0.60
Nodes (4): generateMetadata(), ShippingContent(), ShippingPolicyPage(), ShippingPolicyTemplate()

### Community 66 - "Nodemailer + Gmail Skill"
Cohesion: 0.67
Nodes (3): Gmail App Password SMTP Flow, Nodemailer + Gmail Skill, sendMail Utility (utils/mailer.ts)

### Community 67 - "auth.controller.ts"
Cohesion: 0.36
Nodes (5): login(), authLimiter, router, generateToken(), bcrypt

### Community 68 - "Ische Ghuree"
Cohesion: 0.29
Nodes (6): Common commands, Conventions, Domain contracts (do not reintroduce jewelry-era fields), graphify, Ische Ghuree, Skills

### Community 69 - "Prisma 7 (ginag-backend)"
Cohesion: 0.29
Nodes (6): After changing the schema, Connection strings, Current models (post-pivot to catalog + custom orders), Migration workflow, Prisma 7 (ginag-backend), Prisma 7 gotcha — datasource block

### Community 70 - "Dream E-commerce Backend (README)"
Cohesion: 0.33
Nodes (6): Dream E-commerce Backend (README), Gemstone Theme API, Md. Jamil Shikder (author, Rajseba Design Studio), Multi-identifier Login (Email/Phone/Username), Role-Based Access Control (Super Admin/Admin/Customer), StoreTheme Model

### Community 71 - "Ginag Monorepo"
Cohesion: 0.67
Nodes (3): Ginag Monorepo, graphify Always-on Integration, ischeghuree (repo name)

### Community 72 - "Cloudinary Media Pipeline (ginag-backend)"
Cohesion: 0.33
Nodes (5): Adding a new upload endpoint, Cloudinary Media Pipeline (ginag-backend), Gotchas, How uploads work (in order), Where things live

### Community 75 - "Nodemailer + Gmail (backend)"
Cohesion: 0.40
Nodes (4): Gotchas, Nodemailer + Gmail (backend), Pre-built templates, Sending a transactional email

### Community 76 - "swiper.d.ts"
Cohesion: 0.40
Nodes (4): swiper/css, swiper/css/autoplay, swiper/css/navigation, swiper/css/pagination

### Community 77 - "sitemap.ts"
Cohesion: 0.67
Nodes (3): fetchSlugs(), sitemap(), staticRoutes

### Community 79 - "next"
Cohesion: 0.10
Nodes (7): nextConfig, AdminRow, AdminTableProps, PageTable(), StorefrontPage, StorefrontPagesDashboard(), next

## Ambiguous Edges - Review These
- `Ginag Frontend (Next 16 + React 19 + Tailwind v4)` → `dreamreload (create-next-app README)`  [AMBIGUOUS]
  frontend/README.md · relation: conceptually_related_to
- `Ginag Backend (Express 5 + Prisma 7 + Supabase)` → `Dream E-commerce Backend (README)`  [AMBIGUOUS]
  backend/README.md · relation: conceptually_related_to

## Knowledge Gaps
- **509 isolated node(s):** `name`, `version`, `description`, `main`, `test` (+504 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 554 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Ginag Frontend (Next 16 + React 19 + Tailwind v4)` and `dreamreload (create-next-app README)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Ginag Backend (Express 5 + Prisma 7 + Supabase)` and `Dream E-commerce Backend (README)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `next` connect `next` to `app/layout.tsx`, `PageData`, `app/page.tsx`, `ProductForm.tsx`, `axios.ts`, `api`, `sweetalert2`, `super-admin/page.tsx`, `homepage/page.tsx`, `getPageBySlug`, `AdminForm.tsx`, `PageCreationForm.tsx`, `Navbar.tsx`, `getSettings.ts`, `app/[slug]/page.tsx`, `frontend/package.json`, `ProductTable.tsx`, `customer/orders/page.tsx`, `products/[slug]/page.tsx`, `order-now/page.tsx`, `about-us/page.tsx`, `lucide-react`, `IconRenderer`, `cancellation-policy/page.tsx`, `privacy-policy/page.tsx`, `shipping-policy/page.tsx`, `sitemap.ts`, `proxy.ts`, `app/products/page.tsx`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `app/layout.tsx`, `PageData`, `app/page.tsx`, `ProductForm.tsx`, `axios.ts`, `api`, `sweetalert2`, `super-admin/page.tsx`, `homepage/page.tsx`, `getPageBySlug`, `AdminForm.tsx`, `PageCreationForm.tsx`, `_OrderForm.tsx`, `ChatManager.tsx`, `Navbar.tsx`, `OrdersInbox.tsx`, `getSettings.ts`, `app/[slug]/page.tsx`, `frontend/package.json`, `ProductTable.tsx`, `customer/orders/page.tsx`, `products/[slug]/page.tsx`, `order-now/page.tsx`, `Profile.tsx`, `IconRenderer`, `next`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `express` connect `express` to `auth.controller.ts`, `app.ts`, `product.routes.ts`, `logAction`, `customOrder.controller.ts`, `page.routes.ts`, `theme.routes.ts`, `hero.routes.ts`, `settings.routes.ts`, `social.routes.ts`, `media.controller.ts`, `auth.middleware.ts`, `backend/package.json`, `audit.controller.ts`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _509 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app/layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0636734693877551 - nodes in this community are weakly interconnected._