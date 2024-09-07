/* eslint-disable prettier/prettier */
import { CreateDateColumn, Entity,JoinColumn,ManyToOne,PrimaryGeneratedColumn} from "typeorm";
import { User } from "./user.entity";
import { Plan } from "./plan.entity";



@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(() => User,{ onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_user' })
    user: User;

    @ManyToOne(() => Plan,{ onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_plan' })
    plan: Plan;

    @CreateDateColumn({ type:'timestamp' })
    payment_date:Date;



}
