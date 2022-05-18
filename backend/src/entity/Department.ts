import {BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {User} from "./User"
import {Deal} from "./Deal"
import {TaskToDeal} from "./TaskToDeal"
import {DepartmentToDeal} from "./DepartmentToDeal"

@Entity()
export class Department extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    initials: string

    @OneToMany(type => User, user => user.department)
    users: User[]

    @OneToMany(() => DepartmentToDeal, departmentToDeal => departmentToDeal.department, {nullable: true})
    departmentToDeal: DepartmentToDeal[]
}