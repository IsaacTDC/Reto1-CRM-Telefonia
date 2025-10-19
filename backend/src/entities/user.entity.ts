import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne
} from "typeorm";
import { Cliente } from "./client.entity";
import { Rol } from "./role.entity";
import { LogAcceso } from "./log.entity";

@Entity({ name: "USUARIOS" })
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50, unique: true })
  userName!: string;

  @Column({ type: "varchar", length: 64 }) // SHA-256 = 64 chars hex
  password!: string;

  @Column({ type: "boolean" , default:true })
  isActive!: boolean; //vamos a controlar si los usuarios estan o no activos para mantener la persistencia de los logs por seguridad

  @ManyToOne(() => Rol, (rol) => rol.usuarios, { eager: true }) //muchos usuarios pueden tener un msimo rol
  @JoinColumn({ name: "rol_id" })
  rol!: Rol;

  @OneToOne(() => Cliente, { nullable: true, eager: true, onDelete:'SET NULL' })
  @JoinColumn({ name: "dni_cliente", referencedColumnName: "dni" })
  cliente?: Cliente | null;

  @OneToMany(() => LogAcceso, (log) => log.usuario) //un usuario puede tener varios logs
  logs!: LogAcceso[];
}