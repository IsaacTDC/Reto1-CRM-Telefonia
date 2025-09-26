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

    public static async updateClient(id: number, payload: Partial<Cliente>){
        const repository = AppDataSource.getRepository(Cliente);

        const client = await repository.findOneBy({ id }); //buscomaos el cliente
        //sino esta emitimos un error
        if(!client){
            const err: any = new Error("No se encontró el cliente");
            err.code = 'NOT_FOUND';
            throw err;
        }

        //si se qeuire cambiar el dni comprobamos si ya se usa
        // --------->Debertia cambiar estop pq no se debe poder cambiar de dni +info para dar juego <---------
        if (payload.dni && payload.dni !== client.dni) {
            const existing = await repository.findOne({ where: { dni: payload.dni } });
            if (existing) {
                const err: any = new Error('DNI en uso');
                err.code = 'DNI_CONFLICT';
                throw err;
            }
        }

        //si todo ha ido bien guardamos 
        repository.merge(client, payload);
        const saved = await repository.save(client);
        return saved;
    }

};