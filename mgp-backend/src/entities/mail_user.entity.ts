/* eslint-disable prettier/prettier */
import { Column,Entity,JoinColumn,ManyToOne,PrimaryGeneratedColumn} from "typeorm";
import { User } from "./user.entity";
import { Mail } from "./mail.entity";


@Entity()
export class MailUser {
    @PrimaryGeneratedColumn()
    id:number;


    @Column({default:false})
    viewed:boolean;

    @Column({default:false})
    clicked:boolean;

    @ManyToOne(() => User,{ onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_user' })
    user: User;

    @ManyToOne(() => Mail,{ onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_mail' })
    mail: Mail;



    

}