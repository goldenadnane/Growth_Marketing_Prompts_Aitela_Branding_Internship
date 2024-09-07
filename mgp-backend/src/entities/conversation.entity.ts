/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { User } from "./user.entity";
import { Message } from "./message.entity";
import { Category } from "./category.entity";



@Entity()
export class Conversation {
    @PrimaryGeneratedColumn()
    id:number;


    @Column({type:"varchar",nullable:true})
    title:string;
    
    @ManyToOne(() => User)
    @JoinColumn({ name: 'id_user' })
    user: User;

    // @ManyToOne(() => Category)
    // @JoinColumn({ name: 'id_category' })
    // category: Category;
    


    @OneToMany(() => Message, message => message.conversation)
    message:Message[];


    @CreateDateColumn({ type:'timestamp' })
    startDate:Date;

    @UpdateDateColumn({ type:'timestamp' })
    endDate:Date;

}