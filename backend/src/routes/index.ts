import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import mediaRoutes from './media.routes';
import userRoutes from './user.routes';
import analyticsRoutes from './analytics.routes';
import auditRoutes from './audit.routes';
import searchRoutes from './search.routes';
import customOrderRoutes from './customOrder.routes';
import googleReviewsRoutes from './googleReviews.routes';

import settingsRoutes from './settings.routes';
import socialRoutes from './social.routes';
import specialRoutes from './special.routes';
import themeRoutes from './theme.routes';
import pageRoutes from './page.routes';
import chatRoutes from './chat.route';
import heroRoutes from './hero.routes';

const router = Router();

const moduleRoutes = [
  { path: '/auth', route: authRoutes },
  { path: '/products', route: productRoutes },
  { path: '/categories', route: categoryRoutes },
  { path: '/media', route: mediaRoutes },
  { path: '/users', route: userRoutes },
  { path: '/analytics', route: analyticsRoutes },
  { path: '/audit', route: auditRoutes },
  { path: '/search', route: searchRoutes },
  { path: '/custom-orders', route: customOrderRoutes },
  { path: '/google-reviews', route: googleReviewsRoutes },
  { path: '/settings', route: settingsRoutes },
  { path: '/social', route: socialRoutes },
  { path: '/special', route: specialRoutes },
  { path: '/themes', route: themeRoutes },
  { path: '/pages', route: pageRoutes },
  { path: '/chat', route: chatRoutes },
  { path: '/hero', route: heroRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
