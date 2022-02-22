import multer from 'multer';
import path from 'path';

export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'), //Para evitar conflitos de barras, fazemos a navegação dessa maneira
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname); //Salvando a extensão do arquivo
            const name = path.basename(file.originalname, ext); //Salvando o nome original do arquivo
            cb(null, `${name.slice(0, 12)}-${Date.now()}${ext}`); //null -> Não estamos tratando erros.
        }
    })
};