import { Entity,
         Column,
         PrimaryGeneratedColumn,
         CreateDateColumn,
         OneToMany,
         ManyToOne,
         JoinColumn } from "typeorm";
import {Telefono} from './phone.entity';

@Entity({name: 'CLIENTES'})
export class Cliente{
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "varchar", length: 9, unique: true })
    dni!: string

    @Column({ type: "text", nullable: true })
    nombre!: string

    @CreateDateColumn({type: "datetime",name: "fecha_alta"})
    fechaAlta!: Date

    @OneToMany(() => Telefono, (Telefono) => Telefono.Cliente,{cascade:true})
    Telefono!: Telefono[];
}