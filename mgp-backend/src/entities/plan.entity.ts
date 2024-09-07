/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";
@Entity()
export class Plan {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true})
    name:string;

    @Column({type:"float"})
    price:number;

    @Column({default:"usd"})
    currency:string;



    @Column({default:false})
    is_available:boolean;

    @Column({nullable:true})
    payment_cycle:string;


    @Column({nullable:true})
    pre_made_prompt:number;


    @Column({nullable:true})
    chat_per_day:number;

    @Column({nullable:true})
    saved_prompt:number;


    @Column({nullable:true})
    custom_instructions:number;





    





}
