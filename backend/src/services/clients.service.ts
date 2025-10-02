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
            where: { id }
        });
        console.log(clientData);
        console.log(client);

        if (!client) {
            throw new Error(`Cliente con id ${id} no encontrado`);
        }

        const incomingIds = clientData.telefonos.map((t: any) => t.id);

        // 1. Desvincular teléfonos que el cliente tenía pero ya no están en clientData
        for (const tel of client.Telefono) {
            if (!incomingIds.includes(tel.id)) {
                tel.Cliente = null; // quitar relación
                await phoneRepo.save(tel);
            }
        }

        // 2. Actualizar o crear teléfonos que llegan en clientData
        const updatedTelefonos: Telefono[] = [];
        for (const tel of clientData.telefonos) {
            let telefono: Telefono | null = null;

            if (tel.id) {
                telefono = await phoneRepo.findOne({
                    where: { id: tel.id },
                    relations: ['Cliente']
                });
                if (telefono) {
                    telefono.numero = tel.numero;
                    telefono.Cliente = client;
                }
            }

            if (!telefono) {
                telefono = phoneRepo.create({
                    numero: tel.numero,
                    Cliente: client,
                    fechaContrato: new Date().toISOString() //
                }) as Telefono; //
            }

            await phoneRepo.save(telefono);
            updatedTelefonos.push(telefono);
        }

        // 3. Actualizar datos básicos del cliente
        client.nombre = clientData.nombre;
        client.dni = clientData.dni;
        client.Telefono = updatedTelefonos;

        await repo.save(client);

        // Retornar objeto plano
        return {
            id: client.id,
            nombre: client.nombre,
            dni: client.dni,
            fechaAlta: client.fechaAlta,
            telefonos: updatedTelefonos.map(t => ({
                id: t.id,
                numero: t.numero,
                fechaContrato: t.fechaContrato
            }))
        };
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