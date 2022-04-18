import { NextFunction, Response } from 'express';
import Config from '../config';
const { roles } = Config;

const roleMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const role = req.role;
    if (role) {
        if (role === roles.admin)
            return next();
        else
            return res.status(403).json({ error: 'Usuário sem permissão de acesso.' });
    } else return res.status(401).json({ error: 'Autorização não identificada. Por favor, tente novamente mais tarde.' });
}

export default roleMiddleware;