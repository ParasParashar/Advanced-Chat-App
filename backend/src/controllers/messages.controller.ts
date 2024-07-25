import { Request, Response } from "express";
import prisma from '../db/prisma.js';
import { getReceiverSocketId, io } from "../socket/socket.js";


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
                    isGroupChat: false,
                },
            });
        }

        const newMessage = await prisma.message.create({
            data: {
                senderId: senderId,
                body: message,
                conversationId: conversation.id,
                seenByIds: [senderId]
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
        // adding socket io
        const receiverSocketId = getReceiverSocketId(receiverId);
        const senderSocketId = getReceiverSocketId(senderId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('new-message', newMessage)
            io.to(senderSocketId).emit('new-message', newMessage)
        }
        // also sending the response 

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
                isGroupChat: false,
                participantsIds: {
                    hasEvery: [senderId, userToChatId]
                }
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    },
                    select: {
                        id: true,
                        createdAt: true,
                        conversationId: true,
                        body: true,
                        seen: true,
                        senderId: true
                    }
                }
            }

        });
        if (!conversation) {
            return res.status(200).json([])
        };

        const obj: any = {};
        conversation.messages.forEach((item: any) => {
            const date = new Date(item.createdAt).toDateString();
            if (!obj[date]) {
                obj[date] = [];
            };
            obj[date].push(item)
        });

        const data = Object.entries(obj).map(([date, messages]) => ({
            date,
            messages,
        }));


        res.status(200).json(data)

    } catch (error: any) {
        console.log('Error in getting user', error.message);
        return res.status(500).json({ error: 'Server error' + error.message });
    }

};

// data for the sidebar

export const getUserConversations = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;

        // Fetching personal conversations
        let personalConversations = await prisma.conversation.findMany({
            where: {
                participantsIds: {
                    has: userId
                },
                isGroupChat: false
            },
            include: {
                messages: {
                    select: {
                        body: true,
                        conversationId: true,
                        createdAt: true,
                        senderId: true,
                        seen: true,
                        seenByIds: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                participants: {
                    where: {
                        id: {
                            not: userId
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
            orderBy: {
                updatedAt: 'desc',
            }
        });

        // Fetching group conversations where the user is a member
        let groupConversations = await prisma.group.findMany({
            where: {
                members: {
                    some: {
                        userId: userId
                    }
                },
            },
            include: {
                messages: {
                    select: {
                        body: true,
                        conversationId: true,
                        createdAt: true,
                        senderId: true,
                        seen: true,
                        seenByIds: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                },
            }
        });



        personalConversations = await Promise.all(personalConversations.map(async (conversation: any) => {
            if (conversation.participantsIds.length > 0) {
                conversation.participants = await prisma.user.findMany({
                    where: {
                        id: {
                            in: conversation.participantsIds.filter((id: string) => id !== req.user.id)
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


        const data = personalConversations.map((item: any) => {
            const unseenMessages = item.messages.reduce((acc: number, message: any) => {
                if (message.seen === 'false' && message.senderId !== req.user.id) {
                    return acc + 1;
                }
                return acc;
            }, 0);
            return {
                message: item?.messages[0] ? item?.messages[0] : { body: "New Chat", createdAt: Date.now(), seen: false },
                participants: item.participants[0],
                id: item.id,
                unseenMesssages: unseenMessages,
                type: 'user',
            }
        })

        const data2 = groupConversations.map((item: any) => {
            const unseenMessages = item.messages.reduce((acc: number, message: any) => {
                const isUserSeenMsg = message.seenByIds?.includes(userId);
                if (!isUserSeenMsg && message.senderId !== req.user.id) {
                    return acc + 1;
                }
                return acc;
            }, 0);
            return {
                message: item?.messages[0] ? item?.messages[0] : { body: "New group Chat", createdAt: Date.now(), seen: false },
                participants: { id: item.id, fullname: item.name },
                id: item.id,
                unseenMesssages: unseenMessages,
                type: 'group',
            }

        })
        const result = [...data, ...data2].sort((b: any, a: any) => a.message.createdAt - b.message.createdAt);;
        res.status(200).json(result);
    } catch (error: any) {
        console.log('Error in getting user conversations', error.message);
        return res.status(500).json({ error: 'Server error: ' + error.message });
    }
};



// search user and group 
export const getSearchUser = async (req: Request, res: Response) => {
    try {
        const query = req.query.query as string;

        let users = [];
        let groups = [];

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
            groups = await prisma.group.findMany({
                where: {
                    AND: [
                        {
                            name: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        },
                        {
                            members: {
                                some: {
                                    userId: req.user.id
                                }
                            }
                        }
                    ]
                },
                take: 4,
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
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
                take: 3,
                select: {
                    username: true,
                    id: true,
                    profilePic: true,
                    fullname: true
                }
            });
            groups = await prisma.group.findMany({
                where: {
                    members: {
                        some: {
                            userId: req.user.id
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 4,
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                }
            });
        }




        if (!users && !groups) {
            return res.status(404).json({ error: 'No Search User or group found' })
        }
        const results = [
            ...users.map(user => ({
                type: 'user',
                id: user.id,
                username: user.username,
                fullname: user.fullname,
                profilePic: user.profilePic
            })),
            ...groups.map(group => ({
                type: 'group',
                id: group.id,
                name: group.name,
                createdAt: group.createdAt
            }))
        ];
        res.status(200).json(results);
    } catch (error: any) {
        console.log('Error in getting search user or group in sidebar', error.message);
        return res.status(500).json({ error: 'Server error: ' + error.message });
    }
};

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
};

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
};

export const deleteConversationController = async (req: Request, res: Response) => {
    try {
        const { id: conversationId } = req.params;
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
        });

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found." });
        }
        const dm = await prisma.message.deleteMany({
            where: {
                conversationId: conversation.id,
            },
        });
        const dc = await prisma.conversation.delete({
            where: {
                id: conversation.id,
            },
        });

        res.status(200).json({ message: 'Conversation deleting successfully' });
    } catch (error: any) {
        console.log('Error in deleting conversations', error.message);
        return res.status(500).json({ error: 'Server error: ' + error.message });
    }
};


export const updateMessageController = async (req: Request, res: Response) => {
    try {
        const senderId = req.user.id;
        const { messageId } = req.body;
        const { id: receiverId } = req.params;
        const messagesToUpdate = await prisma.message.update({
            where: {
                id: messageId
            },
            data: {
                seen: true,
                seenByIds: [receiverId]
            },
            select: {
                id: true,
                seen: true,
                body: true,
                senderId: true,
                createdAt: true
            }
        });
        const receiverSocketId = getReceiverSocketId(receiverId);
        const senderSocketId = getReceiverSocketId(senderId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('updated-message', messagesToUpdate)
            io.to(senderSocketId).emit('updated-message', messagesToUpdate)
        };
        res.status(200).json(messagesToUpdate);
    } catch (error: any) {
        console.log('Error in updating message seen conversations', error.message);
        return res.status(500).json({ error: 'Server error: ' + error.message });
    }
};

