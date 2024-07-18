import { Request, Response } from "express";
import prisma from "../../db/prisma.js";

export const sendMessageController = async (req: Request, res: Response) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;

        let conversation = await prisma.conversation.findFirst({
            where: {
                participantsIds: {
                    hasEvery: [senderId, receiverId],
                },
            },
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    participantsIds: {
                        set: [senderId, receiverId],
                    },
                },
            });
        }

        const newMessage = await prisma.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id,
            },
        });
        if (newMessage) {
            conversation = await prisma.conversation.update({
                where: {
                    id: conversation.id
                },
                data: {
                    messages: {
                        connect: {
                            id: newMessage.id
                        }
                    }
                }
            });

        }
        return res.status(200).json(newMessage)

    } catch (error: any) {
        console.log('Send user message error', error.message);
        return res.status(500).json({ error: 'Server error' + error.message });
    }

};

export const getMessageController = async (req: Request, res: Response) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user.id;
        const conversation = await prisma.conversation.findFirst({
            where: {
                participantsIds: {
                    hasEvery: [senderId, userToChatId]
                }
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }

        });
        if (!conversation) {
            return res.status(200).json([])
        };
        res.status(200).json(conversation.messages)

    } catch (error: any) {
        console.log('Error in getting user', error.message);
        return res.status(500).json({ error: 'Server error' + error.message });
    }

};

export const getUserConversations = async (req: Request, res: Response) => {
    try {
        let conversations = await prisma.conversation.findMany({
            where: {
                participantsIds: {
                    has: req.user.id
                }
            },
            include: {
                messages: {
                    select: {
                        body: true,
                        conversationId: true,
                        // senderId: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                },
                participants: {
                    where: {
                        id: {
                            not: req.user.id
                        }
                    },
                    select: {
                        id: true,
                        profilePic: true,
                        username: true,
                        fullname: true
                    }
                }
            },

        });


        conversations = await Promise.all(conversations.map(async conversation => {
            if (conversation.participantsIds.length > 0) {
                conversation.participants = await prisma.user.findMany({
                    where: {
                        id: {
                            in: conversation.participantsIds.filter(id => id !== req.user.id)
                        },
                    },
                    select: {
                        id: true,
                        profilePic: true,
                        username: true,
                        fullname: true
                    }
                });
            }
            return conversation;
        }));

        const data = conversations.map((item) => ({ message: item?.messages[0] ? item?.messages[0] : { body: "New Chat" }, participants: item.participants[0], id: item.id }))
        res.status(200).json(data)
    } catch (error: any) {
        console.log('Error in getting user coversation', error.message);
        return res.status(500).json({ error: 'Server error' + error.message });
    }

}

export const getUserforSidebar = async (req: Request, res: Response) => {
    try {
        const query = req.query.query as string;

        let users;
        if (query) {
            users = await prisma.user.findMany({
                where: {
                    id: {
                        not: req.user.id
                    },
                    OR: [
                        {
                            username: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        },
                        {
                            fullname: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        }
                    ]
                },
                take: 4,
                select: {
                    username: true,
                    id: true,
                    profilePic: true,
                    fullname: true
                }
            });
        } else {
            users = await prisma.user.findMany({
                where: {
                    id: {
                        not: req.user.id
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 4,
                select: {
                    username: true,
                    id: true,
                    profilePic: true,
                    fullname: true
                }
            });
        }
        if (!users) {
            return res.status(404).json({ error: 'Search User not found' })
        }
        res.status(200).json(users);
    } catch (error: any) {
        console.log('Error in getting user for the sidebar', error.message);
        return res.status(500).json({ error: 'Server error: ' + error.message });
    }
}
export const deleteChatsController = async (req: Request, res: Response) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user.id;
        const conversations = await prisma.conversation.findFirst({
            where: {
                participantsIds: {
                    hasEvery: [senderId, receiverId]
                }
            },
            select: {
                id: true
            }
        })
        if (!conversations) {
            return res.status(402).json({ error: "You don't have any conversation with this user." })
        }

        await prisma.message.deleteMany({
            where: {
                conversationId: conversations.id,
            },
        });

        res.status(200).json({ message: 'Chat Clear Successfully' });
    } catch (error: any) {
        console.log('Error in deleting user chats', error.message);
        return res.status(500).json({ error: 'Server error: ' + error.message });
    }
}

