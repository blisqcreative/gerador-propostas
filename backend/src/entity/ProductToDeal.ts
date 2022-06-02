import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import {Deal} from "./Deal"
import {Product} from "./Product";

@Entity()
export class ProductToDeal extends BaseEntity{

    @Column()
    hours: number

    @Column()
    description: string

    @ManyToOne(() => Product, product => product.productToDeals, {nullable: true, primary: true})
    product: Product

    @ManyToOne(() => Deal, deal => deal.productToDeals, {nullable: true, primary: true})
    deal: Deal;
}