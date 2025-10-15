import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Usuario } from "./user.entity";

@Entity({ name: "ROLES" })
export class Rol {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50, unique: true })
  tipo!: string;

  @OneToMany(() => Usuario, (usuario) => usuario.rol) //un rol pueden tenerlo varios usuarios
  usuarios!: Usuario[];
}