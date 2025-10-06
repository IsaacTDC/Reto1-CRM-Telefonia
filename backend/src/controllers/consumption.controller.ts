import { Request, Response } from "express";
import RespGeneric from "../models/genericResponse";
import { ConsumptionsService } from "../services/consumptions.service";
import { ConsumptionNottId } from "../services/consumptions.service";


export class ConsumptionController {

    public static async createConsumption(req: Request, res: Response) {
        let response = new RespGeneric();

        try {
            const { mes, anio, consumo, telefonoId } = req.body as ConsumptionNottId;;

            const created = await ConsumptionsService.createConsumption({ mes, anio, consumo, telefonoId });

            response.cod = 201;
            response.msg = "Consumo creado con éxito";
            response.data = created;

        } catch (error: any) {
            if (error.code === "NOT_FOUND") {
                return res.status(404).json({ message: error.message });
            }
            if (error.code === "DUPLICATE_CONSUMPTION") {
                //return res.status(400).json({ message: error.message });
                response.cod = 400;
                response.msg = error.message;
                response.data = [];
                return res.status(400).json(response);
            }
            if(error.code === "INVALID_MONTH"){//enviamos el error de la comprobacion  
                return res.status(400).json({ message: error.message });
            }

            console.error(error);
            return res.status(500).json({ message: "Error al crear consumo" });
        }
        return res.json(response);
    }

    public static async getConsumptionsByPhoneAndYear(req: Request, res: Response){

        let response = new RespGeneric();
        try{
            const telefonoId = Number (req.params.id_telefono);
            const anio = Number (req.params.anio);

            const consumos = await ConsumptionsService.getConsumptionByPhoneAndYear(telefonoId, anio);
            console.log(consumos);
            response.cod = 200;
            response.msg = "Cnsumos obtenidos con éxito";
            response.data = consumos;
            ;
        }catch(error: any){
            if(error.code === "NOT_FOUND"){
                //return res.status(404).json({ message: error.message })
                response.cod = 404;
                response.msg = "No hay consumos para este año";
                response.data = [];
            }
            console.error(error);
            //return res.status(500).json({ message: "Error al obtener consumos" });
            response.cod = 500;
            response.msg = "Error al obtener consumos";
            response.data = [];
        }
        return res.json(response)
    }

    public static async updateConsumption(req: Request, res: Response){
        let response = new RespGeneric();
        const id = Number(req.params.id);

        try{
            const updated = await ConsumptionsService.updateCunsumption(id,req.body.consumo);

            response.cod = 200;
            response.msg = "Consumo actualizado con éxito";
            response.data = updated;

            return res.json(response);
        }catch(error: any){
            if (error.code === "NOT_FOUND") {
                return res.status(404).json({ message: error.message });
            }
            if (error.code === "INVALID_CONSUMPTION") {
                return res.status(400).json({ message: error.message });
            }

            console.error(error);
            return res.status(500).json({ message: "Error al actualizar consumo" });
        }
    }

    public static async deleteConsumption(req: Request, res: Response) {
        let response = new RespGeneric();
        const id = Number(req.params.id);

        try {
            const result = await ConsumptionsService.deleteConsumption(id);

            response.cod = 200;
            response.msg = "Consumo eliminado con éxito";
            response.data = result;

            return res.json(response);

        } catch (error: any) {
            if (error.code === "NOT_FOUND") {
                return res.status(404).json({ message: error.message });
            }

            console.error(error);
            return res.status(500).json({ message: "Error al eliminar consumo" });
        }
    }

}