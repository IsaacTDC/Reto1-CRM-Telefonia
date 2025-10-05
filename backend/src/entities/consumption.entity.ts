import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  JoinColumn
} from "typeorm";
import { Telefono } from "./phone.entity";

@Entity({ name: "CONSUMOS_MENSUALES" })
@Unique(["mes", "anio", "telefono"]) // Evita duplicados para el mismo mes-año-telefono
export class Consumo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "tinyint", width: 2 })
  mes!: number; // valores 1-12

  @Column({ type: "int" })
  anio!: number;

  @Column({ type: "decimal", precision: 6, scale: 2 })
  consumo!: number;

  @ManyToOne(() => Telefono, (telefono) => telefono.consumos, {
    onDelete: "CASCADE",
    eager: true
  })
  @JoinColumn({ name: "id_telefono" })
  telefono!: Telefono;
}