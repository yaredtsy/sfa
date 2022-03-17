import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, ManyToMany, ManyToOne, UpdateDateColumn} from "typeorm";
import { User } from "./User";


export default class AbstractModel extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        default: 1
    })
    status_control: number;


    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    lastModified: Date
}


