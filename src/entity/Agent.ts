import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, ManyToMany, ManyToOne, UpdateDateColumn, OneToMany, JoinTable} from "typeorm";
import { User } from "./User";
import AbstractModel from './AbstractModel'
import { Territory } from "./Territory";
import { Truck } from "./Truck";
import { Nation } from "./Nation";
import { Outlet } from "./Outlet";
import { Company } from "./Company";
import { Region } from "./Region";

@Entity("agent")
export class Agent extends AbstractModel {

    @Column()
    agentName: string

    @Column()
    agentCode: string

    @Column()
    phoneNumber: string

    @Column()
    email: string

    @Column()
    address: string


    @ManyToOne(()=> User, user => user.agents)
    created_by: User

    @ManyToOne(()=> Company , company => company.agents)
    company_id: Company

    @ManyToOne(()=> Region, region=>region.agents)
    region_id: Region

    @ManyToMany(()=> Territory)
    @JoinTable()
    territories: Territory[]

}
