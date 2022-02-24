import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm"

Entity()
export class Type extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

}