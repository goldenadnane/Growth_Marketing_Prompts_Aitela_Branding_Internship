/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { ConversationService } from 'src/conversation/conversation.service';
import { Category } from 'src/entities/category.entity';
import { Conversation } from 'src/entities/conversation.entity';
import { Message } from 'src/entities/message.entity';
import { User } from 'src/entities/user.entity';
import { MessageController } from 'src/message/message.controller';
import { MessageService } from 'src/message/message.service';
import { UserService } from 'src/user/user.service';




@Module({
  imports: [TypeOrmModule.forFeature([Message,Conversation,User,Category])],

  controllers:[MessageController],
  providers: [MessageService,ConversationService,UserService,CategoryService,JwtService],
  exports:[MessageService]
})
export class MessageModule {}