import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, ManyToMany, ManyToOne, UpdateDateColumn, OneToMany} from "typeorm";
import { User } from "./User";
import AbstractModel from './AbstractModel'
import { Company } from "./Company";
import { City } from "./CityDetail";

@Entity("nation")
export class Nation extends AbstractModel {

    @Column({length: 2})
    nationCode: string

    @Column()
    nationName: string;

    @ManyToOne(()=> User, user => user.nations)
    created_by: User

    @OneToMany(()=> Company, company => company.company_nation_id)
    companies: Company[]

    @OneToMany(()=> City, city => city.nation_id)
    cities: City[]
}
