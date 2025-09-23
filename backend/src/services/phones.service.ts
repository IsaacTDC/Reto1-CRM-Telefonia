import {AppDataSource, pool} from '../config/db';
import { Cliente } from '../entities/client.entity';
import { Telefono } from '../entities/phone.entity';
import { Repository } from "typeorm";


export class PhonesService{

    //petición de los telefonos de un cliente usasdno su id
    public static async getPhonesClientById(id_param:number) {
        return await AppDataSource
                    .getRepository(Telefono)
                    .createQueryBuilder("TELEFONOS")
                    .where("TELEFONOS.id_cliente = :id ",{ id: id_param })
                    .getMany();
    }
}