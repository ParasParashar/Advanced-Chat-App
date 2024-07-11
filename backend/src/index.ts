import express from "express"
import dotenv from "dotenv";
import cookieparser from 'cookie-parser';
import authRoute from './routes/auth.route.js'
import messageRoute from './routes/messages.route.js'


dotenv.config();
const app = express();
const PORT = 4000

app.use(cookieparser())
app.use(express.json());

app.get('/api/auth', authRoute)
app.get('/api/messages', messageRoute)


app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
})