import { Request, Response } from 'express';
import prisma from '../config/prisma';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import axios from 'axios';
import cloudinary from '../config/cloudinary';
import streamifier from 'streamifier';
import sharp from 'sharp';
import { sendMail, renderVerificationEmail } from '../utils/mailer';

// 🚨 IMPORT THE LOGGER
import { logAction } from './audit.controller';

// Convert image buffer → WebP before upload
const convertToWebP = async (file: Express.Multer.File): Promise<Express.Multer.File> => {
  if (!file.mimetype.startsWith('image/') || file.mimetype === 'image/webp') return file;
  const convertedBuffer = await sharp(file.buffer).webp({ quality: 85 }).toBuffer();
  return {
    ...file,
    buffer: convertedBuffer,
    mimetype: 'image/webp',
    originalname: file.originalname.replace(/\.[^/.]+$/, '.webp'),
    size: convertedBuffer.length,
  };
};

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (file: Express.Multer.File, folder: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, username, email, password, phone: rawPhone, gender, dob } = req.body;
    const phone = rawPhone && rawPhone.trim() !== '' ? rawPhone.trim() : undefined;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
          ...(phone ? [{ phone }] : [])
        ]
      }
    });

    if (existingUser) {
      res.status(400).json({ success: false, message: "User already exists" });
      return;
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    const fullName = `${firstName} ${lastName}`;

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        fullName,
        username,
        email,
        phone,
        password: hashedPassword,
        gender,
        dob: dob ? new Date(dob) : undefined,
        verificationToken,
        status: 'PENDING',
        roles: ['CUSTOMER']
      }
    });

    // Send the verification email. Non-blocking: registration succeeds even if
    // the mail provider hiccups — the user can request a re-send later.
    try {
      const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
      const storeName = settings?.storeName || 'ইচ্ছে ঘুড়ি — Ische Ghuree';
      const clientUrl = (process.env.CLIENT_URL || process.env.Client_URL || 'http://localhost:5173').replace(/\/$/, '');
      const verifyUrl = `${clientUrl}/verify-email?token=${verificationToken}`;
      const { html, text } = renderVerificationEmail({ name: firstName, verifyUrl, storeName });
      await sendMail({
        to: email,
        subject: `ইমেইল ভেরিফাই করুন — Verify your email · ${storeName}`,
        html,
        text,
        fromName: storeName,
      });
    } catch (mailErr) {
      console.error('Verification email failed:', mailErr);
    }

    // 🚨 LOG: USER REGISTRATION
    await logAction({
      userId: user.id,
      userRole: 'CUSTOMER',
      action: 'USER_REGISTERED',
      entity: 'User',
      entityId: user.id,
      details: { email: user.email, username: user.username, method: 'Standard Registration' },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(201).json({ success: true, message: "Registration successful. Please verify your email.", data: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.params.token as string;
    const user = await prisma.user.findFirst({ where: { verificationToken: token } });

    if (!user) {
      res.status(400).json({ success: false, message: "Invalid or expired token" });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        status: 'ACTIVE'
      }
    });

    // 🚨 LOG: EMAIL VERIFIED
    await logAction({
      userId: user.id,
      userRole: user.roles?.[0] || 'CUSTOMER',
      action: 'EMAIL_VERIFIED',
      entity: 'User',
      entityId: user.id,
      details: { email: user.email },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const sendPhoneOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone } = req.body;
    const loggedInUserId = (req as any).user?.id; 

    if (!phone) {
      res.status(400).json({ success: false, message: "Phone number is required" });
      return;
    }

    // 1. SECURITY CHECK
    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) {
      if (!loggedInUserId) {
        res.status(403).json({ success: false, message: "This phone number is already registered. Please login." });
        return;
      } else if (existingUser.id !== loggedInUserId) {
        res.status(403).json({ success: false, message: "This phone number is already associated with another account." });
        return;
      }
    }

    // 2. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

    // 3. Save OTP based on user type
    if (loggedInUserId) {
      await prisma.user.update({ where: { id: loggedInUserId }, data: { otp, otpExpires } });
    } else {
      await prisma.phoneVerification.upsert({
        where: { phone },
        update: { otp, otpExpires, verified: false },
        create: { phone, otp, otpExpires, verified: false }
      });
    }

    const smsMessage = `Your Ische Ghuree verification code is: ${otp}. It will expire in 10 minutes.`;
    
    try {
      const smsResponse = await axios.post('https://bulksmsbd.net/api/smsapi', {
        api_key: process.env.BULKSMSBD_API_KEY,
        senderid: process.env.BULKSMSBD_SENDER_ID,
        number: phone,
        message: smsMessage
      });
      console.log("BulkSMSBD Response:", smsResponse.data);
    } catch (smsError: any) {
      console.error("SMS API Warning (SMS may have still sent):", smsError.message);
    }

    // Note: Intentionally NOT logging this to prevent database spam from OTP resends!
    res.json({ success: true, message: "OTP sent to your mobile number" });

  } catch (error: any) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ success: false, message: "Failed to process OTP request", error: error.message });
  }
};

