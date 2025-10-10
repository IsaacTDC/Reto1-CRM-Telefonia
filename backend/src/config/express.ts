import config from './config';
import express,  {Request, Response } from 'express';
import {pool} from './db';
import indexRoutes from '../routes/indexRoutes';
import cors from 'cors';


export default class Server {
    public app: express.Application;
    private port: number;
    private readonly corsOptions = {
        origin: ["http://localhost:4200", "http://127.0.0.1:4200"],
        // Http methods allowed
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        // Content-type it´s for json apps
        // x-request to use XMLHttpRequest
        // Accept to indicate response waited
        allowedHeaders: ['Content-Type', 'X-Requested-With', 'Accept'],
        optionsSuccessStatus: 200 // Indica code for success
    }

    constructor() {
        this.app = express();
        this.port = config.PORT || 3000;

        // Middleware to parse JSON bodies
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
        this.app.use(cors(this.corsOptions));

        //con esto permitimos las peticiones desde angular
        this.app.use(cors({ origin: "http://localhost:4200", allowedHeaders: ['Content-Type', 'X-Requested-With', 'Accept'] })); //solo permite consumir desde este frontend!!!!!

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
