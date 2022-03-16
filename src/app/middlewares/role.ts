import { NextFunction, Response } from 'express';
import { role_admin } from '../config/roles';

const roleMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const role = req.role;
    if (role) {
        if (role === role_admin)
            return next();
        else
            return res.status(403).json({ error: 'User without permission' });
    } else return res.status(401).json({ error: 'Unidentified authorization. Please login again later' });
}

export default roleMiddleware;