/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn , CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne, OneToMany} from "typeorm";
//import * as bcrypt from 'bcrypt';
import { Plan } from "./plan.entity";
import { Conversation } from "./conversation.entity";
import { Saved_Prompts } from "./saved_prompt.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number;

   
    @Column({nullable:true})
    profile_logo: string;

    @Column()
    firstname: string;


    @Column()
    lastname: string;


    @Column({unique:true})
    email: string;


    @Column()
    username: string;

    @Column()
    password: string;


    @Column({ default: 'Active' })
    status: string;

    @Column({default:"user"})
    role:string;


    @Column({ default: 0 })
    spent: number;

    @Column({ default: false })
    is_deleted: boolean;


    @Column({default:true})
    subscribed:boolean;

    @CreateDateColumn({ type:'timestamp' })
    createdAt: Date;
  
    // Update timestamp attribute
    @UpdateDateColumn({ type:'timestamp' })
    updatedAt: Date;


    @Column({nullable:true})
    passwordResetToken:string;


    @Column({ nullable: true, type: 'timestamp' })
    passwordResetTokenExpiration: Date;

    @ManyToOne(() => Plan,{ onDelete: 'SET NULL' })
    @JoinColumn({ name: 'id_plan' })
    plan: Plan;



    @Column({type: 'timestamp',nullable:true})
    plan_expiration_date:Date

    @OneToMany(() => Conversation, conversation => conversation.user)
    conversations: Conversation[];


    @Column({ default: 'false' })
    custom_instuctions_status: boolean;
  
  
    
    @Column({nullable:true})
    pre_made_prompt:number;


    @Column({nullable:true})
    chat_per_day:number;

    @Column({nullable:true})
    saved_prompt:number;


    @Column({nullable:true})
    custom_instructions:number;

    @Column({nullable:true})
    type_of_content:string


    @OneToMany(() => Saved_Prompts, (savedprompts) => savedprompts.user)
    saved_prompts: Saved_Prompts[];


  }
  