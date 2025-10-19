import { AppDataSource } from "../config/db";
import { Usuario } from '../entities/user.entity';
import { Rol } from '../entities/role.entity';
import { LogAcceso } from "../entities/log.entity";
import crypto from 'crypto';
import jwt from "jsonwebtoken";
//import { jwtConfig } from "../config";

export interface NewUser{
    userName: string;
    password: string;
    rolId: number;
    dniCliente: string;
}

export class UserService{

    private userRepo = AppDataSource.getRepository(Usuario);
    private roleRepo = AppDataSource.getRepository(Rol);
    private logRepo = AppDataSource.getRepository(LogAcceso);

    //Funciones auxiliaes para mejorar la modularidad y legibilidad del código

    //funcion auxiliar para encryptar
    static hashPassword(password: string): string {
        return crypto.createHash("sha256").update(password).digest("hex");
    }

    //función auxiliar para crear una entrada en la tabla de logs
    async createLog(user: Usuario, success: boolean) {
        const log = this.logRepo.create({
        usuario: user,
        success,
        });
        await this.logRepo.save(log);
    }

    //funcion para validar el login y crear un aentrada en la tabla de logs
    async validateLogin(userName: string, password: string) {
        const user = await this.userRepo.findOne({
                        where: { userName },
                        relations: ["rol", "cliente"],
                    });
        //validamos qeu el usuario exista
        if (!user) return { success: false, message: "Usuario no encontrado" };
        //validamos si está activo
        if (!user.isActive)
            return { success: false, message: "El usuario está inactivo" };

        const hashed = UserService.hashPassword(password);

        if (hashed === user.password) {
            await this.createLog(user, true);

            const token = jwt.sign(
                {
                id: user.id,
                userName: user.userName,
                rol: user.rol.tipo,
                },
                    process.env.JWT_SECRET!,
                { expiresIn: '1h' }
            );
            return {
                success: true,
                message: "Login exitoso",
                token,
                user: {
                id: user.id,
                userName: user.userName,
                rol: user.rol.tipo,
                cliente: user.cliente?.id || null,
                },
            };
        } else {
            await this.createLog(user, false);
            return { success: false, message: "Contraseña incorrecta" };
        }
    }


    //funcion para crae un usuaario
    async createUser(data: NewUser) {
        const role = await this.roleRepo.findOneBy({ id: data.rolId });
        if (!role) throw new Error("Rol no encontrado");

        const hashedPassword = UserService.hashPassword(data.password);

        const newUser = this.userRepo.create({
            userName: data.userName,
            password: hashedPassword,
            rol: role,
            cliente: data.dniCliente ? { dni: data.dniCliente } as any : null,
        });

        return await this.userRepo.save(newUser);
    }

    //SErvicio pra recuperar la información de un usuario
    async getUserById(id: number) {
        const user = await this.userRepo.findOne({
            where: { id },
            relations: ["rol", "cliente"],
        });

        /* const user2 = await this.userRepo
            .createQueryBuilder()
            .select("user.id","user.userName") */


        if (!user) return null;

        // Evitamos enviar el password al frontend
        const { password, ...safeUser } = user;
        return safeUser;
    }

    //Servicon para borrar un usuario, solo setea a false el campo isActive en la base de datos
    async deleteUser(id: number) {
        const user = await this.userRepo.findOne({ where: { id } });

        if (!user) {
            const error: any = new Error("Usuario no encontrado");
            error.code = "NOT_FOUND";
            throw error;
        }

        // Si ya está inactivo, no hacemos nada
        if (!user.isActive) {
            return { message: `El usuario con ID ${id} ya estaba inactivo` };
        }

        // Soft delete → marcar como inactivo
        user.isActive = false;
        await this.userRepo.save(user);

        return { message: `Usuario con ID ${id} marcado como inactivo` };
    }

}