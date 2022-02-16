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
const user_1 = __importDefault(require("../../database/models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserController {
    save(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const emailIsPresent = yield user_1.default.findOne({
                    where: {
                        email: req.body.email
                    }
                });
                if (emailIsPresent)
                    return res.status(400).json({ error: 'E-mail already registered' });
                const user = yield user_1.default.create({
                    name: req.body.name,
                    email: req.body.email,
                    password_hash: yield bcryptjs_1.default.hash(req.body.password, 8)
                });
                const { id, name, email } = user;
                return res.json({
                    id,
                    name,
                    email
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: 'Error on our server. Try later' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findOne({
                    where: {
                        id: req.params.id
                    }
                });
                if (!user)
                    return res.status(404).json({ error: 'User not found' });
                yield user.destroy();
                return res.status(200).json({});
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: 'Error on our server. Try later' });
            }
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.findAll()
                .then((list) => list.map((user) => {
                const { id, name, email } = user;
                return {
                    id,
                    name,
                    email
                };
            }));
            return res.json(user);
        });
    }
}
exports.default = new UserController();
