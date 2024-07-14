export type User = {
    id: string
    name?: string
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