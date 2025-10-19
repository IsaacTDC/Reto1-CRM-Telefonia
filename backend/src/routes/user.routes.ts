import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { verifyToken } from '../middelware/auth.middelware';
import { isAdmin } from '../middelware/role.middelware';

const router = Router();

// Crear nuevo usuario
router.post("/",verifyToken, isAdmin,  UserController.createUser);

// Login lo dejamos público sin usar ningun middelware de verificación
router.post("/login", UserController.login);

// Eliminar usuario
router.delete("/:id", verifyToken, isAdmin , UserController.deleteUser);

//obtener ususarios
router.get("/", verifyToken, isAdmin , UserController.getAll);

router.get("/:id",verifyToken, UserController.getProfile);

export default router;