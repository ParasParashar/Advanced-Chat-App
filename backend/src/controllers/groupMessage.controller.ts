import { Request, Response } from "express";
import prisma from '../db/prisma.js';
import { io } from "../socket/socket.js";

// creating message
export const createGroupMessageController = async (req: Request, res: Response) => {
    try {
        const senderId = req.user.id;
        const { message } = req.body;
        const { id: groupId } = req.params;
        // finding the group
        const group = await prisma.group.findUnique({
            where: {
                id: groupId
            },
            include: {
                members: {
                    select: {
                        userId: true
                    }
                }
            }
        });

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Finding or creating the conversation
        let conversation = await prisma.conversation.findFirst({
            where: {
                groupId: groupId,
                isGroupChat: true,
            }
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    groupId: groupId,
                    isGroupChat: true
                }
            });
        }


        const newMessage = await prisma.message.create({
            data: {
                senderId: senderId,
                body: message,
                groupId: groupId,
                conversationId: conversation.id,
                seenByIds: [senderId],
            },
            include: {
                sender: {
                    select: {
                        profilePic: true,
                        id: true,
                        fullname: true,
                        username: true,
                    }
                }
            }
        });

        await prisma.conversation.update({
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

        io.to(groupId).emit('group-message', newMessage);

        res.status(200).json(newMessage)

    } catch (error: any) {
        console.error(error.message, 'group message creation error');
        return res.status(500).json({ error: 'Server error' + error.message });

    }

};
// gettting a groupMessage
export const getGroupMessageController = async (req: Request, res: Response) => {
    try {
        const { id: groupId } = req.params;
        const conversation = await prisma.group.findUnique({
            where: {
                id: groupId,
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
                        senderId: true,
                        seenByIds: true,
                        sender: {
                            select: {
                                username: true,
                                id: true,
                                fullname: true,
                                profilePic: true
                            }
                        }
                    },
                },
                members: {
                    select: {
                        isAdmin: true,
                        user: {
                            select: {
                                username: true,
                                id: true,
                                fullname: true,
                                profilePic: true,
                            }
                        }
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
        console.error(error.message, 'group message creation error');
        return res.status(500).json({ error: 'Server error' + error.message });

    }

};


export const createGroupController = async (req: Request, res: Response) => {
    try {
        const adminId = req.user.id;
        const { name, members } = req.body;
        // finding conversation
        const group = await prisma.group.create({
            data: {
                name: name,
                members: {
                    create: [
                        {
                            user: {
                                connect: {
                                    id: adminId,
                                }
                            },
                            isAdmin: true,
                        },
                    ]
                }
            }
        }
        );
        await Promise.all(
            members.map(async (userId: any) => {
                await prisma.groupMembership.create({
                    data: {
                        groupId: group.id,
                        isAdmin: false,
                        userId: userId
                    }
                });
            })
        );


        res.status(200).json({ groupId: group.id })

    } catch (error: any) {
        console.error(error.message, 'group creation error');
        return res.status(500).json({ error: 'Server error' + error.message });

    }

}


export const getGroupDataController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const user = await prisma.group.findUnique({
            where: { id: id }, select: {
                id: true,
                name: true,
            }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            id: user.id,
            name: user.name,
        });
    } catch (error: any) {
        console.log('Error in getting user Data', error.message);
        res.status(500).json({ error: 'Server Error of getting the user' + error.message })
    }
}



export const groupMessageUpdateController = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const { messageId, groupId } = req.body;

        const group = await prisma.group.findUnique({
            where: {
                id: groupId
            }
            ,
            include: {
                members: {
                    select: {
                        userId: true
                    }
                }
            }
        });
        if (!group) {
            return res.status(200).json({ error: 'Group not found' });
        };

        const message = await prisma.message.findFirst({
            where: {
                id: messageId,
                groupId: groupId,
            },
            select: {
                seenByIds: true,
            }
        });

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        // checking and determine if the message should be marked as seen
        const allMembersSeen = group.members.every(member => message.seenByIds.includes(member.userId) || member.userId === userId);
        const messagesToUpdate = await prisma.message.update({
            where: {
                id: messageId,
            },
            data: {
                seen: allMembersSeen,
                seenByIds: {
                    set: message.seenByIds.includes(userId) ? message.seenByIds : [...message.seenByIds, userId]
                }
            },
            select: {
                id: true,
                seen: true,
                body: true,
                senderId: true,
                createdAt: true,
                seenByIds: true,
                sender: {
                    select: {
                        id: true,
                        fullname: true,
                        profilePic: true,
                    }
                }
            },
        });
        io.to(groupId).emit('group-message-update', messagesToUpdate);

        res.status(200).json(messagesToUpdate);
    } catch (error: any) {
        console.log('Error in updating group message seen ', error.message);
        return res.status(500).json({ error: 'Server error: ' + error.message });
    }
};

