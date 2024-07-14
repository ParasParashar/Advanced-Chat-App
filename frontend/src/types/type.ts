export type User = {
    id: string
    username?: string
    fullname: string
    profilePic: string
}

export type SidebarData = {
    message: {
        body: string
        conversationId: string
    },
    participants: User,
    id: string
}