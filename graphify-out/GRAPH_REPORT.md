# Graph Report - .  (2026-08-12)

## Corpus Check
- 259 files · ~116,590 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1048 nodes · 1579 edges · 90 communities (59 shown, 31 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.9)
- Token cost: 168,040 input · 3,056 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Media Upload & Audit|Media Upload & Audit]]
- [[_COMMUNITY_Project Docs & Skills|Project Docs & Skills]]
- [[_COMMUNITY_Categories & Footer Config|Categories & Footer Config]]
- [[_COMMUNITY_Frontend Dependencies|Frontend Dependencies]]
- [[_COMMUNITY_Admin Forms & Addresses|Admin Forms & Addresses]]
- [[_COMMUNITY_Root Layout & Theming|Root Layout & Theming]]
- [[_COMMUNITY_Homepage Featured Sections|Homepage Featured Sections]]
- [[_COMMUNITY_Auth & Rate Limiting|Auth & Rate Limiting]]
- [[_COMMUNITY_Static Info Pages|Static Info Pages]]
- [[_COMMUNITY_Backend Dependencies|Backend Dependencies]]
- [[_COMMUNITY_Product Detail & 360 Viewer|Product Detail & 360 Viewer]]
- [[_COMMUNITY_Custom Order Controller|Custom Order Controller]]
- [[_COMMUNITY_Product Form Parts|Product Form Parts]]
- [[_COMMUNITY_Backend TSConfig|Backend TSConfig]]
- [[_COMMUNITY_Frontend TSConfig|Frontend TSConfig]]
- [[_COMMUNITY_Dynamic Storefront Pages|Dynamic Storefront Pages]]
- [[_COMMUNITY_Backend Dev Dependencies|Backend Dev Dependencies]]
- [[_COMMUNITY_Admin Orders Inbox|Admin Orders Inbox]]
- [[_COMMUNITY_Dashboard Layouts|Dashboard Layouts]]
- [[_COMMUNITY_Homepage Product Grids|Homepage Product Grids]]
- [[_COMMUNITY_Contact & Manifest|Contact & Manifest]]
- [[_COMMUNITY_Homepage Composition|Homepage Composition]]
- [[_COMMUNITY_Prisma Client & Analytics|Prisma Client & Analytics]]
- [[_COMMUNITY_Google Reviews & Search|Google Reviews & Search]]
- [[_COMMUNITY_Category Management UI|Category Management UI]]
- [[_COMMUNITY_Custom Order Form|Custom Order Form]]
- [[_COMMUNITY_Admin Users Table|Admin Users Table]]
- [[_COMMUNITY_Skills Install Script|Skills Install Script]]
- [[_COMMUNITY_Shop Filter Sidebar|Shop Filter Sidebar]]
- [[_COMMUNITY_Backend Package Metadata|Backend Package Metadata]]
- [[_COMMUNITY_Customer Orders Page|Customer Orders Page]]
- [[_COMMUNITY_Backend npm Scripts|Backend npm Scripts]]
- [[_COMMUNITY_Login & Role Redirect|Login & Role Redirect]]
- [[_COMMUNITY_Customer Chat Widget|Customer Chat Widget]]
- [[_COMMUNITY_Pages Controller|Pages Controller]]
- [[_COMMUNITY_Theme Controller|Theme Controller]]
- [[_COMMUNITY_Products Management UI|Products Management UI]]
- [[_COMMUNITY_Chat Controller & Routes|Chat Controller & Routes]]
- [[_COMMUNITY_Site Settings Controller|Site Settings Controller]]
- [[_COMMUNITY_Social Links API|Social Links API]]
- [[_COMMUNITY_Customer Profile Pages|Customer Profile Pages]]
- [[_COMMUNITY_Shipping Policy Pages|Shipping Policy Pages]]
- [[_COMMUNITY_Cancellation Policy Pages|Cancellation Policy Pages]]
- [[_COMMUNITY_Hero Create & Edit|Hero Create & Edit]]
- [[_COMMUNITY_Special Collections API|Special Collections API]]
- [[_COMMUNITY_Order Hero Section|Order Hero Section]]
- [[_COMMUNITY_Pages Seed Script|Pages Seed Script]]
- [[_COMMUNITY_Customer Addresses Page|Customer Addresses Page]]
- [[_COMMUNITY_Storefront Pages Dashboard|Storefront Pages Dashboard]]
- [[_COMMUNITY_Hero Management|Hero Management]]
- [[_COMMUNITY_Shop Page|Shop Page]]
- [[_COMMUNITY_Superadmin Dashboard|Superadmin Dashboard]]
- [[_COMMUNITY_Exchange Policy Template|Exchange Policy Template]]
- [[_COMMUNITY_Theme Colors Page|Theme Colors Page]]
- [[_COMMUNITY_Admin Dashboard|Admin Dashboard]]
- [[_COMMUNITY_Sitemap Generation|Sitemap Generation]]
- [[_COMMUNITY_Customer Layout & Sidebar|Customer Layout & Sidebar]]
- [[_COMMUNITY_Footer Social Icons|Footer Social Icons]]
- [[_COMMUNITY_Google Reviews Section|Google Reviews Section]]
- [[_COMMUNITY_Superadmin Layout|Superadmin Layout]]
- [[_COMMUNITY_Privacy Policy Template|Privacy Policy Template]]
- [[_COMMUNITY_Terms of Service Template|Terms of Service Template]]
- [[_COMMUNITY_Admin Table|Admin Table]]
- [[_COMMUNITY_Color Form|Color Form]]
- [[_COMMUNITY_Color Table|Color Table]]
- [[_COMMUNITY_Products Index Page|Products Index Page]]
- [[_COMMUNITY_Industrial Process Section|Industrial Process Section]]
- [[_COMMUNITY_Personalization Blueprint|Personalization Blueprint]]
- [[_COMMUNITY_Technical Integrity Section|Technical Integrity Section]]
- [[_COMMUNITY_API Proxy|API Proxy]]
- [[_COMMUNITY_Language Store|Language Store]]
- [[_COMMUNITY_Return & Refund Template|Return & Refund Template]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next Config|Next Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Brand Logo Identity|Brand Logo Identity]]

