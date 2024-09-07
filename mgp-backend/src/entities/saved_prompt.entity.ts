/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Prompt } from './prompt.entity';


@Entity() // Specify the name of the join table
export class Saved_Prompts {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.saved_prompts)
  user: User;

  @ManyToOne(() => Prompt, (prompt) => prompt.saved_prompts)
  prompt: Prompt;

  @Column({nullable:true})
  content:string;  

}
