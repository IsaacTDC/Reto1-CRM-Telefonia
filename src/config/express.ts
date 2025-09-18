import config from './config.js';
import express,  {Request, Response } from 'express';
import {initDB} from './db.js';
import indexRoutes from '../routes/indexRoutes.js';


export default class Server {
    public app: express.Application;
    private port: number;

    constructor() {
        this.app = express();
        this.port = config.PORT || 3000;

        // Middleware to parse JSON bodies
        this.app.use(express.json());

        // Rutas principal de la API
        this.app.use('/api', indexRoutes);

        this.app.get('/', (_req: Request, res: Response) => {
            res.send('Express + TypeScript Server');
        });
    }

    public getPort(): number {
        return this.port;
    }

    public start() {
        this.app.listen(this.port, () => {
            console.log(`Servidor escuchando en el puerto ${this.port}`);
            initDB();
        });
    }
}
