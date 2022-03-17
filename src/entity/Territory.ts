import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, ManyToMany, ManyToOne, UpdateDateColumn, OneToMany} from "typeorm";
import { User } from "./User";
import AbstractModel from './AbstractModel'
import { Company } from "./Company";
import { Region } from "./Region";
import { Truck } from "./Truck";

@Entity("territory")
export class Territory extends AbstractModel {

    @Column({length: 8})
    territoryCode: string

    @Column()
    territoryName: string;

    @ManyToOne(()=> User, user => user.territories)
    created_by: User

    @ManyToOne(()=> Region, region => region.territories)
    region_id: Region

    @OneToMany(()=> Truck, truck => truck.territory_id)
    trucks: Truck[]
}
