/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity,JoinColumn,ManyToOne,OneToMany,PrimaryGeneratedColumn} from "typeorm";
import { Subcategory } from "./subcategory.entity";
import { Saved_Prompts } from "./saved_prompt.entity";


@Entity()
export class Prompt {
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(() => Subcategory,{ onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_subcategory' })
    subcategory: Subcategory;

    @Column({type:"varchar"})
    prompt_text:string;

    @Column({type:'bigint',default:0})
    used:number;

    @Column({default:"true"})
    status:boolean;

    @CreateDateColumn({type:'timestamp'})
    createdAt: Date;

    @Column({type:"varchar",nullable:true})
    goal:string;


  
    @OneToMany(() => Saved_Prompts, (savedprompts) => savedprompts.prompt)
    saved_prompts: Saved_Prompts[];
}









