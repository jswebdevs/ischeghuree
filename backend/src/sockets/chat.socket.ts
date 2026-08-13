// sockets/chat.socket.ts
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

export const setupChatSocket = (io: Server) => {
    
    // 1. AUTHENTICATION MIDDLEWARE
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token || 
                      socket.handshake.headers?.token || 
                      socket.handshake.query?.token;

        if (!token) return next(new Error("Authentication error: No token"));

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
            (socket as any).user = decoded; 
            next();
        } catch (err) {
            next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on('connection', async (socket: Socket) => {
        const userId = (socket as any).user.id;
        const userRole = (socket as any).user.role;

        socket.join(`user_${userId}`);
        console.log(`User ${userId} connected to chat.`);

        socket.on('join_admin_room', () => {
            if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
                socket.join('admin_room');
                console.log(`Admin ${userId} joined the live monitoring room.`);
            }
        });

        // 2. UPSERT SESSION — atomic create-or-update so two simultaneous
        // connections from the same user can't both create a row and trip
        // the unique constraint on userId.
        let session = await prisma.chatSession.upsert({
            where: { userId },
            create: { userId, status: 'PENDING' },
            update: {}, // do not blanket-reopen; that case is handled below
        });
        if (session.status === 'CLOSED' || session.status === 'DONE') {
            session = await prisma.chatSession.update({
                where: { id: session.id },
                data: { status: 'PENDING' },
            });
        }

        // Send chat history on load
        const history = await prisma.chatMessage.findMany({
            where: { sessionId: session.id },
            orderBy: { createdAt: 'asc' },
        });
        socket.emit('chat_history', history);

        // Cap inbound message rate per socket — a runaway client can't
        // saturate the DB or push duplicates if the user holds Enter.
        let lastMessageAt = 0;
        const MIN_INTERVAL_MS = 200;
        const MAX_LEN = 4000;

        // 3. HANDLE INCOMING MESSAGES
        socket.on('message', async (rawPayload: any) => {
            const now = Date.now();
            if (now - lastMessageAt < MIN_INTERVAL_MS) return;
            lastMessageAt = now;

            let content = "";

            if (typeof rawPayload === 'object' && rawPayload.content) {
                content = rawPayload.content;
            } else if (typeof rawPayload === 'string') {
                try { content = JSON.parse(rawPayload).content; }
                catch { content = rawPayload; }
            }

            if (!content || !content.trim()) return;
            const trimmed = content.trim().slice(0, MAX_LEN);

            // Atomically write the message AND bump session status so a
            // crash between the two can't leave one without the other.
            const [userMsg] = await prisma.$transaction([
                prisma.chatMessage.create({
                    data: { sessionId: session!.id, senderId: userId, senderType: 'USER', content: trimmed },
                }),
                prisma.chatSession.update({
                    where: { id: session!.id },
                    data: { status: 'PENDING' },
                }),
            ]);

            io.to(`user_${userId}`).emit('receive_message', userMsg);
            io.to('admin_room').emit('admin_receive_message', userMsg);
        });

        socket.on('disconnect', () => {
            console.log(`User ${userId} disconnected.`);
        });
    });
};