## God Nodes (most connected - your core abstractions)
1. `api` - 63 edges
2. `logAction()` - 48 edges
3. `getPageBySlug()` - 29 edges
4. `useUserStore` - 24 edges
5. `compilerOptions` - 16 edges
6. `compilerOptions` - 16 edges
7. `protect()` - 15 edges
8. `authorize()` - 15 edges
9. `getGlobalSettings()` - 12 edges
10. `scripts` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Role-Based Access Control (Super Admin/Admin/Customer)` --semantically_similar_to--> `Next.js 16 App Router Conventions`  [INFERRED] [semantically similar]
  backend/README.md → .claude/skills/next-app-router/SKILL.md
- `dreamreload (create-next-app README)` --semantically_similar_to--> `Dream E-commerce Backend (README)`  [INFERRED] [semantically similar]
  frontend/README.md → backend/README.md
- `Custom-Order Quote Flow` --semantically_similar_to--> `CustomOrder Model`  [INFERRED] [semantically similar]
  CHANGES.md → .claude/skills/prisma/SKILL.md
- `Gemstone Theme API` --semantically_similar_to--> `StoreTheme Model`  [INFERRED] [semantically similar]
  backend/README.md → .claude/skills/prisma/SKILL.md
- `dreamreload (create-next-app README)` --conceptually_related_to--> `Ginag Frontend (Next 16 + React 19 + Tailwind v4)`  [AMBIGUOUS]
  frontend/README.md → CLAUDE.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Media Upload Pipeline Stages** — cloudinary_media_skill_multer_memory_storage, cloudinary_media_skill_converttowebp, cloudinary_media_skill_converttowebm, cloudinary_media_skill_cloudinary_streaming_upload, cloudinary_media_skill_media_model [EXTRACTED 1.00]
- **Ginag Project Skill Registry** — claude_skills_registry, graphify_skill_graphify, prisma_skill_prisma_7_workflow, nodemailer_gmail_skill_nodemailer_gmail, next_app_router_skill_next_app_router, tailwind_v4_theme_skill_theme_tokens, react_hook_form_zod_skill_schema_first_forms, cloudinary_media_skill_cloudinary_media_pipeline [EXTRACTED 1.00]
- **Custom Order Feature Flow** — changes_custom_order_flow, changes_checkout_branching, prisma_skill_customorder_model, react_hook_form_zod_skill_superrefine_conditional_validation, nodemailer_gmail_skill_renderorderconfirmation [INFERRED 0.85]

## Communities (90 total, 31 thin omitted)

### Community 0 - "Media Upload & Audit"
Cohesion: 0.05
Nodes (65): storage, upload, deleteAllAuditLogs(), deleteAuditLog(), getAuditLogById(), getAuditLogs(), logAction(), createCategory() (+57 more)

### Community 1 - "Project Docs & Skills"
Cohesion: 0.06
Nodes (51): Backend pnpm allowBuilds (prisma/sharp/ffmpeg-static/bcrypt), Dream E-commerce Backend (README), Gemstone Theme API, Md. Jamil Shikder (author, Rajseba Design Studio), Multi-identifier Login (Email/Phone/Username), Role-Based Access Control (Super Admin/Admin/Customer), Checkout customOrder Branching, Custom-Order Quote Flow (+43 more)

### Community 2 - "Categories & Footer Config"
Cohesion: 0.05
Nodes (21): CategoriesPage(), getCategories(), metadata, DEFAULT_CONFIG, FooterConfig, FooterContact, FooterLink, generateMetadata() (+13 more)

### Community 3 - "Frontend Dependencies"
Cohesion: 0.04
Nodes (48): dependencies, axios, date-fns, framer-motion, @hookform/resolvers, js-cookie, lucide-react, next (+40 more)

### Community 4 - "Admin Forms & Addresses"
Cohesion: 0.05
Nodes (14): AdminForm(), ADDRESS_TYPES, AddressInputProps, DIVISIONS, FormBasicInfo(), FormStatus(), PageFormProps, ReactQuill (+6 more)

### Community 5 - "Root Layout & Theming"
Cohesion: 0.06
Nodes (29): RootLayout(), FALLBACK_DARK, FALLBACK_LIGHT, Props, ThemeProvider(), AuthContext, AuthContextType, AuthProvider() (+21 more)

### Community 6 - "Homepage Featured Sections"
Cohesion: 0.08
Nodes (7): bgColors, IconLibrary, Testimonial, api, IconRenderer, HowItWorksProps, authService

### Community 7 - "Auth & Rate Limiting"
Cohesion: 0.09
Nodes (16): login(), globalErrorHandler(), apiLimiter, authLimiter, writeLimiter, router, router, setupChatSocket() (+8 more)

### Community 8 - "Static Info Pages"
Cohesion: 0.14
Nodes (14): AboutContent(), generateMetadata(), ExchangeContent(), generateMetadata(), FAQContent(), generateMetadata(), getPageBySlug(), generateMetadata() (+6 more)

### Community 9 - "Backend Dependencies"
Cohesion: 0.08
Nodes (24): dependencies, axios, bcrypt, bcryptjs, cloudinary, cookie-parser, cors, dotenv (+16 more)

### Community 10 - "Product Detail & 360 Viewer"
Cohesion: 0.11
Nodes (14): generateMetadata(), Frame, Product360Viewer(), Props, GalleryImage, ProductGalleryProps, formatRange(), ProductInfo() (+6 more)

### Community 11 - "Custom Order Controller"
Cohesion: 0.18
Nodes (18): createCustomOrder(), deleteCustomOrder(), DeliveryStatusValue, generateOrderNumber(), getCustomOrder(), isAdminUser(), listCustomOrders(), listMyCustomOrders() (+10 more)

### Community 12 - "Product Form Parts"
Cohesion: 0.10
Nodes (5): DescriptionPart(), ReactQuill, Frame, Model3d, Props

### Community 13 - "Backend TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, noEmitOnError, noImplicitAny (+11 more)

### Community 14 - "Frontend TSConfig"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 15 - "Dynamic Storefront Pages"
Cohesion: 0.11
Nodes (5): RESERVED, AboutTemplateProps, ContactTemplateProps, FAQTemplateProps, ProcessTemplateProps

### Community 16 - "Backend Dev Dependencies"
Cohesion: 0.12
Nodes (17): devDependencies, nodemon, prisma, ts-node, @types/bcrypt, @types/cookie-parser, @types/cors, @types/express (+9 more)

### Community 17 - "Admin Orders Inbox"
Cohesion: 0.12
Nodes (9): CustomOrder, DELIVERY_STATUS_STYLE, DELIVERY_STATUSES, DeliveryDraft, DeliveryStatus, OrdersInbox(), OrderStatus, STATUS_STYLE (+1 more)

### Community 18 - "Dashboard Layouts"
Cohesion: 0.19
Nodes (9): AuditLogsPage(), ChatLogin(), UserDashboardPage(), RegisterPage(), AdminSidebar(), Role, User, UserState (+1 more)

### Community 19 - "Homepage Product Grids"
Cohesion: 0.13
Nodes (4): FeaturedProductsProps, formatRange(), ProductCard(), ProductCardProps

### Community 20 - "Contact & Manifest"
Cohesion: 0.22
Nodes (10): generateMetadata(), manifest(), ContactContent(), generateMetadata(), Footer(), getPublicSocialLinks(), getGlobalSettings(), getHomepageConfig() (+2 more)

### Community 21 - "Homepage Composition"
Cohesion: 0.13
Nodes (9): FAQSection, FeaturedProducts, GoogleReviewsSection, Home(), HowItWorks, StorySection, GinaGHeroProps, getFeaturedProducts() (+1 more)

### Community 22 - "Prisma Client & Analytics"
Cohesion: 0.19
Nodes (9): adapter, globalForPrisma, getChartData(), getDashboardOverview(), authorize(), protect(), Request, router (+1 more)

### Community 23 - "Google Reviews & Search"
Cohesion: 0.16
Nodes (11): CachedReviews, getGoogleReviews(), globalSearch(), router, router, moduleRoutes, router, router (+3 more)

### Community 24 - "Category Management UI"
Cohesion: 0.16
Nodes (4): CategoryFormProps, CategoryTableProps, SortKey, ViewCategoryModalProps

### Community 26 - "Custom Order Form"
Cohesion: 0.14
Nodes (9): BOTTOM_RIGHT_DOTS, FormValues, Schema, SquareCheckbox, SquareCheckboxProps, TOP_RIGHT_DOTS, UnderlineField, UnderlineFieldProps (+1 more)

### Community 27 - "Admin Users Table"
Cohesion: 0.15
Nodes (3): STATUS_STYLE, UserRow, UserTableProps

### Community 28 - "Skills Install Script"
Cohesion: 0.42
Nodes (12): skills.sh script, err(), graphify_install(), graphify_status(), graphify_uninstall(), local_skills_install(), local_skills_status(), local_skills_uninstall() (+4 more)

### Community 29 - "Shop Filter Sidebar"
Cohesion: 0.26
Nodes (8): AccordionSection(), AccordionSectionProps, NicheFilterSidebar(), cn(), ProductShowcase(), Filters, ProductState, useProductStore

### Community 30 - "Backend Package Metadata"
Cohesion: 0.18
Nodes (10): author, description, keywords, license, main, name, prisma, seed (+2 more)

### Community 31 - "Customer Orders Page"
Cohesion: 0.18
Nodes (7): CustomOrder, DELIVERY_LABEL, DELIVERY_STATUS_STYLE, DELIVERY_TIMELINE, DeliveryStatus, OrderStatus, STATUS_STYLE

### Community 32 - "Backend npm Scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, postinstall, prisma:generate, prisma:migrate, prisma:seed, start (+2 more)

### Community 33 - "Login & Role Redirect"
Cohesion: 0.33
Nodes (5): LoginForm(), getDashboardRedirectPath(), getHighestRole(), Role, ROLE_HIERARCHY

### Community 35 - "Pages Controller"
Cohesion: 0.39
Nodes (7): createPage(), deletePage(), generateSlug(), getAllPages(), getPageBySlug(), updatePage(), optionalAuth()

### Community 36 - "Theme Controller"
Cohesion: 0.42
Nodes (7): createTheme(), deleteTheme(), getActiveTheme(), getAllThemes(), getPublicThemes(), toggleThemeProperty(), updateTheme()

### Community 38 - "Chat Controller & Routes"
Cohesion: 0.43
Nodes (6): adminSendMessage(), bulkUpdateSessionStatus(), getAllSessions(), getSessionHistory(), updateSessionStatus(), router

### Community 39 - "Site Settings Controller"
Cohesion: 0.50
Nodes (6): getHomepageConfig(), getSettings(), isAdmin(), stripSecrets(), updateHomepageSection(), updateSettings()

### Community 40 - "Social Links API"
Cohesion: 0.43
Nodes (6): createSocialLink(), deleteSocialLink(), getAllSocialLinks(), getPublicSocialLinks(), updateSocialLink(), router

### Community 42 - "Shipping Policy Pages"
Cohesion: 0.25
Nodes (4): generateMetadata(), ShippingContent(), deliveryStages, ShippingPolicyTemplateProps

### Community 43 - "Cancellation Policy Pages"
Cohesion: 0.33
Nodes (4): CancellationContent(), generateMetadata(), CancellationTemplate(), CancellationTemplateProps

### Community 45 - "Special Collections API"
Cohesion: 0.47
Nodes (4): getCollectionByTag(), getSpecialCollection(), productCardIncludes, router

### Community 47 - "Pages Seed Script"
Cohesion: 0.33
Nodes (4): adapter, pages, pool, prisma

### Community 48 - "Customer Addresses Page"
Cohesion: 0.40
Nodes (3): Address, AddressType, initialFormState

### Community 53 - "Exchange Policy Template"
Cohesion: 0.40
Nodes (3): doesntQualifyItems, ExchangePolicyTemplateProps, qualifiesItems

### Community 56 - "Sitemap Generation"
Cohesion: 0.67
Nodes (3): fetchSlugs(), sitemap(), staticRoutes

## Ambiguous Edges - Review These
- `Ginag Backend (Express 5 + Prisma 7 + Supabase)` → `Dream E-commerce Backend (README)`  [AMBIGUOUS]
  backend/README.md · relation: conceptually_related_to
- `Ginag Frontend (Next 16 + React 19 + Tailwind v4)` → `dreamreload (create-next-app README)`  [AMBIGUOUS]
  frontend/README.md · relation: conceptually_related_to

## Knowledge Gaps
- **332 isolated node(s):** `name`, `version`, `description`, `main`, `test` (+327 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Ginag Backend (Express 5 + Prisma 7 + Supabase)` and `Dream E-commerce Backend (README)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Ginag Frontend (Next 16 + React 19 + Tailwind v4)` and `dreamreload (create-next-app README)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `api` connect `Homepage Featured Sections` to `Categories & Footer Config`, `Admin Forms & Addresses`, `Root Layout & Theming`, `Product Form Parts`, `Admin Orders Inbox`, `Dashboard Layouts`, `Homepage Product Grids`, `Category Management UI`, `Admin Chat UI`, `Custom Order Form`, `Admin Users Table`, `Shop Filter Sidebar`, `Customer Orders Page`, `Login & Role Redirect`, `Customer Chat Widget`, `Products Management UI`, `Customer Profile Pages`, `Hero Create & Edit`, `Customer Addresses Page`, `Storefront Pages Dashboard`, `Hero Management`, `Shop Page`, `Superadmin Dashboard`, `Theme Colors Page`, `Admin Dashboard`, `Google Reviews Section`, `Superadmin Layout`, `Color Form`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Why does `useUserStore` connect `Dashboard Layouts` to `Login & Role Redirect`, `Customer Chat Widget`, `Homepage Featured Sections`, `Customer Profile Pages`, `Admin Orders Inbox`, `Customer Layout & Sidebar`, `Superadmin Layout`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `getGlobalSettings()` connect `Contact & Manifest` to `Root Layout & Theming`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _335 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Media Upload & Audit` be split into smaller, more focused modules?**
  _Cohesion score 0.05269497139415839 - nodes in this community are weakly interconnected._