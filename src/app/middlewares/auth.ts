import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../database/models/user';

const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
    //Recuperando os dados de autorização enviados
    const authHeader = req.headers.authorization;
    if (authHeader) {
        try {
            //Criando uma array com a autorização enviada e armazenando apenas a segunda posição em token
            const [, token] = authHeader.split(' ');
            const decoded = Object(await jwt.verify(token, String(process.env.JWT_SECRET)));
            const idIsPresent = await User.findByPk(decoded.id);
            if (idIsPresent) {
                req.userId = decoded.id;
                req.role = decoded.role;
                return next();
            } else
                return res.status(401).json({ error: 'Token e/ou usuário inválido!' });
        } catch (error) {
            return res.status(400).json({ error: 'Token inválido!' });
        }
    } else return res.status(401).json({ error: 'Falha na requisição: Token não enviado.' });
}

export default authMiddleware;