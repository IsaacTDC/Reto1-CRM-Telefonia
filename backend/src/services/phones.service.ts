import {AppDataSource, pool} from '../config/db';
import { Cliente } from '../entities/client.entity';
import { Telefono } from '../entities/phone.entity';
import { Repository } from "typeorm";


export class PhonesService{

    static phoneRepo = () => AppDataSource.getRepository(Telefono);
    static clientRepo = () => AppDataSource.getRepository(Cliente);

    //petición de los telefonos de un cliente usasdno su id
    public static async getPhonesClientById(id_param:number) {
        return await AppDataSource
                    .getRepository(Telefono)
                    .createQueryBuilder("TELEFONOS")
                    .where("TELEFONOS.id_cliente = :id ",{ id: id_param })
                    .getMany();
    }

    public static async addPhoneToClient(clientId: number, numero: string) {
        /* const phoneRepo = AppDataSource.getRepository(Telefono);
        const clientRepo = AppDataSource.getRepository(Cliente); */
        
        const client = await this.clientRepo().findOneBy({ id: clientId });
        if (!client) {
            const err: any = new Error('cliente noencontrado');
            err.code = 'NOT_FOUND';
            throw err;
        }

        const phone = this.phoneRepo().create({
            numero,
            Cliente: client // o la propiedad que tenga tu entity Telefono
        } as Partial<Telefono>);

        return await this.phoneRepo().save(phone);
    }
}