import { Request, Response, NextFunction } from 'express';
import { redis } from '../redis/redisClient.js'

declare module 'express' {
    export interface Response {
        sendResponse?: (body?: any) => Response;
    }
};

const cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const key = req.originalUrl;
    try {
        const cachedData = await redis.get(key);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        } else {
            res.sendResponse = res.json;
            res.json = (body: any) => {
                redis.set(key, JSON.stringify(body), 'EX', 60 * 60); // Cache for 1 hour
                res.sendResponse?.(body);
                return res;
            };
            next();
        }
    } catch (error) {
        console.error('Redis error:', error);
        next();
    }
};

export default cacheMiddleware;