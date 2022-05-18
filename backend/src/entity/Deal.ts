import {BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {Client} from "./Client"
import {User} from "./User"
import {TaskToDeal} from "./TaskToDeal"
import {DepartmentToDeal} from "./DepartmentToDeal"

@Entity()
export class Deal extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    inner_id: string

    @Column()
    date: Date

    @Column()
    status: string

    @Column()
    clientStatus: string

    @Column()
    timings: string

    @Column()
    work: string

    @ManyToOne(type => Client, client => client.deals)
    client: Client

    @ManyToOne(type => User, user => user.deals)
    user: User

    @OneToMany(() => TaskToDeal, taskToDeal => taskToDeal.deal, {nullable: true})
    taskToDeals: TaskToDeal[];

    @OneToMany(() => DepartmentToDeal, departmentToDeal => departmentToDeal.deal, {nullable: true})
    departmentToDeals: DepartmentToDeal[];

}