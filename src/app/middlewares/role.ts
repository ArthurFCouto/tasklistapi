import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../database/models/user';
import logger from '../../logger';
import { role_admin } from '../config/roles';

const roleMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const role = req.role;
    if (role) {
        if (role === role_admin)
            return next();
        else
            return res.status(403).json({ error: 'User without permission' });
    } else return res.status(401).json({ error: 'Error on our server. Try later' });
}

export default roleMiddleware;