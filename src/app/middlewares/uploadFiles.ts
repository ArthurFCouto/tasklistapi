//Futura implantação
/*
import multer from 'multer';
import path from 'path';

export default {
    storage: multer.diskStorage({
         //Para evitar conflitos em diferentes SO, a navegação é feita da maneira abaixo
        destination: path.resolve(__dirname, '..', '..', 'public', 'uploads'),
        filename: (req, file, cb) => {
             //Extensão do arquivo
            const ext = path.extname(file.originalname);
            //Nome original do arquivo, sem espaços vazios, pontos ou traços
            const name = (path.basename(file.originalname, ext)).replace(/[\s.-]/g, '');
            //null -> Indica que não está sendo tratado os erros
            cb(null, `${name.slice(0, 12)}-${Date.now()}${ext}`); 
        }
    })
};
*/