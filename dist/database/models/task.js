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
const user_1 = __importDefault(require("./user"));
const logger_1 = __importDefault(require("../../logger"));
const Task = __1.default.define('task', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    task: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    check: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    deadline: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    }
});
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Task.belongsTo(user_1.default, {
            constraint: true,
            foreignkey: 'user_id'
        });
        yield Task.sync({
            alter: true
        });
    }
    catch (error) {
        logger_1.default.error(error);
    }
});
init();
exports.default = Task;
