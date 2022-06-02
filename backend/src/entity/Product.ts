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

    static async getProductsInDealByDepartment(departmentId: number) {
        /*return await Product.createQueryBuilder("product")
            .leftJoinAndSelect("product.department", "department")
            .leftJoinAndSelect("product.productToDeals", "productToDeals")
            .where("department.id = :id", {id: departmentId})
            .getMany();
            */

        const entityManager = getManager();
        return await entityManager.query(`select p.id                                     as productId,
                                                        p.name                                   as productName,
                                                        ptd.description                          as product_description,
                                                        ptd.hours                                as product_hours,
                                                        p.description                            as product_in_deal_description,
                                                        coalesce(ptd.description, p.description) as final_description,
                                                        case
                                                            when d.id is null then false
                                                            else true
                                                            end                                  as is_selected
                                                 from product p
                                                          left join product_to_deal ptd
                                                                    on p.id = ptd."productId"
                                                          left join deal d
                                                                    on d.id = ptd."dealId"
                                                 where p."departmentId" = $1;`,[departmentId] );
    }


}