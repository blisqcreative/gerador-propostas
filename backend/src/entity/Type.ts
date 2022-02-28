import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {Deal} from "./Deal"

@Entity()
export class Type extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => Deal, deal => deal.type)
    deals: Deal[]

}