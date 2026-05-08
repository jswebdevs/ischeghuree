# Graph Report - ginag  (2026-05-08)

## Corpus Check
- 238 files · ~114,296 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 994 nodes · 1674 edges · 119 communities (102 shown, 17 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 118 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]

## God Nodes (most connected - your core abstractions)
1. `logAction()` - 77 edges
2. `useCurrency()` - 37 edges
3. `update()` - 30 edges
4. `protect()` - 22 edges
5. `authorize()` - 22 edges
6. `getPageBySlug()` - 12 edges
7. `getGlobalSettings()` - 9 edges
8. `createCustomOrder()` - 7 edges
9. `generateMetadata()` - 7 edges
10. `getPaymentConfig()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `addToCart()` --calls--> `handleAddToCart()`  [INFERRED]
  ginag-backend/src/controllers/cart.controller.ts → ginag-frontend/src/app/dashboard/customer/wishlist/page.tsx
- `getHomepageConfig()` --calls--> `Home()`  [INFERRED]
  ginag-backend/src/controllers/settings.controller.ts → ginag-frontend/src/app/page.tsx
- `getHomepageConfig()` --calls--> `OrderNowPage()`  [INFERRED]
  ginag-backend/src/controllers/settings.controller.ts → ginag-frontend/src/app/order-now/page.tsx
- `updateVariation()` --calls--> `handleUpdateVariation()`  [INFERRED]
  ginag-backend/src/controllers/variation.controller.ts → ginag-frontend/src/app/dashboard/customer/cart/page.tsx
- `generateMetadata()` --calls--> `getGlobalSettings()`  [INFERRED]
  ginag-frontend/src/app/layout.tsx → ginag-frontend/src/lib/getSettings.ts

## Communities (119 total, 17 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (10): fetchCategories(), getCategories(), handleCreateNew(), handleDelete(), handleEdit(), handleView(), edit(), resetIcon() (+2 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (27): convertFile(), convertToWebM(), convertToWebP(), createMedia(), deleteMedia(), getAllMedia(), getMediaById(), updateMedia() (+19 more)

### Community 3 - "Community 3"
Cohesion: 0.1
Nodes (14): fetchAdmins(), handleDelete(), fetchCustomers(), handleDelete(), fetchUsers(), handleDelete(), fetchUsers(), handleDelete() (+6 more)

### Community 5 - "Community 5"
Cohesion: 0.15
Nodes (6): TrustBar(), useCurrency(), useSettings(), FormCouponRules(), fetchInsights(), SearchContent()

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (8): handleMouseMove(), isVideo(), fetchAllCategories(), fetchCategory(), fetchCategoryProducts(), fetchProduct(), generateMetadata(), ProductDetailsPage()

### Community 7 - "Community 7"
Cohesion: 0.13
Nodes (6): handleRemoveItem(), handleUpdateQuantity(), handleUpdateVariation(), CreateOrderPage(), EditOrderPage(), removeItem()

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (3): handleImageUpload(), handleSendMessage(), AdminMessagesPage()

### Community 9 - "Community 9"
Cohesion: 0.17
Nodes (6): getGoogleReviews(), globalSearch(), getCollectionByTag(), getSpecialCollection(), setupChatSocket(), main()

### Community 10 - "Community 10"
Cohesion: 0.14
Nodes (3): cn(), formatRange(), ProductCard()

### Community 11 - "Community 11"
Cohesion: 0.13
Nodes (5): CreateProductPage(), EditProductPage(), toggleCategory(), handleTagKeyDown(), removeTag()

### Community 12 - "Community 12"
Cohesion: 0.21
Nodes (13): createPage(), deletePage(), generateSlug(), getAllPages(), getPageBySlug(), updatePage(), getHomepageConfig(), getSettings() (+5 more)

### Community 14 - "Community 14"
Cohesion: 0.23
Nodes (14): addAttribute(), addValue(), deleteVar(), generateMatrix(), handleKeyDown(), handleMediaSelect(), removeAttribute(), removeValue() (+6 more)

### Community 16 - "Community 16"
Cohesion: 0.13
Nodes (14): Accessibility, code:powershell (cd d:\Projects\ginag\ginag-backend), Concurrency / reliability, Ginag — Enterprise Readiness Audit, How to apply schema changes, P0 (block production, fix this sprint), P1 (next sprint), P2 (backlog) (+6 more)

### Community 17 - "Community 17"
Cohesion: 0.26
Nodes (9): generateDailyStatSnapshot(), getChartData(), getDashboardOverview(), addToWishlist(), getAllWishlists(), getWishlist(), removeFromWishlist(), authorize() (+1 more)

### Community 18 - "Community 18"
Cohesion: 0.32
Nodes (13): logAction(), cancelOrder(), createAdminOrder(), createCustomOrderRequest(), createOrder(), deleteOrder(), getAllOrders(), getCartIdentifier() (+5 more)

### Community 19 - "Community 19"
Cohesion: 0.19
Nodes (3): login(), initCronJobs(), generateToken()

### Community 20 - "Community 20"
Cohesion: 0.29
Nodes (11): createCustomOrder(), deleteCustomOrder(), generateOrderNumber(), getCustomOrder(), listCustomOrders(), listMyCustomOrders(), updateCustomOrderStatus(), validateBody() (+3 more)

### Community 21 - "Community 21"
Cohesion: 0.21
Nodes (4): manifest(), getGlobalSettings(), getHomepageConfig(), OrderNowPage()

### Community 22 - "Community 22"
Cohesion: 0.27
Nodes (12): addReview(), addSiteReview(), checkEligibility(), deleteReview(), deleteSiteReview(), getAllReviews(), getAllSiteReviews(), getProductReviews() (+4 more)

### Community 24 - "Community 24"
Cohesion: 0.19
Nodes (4): generateSlug(), handleSubmit(), CreateBlogPage(), EditBlogPage()

### Community 26 - "Community 26"
Cohesion: 0.44
Nodes (9): capturePaypal(), createStripeIntent(), getPublicPaymentConfig(), verifyPaypalOrder(), capturePaypalOrder(), getPaymentConfig(), getPaypalAccessToken(), getPaypalOrder() (+1 more)

### Community 27 - "Community 27"
Cohesion: 0.21
Nodes (4): fetchMedia(), handleBulkDelete(), handleFileUpload(), MediaLibraryPage()

### Community 32 - "Community 32"
Cohesion: 0.36
Nodes (5): handleLogin(), getSmartRedirect(), handleSubmit(), getDashboardRedirectPath(), getHighestRole()

### Community 36 - "Community 36"
Cohesion: 0.42
Nodes (8): addToCart(), clearCart(), getAllCarts(), getCart(), getCartIdentifier(), removeCartItem(), updateCartItem(), updateCartItemVariation()

### Community 37 - "Community 37"
Cohesion: 0.24
Nodes (3): OrderTable(), fetchOrders(), fetchRefundOrders()

### Community 41 - "Community 41"
Cohesion: 0.22
Nodes (8): Backend (read keys from DB on every request), Changes — Custom-order products + dynamic Stripe/PayPal, code:powershell (cd d:\Projects\ginag\ginag-backend), Frontend, Schema (`ginag-backend/prisma/schema.prisma`), To apply, What changed, Where the brand images live

### Community 42 - "Community 42"
Cohesion: 0.44
Nodes (7): cleanPrice(), createProduct(), deleteProduct(), getProductBySlug(), getProductFilters(), getProducts(), updateProduct()

### Community 43 - "Community 43"
Cohesion: 0.42
Nodes (7): createTheme(), deleteTheme(), getActiveTheme(), getAllThemes(), getPublicThemes(), toggleThemeProperty(), updateTheme()

### Community 44 - "Community 44"
Cohesion: 0.5
Nodes (6): createCategory(), deleteCategory(), generateSlug(), getCategories(), getCategoryBySlug(), updateCategory()

### Community 45 - "Community 45"
Cohesion: 0.46
Nodes (6): createCoupon(), deleteCoupon(), getCouponById(), getCoupons(), updateCoupon(), validateCoupon()

### Community 46 - "Community 46"
Cohesion: 0.5
Nodes (6): createBlog(), deleteBlog(), generateSlug(), getAllBlogs(), getBlogBySlug(), updateBlog()

### Community 49 - "Community 49"
Cohesion: 0.38
Nodes (4): fetchProducts(), fetchWishlist(), handleApplyFilters(), handleWishlistToggle()

### Community 51 - "Community 51"
Cohesion: 0.48
Nodes (6): addListItem(), generateCode(), handleNameChange(), removeListItem(), updateListItem(), update()

### Community 52 - "Community 52"
Cohesion: 0.52
Nodes (5): createHeroSection(), deleteHeroSection(), getActiveHeroSections(), getAllHeroSections(), updateHeroSection()

### Community 53 - "Community 53"
Cohesion: 0.52
Nodes (5): createCategory(), deleteCategory(), getCategories(), getCategoryBySlug(), updateCategory()

### Community 54 - "Community 54"
Cohesion: 0.52
Nodes (5): createSocialLink(), deleteSocialLink(), getAllSocialLinks(), getPublicSocialLinks(), updateSocialLink()

### Community 55 - "Community 55"
Cohesion: 0.52
Nodes (5): adminSendMessage(), bulkUpdateSessionStatus(), getAllSessions(), getSessionHistory(), updateSessionStatus()

### Community 56 - "Community 56"
Cohesion: 0.52
Nodes (5): createVariations(), deleteVariation(), getAllVariations(), getVariationById(), updateVariation()

### Community 59 - "Community 59"
Cohesion: 0.38
Nodes (3): BlogDashboard(), fetchBlogs(), handleDelete()

### Community 62 - "Community 62"
Cohesion: 0.33
Nodes (4): handleFeaturedSelect(), handleGallerySelect(), removeFeatured(), removeGalleryImage()

### Community 63 - "Community 63"
Cohesion: 0.33
Nodes (5): Common commands, Conventions, Ginag, graphify, Skills

### Community 64 - "Community 64"
Cohesion: 0.6
Nodes (4): deleteAllAuditLogs(), deleteAuditLog(), getAuditLogById(), getAuditLogs()

### Community 66 - "Community 66"
Cohesion: 0.4
Nodes (3): fetchWishlist(), handleAddToCart(), handleRemove()

### Community 67 - "Community 67"
Cohesion: 0.47
Nodes (3): BlogCategoryDashboard(), fetchCategories(), handleDelete()

### Community 72 - "Community 72"
Cohesion: 0.4
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

### Community 81 - "Community 81"
Cohesion: 0.5
Nodes (3): addListItem(), removeListItem(), updateListItem()

### Community 82 - "Community 82"
Cohesion: 0.5
Nodes (3): handleAddAddress(), removeAddress(), setDefault()

## Knowledge Gaps
- **22 isolated node(s):** `code:powershell (cd d:\Projects\ginag\ginag-backend)`, `Schema (`ginag-backend/prisma/schema.prisma`)`, `Backend (read keys from DB on every request)`, `Frontend`, `Where the brand images live` (+17 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `handleAddToCart()` connect `Community 66` to `Community 36`?**
  _High betweenness centrality (0.251) - this node is a cross-community bridge._
- **Why does `addToCart()` connect `Community 36` to `Community 18`, `Community 66`?**
  _High betweenness centrality (0.250) - this node is a cross-community bridge._
- **Why does `logAction()` connect `Community 18` to `Community 64`, `Community 2`, `Community 36`, `Community 42`, `Community 12`, `Community 45`, `Community 17`, `Community 19`, `Community 20`, `Community 53`, `Community 52`, `Community 54`, `Community 22`, `Community 56`?**
  _High betweenness centrality (0.187) - this node is a cross-community bridge._
- **Are the 58 inferred relationships involving `logAction()` (e.g. with `login()` and `createCategory()`) actually correct?**
  _`logAction()` has 58 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `useCurrency()` (e.g. with `SearchContent()` and `TrustBar()`) actually correct?**
  _`useCurrency()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 29 inferred relationships involving `update()` (e.g. with `handleAddAddress()` and `removeAddress()`) actually correct?**
  _`update()` has 29 INFERRED edges - model-reasoned connections that need verification._
- **What connects `code:powershell (cd d:\Projects\ginag\ginag-backend)`, `Schema (`ginag-backend/prisma/schema.prisma`)`, `Backend (read keys from DB on every request)` to the rest of the system?**
  _22 weakly-connected nodes found - possible documentation gaps or missing edges._