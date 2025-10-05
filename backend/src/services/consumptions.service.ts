import { AppDataSource } from '../config/db';
import { Consumo } from "../entities/consumption.entity";
import { Telefono } from "../entities/phone.entity";

//Con esta interfaz normalizamos los datos de entrada para evitar problemas anteriores
export interface ConsumptionNottId{
    mes: number;
    anio: number;
    consumo: number; 
    telefonoId: number
}


export class ConsumptionsService{

    private static consumRepo = AppDataSource.getRepository(Consumo);

    //endpoint para crear un nuevo consumo
    public static async createConsumption(data: ConsumptionNottId){
        const phoneRepo = AppDataSource.getRepository(Telefono);

        //validamos qeu el valor del mes este entre los valores correctos <------revisra esta validadcion. Db tal vez consultar typeorm
        if (data.mes < 1 || data.mes > 12) {
            throw { code: "INVALID_MONTH", message: "El mes debe estar entre 1 y 12" };
        }

        const telefono = await phoneRepo.findOneBy({id: data.telefonoId}); //extraemos el telefono al qeu vamosa añadir el consumo
        if (!telefono) {
            throw { code: "NOT_FOUND", message: `Teléfono con id ${data.telefonoId} no encontrado` };//comporbación típica
        }

        //creamos el nuevo consumo con los campos que nos han llegado
        const nuevoConsumo = this.consumRepo.create({ 
            mes: data.mes,
            anio: data.anio,
            consumo: data.consumo,
            telefono
        });

        try{
            return await this.consumRepo.save(nuevoConsumo); //lo guardamos
        }catch (error: any){ //si ya existe el consumo con el mismo mes y año para ese teléfono emitimos el error
            if (error.code === "ER_DUP_ENTRY") {
                throw { code: "DUPLICATE_CONSUMPTION", message: "Ya existe un consumo para este mes y año en ese teléfono." };
            }
            console.log(error);
            throw error;
        }
    }

    //endpoint para obtener consumos de un año
    public static async getConsumptionByPhoneAndYear(telefonoId: number, anio: number){

        const consumos = await this.consumRepo.find({
            where: {
                telefono: {id: telefonoId},
                anio
            },
            order: { mes: "ASC" } //>------ lo erdenamos de forma ascendente
        });
        
        if (!consumos.length) {
            throw { code: "NOT_FOUND", message: `No hay consumos para el teléfono ${telefonoId} en el año ${anio}` };
        }
        
        return consumos;
    }

    public static async updateCunsumption( id: number, newConsumo: number){
        const existing = await this.consumRepo.findOne({where:{ id }});

        if (!existing) {
            throw { code: "NOT_FOUND", message: `Consumo con id ${id} no encontrado` };
        }

        if (newConsumo < 0) {
            throw { code: "INVALID_CONSUMPTION", message: "El valor de consumo no puede ser negativo." };
        }

        existing.consumo = newConsumo;

        try{
            const update = await this.consumRepo.save(existing);
            return update;
        }catch(error: any){
            console.error("Erroe al actualizar el consumo", error);
            throw error;
        }

    }

    public static async deleteConsumption(id: number) {

        // Buscar el consumo antes de eliminar
        const existing = await this.consumRepo.findOne({ where: { id } });

        if (!existing) {
            throw { code: "NOT_FOUND", message: `Consumo con id ${id} no encontrado` };
        }

        try {
            await this.consumRepo.remove(existing);
            return { message: `Consumo con id ${id} eliminado correctamente` };
        } catch (error) {
            console.error("Error al eliminar consumo:", error);
            throw error;
        }
    }
}