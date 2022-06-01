import {BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Deal} from "./Deal"
import {Department} from "./Department"

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(type => Deal, deal => deal.user)
    deals: Deal[];

    @ManyToOne(type => Department, department => department.users)
    department: Department;

    static async getUserWithDepartmentByEmail(email: string) {
        return await User.createQueryBuilder("user")
            .leftJoinAndSelect("user.department", "department")
            .where("user.email = :email", {email})
            .getOne();
    }

}
