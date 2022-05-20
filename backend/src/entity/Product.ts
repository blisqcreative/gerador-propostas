import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import {Department} from "./Department"

export enum ProductUnit {
    UNIDADE = 'unidade',
    HORA = 'hora',
}

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    unit: string;

    @Column({
        type: 'enum',
        enum: ProductUnit,
        default: ProductUnit.HORA
    })
    format: ProductUnit;

    @ManyToOne(type => Department, department => department.products)
    department: Department;


}