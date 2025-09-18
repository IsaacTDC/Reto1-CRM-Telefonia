import {PhonesService} from '../services/phones.service';
import { Request, Response } from 'express';

export class PhonesController{
    public static getAllPhonesClientById = async (req: Request , res: Response) =>{
        try {
            const phones = await PhonesService.getPhonesClientById(Number (req.params.id));
            res.json(phones);
        }catch(error){
             res.status(500).json({message: 'Error al obtener el cliente', error});
        }
    };
}