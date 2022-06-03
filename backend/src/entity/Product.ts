import {BaseEntity, Column, Entity, getManager, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {Department} from "./Department"
import {ProductToDeal} from "./ProductToDeal";


@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne(type => Department, department => department.products)
    department: Department;

    @OneToMany(() => ProductToDeal, productToDeal => productToDeal.product, {nullable: true})
    productToDeals: ProductToDeal[];

    static async getProductsByDepartment(departmentId: number) {
        return await Product.createQueryBuilder("product")
            .leftJoinAndSelect("product.department", "department")
            .where("department.id = :id", {id: departmentId})
            .getMany();
    }

    static async getProductsInDealByDepartment(dealId:number, departmentId: number) {
        const entityManager = getManager();
        return await entityManager.query(`select
                                              p.id as productId,
                                              p.name as productName,
                                              p.description as product_description,
                                              ptd.description as product_in_deal_description,
                                              case when ptd.hours is null then 0 else ptd.hours end as hours,
                                              coalesce(ptd.description, p.description) as final_description,
                                              case
                                                  when ptd."dealId" is null then false
                                                  else true
                                                  end as is_selected
                                          from product p
                                                   left join (select * from product_to_deal ptd where "dealId" = $1) ptd
                                                             on ptd."productId" = p.id
                                          where "departmentId"=$2;`,[dealId, departmentId] );
    }


}