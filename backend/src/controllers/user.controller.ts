import { Request, Response } from "express";
import RespGeneric from "../models/genericResponse";
import { UserService , NewUser } from "../services/user.service";


export class UserController{

    public static async createUser(req: Request, res: Response) {
        let response = new RespGeneric();

        try {
            const data = req.body as NewUser;

            if (!data.userName || !data.password || !data.rolId) {
                response.cod = 400;
                response.msg = "Datos insuficientes para crear usuario";
                response.data = [];
                return res.status(400).json(response);
            }

            const userService = new UserService();
            const newUser = await userService.createUser(data);

            response.cod = 201;
            response.msg = "Usuario creado con éxito";
            response.data = newUser;

            return res.json(response);

        } catch (error: any) {
            console.error("Error al crear usuario:", error.message);

            if (error.message === "Rol no encontrado") {
                response.cod = 404;
                response.msg = error.message;
                response.data = [];
                return res.status(404).json(response);
            }

            if (error.code === "ER_DUP_ENTRY") { // error MySQL clave única
                response.cod = 400;
                response.msg = "Nombre de usuario o NIF ya existente";
                response.data = [];
                return res.status(400).json(response);
            }

            response.cod = 500;
            response.msg = "Error al crear usuario";
            response.data = [];
            return res.status(500).json(response);
        }
    }

    public static async login(req: Request, res:Response){
        let response = new RespGeneric();
        try{
            const { userName, password } = req.body;
            if (!userName || !password) {
                response.cod = 400;
                response.msg = "Faltan credenciales";
                response.data = [];
                return res.status(400).json(response);
            }

            const userService = new UserService();
            const result = await userService.validateLogin(userName, password);

            if (!result.success) {
                response.cod = 401;
                response.msg = result.message;
                response.data = [];
                return res.status(401).json(response);
            }

            response.cod = 200;
            response.msg = "Login exitoso";
            response.data = result || {};

            return res.json(response);

        }catch(error){
            console.error("Error en login:", error);
            response.cod = 500;
            response.msg = "Error interno al iniciar sesión";
            response.data = [];
            return res.status(500).json(response);
        }
    }

    public static async deleteUser(req: Request, res: Response) {
        let response = new RespGeneric();
        const id = Number(req.params.id);

        try {
            const userService = new UserService();
            const result = await userService.deleteUser(id);

            response.cod = 200;
            response.msg = "Usuario eliminado con éxito";
            response.data = result;

            return res.json(response);
        } catch (error: any) {
            if (error.code === "NOT_FOUND") {
                response.cod = 404;
                response.msg = error.message;
                response.data = [];
                return res.status(404).json(response);
            }

            console.error("Error al eliminar usuario:", error);
            response.cod = 500;
            response.msg = "Error interno al eliminar usuario";
            response.data = [];
            return res.status(500).json(response);
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const service = new UserService();
            const users = await service["userRepo"].find({ relations: ["rol", "cliente"] });
            res.status(200).json({ ok: true, users });
        } catch (error) {
            console.error("Error obteniendo usuarios:", error);
            res.status(500).json({ ok: false, msg: "Error interno" });
         }
    }

    public static async getProfile(req: Request, res: Response) {
    let response = new RespGeneric();

    try {
        // El token fue verificado por el middleware verifyToken
        const userData = (req as any).user; // contiene { id, userName, rol, ... }

        if (!userData) {
            response.cod = 401;
            response.msg = "Usuario no autenticado";
            response.data = [];
            return res.status(401).json(response);
        }

        const userService = new UserService();
        const user = await userService.getUserById(userData.id);

        if (!user) {
            response.cod = 404;
            response.msg = "Usuario no encontrado";
            response.data = [];
            return res.status(404).json(response);
        }

        response.cod = 200;
        response.msg = "Información del usuario obtenida con éxito";
        response.data = user;

        return res.json(response);

    } catch (error) {
        console.error("Error al obtener perfil:", error);
        response.cod = 500;
        response.msg = "Error interno al obtener información del usuario";
        response.data = [];
        return res.status(500).json(response);
    }
}
}