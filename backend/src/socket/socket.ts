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

    if (userId) {
        userSocketMap[userId] = socket.id;
    };
    // io.emit is used to send the message to all the connected clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    // socker.on is used to listen to the events. for both client and the server
    socket.on('disconnect', () => {

        console.log('user disconnected', socket.id);

        delete userSocketMap[socket.id]; //deleting the connected socket

        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});
export { app, io, server }