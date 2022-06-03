import {
    BaseEntity,
    Column,
    Entity, getManager, getRepository,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm"
import {Client} from "./Client"
import {User} from "./User"
import {ProductToDeal} from "./ProductToDeal"
import {Department} from "./Department"
import {DealToDepartment} from "./DealToDepartment"
import {Product} from "./Product"

@Entity()
export class Deal extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    inner_id: string

    @Column()
    date: Date

    @Column()
    status: string

    @Column()
    clientStatus: string

    @Column()
    timings: string

    @Column()
    work: string

    @Column("int", {nullable: true})
    clientId: number;

    @JoinColumn({name: "clientId"})
    @ManyToOne(type => Client, client => client.deals)
    client: Client

    @ManyToOne(type => User, user => user.deals)
    user: User

    @OneToMany(() => ProductToDeal, productToDeal => productToDeal.deal, {nullable: true})
    productToDeals: ProductToDeal[];

    @OneToMany(() => DealToDepartment, dealToDepartment => dealToDepartment.deal, {nullable: true})
    dealToDepartments: DealToDepartment[];


    static async getDealWithDepartments() {
        return await Deal.createQueryBuilder("deal")
            .leftJoinAndSelect("deal.dealToDepartments", "departments")
            .leftJoinAndSelect("departments.department", "department")
            .leftJoinAndSelect("deal.client", "client")
            .getMany();
    }

    static async getDealWithDepartmentById(id: number) {
        return await Deal.createQueryBuilder("deal")
            .leftJoinAndSelect("deal.dealToDepartments", "departments")
            .leftJoinAndSelect("departments.department", "department")
            .leftJoinAndSelect("deal.client", "client")
            .where("deal.id = :id", {id})
            .getOne();
    }

    static async getDealByDepartmentId(id: number) {
        return await Deal.createQueryBuilder("deal")
            .leftJoin("deal.dealToDepartments", "departmentSelect")
            .leftJoinAndSelect("deal.dealToDepartments", "department")
            .leftJoinAndSelect("department.department", "department1")
            .leftJoinAndSelect("deal.client", "client")
            .where("departmentSelect.department.id = :id", {id})
            .getMany();
    }

    //get deals with departments and its status
    static async getDealWithDepartmentStatus() {
        return await Deal.createQueryBuilder("deal")
            .innerJoin("deal.departments", "department")
            .innerJoinAndSelect("department.status", "status")
            .leftJoinAndSelect("deal.client", "client")
            .getMany();
    }

    static async getProductToDealByDealId(id: number) {
        return await ProductToDeal.createQueryBuilder("productToDeal")
            .innerJoin("productToDeal.deal", "deal")
            .where("deal.id = :id", {id})
            .getMany();
    }

    //get the products in a deal joined with the products that are out of the deal filtered by the department
    static async getProductToDealByDealIdAndDepartmentId(id: number, departmentId: number) {
        const entityManager = getManager();
        return await entityManager.query(`select *
                                          from product p
                                                   left join product_to_deal ptd on p.id = ptd."productId"
                                                   left join deal d on ptd."dealId" = d.id
                                          where "departmentId" = $1
                                            and "dealId" = $2`,
            [departmentId, id]
        );

    }
}