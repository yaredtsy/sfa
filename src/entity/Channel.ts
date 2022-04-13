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
import { Outlet } from "./Outlet";

@Entity("channel")
export class Channel extends AbstractModel {
  @Column({ unique: true })
  channelName: string;

  @ManyToOne(() => User, (user) => user.channels)
  created_by: User;

  @OneToMany(() => Outlet, (outlet) => outlet.channel_id)
  outlets: Outlet[];
}