export const verifyPhoneOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, otp } = req.body;
    const loggedInUserId = (req as any).user?.id;

    if (!phone || !otp) {
      res.status(400).json({ success: false, message: "Phone and OTP are required" });
      return;
    }

    if (loggedInUserId) {
      // --- LOGGED IN USER VERIFICATION ---
      const user = await prisma.user.findUnique({ where: { id: loggedInUserId } });

      if (!user || user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
        res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        return;
      }

      await prisma.user.update({
        where: { id: loggedInUserId },
        data: {
          phone, 
          phoneVerified: new Date(),
          otp: null,
          otpExpires: null
        }
      });

    } else {
      // --- GUEST VERIFICATION ---
      const verification = await prisma.phoneVerification.findUnique({ where: { phone } });

      if (!verification || verification.otp !== otp || verification.otpExpires < new Date()) {
        res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        return;
      }

      await prisma.phoneVerification.update({
        where: { phone },
        data: { verified: true, otp: "USED", otpExpires: new Date() }
      });
    }

    // 🚨 LOG: SUCCESSFUL PHONE VERIFICATION
    await logAction({
      userId: loggedInUserId || undefined,
      userRole: loggedInUserId ? (req as any).user?.role : 'GUEST',
      action: 'PHONE_VERIFIED',
      entity: 'User',
      entityId: loggedInUserId || phone,
      details: { phone, isGuest: !loggedInUserId },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ success: true, message: "Phone number verified successfully" });
  } catch (error: any) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ success: false, message: "Failed to verify OTP", error: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { firstName, lastName, gender, dob, addresses, password } = req.body;

    const dataToUpdate: any = {};
    if (firstName) dataToUpdate.firstName = firstName;
    if (lastName) dataToUpdate.lastName = lastName;
    if (firstName || lastName) dataToUpdate.fullName = `${firstName || ''} ${lastName || ''}`.trim();
    if (gender) dataToUpdate.gender = gender;
    if (dob) dataToUpdate.dob = new Date(dob);

    if (addresses && Array.isArray(addresses)) {
      dataToUpdate.addresses = {
        deleteMany: {}, 
        create: addresses.map(addr => ({
          type: addr.type, isDefault: addr.isDefault, house: addr.house, road: addr.road,
          area: addr.area, postalCode: addr.postalCode, thana: addr.thana,
          district: addr.district, division: addr.division, country: addr.country || "Bangladesh"
        }))
      };
    }
    if (password && password.trim() !== "") {
      const salt = await bcryptjs.genSalt(10);
      dataToUpdate.password = await bcryptjs.hash(password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      include: { addresses: true }
    });

    const { password: _, verificationToken, otp, ...safeUser } = updatedUser;

    // 🚨 LOG: PROFILE UPDATE
    await logAction({
      userId,
      userRole: (req as any).user.role,
      action: 'UPDATE_PROFILE',
      entity: 'User',
      entityId: userId,
      details: { updatedFields: Object.keys(dataToUpdate), addressesUpdated: !!addresses },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const uploadAvatar = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    
    if (!req.file) {
      res.status(400).json({ success: false, message: "No image provided" });
      return;
    }

    // 1. Convert to WebP, then upload
    const converted = await convertToWebP(req.file);
    const result = await uploadToCloudinary(converted, 'avatars');

    // 2. Save the Cloudinary URL to the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        avatar: result.secure_url,
        lastAvatarUpdate: new Date()
      }
    });

    // 🚨 LOG: AVATAR UPDATE
    await logAction({
      userId,
      userRole: (req as any).user.role,
      action: 'UPDATE_AVATAR',
      entity: 'User',
      entityId: userId,
      details: { action: 'User uploaded a new profile picture', url: result.secure_url },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ success: true, message: "Avatar updated", data: updatedUser });
  } catch (error: any) {
    console.error("Avatar Upload Error:", error);
    res.status(500).json({ success: false, message: "Avatar upload failed", error: error.message });
  }
};

