/* eslint-disable prettier/prettier */
import { Column, Entity,OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Subcategory } from "./subcategory.entity";


@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id:number;


    @Column({type:"varchar"})
    name:string;

    @OneToMany(() => Subcategory, subcategory => subcategory.category,{ onDelete: 'CASCADE' })
    subcategory: Subcategory[];


    @Column({default:false})
    is_free:boolean;



  

    
}