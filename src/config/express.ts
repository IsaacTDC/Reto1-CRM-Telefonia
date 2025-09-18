import config from './config';
import express,  {Request, Response } from 'express';
import {pool} from './db';
import indexRoutes from '../routes/indexRoutes';


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

    public start(callback: (app: express.Application) => void) {
        this.app.listen(this.port, () => callback (this.app)) ;
        //console.log(`Servidor escuchando en el puerto ${this.port}`);
    }
}
