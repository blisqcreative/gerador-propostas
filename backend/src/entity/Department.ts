import {BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {User} from "./User"
import {Deal} from "./Deal"
import {ProductToDeal} from "./ProductToDeal"
import {Product} from "./Product"
import {DealToDepartment} from "./DealToDepartment"

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


    @OneToMany(type => Product, product => product.department)
    products: Product[];

    @OneToMany(() => DealToDepartment, dealToDepartment => dealToDepartment.department, {nullable: true})
    dealToDepartments: DealToDepartment[];
}