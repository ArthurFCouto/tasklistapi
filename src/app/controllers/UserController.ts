import { Request, Response } from 'express';
import User from '../../database/models/user';
import bcrypt from 'bcryptjs';

class UserController {
    async save(req: Request, res: Response) {
        try {
            const emailIsPresent = await User.findOne({
                where: {
                    email: req.body.email
                }
            });
            if (emailIsPresent)
                return res.status(400).json({ error: 'E-mail already registered' });
            const user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password_hash: await bcrypt.hash(req.body.password, 8)
            });
            const { id, name, email } = user;
            return res.json({
                id,
                name,
                email
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error on our server. Try later' });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const user = await User.findOne({
                where: {
                    id: req.params.id
                }
            });
            if (!user)
                return res.status(404).json({ error: 'User not found' });
            await user.destroy();
            return res.status(200).json({});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error on our server. Try later' });
        }
    }

    async list(req: Request, res: Response) {
        const user = await User.findAll()
            .then((list: any) => list.map((user: any) => {
                const { id, name, email } = user;
                return {
                    id,
                    name,
                    email
                }
            }));
        return res.json(user);
    }
}

export default new UserController();