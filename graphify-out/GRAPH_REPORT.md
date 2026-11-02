# Graph Report - ischeghuree  (2026-11-02)

## Corpus Check
- 260 files · ~170,970 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 2, .prisma 1)

## Summary
- 1451 nodes · 3079 edges · 82 communities (77 shown, 5 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 128 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `afc4c2d0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- app/layout.tsx
- Project Skills Registry
- PageCreationForm.tsx
- dependencies
- app/page.tsx
- ProductForm.tsx
- axios.ts
- logAction
- express
- dependencies
- customOrder.controller.ts
- order-form/page.tsx
- ref_axios
- compilerOptions
- compilerOptions
- api
- devDependencies
- homepage/page.tsx
- getPageBySlug
- AdminForm.tsx
- HeroForm
- _OrderForm.tsx
- ChatManager.tsx
- ProductCard.tsx
- media.controller.ts
- auth.middleware.ts
- ইচ্ছে ঘুড়ি — Ische Ghuree · Brand Data
- OrdersInbox.tsx
- skills.sh
- FeaturedProductBlock.tsx
- backend/package.json
- StickyBanner.tsx
- scripts
- seed.ts
- frontend/package.json
- ProductInfo.tsx
- app.ts
- /graphify
- prisma.ts
- product.controller.ts
- What You Must Do When Invoked
- devDependencies
- status.controller.ts
- customer/orders/page.tsx
- server.ts
- products/[slug]/page.tsx
- ProductMediaViewer.tsx
- order-now/page.tsx
- Tailwind v4 + Dynamic Theme (ginag-frontend)
- theme.routes.ts
- page.routes.ts
- Prisma 7 + Supabase Workflow
- hero.routes.ts
- Changes — Ische Ghuree rebrand (2026-08-12)
- settings.controller.ts
- social.routes.ts
- ProfilePage
- audit.controller.ts
- lucide-react
- MediaManager
- scripts
- Next.js 16 App Router (ginag-frontend)
- CollectionTiles.tsx
- Nodemailer + Gmail Skill
- KiteHero.tsx
- PageMediaAddin
- TrustBar.tsx
- Step 3 - Extract entities and relationships
- Ische Ghuree
- Prisma 7 (ginag-backend)
- Dream E-commerce Backend (README)
- app/products/page.tsx
- Cloudinary Media Pipeline (ginag-backend)
- Navbar.tsx
- Nodemailer + Gmail (backend)
- swiper.d.ts
- sitemap.ts
- next
- postcss.config.mjs
- utils.ts
- proxy.ts
- global.d.ts

## God Nodes (most connected - your core abstractions)
1. `lucide-react` - 102 edges
2. `react` - 99 edges
3. `next` - 87 edges
4. `api` - 53 edges
5. `logAction()` - 48 edges
6. `express` - 41 edges
7. `getPageBySlug()` - 31 edges
8. `sweetalert2` - 26 edges
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
Nodes (43): ActiveTheme, ColorsPage(), hexToHsl(), hslToHex(), VARIABLE_LABELS, generateMetadata(), hindSiliguri, notoSerifBengali (+35 more)

### Community 1 - "Project Skills Registry"
Cohesion: 0.18
Nodes (13): Ginag Frontend (Next 16 + React 19 + Tailwind v4), Ginag Monorepo, graphify Always-on Integration, Shared Axios Instance (src/lib/axios.ts), Next.js 16 App Router Conventions, Frontend Provider Stack, Server vs Client Component Split, Project Skills Registry (+5 more)

### Community 2 - "PageCreationForm.tsx"
Cohesion: 0.14
Nodes (15): BlockTypeButton(), PageBlock, PageBlockData, PageCreationForm(), PageFormProps, PageInitialData, QuillWrapperProps, ReactQuill (+7 more)

### Community 3 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, axios, date-fns, framer-motion, @hookform/resolvers, js-cookie, lucide-react, next (+17 more)

### Community 4 - "app/page.tsx"
Cohesion: 0.17
Nodes (14): CollectionRails, CollectionTiles, FAQSection, FeaturedProductBlock, GoogleReviewsSection, Home(), HowItWorks, StorySection (+6 more)

### Community 5 - "ProductForm.tsx"
Cohesion: 0.10
Nodes (30): CreateProductPage(), EditProductPage(), ProductRow, CreateProductPage(), EditProductPage(), ProductRow, AdditionalInfoPart(), AdditionalInfoPartProps (+22 more)

### Community 6 - "axios.ts"
Cohesion: 0.13
Nodes (22): AdminLayout(), UserDashboardPage(), UserLayout(), DashboardIndexPage(), SuperadminLayout(), LoginForm(), LoginPage(), RegisterPage() (+14 more)

### Community 7 - "logAction"
Cohesion: 0.21
Nodes (19): logAction(), convertToWebP(), createAdminAccount(), createUser(), deleteUser(), getAdminByUsername(), getAllAdmins(), getAllUsers() (+11 more)

### Community 8 - "express"
Cohesion: 0.09
Nodes (26): login(), adminSendMessage(), bulkUpdateSessionStatus(), getAllSessions(), getSessionHistory(), updateSessionStatus(), CachedReviews, getGoogleReviews() (+18 more)

### Community 9 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, axios, bcrypt, bcryptjs, cloudinary, cookie-parser, cors, dotenv (+15 more)

### Community 10 - "customOrder.controller.ts"
Cohesion: 0.14
Nodes (26): createCustomOrder(), deleteCustomOrder(), DeliveryStatusValue, generateOrderNumber(), getCustomOrder(), isAdminUser(), listCustomOrders(), listMyCustomOrders() (+18 more)

### Community 11 - "order-form/page.tsx"
Cohesion: 0.12
Nodes (16): AuditLog, AuditLogsPage(), SuperAdminHeroPage(), EMPTY, Field(), ImagePicker(), OrderFormHeroEditor(), OrderHeroConfig (+8 more)

### Community 12 - "ref_axios"
Cohesion: 0.29
Nodes (9): AdminCustomersPage(), AdminsPage(), Avatar(), RoleChips(), STATUS_STYLE, UserRow, UserTable(), UserTableProps (+1 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, ignoreDeprecations, module, moduleResolution, noEmitOnError, noImplicitAny (+9 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 15 - "api"
Cohesion: 0.14
Nodes (11): AdminDashboardPage(), KPI(), Overview, Address, AddressType, initialFormState, ChartPoint, KPI() (+3 more)

### Community 16 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, nodemon, prisma, ts-node, @types/bcrypt, @types/cookie-parser, @types/cors, @types/express (+8 more)

### Community 17 - "homepage/page.tsx"
Cohesion: 0.10
Nodes (28): BannerMessageList(), CategoryBarConfig, ColorInput(), DEFAULTS, FaqConfig, FaqItem, FAQList(), Field() (+20 more)

### Community 18 - "getPageBySlug"
Cohesion: 0.05
Nodes (72): AboutContent(), AboutUsPage(), generateMetadata(), CancellationContent(), CancellationPolicyPage(), generateMetadata(), ContactContent(), ContactPage() (+64 more)

### Community 19 - "AdminForm.tsx"
Cohesion: 0.17
Nodes (15): AdminAddress, AdminForm(), AdminFormData, AdminFormSectionProps, AdminInitialData, ADDRESS_TYPES, AddressInput(), AddressInputProps (+7 more)

### Community 20 - "HeroForm"
Cohesion: 0.60
Nodes (3): SuperAdminHeroCreatePage(), SuperAdminHeroEditPage(), HeroForm()

### Community 21 - "_OrderForm.tsx"
Cohesion: 0.20
Nodes (14): FieldError(), FieldLabel(), FormValues, KiteRibbon(), OrderForm(), OrderFormProps, RadioCard, RadioCardProps (+6 more)

### Community 22 - "ChatManager.tsx"
Cohesion: 0.18
Nodes (13): AdminMessagesPage(), AdminMessagesPage(), ChatBox(), ChatManager(), ChatTable(), ChatTableProps, ChatTableToolbar(), ChatTableToolbarProps (+5 more)

### Community 23 - "ProductCard.tsx"
Cohesion: 0.14
Nodes (16): SearchContent(), SearchPage(), SearchResult, metadata, ShopCategory, ShopFilters, ShopPage(), ShopProduct (+8 more)

### Community 24 - "media.controller.ts"
Cohesion: 0.11
Nodes (18): storage, upload, convertFile(), convertToWebM(), convertToWebP(), createMedia(), deleteMedia(), getAllMedia() (+10 more)

### Community 25 - "auth.middleware.ts"
Cohesion: 0.17
Nodes (15): getChartData(), getDashboardOverview(), createCategory(), deleteCategory(), getCategories(), getCategoryBySlug(), updateCategory(), authorize() (+7 more)

### Community 26 - "ইচ্ছে ঘুড়ি — Ische Ghuree · Brand Data"
Cohesion: 0.05
Nodes (38): API overview (`src/routes/index.ts`), Environment variables (`.env.example`), Ische Ghuree — Backend API, Layout, Setup & run, Stack, Business Model Notes, Contact (+30 more)

### Community 27 - "OrdersInbox.tsx"
Cohesion: 0.07
Nodes (33): AdminOrdersPage(), ProductsManagementPage(), SuperAdminOrdersPage(), ProductsManagementPage(), CustomOrder, DELIVERY_STATUS_STYLE, DELIVERY_STATUSES, DeliveryDraft (+25 more)

### Community 28 - "skills.sh"
Cohesion: 0.42
Nodes (12): err(), graphify_install(), graphify_status(), graphify_uninstall(), local_skills_install(), local_skills_status(), local_skills_uninstall(), log() (+4 more)

### Community 29 - "FeaturedProductBlock.tsx"
Cohesion: 0.39
Nodes (6): FeaturedProduct, FeaturedProductBlock(), formatPriceRange(), ProductPrice(), ProductPriceProps, getFeaturedProducts()

### Community 30 - "backend/package.json"
Cohesion: 0.07
Nodes (28): author, description, axios, @types/node, typescript, keywords, license, main (+20 more)

### Community 31 - "StickyBanner.tsx"
Cohesion: 0.19
Nodes (14): BannerConfig, MarqueeTicker(), MarqueeTickerProps, BANNER_FONT_SIZE, BANNER_GAP, BANNER_SPEED, BannerMessage, clamp() (+6 more)

### Community 32 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, postinstall, prisma:generate, prisma:migrate, prisma:seed, prisma:seed:pages (+2 more)

### Community 33 - "seed.ts"
Cohesion: 0.18
Nodes (16): BRAND, buildFooterConfig(), buildHomepageConfig(), ensureMedia(), main(), MediaSpec, ProductSpec, seedCategories() (+8 more)

### Community 34 - "frontend/package.json"
Cohesion: 0.09
Nodes (21): eslintConfig, axios, @types/node, typescript, name, private, version, babel-plugin-react-compiler (+13 more)

### Community 35 - "ProductInfo.tsx"
Cohesion: 0.25
Nodes (11): InfoProduct, MediaViewerProps, ProductDetailHero(), ProductDetailHeroProps, hasPrice(), ProductInfo(), ProductInfoData, ProductInfoProps (+3 more)

### Community 36 - "app.ts"
Cohesion: 0.15
Nodes (9): allowedOriginPatterns, allowedOrigins, globalErrorHandler(), apiLimiter, writeLimiter, router, cookie-parser, cors (+1 more)

### Community 37 - "/graphify"
Cohesion: 0.10
Nodes (18): AST Structural Extraction, Community Detection, Incremental --update Re-extraction, Parallel Semantic Extraction Subagents, For --cluster-only, For git commit hook, For /graphify add, For /graphify explain (+10 more)

### Community 38 - "prisma.ts"
Cohesion: 0.19
Nodes (10): adapter, globalForPrisma, adapter, pages, pool, prisma, dotenv, pg (+2 more)

### Community 39 - "product.controller.ts"
Cohesion: 0.12
Nodes (29): cleanPrice(), createProduct(), deleteProduct(), getProductById(), getProductBySlug(), getProductFilters(), getProducts(), HIDDEN_STATUSES (+21 more)

### Community 40 - "What You Must Do When Invoked"
Cohesion: 0.13
Nodes (15): Step 0 - Clone GitHub repo(s) (only if a GitHub URL was given), Step 1 - Ensure graphify is installed, Step 2.5 - Transcribe video / audio files (only if video files detected), Step 2 - Detect files, Step 4 - Build graph, cluster, analyze, generate outputs, Step 5 - Label communities, Step 6 - Generate Obsidian vault (opt-in) + HTML, Step 6b - Wiki (only if --wiki flag) (+7 more)

### Community 41 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, babel-plugin-react-compiler, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @tanstack/react-query-devtools, @types/js-cookie (+6 more)

### Community 42 - "status.controller.ts"
Cohesion: 0.29
Nodes (10): escapeHtml(), formatTime(), getServiceStatus(), LABELS, renderPage(), resolveState(), ServiceState, ServiceStatus (+2 more)

### Community 43 - "customer/orders/page.tsx"
Cohesion: 0.18
Nodes (12): CustomerOrdersPage(), CustomOrder, DELIVERY_LABEL, DELIVERY_STATUS_STYLE, DELIVERY_TIMELINE, DeliveryPanel(), DeliveryStatus, DetailRow() (+4 more)

### Community 44 - "server.ts"
Cohesion: 0.23
Nodes (8): app, allowedOriginPatterns, allowedOrigins, isSocketOriginAllowed(), main(), setupChatSocket(), jsonwebtoken, socket.io

### Community 45 - "products/[slug]/page.tsx"
Cohesion: 0.23
Nodes (12): fetchProduct(), fetchRelated(), generateMetadata(), ProductDetailsPage(), RelatedProduct, revalidate, CollectionRails(), FlatCategory (+4 more)

### Community 46 - "ProductMediaViewer.tsx"
Cohesion: 0.14
Nodes (16): Frame, Product360Viewer(), Props, Model(), Product3DViewer(), GalleryImage, ProductGallery(), ProductGalleryProps (+8 more)

### Community 47 - "order-now/page.tsx"
Cohesion: 0.33
Nodes (8): KiteMark(), KiteRibbon(), OrderHero(), OrderHeroData, buildProductPrefill(), metadata, OrderNowPage(), revalidate

### Community 48 - "Tailwind v4 + Dynamic Theme (ginag-frontend)"
Cohesion: 0.13
Nodes (13): Conditional required fields (Zod refinement), Existing reference forms, react-hook-form + Zod (ginag-frontend), Standard form skeleton, Theme-aware styling, Watching values for conditional UI, Adding a new token, Dark mode (+5 more)

### Community 49 - "theme.routes.ts"
Cohesion: 0.36
Nodes (8): createTheme(), deleteTheme(), getActiveTheme(), getAllThemes(), getPublicThemes(), toggleThemeProperty(), updateTheme(), router

### Community 50 - "page.routes.ts"
Cohesion: 0.38
Nodes (8): createPage(), deletePage(), generateSlug(), getAllPages(), getPageBySlug(), isAdminReq(), updatePage(), router

### Community 51 - "Prisma 7 + Supabase Workflow"
Cohesion: 0.24
Nodes (8): Backend pnpm allowBuilds (prisma/sharp/ffmpeg-static/bcrypt), Ginag Backend (Express 5 + Prisma 7 + Supabase), Cloudinary Streaming Upload, convertToWebM (fluent-ffmpeg), convertToWebP (sharp), Media Model (Prisma), Multer Memory Storage, Prisma 7 + Supabase Workflow

### Community 52 - "hero.routes.ts"
Cohesion: 0.43
Nodes (6): createHeroSection(), deleteHeroSection(), getActiveHeroSections(), getAllHeroSections(), updateHeroSection(), router

### Community 53 - "Changes — Ische Ghuree rebrand (2026-08-12)"
Cohesion: 0.18
Nodes (10): Brand source, Changes — Ische Ghuree rebrand (2026-08-12), Dead code / dead config deleted, Known design decisions, Public-surface bug fixes, Required operator steps (deploy checklist), Schema (`backend/prisma/schema.prisma`), Seeds (+2 more)

### Community 54 - "settings.controller.ts"
Cohesion: 0.40
Nodes (8): BadMaintenanceDate, getHomepageConfig(), getSettings(), isAdmin(), parseWhen(), stripSecrets(), updateHomepageSection(), updateSettings()

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
Cohesion: 0.11
Nodes (19): CustomerChatsPage(), SelectedMedia, AdminUser, fromLocalInput(), GeneralSettingsPage(), toLocalInput(), PageInitialData, SessionData (+11 more)

### Community 59 - "MediaManager"
Cohesion: 0.07
Nodes (48): Category, fetchAllCategories(), fetchCategory(), fetchCategoryProducts(), generateMetadata(), revalidate, SingleCategoryPage(), CategoriesManagementPage() (+40 more)

### Community 60 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, upload

### Community 61 - "Next.js 16 App Router (ginag-frontend)"
Cohesion: 0.22
Nodes (8): Data fetching, File conventions, Metadata, Next.js 16 App Router (ginag-frontend), Project layout, Provider stack (top → bottom inside `<body>`), Server vs client components, Theme bootstrap (no flash)

### Community 62 - "CollectionTiles.tsx"
Cohesion: 0.36
Nodes (7): CategoriesPage(), metadata, revalidate, CollectionTiles(), CollectionTilesProps, TileCategory, getCategoriesFlat()

### Community 63 - "Nodemailer + Gmail Skill"
Cohesion: 0.18
Nodes (9): Checkout customOrder Branching, payment.ts Utilities (getPaymentConfig/getStripeClient/capturePaypalOrder), Gmail App Password SMTP Flow, Nodemailer + Gmail Skill, renderOrderConfirmation Template, sendMail Utility (utils/mailer.ts), CustomOrder Model, Dropped Commerce Models (Order/Cart/Wishlist/Coupon) (+1 more)

### Community 64 - "KiteHero.tsx"
Cohesion: 0.38
Nodes (5): HeroImageSlider(), HeroImageSliderProps, KiteHero(), KiteHeroConfig, KiteHeroProps

### Community 65 - "PageMediaAddin"
Cohesion: 0.40
Nodes (4): HeroImagesPicker(), IconBtn(), PageMediaAddin(), MediaManagerProps

### Community 66 - "TrustBar.tsx"
Cohesion: 0.40
Nodes (4): DEFAULT_FEATURES, ICON_MAP, TrustBarData, TrustBarItem

### Community 67 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

### Community 68 - "Ische Ghuree"
Cohesion: 0.29
Nodes (6): Common commands, Conventions, Domain contracts (do not reintroduce jewelry-era fields), graphify, Ische Ghuree, Skills

### Community 69 - "Prisma 7 (ginag-backend)"
Cohesion: 0.29
Nodes (6): After changing the schema, Connection strings, Current models (post-pivot to catalog + custom orders), Migration workflow, Prisma 7 (ginag-backend), Prisma 7 gotcha — datasource block

### Community 70 - "Dream E-commerce Backend (README)"
Cohesion: 0.33
Nodes (6): Dream E-commerce Backend (README), Gemstone Theme API, Md. Jamil Shikder (author, Rajseba Design Studio), Multi-identifier Login (Email/Phone/Username), Role-Based Access Control (Super Admin/Admin/Customer), StoreTheme Model

### Community 72 - "Cloudinary Media Pipeline (ginag-backend)"
Cohesion: 0.33
Nodes (5): Adding a new upload endpoint, Cloudinary Media Pipeline (ginag-backend), Gotchas, How uploads work (in order), Where things live

### Community 73 - "Navbar.tsx"
Cohesion: 0.12
Nodes (22): BasicInfoPart(), BasicInfoPartProps, CategoryBarConfig, IconRenderer, MegaMenu(), MenuCategory, safeColor(), DrawerCategory (+14 more)

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
Cohesion: 0.09
Nodes (7): nextConfig, AdminRow, AdminTableProps, PageTable(), StorefrontPage, StorefrontPagesDashboard(), next

## Ambiguous Edges - Review These
- `Ginag Frontend (Next 16 + React 19 + Tailwind v4)` → `dreamreload (create-next-app README)`  [AMBIGUOUS]
  frontend/README.md · relation: conceptually_related_to
- `Ginag Backend (Express 5 + Prisma 7 + Supabase)` → `Dream E-commerce Backend (README)`  [AMBIGUOUS]
  backend/README.md · relation: conceptually_related_to

## Knowledge Gaps
- **524 isolated node(s):** `name`, `version`, `description`, `main`, `test` (+519 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 569 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Ginag Frontend (Next 16 + React 19 + Tailwind v4)` and `dreamreload (create-next-app README)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Ginag Backend (Express 5 + Prisma 7 + Supabase)` and `Dream E-commerce Backend (README)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `express` connect `express` to `app.ts`, `product.controller.ts`, `logAction`, `customOrder.controller.ts`, `status.controller.ts`, `theme.routes.ts`, `page.routes.ts`, `hero.routes.ts`, `settings.controller.ts`, `social.routes.ts`, `media.controller.ts`, `auth.middleware.ts`, `backend/package.json`, `audit.controller.ts`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Why does `react` connect `lucide-react` to `app/layout.tsx`, `PageCreationForm.tsx`, `app/page.tsx`, `ProductForm.tsx`, `axios.ts`, `order-form/page.tsx`, `ref_axios`, `api`, `homepage/page.tsx`, `getPageBySlug`, `AdminForm.tsx`, `_OrderForm.tsx`, `ChatManager.tsx`, `ProductCard.tsx`, `OrdersInbox.tsx`, `StickyBanner.tsx`, `frontend/package.json`, `ProductInfo.tsx`, `customer/orders/page.tsx`, `products/[slug]/page.tsx`, `ProductMediaViewer.tsx`, `MediaManager`, `KiteHero.tsx`, `Navbar.tsx`, `next`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `app/layout.tsx`, `PageCreationForm.tsx`, `app/page.tsx`, `ProductForm.tsx`, `axios.ts`, `order-form/page.tsx`, `ref_axios`, `api`, `homepage/page.tsx`, `getPageBySlug`, `AdminForm.tsx`, `_OrderForm.tsx`, `ChatManager.tsx`, `ProductCard.tsx`, `OrdersInbox.tsx`, `FeaturedProductBlock.tsx`, `StickyBanner.tsx`, `frontend/package.json`, `ProductInfo.tsx`, `customer/orders/page.tsx`, `products/[slug]/page.tsx`, `ProductMediaViewer.tsx`, `order-now/page.tsx`, `MediaManager`, `KiteHero.tsx`, `TrustBar.tsx`, `Navbar.tsx`, `next`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _524 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app/layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.059932659932659935 - nodes in this community are weakly interconnected._