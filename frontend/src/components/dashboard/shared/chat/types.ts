// Shared shapes for the admin chat dashboard, mirroring the /chat/sessions API.

export interface ChatUser {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string | null;
    customerStatus?: string;
}

export interface ChatSessionInfo {
    id: string;
    status: string;
    user?: ChatUser | null;
    messages: { content?: string | null; senderType?: string }[];
    _count: { messages: number };
}

export interface AdminChatMessage {
    id: string;
    sessionId?: string;
    senderType?: string;
    content?: string | null;
    attachmentUrl?: string | null;
    createdAt: string;
    session?: { status?: string; user?: ChatUser | null } | null;
}
