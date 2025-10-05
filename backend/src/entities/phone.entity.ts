import { Entity,
         Column,
         PrimaryGeneratedColumn,
         CreateDateColumn,
         OneToMany,
         ManyToOne,
         JoinColumn } from "typeorm";
import {Cliente} from './client.entity'
import { Consumo } from "./consumption.entity";


@Entity({name: 'TELEFONOS'})
export class Telefono{
    @PrimaryGeneratedColumn()
    id!: number

    @Column("varchar", { length: 13 })
    numero!: string

    @CreateDateColumn({ type: "timestamp", name: "fecha_contrato" })
    fechaContrato!: string

    @ManyToOne(() => Cliente, (Cliente) => Cliente.Telefono, { onDelete: "SET NULL" })
    @JoinColumn({ name: "id_cliente" })
    Cliente!: Cliente | null;
    @OneToMany(() => Consumo, (consumo) => consumo.telefono, { cascade: true })
    consumos!: Consumo[];
}