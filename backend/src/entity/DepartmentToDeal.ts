import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import {Task} from "./Task"
import {Deal} from "./Deal"
import {Department} from "./Department"

@Entity()
export class DepartmentToDeal extends BaseEntity{
    @PrimaryGeneratedColumn()
    taskToDealId: number

    @ManyToOne(() => Department, department => department.departmentToDeal, {nullable: true})
    department: Department

    @ManyToOne(() => Deal, deal => deal.departmentToDeals, {nullable: true})
    deal: Deal;

}