import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { Usuario } from "./user.entity";

@Entity({ name: "LOGS_ACCESOS" })
export class LogAcceso {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.logs, { eager: true }) //un log solo le pertenece a un usuario
  @JoinColumn({ name: "usuario_id" })
  usuario!: Usuario;

  @CreateDateColumn({ type: "datetime", name: "fecha" })
  fecha!: Date;

  @Column({ type: "boolean" })
  success!: boolean;
}