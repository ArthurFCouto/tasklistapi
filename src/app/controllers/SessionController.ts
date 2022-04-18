import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../database/models/user';
import logger from '../../logger';

class SessionController {
    async verify(req: Request, res: Response) {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: 'Por favor, verifique se os dados foram enviados corretamente.' });
        try {
            const user = await User.findOne({
                where: {
                    email: email
                }
            });
            if (user) {
                if (await bcrypt.compare(String(password), user.password_hash)) {
                    const { id, email, name, role } = user;
                    return res.status(200).json({
                        user: {
                            id,
                            name,
                            email
                        },
                        token: jwt.sign({ id, role }, String(process.env.JWT_SECRET), {
                            expiresIn: process.env.JWT_EXPIRESIN
                        })
                    });
                } else return res.status(400).json({
                    error: 'Senha incorreta'
                });
            } else return res.status(404).json({
                error: 'Usuário não cadastrado'
            });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Erro interno no servidor. Tente mais tarde.' });
        }
    }
}

export default new SessionController();