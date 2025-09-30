import { Entity,
         Column,
         PrimaryGeneratedColumn,
         CreateDateColumn,
         OneToMany,
         ManyToOne,
         JoinColumn } from "typeorm";
import {Cliente} from './client.entity'


@Entity({name: 'TELEFONOS'})
export class Telefono{
    @PrimaryGeneratedColumn()
    id!: number

    @Column("varchar", { length: 13 })
    numero!: string

    @CreateDateColumn({ type: "timestamp", name: "fecha_contrato" })
    fechaContrato!: string

    /* @Column({ type:"int", nullable: true })
    id_cliente!: number */

    @ManyToOne(() => Cliente, (Cliente) => Cliente.Telefono, { onDelete: "SET NULL" })
    @JoinColumn({ name: "id_cliente" })
    Cliente!: Cliente | null;
}