import {BaseEntity, Column, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import {Department} from "./Department"

export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    unit: string;

    @ManyToOne(type => Department, department => department.products)
    department: Department;
}