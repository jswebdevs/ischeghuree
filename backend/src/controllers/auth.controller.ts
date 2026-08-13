import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../config/prisma';
import { generateToken } from '../utils/jwt';

// 🚨 IMPORT THE LOGGER
import { logAction } from './audit.controller'; 

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400).json({ success: false, message: 'Please provide both identifier and password' });
      return;
    }

    // 1. Find the user
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
          { phone: identifier }
        ]
      }
    });

    if (!user) {
      // 🚨 LOG: Failed Login Attempt (Unknown User)
      await logAction({
        action: 'LOGIN_FAILED',
        entity: 'Auth',
        details: { reason: 'User not found', attemptedIdentifier: identifier },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });

      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    if (user.status === 'SUSPENDED' || user.status === 'BLOCKED') {
      // 🚨 LOG: Blocked Account Access Attempt
      await logAction({
        userId: user.id,
        userRole: user.roles?.[0] || 'CUSTOMER',
        action: 'LOGIN_BLOCKED',
        entity: 'Auth',
        entityId: user.id,
        details: { reason: 'Account is suspended or blocked', email: user.email },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });

      res.status(403).json({ success: false, message: 'Account is suspended or blocked.' });
      return;
    }

    // 2. Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      // 🚨 LOG: Failed Login Attempt (Wrong Password)
      await logAction({
        userId: user.id,
        userRole: user.roles?.[0] || 'CUSTOMER',
        action: 'LOGIN_FAILED',
        entity: 'Auth',
        entityId: user.id,
        details: { reason: 'Invalid password', email: user.email },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });

      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    // 3. Generate Token & Respond
    const token = generateToken(user.id, user.roles[0]);
    const { password: _password, otp: _otp, otpExpires: _otpExp, verificationToken: _vt, ...userData } = user;

    // 🚨 LOG: Successful Login
    await logAction({
      userId: user.id,
      userRole: user.roles[0],
      action: 'LOGIN_SUCCESS',
      entity: 'Auth',
      entityId: user.id,
      details: { email: user.email, name: user.firstName },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    res.json({
      success: true,
      message: `স্বাগতম, ${user.firstName}! Welcome back to Ische Ghuree.`,
      token,
      user: userData,
    });

  } catch (error) {
    console.error(`[AUTH ERROR] Login failed:`, error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};