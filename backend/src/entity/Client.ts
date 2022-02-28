import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {Deal} from "./Deal"

@Entity()
export class Client extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    person: string

    @Column()
    email: string

    @Column()
    phone: string

    @Column()
    address: string

    @Column()
    city: string

    @Column()
    state: string

    @Column()
    zip: string

    @Column()
    nif: number

    @OneToMany(type => Deal, deal => deal.client)
    deals: Deal[]

}