// GET ME (Read-only)
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: (req as any).user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        fullName: true,
        email: true,
        phone: true,
        phoneVerified: true, // 🔥 Added this
        emailVerified: true, // 🔥 Added this
        customerStatus: true,
        roles: true,
        status: true,
        avatar: true,
        addresses: {
          orderBy: { isDefault: 'desc' } // 🔥 Added this to get saved addresses
        }
      }
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL USERS (Admin - Read-only)
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, fullName: true, email: true, phone: true, status: true, roles: true, createdAt: true
      }
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// GET SINGLE USER (Admin - Read-only)
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const user = await prisma.user.findUnique({
      where: { id },
      include: { addresses: true }
    });
    
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// CREATE USER (Admin)
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, username, email, password, phone, gender, dob, roles, status } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }, { phone }] }
    });

    if (existingUser) {
      res.status(400).json({ success: false, message: "User already exists" });
      return;
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const fullName = `${firstName} ${lastName}`;

    // SECURITY: Only SUPER_ADMIN can assign roles. Regular ADMIN can only create CUSTOMERS.
    const requesterRole = (req as any).user?.role;
    const assignedRoles = (requesterRole === 'SUPER_ADMIN') 
      ? (roles && roles.length > 0 ? roles : ['CUSTOMER'])
      : ['CUSTOMER'];

    const user = await prisma.user.create({
      data: {
        firstName, lastName, fullName, username, email, phone,
        password: hashedPassword, gender,
        dob: dob ? new Date(dob) : undefined,
        status: status || 'ACTIVE',
        roles: assignedRoles,
        emailVerified: new Date(),
        phoneVerified: new Date()
      }
    });

    // 🚨 LOG: ADMIN CREATED USER
    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'CREATE_USER',
      entity: 'User',
      entityId: user.id,
      details: { targetUserEmail: user.email, assignedRoles: user.roles },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(201).json({ success: true, message: "User created successfully", data: { id: user.id, email: user.email, roles: user.roles } });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// DELETE USER (Admin)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    
    // Fetch first to log who was deleted
    const userToDelete = await prisma.user.findUnique({ where: { id } });
    if (!userToDelete) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // SECURITY: Admins can't delete other Admins or Super Admins
    const requesterRole = (req as any).user?.role;
    const hasAdminRole = userToDelete.roles.some(role => 
      ['SUPER_ADMIN', 'ADMIN'].includes(role)
    );

    if (requesterRole !== 'SUPER_ADMIN' && hasAdminRole) {
      res.status(403).json({ success: false, message: "You do not have permission to delete administrative accounts." });
      return;
    }

    await prisma.user.delete({ where: { id } });

    // 🚨 LOG: ADMIN DELETED USER
    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'DELETE_USER',
      entity: 'User',
      entityId: id,
      details: { deletedEmail: userToDelete.email, deletedRoles: userToDelete.roles },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// ==========================================
// SUPER-ADMIN: STAFF MANAGEMENT ROUTES
// ==========================================

// GET ALL ADMINS (Read-only)
export const getAllAdmins = async (req: Request, res: Response): Promise<void> => {
  try {
    const admins = await prisma.user.findMany({
      where: { roles: { hasSome: ['ADMIN'] } },
      select: {
        id: true, firstName: true, lastName: true, username: true, email: true, phone: true, status: true, roles: true, avatar: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch admins" });
  }
};

// GET USERS BY ROLE (Read-only)
export const getUsersByRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const role = (req.params.role as string).toUpperCase() as any;
    const users = await prisma.user.findMany({
      where: { roles: { hasSome: [role] } },
      select: {
        id: true, 
        firstName: true, 
        lastName: true, 
        username: true, 
        email: true, 
        phone: true, 
        status: true, 
        roles: true, 
        avatar: true,
        customerStatus: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error(`Failed to fetch users for role ${req.params.role}:`, error);
    res.status(500).json({ success: false, message: `Failed to fetch ${req.params.role}s` });
  }
};

// GET SINGLE ADMIN BY USERNAME (Read-only)
export const getAdminByUsername = async (req: Request, res: Response): Promise<void> => {
  try {
    const username  = req.params.username as string;
    const admin = await prisma.user.findUnique({
      where: { username },
      include: { addresses: true } 
    });
    
    if (!admin) {
      res.status(404).json({ success: false, message: "Admin not found" });
      return;
    }

    const { password, ...safeAdmin } = admin;
    res.json({ success: true, data: safeAdmin });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch admin details" });
  }
};

// CREATE ADMIN ACCOUNT (Super Admin)
export const createAdminAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      firstName, lastName, username, email, phone, password, gender, dob, 
      roles, status, avatar, bankDetails, mobileBanking, addresses 
    } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }, { phone: phone || undefined }] }
    });

    if (existingUser) {
      res.status(400).json({ success: false, message: "Email, Username, or Phone already in use" });
      return;
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const admin = await prisma.user.create({
      data: {
        firstName, lastName, 
        fullName: `${firstName} ${lastName}`,
        username, email, phone, gender, avatar,
        dob: dob ? new Date(dob) : undefined,
        password: hashedPassword,
        status: status || 'ACTIVE',
        roles: roles && roles.length > 0 ? roles : ['ADMIN'],
        bankDetails: bankDetails || undefined,
        mobileBanking: mobileBanking || undefined,
        emailVerified: new Date(), 
        addresses: addresses && addresses.length > 0 ? {
          create: addresses.map((addr: any) => ({
            type: addr.type, isDefault: addr.isDefault, house: addr.house, road: addr.road,
            area: addr.area, postalCode: addr.postalCode, thana: addr.thana,
            district: addr.district, division: addr.division, country: addr.country || "Bangladesh"
          }))
        } : undefined
      }
    });

    // 🚨 LOG: SUPER ADMIN CREATED STAFF ACCOUNT
    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'CREATE_ADMIN_ACCOUNT',
      entity: 'User',
      entityId: admin.id,
      details: { targetEmail: admin.email, assignedRoles: admin.roles },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(201).json({ success: true, message: "Admin created successfully", data: { id: admin.id, username: admin.username } });
  } catch (error) {
    console.error("Create Admin Error:", error);
    res.status(500).json({ success: false, message: "Failed to create admin account" });
  }
};

