/* eslint-disable prettier/prettier */
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./user.entity";
//import * as bcrypt from 'bcrypt';


@Entity()
export class Custom_Instructions {
    @PrimaryGeneratedColumn()
    id:number;

   
    @Column({nullable:true})
    brand: string;

    @Column({nullable:true})
    product_service: string;

    
    @Column({nullable:true})
    feature1: string;

    @Column({nullable:true})
    feature2: string;

    @Column({nullable:true})
    feature3: string;

    @Column({type:"varchar",nullable:true})
    target_audience:string

    @Column({default:true})
    status: boolean;


    @ManyToOne(() => User,{ onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_user' })
    user: User;


}
