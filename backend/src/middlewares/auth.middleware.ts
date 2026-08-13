import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

// Add 'user' to Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Derive the single highest role from the roles array so legacy `.role`
// consumers (audit logging, role gates) read a real value instead of undefined.
const deriveHighestRole = (roles: string[]): string => {
  if (roles.includes('SUPER_ADMIN')) return 'SUPER_ADMIN';
  if (roles.includes('ADMIN')) return 'ADMIN';
  return roles[0] || 'CUSTOMER';
};

// 1. PROTECT: Verifies if the user is logged in
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;

  // Extract token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    return;
  }

  try {
    // Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    // Fetch user with specific fields (including phoneVerified for later checks)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { 
        id: true, 
        email: true, 
        roles: true, 
        status: true,
        phoneVerified: true // Used by phone-verification-gated features
      }
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'The user belonging to this token no longer exists.' });
      return;
    }

    // Security Check: Prevent blocked or suspended users from accessing protected routes
    if (user.status === 'SUSPENDED' || user.status === 'BLOCKED') {
      res.status(403).json({ 
        success: false, 
        message: `Your account has been ${user.status.toLowerCase()}. Please contact support.` 
      });
      return;
    }

    // Attach user to request object (with derived highest role for `.role` consumers)
    req.user = { ...user, role: deriveHighestRole(user.roles) };
    next();
  } catch (error: any) {
    console.error('Auth Error:', error);

    // If it's a JWT error, return 401 (forces logout on frontend)
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, message: 'Not authorized, token failed or expired' });
      return;
    }

    // If it's a DB or other system error, return 500 (does NOT force logout)
    res.status(500).json({ success: false, message: 'Internal server error during authentication' });
  }
};

// 2. AUTHORIZE: Verifies if the user has the right role
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Check if user has at least one of the allowed roles
    if (!req.user || !req.user.roles) {
      res.status(403).json({ success: false, message: 'User role not found' });
      return;
    }

    const hasRole = req.user.roles.some((role: string) => allowedRoles.includes(role));

    if (!hasRole) {
      res.status(403).json({ 
        success: false, 
        message: `Role unauthorized. Required: [${allowedRoles.join(', ')}]` 
      });
      return;
    }
    
    next();
  };
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      // Mirror protect(): same narrow field selection (never the password hash),
      // and SUSPENDED/BLOCKED users proceed as guests — no req.user attached.
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          roles: true,
          status: true,
          phoneVerified: true,
        },
      });
      if (user && user.status !== 'SUSPENDED' && user.status !== 'BLOCKED') {
        (req as any).user = { ...user, role: deriveHighestRole(user.roles) };
      }
    } catch (error) {
      // Token is invalid or expired, but we just ignore it and let them proceed as a guest
    }
  }

  next(); // Always proceed to the controller
};