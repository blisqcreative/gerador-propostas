import {BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm"
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

    @OneToMany(() => TaskToDeal, taskToDeal => taskToDeal.task, {nullable: true})
    taskToDeals: TaskToDeal[];

    @Column("int", { nullable: true })
    serviceId: number;

    @ManyToOne(type => Service, service => service.tasks)
    @JoinColumn({ name: "serviceId" })
    service: Service
}