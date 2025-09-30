import  {pool} from '../config/db';
import { AppDataSource } from '../config/db';
import { Cliente } from '../entities/client.entity';

export class ClientsService {

    public static async getAllClients() {
        return await AppDataSource.getRepository(Cliente).find();
    }

    //Obtiene u cliente por el id
    public static async getClientById(id: number){
        return await AppDataSource.getRepository(Cliente).findOneBy({id});
    }

    //actualiza la información del cliente
    public static async updateClient(id: number, clientData: any) {
        const repo = AppDataSource.getRepository(Cliente);

        // Buscamos el cliente actual con sus teléfonos
        const client = await repo.findOne({
            where: { id },
            relations: ['Telefono']
        });

        if (!client) throw new Error('Cliente no encontrado');

        // Actualizamos los campos básicos
        client.nombre = clientData.nombre;
        client.dni = clientData.dni;

        // Reemplazamos los teléfonos (elimina los antiguos y guarda los nuevos)
        client.Telefono = (clientData.telefonos || []).map((t: any) =>
            repo.manager.getRepository('Telefono').create({
            id: t.id,         // si viene id lo actualiza
            numero: t.numero  // si no viene id crea uno nuevo
            })
        );

        const saved = await repo.save(client);
        return saved;
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