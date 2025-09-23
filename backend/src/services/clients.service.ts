import  {pool} from '../config/db';
import { AppDataSource } from '../config/db';
import { Cliente } from '../entities/client.entity';

export class ClientsService {

    public static async getAllClients() {
        return await AppDataSource.getRepository(Cliente).find();
    }

    public static async getClientById(id: number){
        return await AppDataSource.getRepository(Cliente).findOneBy({id});
    }

};