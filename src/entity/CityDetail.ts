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
import { Nation } from "./Nation";
import { Outlet } from "./Outlet";
import { Region } from "./Region";

@Entity("city_detail")
export class City extends AbstractModel {
  @Column()
  city!: string;

  @Column()
  subCity!: string;

  @Column()
  specificArea!: string;

  @ManyToOne(() => User, (user) => user.cities)
  created_by!: User;

  @ManyToOne(() => Nation, (nation) => nation.cities)
  nation_id!: Nation;

  @OneToMany(() => Outlet, (outlet) => outlet.city_id)
  outlets!: Outlet[];

  @ManyToOne(() => Region, (region) => region.cities)
  region_id!: Region;
}
