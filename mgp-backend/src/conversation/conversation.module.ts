/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from 'src/entities/conversation.entity';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { UserService } from 'src/user/user.service';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/entities/category.entity';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Message } from 'src/entities/message.entity';








@Module({
  imports: [TypeOrmModule.forFeature([Conversation,Category,User,Message])],

  controllers:[ConversationController],
  providers: [ConversationService,CategoryService,UserService,JwtService],
  exports:[ConversationService]
})
export class ConversationModule {}