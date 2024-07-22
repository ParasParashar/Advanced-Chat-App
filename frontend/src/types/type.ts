export type User = {
    id: string
    username?: string
    fullname: string
    profilePic: string
}

export type MessageType = {
    id: string;
    body: string;
    senderId: string;
    seen: boolean;
    createdAt: string;
    conversationId?: string;
};

export type SidebarData = {
    message: {
        body: string
        conversationId: string
        seen: boolean
    },
    participants: User,
    id: string,
    unseenMesssages?: number
}