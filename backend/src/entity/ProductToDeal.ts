import {
    AfterInsert,
    AfterUpdate,
    BaseEntity,
    BeforeUpdate,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm"
import {Deal} from "./Deal"
import {Product} from "./Product";

@Entity()
export class ProductToDeal extends BaseEntity{

    @Column()
    hours: number

    @Column()
    description: string

    @Column({nullable: true})
    sellPrice: number

    @Column({default: 35})
    hourRate: number

    @Column({nullable:true})
    adjustedSellPrice: number

    @Column({nullable: true})
    cost: number;

    @Column({nullable: true})
    netMargin: number;

    @Column({nullable: true, type: "decimal"})
    netMarginPercentage: number;

    @ManyToOne(() => Product, product => product.productToDeals, {nullable: true, primary: true})
    product: Product

    @ManyToOne(() => Deal, deal => deal.productToDeals, {nullable: true, primary: true})
    deal: Deal;

    @AfterInsert()
    setSellPrice() {
        this.hourRate = this.hourRate ? this.hourRate : 35;
        this.sellPrice = this.hourRate * this.hours;
        this.netMargin = this.adjustedSellPrice - this.cost;
        this.netMarginPercentage = Math.round(this.netMargin / this.adjustedSellPrice * 100);
    }

    @BeforeUpdate()
    updateSellPrice() {
        this.hourRate = this.hourRate ? this.hourRate : 35;
        this.sellPrice = (this.hourRate ? this.hourRate : 35) * this.hours;
        this.cost = 25 * this.hours;
        this.netMargin = this.adjustedSellPrice - this.cost;
        this.netMarginPercentage = Math.round(this.netMargin / this.adjustedSellPrice * 100);
    }

    static async getDealsWithProducts(dealId: number) {
        return await ProductToDeal.createQueryBuilder("productToDeal")
            .leftJoinAndSelect("productToDeal.product", "product")
            .leftJoinAndSelect("productToDeal.deal", "deal")
            .where("deal.id = :id", {id: dealId})
            .getMany();
    }
}