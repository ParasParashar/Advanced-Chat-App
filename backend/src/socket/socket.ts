import { Server } from 'socket.io'

import http from 'http';
import express from 'express';
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000'],
        methods: ["GET", "POST", "DELETE"],
    }
});
const userSocketMap: { [key: string]: string } = {};

// utility functions
export const getReceiverSocketId = (receiverId: string) => {
    return userSocketMap[receiverId];
}



io.on('connection', (socket) => {
    console.log('socket is connected', socket.id);
    const userId = socket.handshake.query.userId as string;

    // adding the socket id with the userId
    if (userId) userSocketMap[userId] = socket.id;

    // io.emit is used to send the message to all the connected clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    // emit the typing message
    socket.on('typing', ({ senderId, receiverId }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('typing', { senderId, receiverId })
        }

    });

    socket.on('stopTyping', ({ senderId, receiverId }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('stopTyping', { senderId, receiverId });
        }
    });

    // emit the group typing message

    socket.on('groupTyping', ({ groupId, senderName }) => {
        io.emit('groupTyping', { groupId, senderName });
    })
    socket.on('stopGroupTyping', ({ groupId, senderName }) => {
        io.emit('stopGroupTyping', { groupId, senderName });
    })

    // emit the group typing message
    socket.on('join-group', (groupId) => {
        socket.join(groupId);
        console.log('user joind', groupId)
    });
    socket.on('leave-group', (groupId) => {
        socket.leave(groupId);
        console.log(`User left group: ${groupId}`);
    });

    // socker.on is used to listen to the events. for both client and the server
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        for (const [userId, socketId] of Object.entries(userSocketMap)) {
            if (socketId === socket.id) {
                delete userSocketMap[userId];
                break;
            }
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});
export { app, io, server }