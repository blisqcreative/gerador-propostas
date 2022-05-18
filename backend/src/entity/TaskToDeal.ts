import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import {Task} from "./Task"
import {Deal} from "./Deal"

@Entity()
export class TaskToDeal extends BaseEntity{
    @PrimaryGeneratedColumn()
    taskToDealId: number

    @Column()
    taskId: number

    @Column()
    dealId: number

    @Column()
    hours: number

    @Column()
    sellPrice: number

    @Column()
    costPrice: number

    @ManyToOne(() => Task, task => task.taskToDeals, {nullable: true})
    task: Task

    @ManyToOne(() => Deal, deal => deal.taskToDeals, {nullable: true})
    deal: Deal;


}