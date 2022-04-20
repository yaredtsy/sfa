import {
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export default class AbstractModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    default: 1,
  })
  status_control!: number;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  lastModified!: Date;
}
