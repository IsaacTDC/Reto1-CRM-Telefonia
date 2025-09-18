import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from "typeorm";

@Entity()
export class cliente{
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "varchar", length: 9, unique: true })
    dni!: string

    @Column({ type: "text", nullable: true })
    name!: string

    @CreateDateColumn({type: "datetime"})
    fecha_alta!: Date

    @OneToMany(() => telefono, (telefonos) => telefono.cliente)
    telefonos!: telefono[];
}

@Entity()
export class telefono{
    @PrimaryGeneratedColumn()
    id!: number

    @Column("varchar", { length: 13 })
    numero!: string

    @CreateDateColumn()
    fecha_contrato!: string

    @Column("int")
    id_cliente!: number


}