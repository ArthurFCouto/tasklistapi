import { Request, Response } from 'express';
//import fs, { PathLike } from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../../database/models/user';
import logger from '../../logger';

/*const deleteFile = (src: PathLike) => {
    fs.unlink(src, function (err) {
        if (err)
            logger.error(err);
        console.log(`Image temp deleted. Source: ${src}`);
    });
}*/

class UserController {
    async save(req: any, res: Response) {
        const { email, name, password } = req.body;
        if (!email || !name || !password)
            return res.status(400).json({ error: 'Please check the submitted fields' });
        try {
            const emailIsPresent = await User.findOne({
                where: {
                    email: email
                }
            });
            if (emailIsPresent)
                return res.status(400).json({ error: 'E-mail already registered' });
            /*let url = null;
            if (req.file) {
                const { filename, path: src, size } = req.file;
                if (size / 1024 < 300) {
                    url = filename;
                } else {
                    deleteFile(src);
                    return res.status(401).json({ error: 'Image size larger than allowed (300kb)' });
                }
            }*/
            const user = await User.create({
                name: name,
                email: email,
                password_hash: await bcrypt.hash(password, 8)
            });
            const { id } = user;
            return res.json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: `/public/images/profile.png`
                },
                token: jwt.sign({ id }, String(process.env.JWT_SECRET), {
                    expiresIn: process.env.JWT_EXPIRESIN
                })
            });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Error on our server. Try later' });
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        if (!id)
            return res.status(400).json({ error: 'Please check the submitted fields' });
        try {
            const user = await User.findOne({
                where: {
                    id: id
                }
            });
            if (!user)
                return res.status(404).json({ error: 'User not found' });
            /*if (user.image_perfil != null)
                deleteFile(user.image_perfil);*/
            await user.destroy();
            return res.status(200).json({});
        } catch (error) {
            logger.error(error);
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
                    email,
                    image: `/public/images/profile.png`
                }
            }));
        return res.json(user);
    }

    async detail(req: Request, res: Response) {
        const { id } = req.params;
        if (!id)
            return res.status(400).json({ error: 'Please check the submitted fields' });
        try {
            const user = await User.findOne({
                where: {
                    id: id
                }
            });
            if (!user)
                return res.status(404).json({ error: 'User not found' });
            return res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                image: `/public/images/profile.png`
            });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Error on our server. Try later' });
        }
    }
}

export default new UserController();