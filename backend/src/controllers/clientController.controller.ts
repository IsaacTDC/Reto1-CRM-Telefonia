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
        let response = new RespGeneric();
        try {
            const client = await ClientsService.getClientById(Number (req.params.id));
            res.json(client);
        }catch (error) {
            res.status(500).json({message: 'Error al obtener el cliente', error});
        }  
    }

    //editar los datos del cliente
    public static async updateClient(req: Request, res: Response) {
        const id = Number(req.params.id);
        try {
            const updated = await ClientsService.updateClient(id, req.body);
            return res.json({ msg: 'Cliente actualizado', data: updated });
        } catch (err: any) {
            if (err.code === 'NOT_FOUND') return res.status(404).json({ message: err.message });
            if (err.code === 'DNI_CONFLICT') return res.status(409).json({ message: err.message });
            console.error(err);
            return res.status(500).json({ message: 'Error al actualizar cliente' });
        }
    }

    public static async createClient(req : Request, res: Response){
        let response = new RespGeneric();
        try{
            const create = await ClientsService.createClient(req.body);
            response.data = create;
            response.msg = "Cliente creado con exito";
            response.cod = 200;
        }catch(error){
            response.msg = "No se ha podido crear el cliente";
            response.cod = 500;
        }
        return res.json(response);
    }

    public static async deleteClient(req : Request, res: Response){
        let response = new RespGeneric();
        try{
            const id = Number(req.params.id);
            const result = await ClientsService.deleteClient(id);
            if (result.affected === 0) {
             return res.status(404).json({ message: 'Cliente no encontrado' });
            }
            response.data = {};
            response.msg = "Cliente eliminado con exito";
            response.cod = 200;
        }catch(error){
            response.msg = "No se ha eliminado el cliente";
            response.cod = 500;
        }
        return res.json(response);
    }

    
};

