import { Request, Response } from 'express';
import prisma from '../config/prisma';

// 1. Get all chat sessions (With Filtering, Searching, and Unread Counts)
export const getAllSessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Build Where Clause dynamically
    const whereClause: any = {
      // DEFAULT: Hide ARCHIVED, SPAM, and DELETED from normal views unless specifically requested
      status: status ? (status as any) : { notIn: ['ARCHIVED', 'SPAM', 'DELETED'] },
    };

    if (search) {
      whereClause.user = {
        OR: [
          { firstName: { contains: String(search), mode: 'insensitive' } },
          { lastName: { contains: String(search), mode: 'insensitive' } },
          { email: { contains: String(search), mode: 'insensitive' } },
          { username: { contains: String(search), mode: 'insensitive' } }
        ]
      };
    }

    const [sessions, total] = await Promise.all([
      prisma.chatSession.findMany({
        where: whereClause,
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, customerStatus: true, avatar: true } },
          // Count ONLY unread messages sent by the USER
          _count: {
            select: { messages: { where: { isRead: false, senderType: 'USER' } } }
          },
          // Get the very last message for the preview snippet
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { content: true, createdAt: true, senderType: true }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.chatSession.count({ where: whereClause })
    ]);

    res.json({
      success: true,
      data: sessions,
      pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch chat sessions', error: error.message });
  }
};

// 2. Get specific chat history & Mark as Read
export const getSessionHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Fetch messages
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: String(id) },
      orderBy: { createdAt: 'asc' },
      include: {
        session: { select: { user: { select: { firstName: true, lastName: true, avatar: true } } } }
      }
    });

    // Mark all unread user messages as read since the admin just opened the chat
    await prisma.chatMessage.updateMany({
      where: { sessionId: String(id), senderType: 'USER', isRead: false },
      data: { isRead: true }
    });

    res.json({ success: true, data: messages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch chat history', error: error.message });
  }
};

// 3. Single Session Status Update
export const updateSessionStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userRoles = (req as any).user.roles;
    const isSuperAdmin = userRoles.includes('SUPER_ADMIN');

    if (status === 'DELETED' && !isSuperAdmin) {
      res.status(403).json({ success: false, message: 'Only Super Admins can delete chats' });
      return;
    }

    if (status === 'DELETED') {
      await prisma.chatSession.delete({
        where: { id: String(id) }
      });
      res.json({ success: true, message: "Session permanently deleted" });
      return;
    }

    const session = await prisma.chatSession.update({
      where: { id: String(id) },
      data: { status }
    });

    res.json({ success: true, message: `Session updated to ${status}`, data: session });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update session status', error: error.message });
  }
};

// 4. Bulk Operations (Select multiple rows and mark as SPAM, DONE, ARCHIVED, etc.)
export const bulkUpdateSessionStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids, status } = req.body; 
    const userRoles = (req as any).user.roles;
    const isSuperAdmin = userRoles.includes('SUPER_ADMIN');

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ success: false, message: 'No session IDs provided' });
      return;
    }

    if (status === 'DELETED' && !isSuperAdmin) {
      res.status(403).json({ success: false, message: 'Only Super Admins can delete chats' });
      return;
    }

    if (status === 'DELETED') {
      const deleted = await prisma.chatSession.deleteMany({
        where: { id: { in: ids } }
      });
      res.json({ success: true, message: `Successfully deleted ${deleted.count} sessions` });
      return;
    }

    const updated = await prisma.chatSession.updateMany({
      where: { id: { in: ids } },
      data: { status }
    });

    res.json({ success: true, message: `Successfully updated ${updated.count} sessions to ${status}` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Bulk update failed', error: error.message });
  }
};

// 5. Admin Sending Message (Handles text & image URLs)
export const adminSendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content, attachmentUrl } = req.body;
    const adminId = (req as any).user.id;

    if (!content && !attachmentUrl) {
      res.status(400).json({ success: false, message: 'Message content or image is required' });
      return;
    }

    // 🔥 1. Get the session to find the customer's userId
    const session = await prisma.chatSession.findUnique({ where: { id: String(id) } });
    if (!session) {
      res.status(404).json({ success: false, message: 'Session not found' });
      return;
    }

    const message = await prisma.chatMessage.create({
      data: {
        sessionId: String(id),
        senderId: adminId,
        senderType: 'AGENT',
        content: content || "",
        attachmentUrl: attachmentUrl || null,
        isRead: true 
      }
    });

    await prisma.chatSession.update({
      where: { id: String(id) },
      data: { status: 'AGENT_ACTIVE', updatedAt: new Date() }
    });

    // 🔥 2. Grab the io instance and broadcast to the customer!
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${session.userId}`).emit('receive_message', message);
    }

    res.status(201).json({ success: true, data: message });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to send message', error: error.message });
  }
};