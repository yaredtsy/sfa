import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import AbstractModel from "./AbstractModel";
import { Territory } from "./Territory";
import { Route } from "./Route";
import { RouteMarket } from "./RouteMarket";
import { Invoice } from "./Invoice";

@Entity("truck")
export class Truck extends AbstractModel {
  @Column({ length: 9 })
  truckCode!: string;

  @Column()
  truckName!: string;

  @Column({ length: 7 })
  plateNumber!: string;

  @ManyToOne(() => User, (user) => user.trucks)
  created_by!: User;

  @ManyToOne(() => Territory, (territory) => territory.trucks)
  territory_id!: Territory;

  @OneToMany(() => Route, (route) => route.truck_id)
  routes!: Route;

  @OneToMany(() => RouteMarket, (routeMarket) => routeMarket.truck_id)
  routeMarkets!: RouteMarket[];

  @OneToMany(() => Invoice, (invoice) => invoice.truck_id)
  invoices!: Invoice[];
}
