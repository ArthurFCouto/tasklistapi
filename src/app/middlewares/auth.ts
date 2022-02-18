import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from "../../database/models/user"

const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const [, token] = authHeader.split(' ');
        try {
            const decoded = Object(await jwt.verify(token, String(process.env.JWT_SECRET)));
            req.userId = decoded.id;
            const idIsPresent = await User.findByPk(decoded.id);
            if (idIsPresent)
                return next();
            else
                return res.status(400).json({ error: 'Invalid token' });
        } catch (error) {
            return res.status(500).json({ error: 'Error on our server. Try later' });
        }
    } else return res.status(401).json({
        error: 'Request failed, token not sent'
    });
}

export default authMiddleware;