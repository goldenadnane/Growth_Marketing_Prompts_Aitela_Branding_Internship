/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { Custom_InstructionsService } from 'src/prompt/custom_instructions.service';
import { Custom_Instructions } from 'src/entities/custom_instructions.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/entities/user.entity';
import { ConversationService } from 'src/conversation/conversation.service';
import { Conversation } from 'src/entities/conversation.entity';
import { Category } from 'src/entities/category.entity';
import { CategoryService } from 'src/category/category.service';
import { MessageService } from 'src/message/message.service';
import { Message } from 'src/entities/message.entity';
import { JwtService } from '@nestjs/jwt';







@Module({
  imports: [TypeOrmModule.forFeature([Custom_Instructions,User,Conversation,Category,MessageService,Message])],

  controllers:[AiController],
  providers: [AiService,Custom_InstructionsService,UserService,ConversationService,CategoryService,MessageService, JwtService],
  exports:[AiService]
})
export class AiModule {}