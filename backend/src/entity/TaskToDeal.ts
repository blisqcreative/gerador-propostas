import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import {Task} from "./Task"
import {Deal} from "./Deal"

@Entity()
export class TaskToDeal {
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

    @ManyToOne(() => Task, task => task.taskToDeals)
    task: Task

    @ManyToOne(() => Deal, deal => deal.taskToDeals)
    deal: Deal;


}