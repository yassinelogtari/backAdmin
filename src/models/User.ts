import {Column, Entity,CreateDateColumn,UpdateDateColumn, DeleteDateColumn, 
    PrimaryGeneratedColumn, 
    OneToMany,
    BaseEntity} from "typeorm";
import { Employe } from "./Employe";



@Entity ('user')
export class User extends BaseEntity{

@PrimaryGeneratedColumn()
user_id:number;

@Column()
username:string

@Column()
firstname:string;

@Column()
lastname:string;

@Column()
email:string;

@Column()
password:string;

@CreateDateColumn()
created_at:Date;

@UpdateDateColumn()
updated_at:Date;

@DeleteDateColumn({
    default:null
})
deleted_at:Date;

@OneToMany(
    ()=>Employe,
    employe=>employe.user
)
    employe:Employe[ ]
}