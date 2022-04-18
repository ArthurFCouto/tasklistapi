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
const user_1 = __importDefault(require("../../database/models/user"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        try {
            const [, token] = authHeader.split(' ');
            const decoded = Object(yield jsonwebtoken_1.default.verify(token, String(process.env.JWT_SECRET)));
            const idIsPresent = yield user_1.default.findByPk(decoded.id);
            if (idIsPresent) {
                req.userId = decoded.id;
                req.role = decoded.role;
                return next();
            }
            else
                return res.status(401).json({ error: 'Token user not found, invalid token' });
        }
        catch (error) {
            return res.status(400).json({ error: 'Invalid token' });
        }
    }
    else
        return res.status(401).json({ error: 'Request failed, token not sent' });
});
exports.default = authMiddleware;
