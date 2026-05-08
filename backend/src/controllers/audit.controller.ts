import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const logAction = async (data: {
  userId?: string;
  userRole?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        userRole: data.userRole,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        details: data.details,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent
      }
    });
  } catch (error) {
    console.error(error);
  }
};

export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, action, entity, userId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (action) where.action = String(action);
    if (entity) where.entity = String(entity);
    if (userId) where.userId = String(userId);

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.auditLog.count({ where })
    ]);

    res.json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch audit logs' });
  }
};

export const getAuditLogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const log = await prisma.auditLog.findUnique({ where: { id } });

    if (!log) {
      res.status(404).json({ success: false, message: 'Audit log not found' });
      return;
    }

    res.json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch audit log' });
  }
};

export const deleteAuditLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const log = await prisma.auditLog.findUnique({ where: { id } });

    if (!log) {
      res.status(404).json({ success: false, message: 'Audit log not found' });
      return;
    }

    await prisma.auditLog.delete({ where: { id } });

    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'DELETE_AUDIT_LOG',
      entity: 'AuditLog',
      entityId: id,
      details: { deletedAction: log.action, deletedEntity: log.entity },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ success: true, message: 'Audit log deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete audit log' });
  }
};

export const deleteAllAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { count } = await prisma.auditLog.deleteMany({});

    await logAction({
      userId: (req as any).user?.id,
      userRole: (req as any).user?.role,
      action: 'DELETE_ALL_AUDIT_LOGS',
      entity: 'AuditLog',
      details: { deletedCount: count },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ success: true, message: `Deleted ${count} audit logs` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete all audit logs' });
  }
};