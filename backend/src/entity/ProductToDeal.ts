import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import {Deal} from "./Deal"
import {Product} from "./Product";

@Entity()
export class ProductToDeal extends BaseEntity{
    @PrimaryGeneratedColumn()
    productToDealId: number

    @Column()
    productId: number

    @Column()
    dealId: number

    @Column()
    hours: number

    @Column()
    description: string

    @ManyToOne(() => Product, product => product.productToDeals, {nullable: true})
    product: Product

    @ManyToOne(() => Deal, deal => deal.productToDeals, {nullable: true})
    deal: Deal;


}