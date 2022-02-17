import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../database/models/user';

class SessionController {
    async verify(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({
                where: {
                    email: email
                }
            });
            if (user) {
                if (await bcrypt.compare(String(password), user.password_hash)) {
                    const { id, name, email } = user;
                    return res.status(200).json({
                        user: {
                            id,
                            name,
                            email
                        },
                        token: jwt.sign({ id }, String(process.env.JWT_SECRET), {
                            expiresIn: process.env.JWT_EXPIRESIN
                        }) 
                    });
                } else return res.status(400).json({
                    error: 'Password does not match'
                });
            } else return res.status(404).json({
                error: 'User not found'
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error on our server. Try later' });
        }
    }
}

export default new SessionController();