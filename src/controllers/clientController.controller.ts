import {ClientsService} from '../services/clients.service';
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

    //servicio para obtener un cliente por su ID
    public static getClientById = async (req: Request, res: Response) => {
        try {
            const client = await ClientsService.getClientById(Number (req.params.id));
            res.json(client);
        }catch (error) {
            res.status(500).json({message: 'Error al obtener el cliente', error});
        }  
    }

    
};

