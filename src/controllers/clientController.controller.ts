import {ClientsService} from '../services/clients.service.js';
import { Request, Response } from 'express';


export class ClientController { 

    public static getAllClients = async (req: Request, res: Response) => {
        try {
            const clients = await ClientsService.getAllClients();
            res.json(clients);
        } catch (error) {
            res.status(500).json({message: 'Error al obtener los clientes', error});
        }       
    };
};

