/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty,IsNumber} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { Conversation } from 'src/entities/conversation.entity';




@Injectable()

export class MessageDto {

  @IsString()
  @IsNotEmpty()
  
  text: string;



  @IsNotEmpty()
  @IsNumber()
  conversation:Conversation





    

}