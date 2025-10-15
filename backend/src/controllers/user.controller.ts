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
}