import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, ManyToMany, ManyToOne, UpdateDateColumn, OneToMany} from "typeorm";
import { User } from "./User";
import AbstractModel from './AbstractModel'
import { Territory } from "./Territory";
import { Truck } from "./Truck";
import { Outlet } from "./Outlet";
import { RouteMarket } from "./RouteMarket";
import { Invoice } from "./Invoice";

export interface Geometry{
    type: "polygon",

}

@Entity("route")
export class Route extends AbstractModel {

    @Column({length: 12})
    routeCode: string

    @Column()
    routeName: string;

    @Column({type: 'polygon', nullable: true})
    polygon: string;
    

    @ManyToOne(()=> User, user => user.routes)
    created_by: User

    @ManyToOne(()=> Truck, truck => truck.routes)
    truck_id: Truck

    @OneToMany(() => Outlet, outlet => outlet.route_id)
    outlets: Outlet[]

    @OneToMany(()=> RouteMarket, routeMarket => routeMarket.route_id)
    routeMarkets: RouteMarket[]

    @OneToMany(()=> Invoice, invoice => invoice.route_id)
    invoices: Invoice[]
}
