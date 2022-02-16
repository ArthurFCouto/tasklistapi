import { Request, Response } from 'express';
import User from '../../database/models/user';

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
                password_hash: req.body.password
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