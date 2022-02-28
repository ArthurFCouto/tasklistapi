import { Request, Response } from 'express';
import fs, { PathLike } from 'fs';
import bcrypt from 'bcryptjs';
import User from '../../database/models/user';
import logger from '../../logger';

const deleteFile = (src: PathLike) => {
    fs.unlink(src, function (err) {
        if (err)
            logger.error(err);
        console.log(`Image temp deleted. Source: ${src}`);
    });
}

class UserController {
    async save(req: any, res: Response) {
        try {
            const emailIsPresent = await User.findOne({
                where: {
                    email: req.body.email
                }
            });
            if (emailIsPresent)
                return res.status(400).json({ error: 'E-mail already registered' });
            let url = null;
            if (req.file) {
                const { filename, path: src, size } = req.file;
                if (size / 1024 < 300) {
                    url = filename;
                } else {
                    deleteFile(src);
                    return res.status(401).json({ error: 'Image size larger than allowed (300kb)' });
                }
            }
            const user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password_hash: await bcrypt.hash(req.body.password, 8),
                image_perfil: url
            });
            const { id, name, email } = user;
            return res.json({
                id,
                name,
                email,
                image_perfil: url == null ? url : `/public/uploads/${url}`
            });
        } catch (error) {
            logger.error(error);
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
            logger.error(error);
            return res.status(500).json({ error: 'Error on our server. Try later' });
        }
    }

    async list(req: Request, res: Response) {
        const user = await User.findAll()
            .then((list: any) => list.map((user: any) => {
                const { id, name, email, image_perfil } = user;
                const url = image_perfil == null ? `/public/profile.png` : `/public/uploads/${image_perfil}`
                return {
                    id,
                    name,
                    email,
                    image_perfil: url
                }
            }));
        return res.json(user);
    }

    async detail(req: Request, res: Response) {
        try {
            const user = await User.findOne({
                where: {
                    id: req.params.id
                }
            });
            if (!user)
                return res.status(404).json({ error: 'User not found' });
            const { id, name, email, image_perfil } = user;
            const url = image_perfil == null ? `/public/profile.png` : `/public/uploads/${image_perfil}`
            return res.json({
                id,
                name,
                email,
                image_perfil: url
            });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Error on our server. Try later' });
        }
    }
}

export default new UserController();