/* eslint-disable prettier/prettier */
import { Column, Entity,ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Category } from "./category.entity";

@Entity()
export class Subcategory {
    @PrimaryGeneratedColumn()
    id:number;


    @Column({type:"varchar"})
    name:string;

    @ManyToOne(() => Category, category => category.subcategory,{ onDelete: 'CASCADE' })
    category: Category;

}