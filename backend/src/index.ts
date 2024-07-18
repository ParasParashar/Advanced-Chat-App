import express from "express"
import dotenv from "dotenv";
import cookieparser from 'cookie-parser';
import authRoute from './routes/auth.route.js'
import messageRoute from './routes/messages.route.js'
import { app, server } from "./socket/socket.js";


dotenv.config();

const PORT = 4000


app.use(cookieparser())
app.use(express.json());

app.use('/api/auth', authRoute)
app.use('/api/messages', messageRoute)


server.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
})