import {BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {Service} from "./Service"
import {Deal} from "./Deal"
import {TaskToDeal} from "./TaskToDeal"

@Entity()
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    description: string

    @OneToMany(() => TaskToDeal, taskToDeal => taskToDeal.task)
    taskToDeals: TaskToDeal[];

    @ManyToOne(type => Service, service => service.tasks)
    service: Service
}