// UPDATE ADMIN ACCOUNT (Super Admin)
export const updateAdminAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const id  = req.params.id as string;
    const { 
      firstName, lastName, username, email, phone, password, gender, dob, 
      roles, status, avatar, bankDetails, mobileBanking, addresses 
    } = req.body;

    const dataToUpdate: any = {
      firstName, lastName, username, email, phone, gender, avatar, status, roles,
      bankDetails, mobileBanking,
      fullName: `${firstName} ${lastName}`
    };

    if (dob) dataToUpdate.dob = new Date(dob);

    if (password && password.trim() !== "") {
      const salt = await bcryptjs.genSalt(10);
      dataToUpdate.password = await bcryptjs.hash(password, salt);
    }

    if (addresses && Array.isArray(addresses)) {
      dataToUpdate.addresses = {
        deleteMany: {}, 
        create: addresses.map((addr: any) => ({
          type: addr.type, isDefault: addr.isDefault, house: addr.house, road: addr.road,
          area: addr.area, postalCode: addr.postalCode, thana: addr.thana,
          district: addr.district, division: addr.division, country: addr.country || "Bangladesh"
        }))
      };
    }

    const updatedAdmin = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      include: { addresses: true }
    });

    // 🚨 LOG: SUPER ADMIN UPDATED STAFF ACCOUNT
    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'UPDATE_ADMIN_ACCOUNT',
      entity: 'User',
      entityId: updatedAdmin.id,
      details: { 
        targetUsername: updatedAdmin.username, 
        updatedRoles: updatedAdmin.roles, 
        statusChangedTo: updatedAdmin.status,
        passwordReset: !!(password && password.trim() !== "")
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ success: true, message: "Admin updated successfully", data: { username: updatedAdmin.username } });
  } catch (error) {
    console.error("Update Admin Error:", error);
    res.status(500).json({ success: false, message: "Failed to update admin account" });
  }
};