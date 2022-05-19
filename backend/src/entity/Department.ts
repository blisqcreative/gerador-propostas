import {BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {User} from "./User"
import {Deal} from "./Deal"
import {TaskToDeal} from "./TaskToDeal"
import {Product} from "./Product"

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

    @ManyToMany(() => Deal, deal => deal.departments)
    deals: Deal[];

    @OneToMany(type => Product, product => product.department)
    products: Product[];
}