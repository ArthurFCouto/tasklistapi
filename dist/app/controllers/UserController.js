"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../../database/models/user"));
const logger_1 = __importDefault(require("../../logger"));
const config_1 = __importDefault(require("../config"));
const { roles } = config_1.default;
const user_model = (user) => {
    return {
        created_at: user.created_at,
        email: user.email,
        id: user.id,
        image: `/public/images/profile.png`,
        name: user.name,
        role: user.role,
        updated_at: user.updated_at,
    };
};
class UserController {
    save(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, name, password } = req.body;
            if (!email || !name || !password)
                return res.status(400).json({ error: 'Please check the submitted fields' });
            try {
                const emailIsPresent = yield user_1.default.findOne({
                    where: {
                        email: email
                    }
                });
                if (emailIsPresent)
                    return res.status(400).json({ error: 'E-mail already registered' });
                const user = yield user_1.default.create({
                    name: name,
                    email: email,
                    password_hash: yield bcryptjs_1.default.hash(password, 8),
                    role: roles.user
                });
                const { id, role } = user;
                return res.json({
                    user: user_model(user),
                    token: jsonwebtoken_1.default.sign({ id, role }, String(process.env.JWT_SECRET), {
                        expiresIn: process.env.JWT_EXPIRESIN
                    })
                });
            }
            catch (error) {
                logger_1.default.error(error);
                return res.status(500).json({ error: 'Error on our server. Try later' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id)
                return res.status(400).json({ error: 'Please check the submitted params' });
            try {
                const user = yield user_1.default.findOne({
                    where: {
                        id: id
                    }
                });
                if (!user)
                    return res.status(404).json({ error: 'User not found' });
                /*if (user.image_perfil != null)
                    deleteFile(user.image_perfil);*/
                yield user.destroy();
                return res.status(200).end();
            }
            catch (error) {
                logger_1.default.error(error);
                return res.status(500).json({ error: 'Error on our server. Try later' });
            }
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.findAll()
                .then((list) => list.map((user) => {
                return user_model(user);
            }));
            return res.json(user);
        });
    }
    detail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id)
                return res.status(400).json({ error: 'Please check the submitted fields' });
            try {
                const user = yield user_1.default.findOne({
                    where: {
                        id: id
                    }
                });
                if (!user)
                    return res.status(404).json({ error: 'User not found' });
                return res.json(user_model(user));
            }
            catch (error) {
                logger_1.default.error(error);
                return res.status(500).json({ error: 'Error on our server. Try later' });
            }
        });
    }
}
exports.default = new UserController();
//Futuros testes com a biblioteca multer
//import fs, { PathLike } from 'fs';
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
/*const deleteFile = (src: PathLike) => {
fs.unlink(src, function (err) {
if (err)
logger.error(err);
console.log(`Image temp deleted. Source: ${src}`);
});
}*/ 
