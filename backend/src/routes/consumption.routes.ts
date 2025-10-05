import { Router } from "express";
import { ConsumptionController } from "../controllers/consumption.controller";

const router = Router();

// POST /api/consumtions/
router.post("/", ConsumptionController.createConsumption);

// GET /api/consumtions/:telefonoId/:anio  obtener consumos de un año para un teléfono
router.get("/:id_telefono/:anio", ConsumptionController.getConsumptionsByPhoneAndYear);

//PUT /api/consumtions/:id
router.put("/:id", ConsumptionController.updateConsumption);

router.delete("/:id", ConsumptionController.deleteConsumption);



export default router;