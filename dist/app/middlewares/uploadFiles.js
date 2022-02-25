"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
exports.default = {
    storage: multer_1.default.diskStorage({
        //destination: path.resolve(__dirname, '..', '..', 'uploads'), //Para evitar conflitos de barras, fazemos a navegação dessa maneira
        filename: (req, file, cb) => {
            const ext = path_1.default.extname(file.originalname); //Salvando a extensão do arquivo
            const name = (path_1.default.basename(file.originalname, ext)).replace(/[\s.-]/g, ''); //Salvando o nome original do arquivo e removendo os espaços vazios pontos e traços
            cb(null, `${name.slice(0, 12)}-${Date.now()}${ext}`); //null -> Não estamos tratando erros.
        }
    })
};
