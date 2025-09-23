import {PhonesService} from '../services/phones.service';
import { Request, Response } from 'express';
import  RespGeneric from '../models/genericResponse'


export class PhonesController{
    public static getAllPhonesClientById = async (req: Request , res: Response) =>{
        let response = new RespGeneric();
        try {
            const phones = await PhonesService.getPhonesClientById(Number (req.params.id));
            response.data = phones;
            response.msg = "Telefonos obtenidos con éxito";
            response.cod = 200;
        }catch(error){
            console.error(error);
            res.status(500).json({message: 'Error al obtener el telefonos', error});
        }
        res.json(response);
    };
}