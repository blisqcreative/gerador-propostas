import {
    BaseEntity,
    Column,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn
} from "typeorm"
import {Client} from "./Client"
import {User} from "./User"
import {Task} from "./Task"
import {TaskToDeal} from "./TaskToDeal"

@Entity()
export class Deal extends BaseEntity{
    @PrimaryColumn()
    id: string

    @Column()
    date: Date

    @Column()
    type: string

    @ManyToOne(type => Client, client => client.deals)
    client: Client

    @ManyToOne(type => User, user => user.deals)
    user: User

    @OneToMany(() => TaskToDeal, taskToDeal => taskToDeal.deal)
    taskToDeals: TaskToDeal[];


}