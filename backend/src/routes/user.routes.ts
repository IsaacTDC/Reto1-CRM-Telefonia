import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();

// Crear nuevo usuario
router.post("/", UserController.createUser);


export default router;