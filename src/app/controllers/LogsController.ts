import { Request, Response } from 'express';
import { readFile } from 'fs';
import path from 'path';

class LogController {
    async getLogs(req: Request, res: Response) {
        const src = path.resolve(__dirname, '..', '..', '..', 'logs', 'logs.log');
        //const src = 'logs/logs.log';
        readFile(src, (err, data) => {
            if (err)
                return res.status(500).json({
                    error: 'Error on our server. Try later',
                    details: err
                });
            return res.set({ 'Content-Type': 'application/json' }).send(data);
        });
    }
}

export default new LogController();