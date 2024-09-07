/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity,JoinColumn,ManyToOne,PrimaryGeneratedColumn} from "typeorm";
import { Conversation } from "./conversation.entity";


@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:true})
    sender:string;

    @Column({type:"varchar"})
    text:string;



    @ManyToOne(() => Conversation)
    @JoinColumn({ name: 'id_conversation' })
    conversation: Conversation;





    @CreateDateColumn({ type:'timestamp' })
    createdAt:Date;


    @Column({default:0})
    used:number;

    @Column({default:"false"})
    saved:boolean;


}