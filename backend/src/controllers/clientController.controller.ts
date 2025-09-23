import {ClientsService} from '../services/clients.service';
import { Request, Response } from 'express';
import  RespGeneric from '../models/genericResponse'


export class ClientController { 

    

    public static getAllClients = async (req: Request, res: Response) => {
        let response = new RespGeneric();
        try {
            const clients = await ClientsService.getAllClients();
            response.data = clients;
            response.msg = "Clientes obtenidos con exito";
            response.cod = 200;
        } catch (error) {
            res.status(500).json({message: 'Error al obtener los clientes', error});
        }       
        res.json(response);
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

