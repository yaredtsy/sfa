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
import { Company } from "./Company";
import { Territory } from "./Territory";
import { City } from "./CityDetail";
import { Agent } from "./Agent";

@Entity("region")
export class Region extends AbstractModel {
  @Column({ length: 5 })
  regionCode!: string;

  @Column()
  regionName!: string;

  @ManyToOne(() => User, (user) => user.regions)
  created_by!: User;

  @ManyToOne(() => Company, (company) => company.regions)
  company_id!: Company;

  @OneToMany(() => Territory, (territory) => territory.region_id)
  territories!: Territory[];

  @OneToMany(() => City, (city) => city.region_id)
  cities!: City[];

  @OneToMany(() => Agent, (agent) => agent.region_id)
  agents!: Agent[];
}
