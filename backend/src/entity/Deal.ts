import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm"
import {Client} from "./Client"
import {User} from "./User"
import {TaskToDeal} from "./TaskToDeal"
import {Department} from "./Department"

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

    @Column("int", { nullable: true })
    clientId: number;

    @JoinColumn({name: "clientId"})
    @ManyToOne(type => Client, client => client.deals)
    client: Client

    @ManyToOne(type => User, user => user.deals)
    user: User

    @OneToMany(() => TaskToDeal, taskToDeal => taskToDeal.deal, {nullable: true})
    taskToDeals: TaskToDeal[];

    @ManyToMany(() => Department, department => department.deals)
    @JoinTable()
    departments: Department[];


    static async getDealWithDepartments() {
        return await Deal.createQueryBuilder("deal")
            .leftJoinAndSelect("deal.departments", "departments")
            .leftJoinAndSelect("deal.client", "client")
            .getMany();
    }
    static async getDealWithDepartmentById(id: number) {
        return await Deal.createQueryBuilder("deal")
            .leftJoinAndSelect("deal.departments", "departments")
            .leftJoinAndSelect("deal.client", "client")
            .where("deal.id = :id", {id})
            .getOne();
    }
}