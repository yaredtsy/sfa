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
  OneToOne,
} from "typeorm";
import { User } from "./User";
import AbstractModel from "./AbstractModel";
import { Nation } from "./Nation";
import { Region } from "./Region";
import { Outlet } from "./Outlet";
import { Material } from "./Material";
import { Agent } from "./Agent";
import { Invoice } from "./Invoice";

@Entity("company")
export class Company extends AbstractModel {
  @Column({ length: 2 })
  companyCode!: string;

  @Column()
  companyName!: string;

  // @OneToOne(()=> {})
  // city: string;

  @Column()
  address!: string;

  @Column()
  numberOfAgents!: number;

  @OneToMany(() => Region, (region) => region.company_id)
  regions!: Region[];

  @OneToMany(() => Material, (material) => material.company_id)
  materials!: Material[];

  @OneToMany(() => Outlet, (outlet) => outlet.company_id)
  outlets!: Outlet[];

  @ManyToOne(() => Nation, (nation) => nation.companies)
  company_nation_id!: Nation;

  @ManyToOne(() => User, (user) => user.companies)
  created_by!: User;

  @OneToMany(() => Agent, (agent) => agent.company_id)
  agents!: Agent[];

  @OneToMany(() => Invoice, (invoice) => invoice.company_id)
  invoices!: Invoice[];
}
