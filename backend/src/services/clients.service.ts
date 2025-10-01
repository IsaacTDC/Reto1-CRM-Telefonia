import  {pool} from '../config/db';
import { AppDataSource } from '../config/db';
import { Cliente } from '../entities/client.entity';

export class ClientsService {

    public static async getAllClients() {
        return await AppDataSource.getRepository(Cliente).find({
            relations: ['Telefono'],   //esto trae también los teléfonos
        });
    }

    //Obtiene u cliente por el id
    public static async getClientById(id: number){
        return await AppDataSource.getRepository(Cliente).findOneBy({id});
    }

    //actualiza la información del cliente
    public static async updateClient(id: number, clientData: any) {
        const repo = AppDataSource.getRepository(Cliente);

        const client = await repo.findOne({ where: { id }, relations: ['Telefono'] });
        if (!client) {
            throw new Error(`Cliente con id ${id} no encontrado`);
        }

        repo.merge(client, {
            nombre: clientData.nombre,
            dni: clientData.dni,
            Telefono: clientData.telefonos
        });

        return await repo.save(client);
    }

    public static async createClient(clientData: any) {
        console.log(clientData);
        const repo = AppDataSource.getRepository(Cliente);
        const client = repo.create({
            nombre: clientData.nombre,
            dni: clientData.dni,
            Telefono: (clientData.telefonos || []).map((t: any) => ({
                numero: t.numero
            }))
        });
        console.log(client);
        const saved = await repo.save(client);
        return saved;
    }

    public static async deleteClient(id : number){
        const repo = AppDataSource.getRepository(Cliente);
        return await repo.delete(id);
    }

    
};