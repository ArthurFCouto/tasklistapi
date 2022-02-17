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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../../database/models/user"));
class SessionController {
    verify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const user = yield user_1.default.findOne({
                    where: {
                        email: email
                    }
                });
                if (user) {
                    if (yield bcryptjs_1.default.compare(String(password), user.password_hash)) {
                        const { id, name, email } = user;
                        return res.status(200).json({
                            user: {
                                id,
                                name,
                                email
                            },
                            token: jsonwebtoken_1.default.sign({ id }, String(process.env.JWT_SECRET), {
                                expiresIn: process.env.JWT_EXPIRESIN
                            })
                        });
                    }
                    else
                        return res.status(400).json({
                            error: 'Password does not match'
                        });
                }
                else
                    return res.status(404).json({
                        error: 'User not found'
                    });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: 'Error on our server. Try later' });
            }
        });
    }
}
exports.default = new SessionController();
