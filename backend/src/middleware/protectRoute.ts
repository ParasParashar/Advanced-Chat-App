import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from "../db/prisma.js";

interface DecodedToken extends JwtPayload {
    userId: string
}

// declaring global to user type

declare global {
    namespace Express {
        export interface Request {
            user: {
                id: string
            }
        }
    }
}

const protectRoute = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "You need to login first." });
        };
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized!! Invalid token." });
        };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }, select: {
                id: true,
                username: true,
                fullname: true,
                profilePic: true
            }
        });

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        };

        req.user = user;
        next();
    } catch (error: any) {
        console.error('Error in getting protect route', error.message);
    }
};

export default protectRoute;