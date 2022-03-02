import {
    AfterInsert,
    BaseEntity, BeforeInsert,
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
import {Type} from "./Type"

@Entity()
export class Deal extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    inner_id: string

    @Column()
    date: Date

    @ManyToOne(type => Client, client => client.deals)
    client: Client

    @ManyToOne(type => User, user => user.deals)
    user: User

    @OneToMany(() => TaskToDeal, taskToDeal => taskToDeal.deal)
    taskToDeals: TaskToDeal[];

    @ManyToOne(() => Type, type => type.deals)
    type: Type


}