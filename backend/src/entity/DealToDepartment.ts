import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import {Deal} from "./Deal"
import {Product} from "./Product";
import {Department} from "./Department"

@Entity()
export class DealToDepartment extends BaseEntity{
    @Column()
    status: boolean

    @ManyToOne(() => Department, department => department.dealToDepartments, {nullable: true, primary: true})
    department: Department

    @ManyToOne(() => Deal, deal => deal.dealToDepartments, {nullable: true, primary: true})
    deal: Deal;
}