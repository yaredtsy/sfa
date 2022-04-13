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

@Entity("route_market")
export class RouteMarket extends AbstractModel {
  @Column({ default: false })
  monday: boolean;

  @Column({ default: false })
  tuesday: boolean;

  @Column({ default: false })
  wednesday: boolean;

  @Column({ default: false })
  thursday: boolean;

  @Column({ default: false })
  friday: boolean;

  @Column({ default: false })
  saturday: boolean;

  @Column()
  fromDate: Date;

  @Column()
  toDate: Date;

  @ManyToOne(() => Truck, (truck) => truck.routeMarkets)
  truck_id: Truck;

  @ManyToOne(() => Route, (route) => route.routeMarkets)
  route_id: Route;

  @ManyToOne(() => User, (user) => user.routeMarkets)
  created_by: User;
}
