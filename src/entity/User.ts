import { Entity, Column, OneToMany } from "typeorm";
import { Nation } from "./Nation";
import AbstractModel from "./AbstractModel";
import { Company } from "./Company";
import { Region } from "./Region";
import { Territory } from "./Territory";
import { Truck } from "./Truck";
import { Route } from "./Route";
import { City } from "./CityDetail";
import { Outlet } from "./Outlet";
import { Material } from "./Material";
import { Channel } from "./Channel";
import { Agent } from "./Agent";
import { RouteMarket } from "./RouteMarket";
import { Invoice } from "./Invoice";

@Entity("user_detail")
export class User extends AbstractModel {
  @Column()
  firstName!: string;

  @Column()
  middleName!: string;

  @Column()
  lastName!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column({
    unique: true,
  })
  phoneNumber!: string;

  @Column()
  role!: number;

  @Column()
  address!: string;

  @Column()
  position!: string;

  @Column()
  password!: string;

  @OneToMany(() => Nation, (nation) => nation.created_by)
  nations!: Nation[];

  @OneToMany(() => Company, (company) => company.created_by)
  companies!: Company[];

  @OneToMany(() => Region, (region) => region.created_by)
  regions!: Region[];

  @OneToMany(() => Territory, (territory) => territory.created_by)
  territories!: Territory[];

  @OneToMany(() => Truck, (truck) => truck.created_by)
  trucks!: Truck[];

  @OneToMany(() => Route, (route) => route.created_by)
  routes!: Route[];

  @OneToMany(() => Outlet, (outlet) => outlet.created_by)
  outlets!: Outlet[];

  @OneToMany(() => City, (city) => city.created_by)
  cities!: City[];

  @OneToMany(() => Material, (material) => material.created_by)
  materials!: Material[];

  @OneToMany(() => Channel, (channel) => channel.created_by)
  channels!: Channel[];

  @OneToMany(() => Agent, (agent) => agent.created_by)
  agents!: Agent[];

  @OneToMany(() => RouteMarket, (rm) => rm.created_by)
  routeMarkets!: RouteMarket[];

  @OneToMany(() => Invoice, (invoice) => invoice.created_by)
  invoices!: Invoice[];
}
