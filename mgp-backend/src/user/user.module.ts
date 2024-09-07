/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import { Plan } from 'src/entities/plan.entity';
import { Category } from 'src/entities/category.entity';
import { Subcategory } from 'src/entities/subcategory.entity';
import { Message } from 'src/entities/message.entity';
import { Conversation } from 'src/entities/conversation.entity';
import { Prompt } from 'src/entities/prompt.entity';
import { Payment } from 'src/entities/payment.entity';
import { Mail } from 'src/entities/mail.entity';
import { MailUser } from 'src/entities/mail_user.entity';
import { Home } from 'src/entities/home.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User,Plan,Category,Subcategory,Message,Conversation,Prompt,Payment,Mail,MailUser,Home])],
  controllers: [UserController],
  providers: [UserService,JwtService],
  exports:[UserService],
})
export class UserModule {}