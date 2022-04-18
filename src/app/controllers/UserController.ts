//Realizar a implementação do Service
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../../database/models/user';
import logger from '../../logger';
import Config from '../config';
const { roles } = Config;

type User = {
    created_at: string;
    id: number;
    email: string;
    name: string;
    role: string;
    updated_at: string;
}

const user_model = (user: User) => {
    return {
        created_at: user.created_at,
        email: user.email,
        id: user.id,
        image: `/public/images/profile.png`,
        name: user.name,
        role: user.role,
        updated_at: user.updated_at,
    }
};

class UserController {
    async save(req: any, res: Response) {
        const { email, name, password } = req.body;
        if (!email || !name || !password)
            return res.status(400).json({ error: 'Por favor, verifique se os dados foram enviados corretamente.' });
        try {
            const emailIsPresent = await User.findOne({
                where: {
                    email: email
                }
            });
            if (emailIsPresent)
                return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
            const user = await User.create({
                name: name,
                email: email,
                password_hash: await bcrypt.hash(password, 8),
                role: roles.user
            });
            const { id, role } = user;
            return res.json({
                user: user_model(user),
                token: jwt.sign({ id, role }, String(process.env.JWT_SECRET), {
                    expiresIn: process.env.JWT_EXPIRESIN
                })
            });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Erro interno no servidor. Tente mais tarde.' });
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        if (!id)
            return res.status(400).json({ error: 'Por favor, verifique se os dados foram enviados corretamente.' });
        try {
            const user = await User.findOne({
                where: {
                    id: id
                }
            });
            if (!user)
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            await user.destroy();
            return res.status(200).end();
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Erro interno no servidor. Tente mais tarde.' });
        }
    }

    async list(req: Request, res: Response) {
        const user = await User.findAll()
            .then((list: any) => list.map((user: any) => {
                return user_model(user);
            }));
        return res.json(user);
    }

    async detail(req: Request, res: Response) {
        const { id } = req.params;
        if (!id)
            return res.status(400).json({ error: 'Por favor, verifique se os dados foram enviados corretamente.' });
        try {
            const user = await User.findOne({
                where: {
                    id: id
                }
            });
            if (!user)
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            return res.json(user_model(user));
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Erro interno no servidor. Tente mais tarde.' });
        }
    }
}

export default new UserController();