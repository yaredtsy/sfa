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
  JoinTable,
} from "typeorm";
import { User } from "./User";
import AbstractModel from "./AbstractModel";
import { Territory } from "./Territory";
import { Truck } from "./Truck";
import { Nation } from "./Nation";
import { Outlet } from "./Outlet";
import { Company } from "./Company";
import { Region } from "./Region";
import { Material } from "./Material";
import { Route } from "./Route";

@Entity("invoice")
export class Invoice extends AbstractModel {
  @Column()
  outletName!: string;

  @Column()
  quantity!: number;

  @Column()
  totalPrice!: number;

  @ManyToOne(() => Company, (company) => company.invoices)
  company_id!: Company;

  @ManyToOne(() => Truck, (truck) => truck.invoices)
  truck_id!: Truck;

  @ManyToOne(() => Route, (route) => route.invoices)
  route_id!: Route;

  @ManyToOne(() => Outlet, (outlet) => outlet.invoices, { nullable: true })
  outlet_id!: Outlet;

  @ManyToOne(() => Material, (material) => material.invoices)
  material_id!: Material;

  @ManyToOne(() => User, (user) => user.invoices)
  created_by!: User;
}
