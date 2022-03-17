import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, ManyToMany, ManyToOne, UpdateDateColumn, OneToMany} from "typeorm";
import { User } from "./User";
import AbstractModel from './AbstractModel'
import { Territory } from "./Territory";
import { Truck } from "./Truck";
import { Company } from "./Company";
import { Invoice } from "./Invoice";

@Entity("material")
export class Material extends AbstractModel {

    @Column({length: 3})
    brandType: string

    @Column()
    brandName: string;

    @Column()
    unitPrice: number;

    @Column()
    description: string;

    @Column()
    sku: string;
    

    @ManyToOne(()=> User, user => user.materials)
    created_by: User

    @ManyToOne(()=> Company, company => company.materials)
    company_id: Company

    @OneToMany(()=> Invoice, invoice => invoice.material_id)
    invoices: Invoice[]
}
