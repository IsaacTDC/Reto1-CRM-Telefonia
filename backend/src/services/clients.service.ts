import { Telefono } from '../entities/phone.entity';
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
        const phoneRepo = AppDataSource.getRepository(Telefono);

        const client = await repo.findOne({
            where: { id },
            relations: ['Telefono'],
        });

        if (!client) {
            throw new Error(`Cliente con id ${id} no encontrado`);
        }

        // Actualizar campos básicos
        client.nombre = clientData.nombre;
        client.dni = clientData.dni;

        // Extraer los IDs que vienen del front
        const incomingIds = clientData.Telefono.filter((t: any) => t.id).map((t: any) => t.id);

        // Desvincular los que ya no estén
        const phonesToUnlink = client.Telefono.filter(t => !incomingIds.includes(t.id));
        if (phonesToUnlink.length > 0) {
            for (const phone of phonesToUnlink) {
            phone.Cliente = null;
            await phoneRepo.save(phone);
            }
        }

        // Asociar los que vienen (nuevos + existentes)
        client.Telefono = await Promise.all(
            clientData.Telefono.map(async (t: any) => {
            if (t.id) {
                // Teléfono existente → actualizar número si cambió
                const phone = await phoneRepo.findOneBy({ id: t.id });
                if (phone) {
                phone.numero = t.numero;
                phone.Cliente = client;
                return await phoneRepo.save(phone);
                }
            }
            // Teléfono nuevo
            return phoneRepo.create({ numero: t.numero, Cliente: client });
            })
        );

        return await repo.save(client);
    }

    public static async createClient(clientData: any) {
        console.log("En añadir cliente q llega",clientData);
        const repo = AppDataSource.getRepository(Cliente);
        const client = repo.create({
            nombre: clientData.nombre,
            dni: clientData.dni,
            Telefono: clientData.Telefono
        });
        console.log("En añadir cliente back",client);
        const saved = await repo.save(clientData);
        return saved;
    }

    public static async deleteClient(id : number){
        const repo = AppDataSource.getRepository(Cliente);
        return await repo.delete(id);
    }

    
};