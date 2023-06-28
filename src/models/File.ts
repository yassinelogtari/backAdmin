import {Column, Entity,CreateDateColumn,UpdateDateColumn,PrimaryGeneratedColumn,BaseEntity, DeleteDateColumn} from "typeorm";

@Entity ('file')
export class File extends BaseEntity{

@PrimaryGeneratedColumn({type: 'int'})
file_id:string;

@Column()
month:string

@Column()
year:string;

@Column()
checksumpdf:string;

@Column({ type: "simple-json", nullable: true })
  file: string;
@CreateDateColumn()
created_at:Date;

@UpdateDateColumn()
updated_at:Date;

@DeleteDateColumn()
deleted_at:Date;

}