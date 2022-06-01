import {BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {Department} from "./Department"
import {ProductToDeal} from "./ProductToDeal";

export enum ProductUnit {
    UNIDADE = 'unidade',
    HORA = 'hora',
}

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

/*    @Column()
    unit: string;

    @Column({
        type: 'enum',
        enum: ProductUnit,
        default: ProductUnit.HORA
    })
    format: ProductUnit;*/

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

}