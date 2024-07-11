import { Response } from "express";
import jwt from 'jsonwebtoken';

const generateToken = (userId: String, res: Response) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
            expiresIn: '15d'
        });
        res.cookie('jwt', token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            sameSite: true,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'


        });
        return token;

    } catch (error: any) {
        console.error("Error in generating token", error.message);
    }
}

export default generateToken