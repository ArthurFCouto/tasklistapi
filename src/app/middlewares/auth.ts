import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../database/models/user';

const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        try {
            const [, token] = authHeader.split(' ');
            const decoded = Object(await jwt.verify(token, String(process.env.JWT_SECRET)));
            const idIsPresent = await User.findByPk(decoded.id);
            if (idIsPresent) {
                req.userId = decoded.id;
                req.role = decoded.role;
                return next();
            } else
                return res.status(401).json({ error: 'Token user not found, invalid token' });
        } catch (error) {
            return res.status(400).json({ error: 'Invalid token' });
        }
    } else return res.status(401).json({ error: 'Request failed, token not sent' });
}

export default authMiddleware;