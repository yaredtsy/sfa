import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  ManyToMany,
  ManyToOne,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import AbstractModel from "./AbstractModel";
import { Territory } from "./Territory";
import { Truck } from "./Truck";
import { Company } from "./Company";
import { City } from "./CityDetail";
import { Route } from "./Route";
import { Channel } from "./Channel";
import { Invoice } from "./Invoice";

@Entity("outlet")
export class Outlet extends AbstractModel {
  @Column()
  outletName: string;

  @Column()
  ownerName: string;

  @Column()
  phoneNumber: string;

  @Column()
  vatNumber: string;

  @Column()
  geoLat: string;

  @Column()
  geoLong: string;

  @ManyToOne(() => User, (user) => user.outlets)
  created_by: User;

  @ManyToOne(() => Company, (company) => company.outlets)
  company_id: Company;

  @ManyToOne(() => City, (city) => city.outlets)
  city_id: City;

  @ManyToOne(() => Route, (route) => route.outlets)
  route_id: Route;

  @ManyToOne(() => Channel, (channel) => channel.outlets)
  channel_id: Channel;

  @OneToMany(() => Invoice, (invoice) => invoice.outlet_id)
  invoices: Invoice[];
}
