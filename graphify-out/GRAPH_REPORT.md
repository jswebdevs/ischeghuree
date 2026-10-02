# Graph Report - ischeghuree  (2026-10-02)

## Corpus Check
- 250 files · ~162,118 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 2, .prisma 1)

## Summary
- 1381 nodes · 2892 edges · 88 communities (83 shown, 5 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 125 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `06e436e8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- app/layout.tsx
- Project Skills Registry
- ProductMediaViewer.tsx
- dependencies
- app/page.tsx
- react
- axios.ts
- logAction
- express
- dependencies
- customOrder.controller.ts
- MediaManager
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
- admin/categories/page.tsx
- backend/package.json
- IconRenderer
- scripts
- seed.ts
- frontend/package.json
- products/[slug]/page.tsx
- app.ts
- /graphify
- prisma.ts
- product.routes.ts
- What You Must Do When Invoked
- devDependencies
- ProductTable.tsx
- customer/orders/page.tsx
- server.ts
- getSettings.ts
- categories/[slug]/page.tsx
- page.routes.ts
- Tailwind v4 + Dynamic Theme (ginag-frontend)
- theme.routes.ts
- mailer.ts
- Prisma 7 + Supabase Workflow
- hero.routes.ts
- Changes — Ische Ghuree rebrand (2026-08-12)
- settings.routes.ts
- social.routes.ts
- ProfilePage
- audit.controller.ts
- lucide-react
- CategoryTable.tsx
- scripts
- Next.js 16 App Router (ginag-frontend)
- useCurrency
- CustomOrder Model
- HeroManagement.tsx
- order-now/page.tsx
- HeroForm
- auth.controller.ts
- Ische Ghuree
- Prisma 7 (ginag-backend)
- Dream E-commerce Backend (README)
- _ShopClient.tsx
- Cloudinary Media Pipeline (ginag-backend)
- IconRenderer.tsx
- StorySection.tsx
- Nodemailer + Gmail (backend)
- swiper.d.ts
- sitemap.ts
- StickyBanner.tsx
- next
- postcss.config.mjs
- utils.ts
- proxy.ts
- KiteHero.tsx
- app/products/page.tsx
- global.d.ts
- Nodemailer + Gmail Skill
- Ginag Monorepo

## God Nodes (most connected - your core abstractions)
1. `lucide-react` - 101 edges
2. `react` - 94 edges
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

## Communities (88 total, 5 thin omitted)

### Community 0 - "app/layout.tsx"
Cohesion: 0.06
Nodes (42): ActiveTheme, ColorsPage(), hexToHsl(), hslToHex(), VARIABLE_LABELS, generateMetadata(), hindSiliguri, notoSerifBengali (+34 more)

### Community 1 - "Project Skills Registry"
Cohesion: 0.23
Nodes (10): Ginag Frontend (Next 16 + React 19 + Tailwind v4), Shared Axios Instance (src/lib/axios.ts), Next.js 16 App Router Conventions, Frontend Provider Stack, Server vs Client Component Split, Project Skills Registry, Class-based Dark Mode, ThemeProvider (runtime CSS variables) (+2 more)

### Community 2 - "ProductMediaViewer.tsx"
Cohesion: 0.14
Nodes (16): Frame, Product360Viewer(), Props, Model(), Product3DViewer(), GalleryImage, ProductGallery(), ProductGalleryProps (+8 more)

### Community 3 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, axios, date-fns, framer-motion, @hookform/resolvers, js-cookie, lucide-react, next (+17 more)

### Community 4 - "app/page.tsx"
Cohesion: 0.12
Nodes (19): CollectionRails, CollectionTiles, FAQSection, FeaturedProductBlock, GoogleReviewsSection, Home(), HowItWorks, StorySection (+11 more)

### Community 5 - "react"
Cohesion: 0.11
Nodes (27): CreateProductPage(), EditProductPage(), ProductRow, CreateProductPage(), EditProductPage(), ProductRow, AdditionalInfoPart(), AdditionalInfoPartProps (+19 more)

### Community 6 - "axios.ts"
Cohesion: 0.11
Nodes (24): UserDashboardPage(), UserLayout(), DashboardIndexPage(), AuditLog, AuditLogsPage(), SuperadminLayout(), PageInitialData, LoginForm() (+16 more)

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

### Community 11 - "MediaManager"
Cohesion: 0.15
Nodes (17): MediaLibraryPage(), MediaLibraryPage(), GeneralSettingsPage(), EMPTY, Field(), ImagePicker(), OrderFormHeroEditor(), OrderHeroConfig (+9 more)

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
Cohesion: 0.10
Nodes (28): BannerConfig, CategoryBarConfig, ColorInput(), DEFAULTS, FaqConfig, FaqItem, FAQList(), Field() (+20 more)

### Community 18 - "getPageBySlug"
Cohesion: 0.05
Nodes (71): AboutContent(), AboutUsPage(), generateMetadata(), CancellationContent(), CancellationPolicyPage(), generateMetadata(), ContactContent(), ContactPage() (+63 more)

### Community 19 - "AdminForm.tsx"
Cohesion: 0.16
Nodes (16): AdminAddress, AdminForm(), AdminFormData, AdminFormSectionProps, AdminInitialData, ADDRESS_TYPES, AddressInput(), AddressInputProps (+8 more)

### Community 20 - "PageCreationForm.tsx"
Cohesion: 0.12
Nodes (19): BlockTypeButton(), PageBlock, PageBlockData, PageCreationForm(), PageFormProps, PageInitialData, QuillWrapperProps, ReactQuill (+11 more)

### Community 21 - "_OrderForm.tsx"
Cohesion: 0.20
Nodes (14): FieldError(), FieldLabel(), FormValues, KiteRibbon(), OrderForm(), OrderFormProps, RadioCard, RadioCardProps (+6 more)

### Community 22 - "ChatManager.tsx"
Cohesion: 0.17
Nodes (15): AdminMessagesPage(), AdminMessagesPage(), ChatBox(), SessionData, ChatManager(), ChatTable(), ChatTableProps, ChatTableToolbar() (+7 more)

### Community 23 - "Navbar.tsx"
Cohesion: 0.18
Nodes (13): CategoryBarConfig, MegaMenu(), MenuCategory, safeColor(), DrawerCategory, IconRenderer, MobileCategoryDrawer(), MobileCategoryDrawerProps (+5 more)

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

### Community 29 - "admin/categories/page.tsx"
Cohesion: 0.38
Nodes (7): CategoriesManagementPage(), Category, CategoriesManagementPage(), Category, CategoryForm(), CategoryTable(), ViewCategoryModal()

### Community 30 - "backend/package.json"
Cohesion: 0.07
Nodes (28): author, description, axios, @types/node, typescript, keywords, license, main (+20 more)

### Community 31 - "IconRenderer"
Cohesion: 0.22
Nodes (13): DEFAULT_CONFIG, FooterConfig, FooterContact, FooterLink, FooterManagementPage(), IconLabelList(), StepList(), SocialLink (+5 more)

### Community 32 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, postinstall, prisma:generate, prisma:migrate, prisma:seed, prisma:seed:pages (+2 more)

### Community 33 - "seed.ts"
Cohesion: 0.18
Nodes (16): BRAND, buildFooterConfig(), buildHomepageConfig(), ensureMedia(), main(), MediaSpec, ProductSpec, seedCategories() (+8 more)

### Community 34 - "frontend/package.json"
Cohesion: 0.08
Nodes (24): eslintConfig, axios, @types/node, typescript, name, private, version, TanstackProviderProps (+16 more)

### Community 35 - "products/[slug]/page.tsx"
Cohesion: 0.23
Nodes (12): fetchProduct(), fetchRelated(), generateMetadata(), ProductDetailsPage(), RelatedProduct, revalidate, CollectionRails(), FlatCategory (+4 more)

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

### Community 45 - "getSettings.ts"
Cohesion: 0.31
Nodes (7): CategoriesPage(), metadata, revalidate, CollectionTiles(), CollectionTilesProps, TileCategory, getCategoriesFlat()

### Community 46 - "categories/[slug]/page.tsx"
Cohesion: 0.16
Nodes (16): Category, fetchAllCategories(), fetchCategory(), fetchCategoryProducts(), generateMetadata(), revalidate, SingleCategoryPage(), SearchContent() (+8 more)

### Community 47 - "page.routes.ts"
Cohesion: 0.38
Nodes (8): createPage(), deletePage(), generateSlug(), getAllPages(), getPageBySlug(), isAdminReq(), updatePage(), router

### Community 48 - "Tailwind v4 + Dynamic Theme (ginag-frontend)"
Cohesion: 0.13
Nodes (13): Conditional required fields (Zod refinement), Existing reference forms, react-hook-form + Zod (ginag-frontend), Standard form skeleton, Theme-aware styling, Watching values for conditional UI, Adding a new token, Dark mode (+5 more)

### Community 49 - "theme.routes.ts"
Cohesion: 0.36
Nodes (8): createTheme(), deleteTheme(), getActiveTheme(), getAllThemes(), getPublicThemes(), toggleThemeProperty(), updateTheme(), router

### Community 50 - "mailer.ts"
Cohesion: 0.28
Nodes (12): BRAND, contactBlock(), DELIVERY_STATUS_LABELS, emailShell(), escapeHtml(), getTransporter(), ORDER_TYPE_LABELS, renderDeliveryStatusUpdate() (+4 more)

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

### Community 56 - "ProfilePage"
Cohesion: 0.43
Nodes (4): page(), page(), page(), ProfilePage()

### Community 57 - "audit.controller.ts"
Cohesion: 0.48
Nodes (5): deleteAllAuditLogs(), deleteAuditLog(), getAuditLogById(), getAuditLogs(), router

### Community 58 - "lucide-react"
Cohesion: 0.24
Nodes (6): AdminLayout(), CustomerChatsPage(), AdminSidebar(), ChatMessage, CustomerChatBox(), lucide-react

### Community 59 - "CategoryTable.tsx"
Cohesion: 0.24
Nodes (7): CategoryFormProps, CategoryTableProps, SortIcon(), SortKey, AdminCategory, ViewCategoryModalProps, react-icons

### Community 60 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, upload

### Community 61 - "Next.js 16 App Router (ginag-frontend)"
Cohesion: 0.22
Nodes (8): Data fetching, File conventions, Metadata, Next.js 16 App Router (ginag-frontend), Project layout, Provider stack (top → bottom inside `<body>`), Server vs client components, Theme bootstrap (no flash)

### Community 62 - "useCurrency"
Cohesion: 0.27
Nodes (9): FeaturedProduct, FeaturedProductBlock(), ProductInfo(), ProductInfoData, formatPriceRange(), ProductPrice(), ProductPriceProps, useCurrency() (+1 more)

### Community 63 - "CustomOrder Model"
Cohesion: 0.25
Nodes (6): Checkout customOrder Branching, payment.ts Utilities (getPaymentConfig/getStripeClient/capturePaypalOrder), renderOrderConfirmation Template, CustomOrder Model, Dropped Commerce Models (Order/Cart/Wishlist/Coupon), superRefine Conditional Required Fields

### Community 64 - "HeroManagement.tsx"
Cohesion: 0.47
Nodes (4): SuperAdminHeroPage(), HeroManagement(), HeroManagementProps, HeroRecord

### Community 65 - "order-now/page.tsx"
Cohesion: 0.33
Nodes (8): KiteMark(), KiteRibbon(), OrderHero(), OrderHeroData, buildProductPrefill(), metadata, OrderNowPage(), revalidate

### Community 66 - "HeroForm"
Cohesion: 0.60
Nodes (3): SuperAdminHeroCreatePage(), SuperAdminHeroEditPage(), HeroForm()

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

### Community 71 - "_ShopClient.tsx"
Cohesion: 0.29
Nodes (5): metadata, ShopCategory, ShopFilters, ShopPage(), ShopProduct

### Community 72 - "Cloudinary Media Pipeline (ginag-backend)"
Cohesion: 0.33
Nodes (5): Adding a new upload endpoint, Cloudinary Media Pipeline (ginag-backend), Gotchas, How uploads work (in order), Where things live

### Community 73 - "IconRenderer.tsx"
Cohesion: 0.20
Nodes (8): HowItWorks(), HowItWorksData, HowItWorksProps, HowItWorksStep, IconRenderer, SocialLink, IconLibrary, IconRendererProps

### Community 74 - "StorySection.tsx"
Cohesion: 0.40
Nodes (4): LEGACY_ICON_ALIASES, StoryHighlight, StorySection(), StorySectionData

### Community 75 - "Nodemailer + Gmail (backend)"
Cohesion: 0.40
Nodes (4): Gotchas, Nodemailer + Gmail (backend), Pre-built templates, Sending a transactional email

### Community 76 - "swiper.d.ts"
Cohesion: 0.40
Nodes (4): swiper/css, swiper/css/autoplay, swiper/css/navigation, swiper/css/pagination

### Community 77 - "sitemap.ts"
Cohesion: 0.67
Nodes (3): fetchSlugs(), sitemap(), staticRoutes

### Community 78 - "StickyBanner.tsx"
Cohesion: 0.29
Nodes (6): RangeInput(), BANNER_FONT_SIZE, BANNER_SPEED, clamp(), StickyBannerData, StickyBannerProps

### Community 79 - "next"
Cohesion: 0.08
Nodes (11): nextConfig, AdminDashboardPage(), KPI(), Overview, AdminRow, AdminTableProps, AdminUser, PageTable() (+3 more)

### Community 83 - "KiteHero.tsx"
Cohesion: 0.40
Nodes (4): HeroImageSlider(), HeroImageSliderProps, KiteHeroConfig, KiteHeroProps

### Community 90 - "Nodemailer + Gmail Skill"
Cohesion: 0.67
Nodes (3): Gmail App Password SMTP Flow, Nodemailer + Gmail Skill, sendMail Utility (utils/mailer.ts)

### Community 91 - "Ginag Monorepo"
Cohesion: 0.67
Nodes (3): Ginag Monorepo, graphify Always-on Integration, ischeghuree (repo name)

## Ambiguous Edges - Review These
- `Ginag Frontend (Next 16 + React 19 + Tailwind v4)` → `dreamreload (create-next-app README)`  [AMBIGUOUS]
  frontend/README.md · relation: conceptually_related_to
- `Ginag Backend (Express 5 + Prisma 7 + Supabase)` → `Dream E-commerce Backend (README)`  [AMBIGUOUS]
  backend/README.md · relation: conceptually_related_to

## Knowledge Gaps
- **510 isolated node(s):** `name`, `version`, `description`, `main`, `test` (+505 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 555 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Ginag Frontend (Next 16 + React 19 + Tailwind v4)` and `dreamreload (create-next-app README)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Ginag Backend (Express 5 + Prisma 7 + Supabase)` and `Dream E-commerce Backend (README)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `next` connect `next` to `app/layout.tsx`, `ProductMediaViewer.tsx`, `app/page.tsx`, `react`, `axios.ts`, `MediaManager`, `sweetalert2`, `super-admin/page.tsx`, `getPageBySlug`, `AdminForm.tsx`, `PageCreationForm.tsx`, `Navbar.tsx`, `frontend/package.json`, `products/[slug]/page.tsx`, `ProductTable.tsx`, `customer/orders/page.tsx`, `getSettings.ts`, `categories/[slug]/page.tsx`, `lucide-react`, `CategoryTable.tsx`, `useCurrency`, `HeroManagement.tsx`, `order-now/page.tsx`, `_ShopClient.tsx`, `IconRenderer.tsx`, `sitemap.ts`, `StickyBanner.tsx`, `proxy.ts`, `KiteHero.tsx`, `app/products/page.tsx`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Why does `express` connect `express` to `auth.controller.ts`, `app.ts`, `product.routes.ts`, `logAction`, `customOrder.controller.ts`, `page.routes.ts`, `theme.routes.ts`, `hero.routes.ts`, `settings.routes.ts`, `social.routes.ts`, `media.controller.ts`, `auth.middleware.ts`, `backend/package.json`, `audit.controller.ts`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `app/layout.tsx`, `ProductMediaViewer.tsx`, `app/page.tsx`, `react`, `axios.ts`, `MediaManager`, `sweetalert2`, `super-admin/page.tsx`, `homepage/page.tsx`, `getPageBySlug`, `AdminForm.tsx`, `PageCreationForm.tsx`, `_OrderForm.tsx`, `ChatManager.tsx`, `Navbar.tsx`, `OrdersInbox.tsx`, `admin/categories/page.tsx`, `IconRenderer`, `frontend/package.json`, `products/[slug]/page.tsx`, `ProductTable.tsx`, `customer/orders/page.tsx`, `categories/[slug]/page.tsx`, `useCurrency`, `HeroManagement.tsx`, `order-now/page.tsx`, `_ShopClient.tsx`, `IconRenderer.tsx`, `StorySection.tsx`, `StickyBanner.tsx`, `next`, `KiteHero.tsx`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _510 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app/layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05974025974025974 - nodes in this community are weakly interconnected._