import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import {Client} from "./Client"

@Entity()
export class Lead extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({nullable: true})
    inner_id: string

    @Column({nullable: true})
    crmId: number

    @Column()
    date: Date

    @ManyToOne(type => Client, client => client.leads, {nullable: true})
    client: Client

    static async getLeadsWithClient() {
        return await Lead.createQueryBuilder("lead")
            .leftJoinAndSelect("lead.client", "client")
            .getMany();
    }
    static async getLeadWithClientById(id: string) {
        return await Lead.createQueryBuilder("lead")
            .leftJoinAndSelect("lead.client", "client")
            .where("lead.inner_id = :id", {id})
            .getOne();
    }

}