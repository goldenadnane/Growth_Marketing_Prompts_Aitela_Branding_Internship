/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity,PrimaryGeneratedColumn} from "typeorm";


@Entity()
export class Mail {
    @PrimaryGeneratedColumn()
    id:number;


    @Column({type:"varchar"})
    title:string;
  
    @Column({type:"varchar"})
    text:string;





    @CreateDateColumn({ type:'timestamp' })
    sentdAt:Date;





}