import {Column, Entity,CreateDateColumn,UpdateDateColumn, DeleteDateColumn, 
        PrimaryGeneratedColumn , ManyToOne, JoinColumn, BaseEntity} from "typeorm";

import { User } from "./User";


@Entity ('employe')
export class Employe extends BaseEntity{
    
    @PrimaryGeneratedColumn({type: 'int'})
    employe_id:string;

    @Column()
    firstname:string;

    @Column()
    lastname:string;

    @Column()
    id_ident:string

    @Column()
    email:string;

    @Column()
    cnprs:string

    @CreateDateColumn()
    created_at:Date;

    @UpdateDateColumn()
    updated_at:Date;

    @DeleteDateColumn({
        default:null
    })
    deleted_at:Date;

  
    @ManyToOne(
        ()=>User,
        user=>user.employe
    )

    @JoinColumn({
        name: 'created_by'
    })

    user:User

    
    
}