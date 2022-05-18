import {Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, ManyToOne} from "typeorm";
import {Deal} from "./Deal"
import {Department} from "./Department"

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(type => Deal, deal => deal.user)
    deals: Deal[];

    @ManyToOne(type => Department, department => department.users)
    department: Department;

}
