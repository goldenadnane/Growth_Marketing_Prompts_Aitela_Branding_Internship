/* eslint-disable prettier/prettier */
import { Column, Entity,PrimaryGeneratedColumn} from "typeorm";


@Entity()
export class Home {
    @PrimaryGeneratedColumn()
    id:number;


    @Column({type:"varchar"})
    title:string;
  
    @Column()
    title_background:string;

    @Column()
    slide_1_text:string;

    @Column()
    slide_1_img:string;

    @Column()
    slide_1_description:string;



    @Column()
    slide_2_text:string;

    @Column()
    slide_2_img:string;

    @Column()
    slide_2_description:string;


    @Column()
    slide_3_text:string;

    @Column()
    slide_3_img:string;

    @Column()
    slide_3_description:string;





}