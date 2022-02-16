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
const sequelize_1 = require("sequelize");
const __1 = __importDefault(require(".."));
const User = __1.default.define('user', {
    id: sequelize_1.DataTypes.INTEGER,
    name: sequelize_1.DataTypes.STRING,
    email: sequelize_1.DataTypes.BOOLEAN,
    password_hash: sequelize_1.DataTypes.STRING
});
//Create table if not exists...
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    yield User.sync();
});
init();
exports.default = User;
