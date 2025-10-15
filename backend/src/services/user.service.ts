import { AppDataSource } from "../config/db";
import { Usuario } from '../entities/user.entity';
import { Rol } from '../entities/role.entity';
import { LogAcceso } from "../entities/log.entity";
import crypto from 'crypto';

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

    //Validación del login
    async validateLogin(userName: string, password: string) {
        const user = await this.userRepo.findOne({
                        where: { userName },
                        relations: ["rol", "cliente"],
                    });
        if (!user) return { success: false, message: "Usuario no encontrado" };

        const hashed = UserService.hashPassword(password);

        if (hashed === user.password) {
        await this.createLog(user, true);
        return {
            success: true,
            message: "Login exitoso",
            user: {
            id: user.id,
            userName: user.userName,
            rol: user.rol.tipo,
            cliente: user.cliente?.nombre || null,
            },
        };
        } else {
        await this.createLog(user, false);
        return { success: false, message: "Contraseña incorrecta" };
        }
    }

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

}