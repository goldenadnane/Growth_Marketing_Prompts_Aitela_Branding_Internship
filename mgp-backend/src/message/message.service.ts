/* eslint-disable prettier/prettier */
import {Injectable,HttpException,HttpStatus, Inject, Req, /*BadRequestException*/} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { Message } from 'src/entities/message.entity';
import { ConversationService } from 'src/conversation/conversation.service';
import { MessageDto } from './dto/message.dto';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';

@Injectable()
export class MessageService {
    constructor(
        @Inject(ConversationService)
        private readonly conversationService: ConversationService,
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        private userService:UserService,
      ) {}

    // get all messages
    async findall(): Promise<Message[]> {
        return await this.messageRepository.find();
    }

    // get one message
    async findOne(id: number): Promise<Message> {
        return await this.messageRepository.findOne({ where : { id } });
    }


    //create message
    async create(@Req() req:Request,message:Message): Promise<Message> {

      const user=await this.userService.findOne(req.userId)


      
      const msg = new Message();


        if(user.chat_per_day>0 && message.sender==="user"){
          msg.text = message.text;
          msg.conversation=message.conversation;
          msg.sender=message.sender;
          user.chat_per_day-=1
          await this.userService.create(user)
          return await this.messageRepository.save(msg)
        }

        else if(message.sender==="Ai"){
          msg.text = message.text;
          msg.conversation=message.conversation;
          msg.sender=message.sender;
          return await this.messageRepository.save(msg)
        }

        else{
         // throw new BadRequestException(`Upgrade your plan.You cannot send more chats`)

         if(message.sender==="user"){
          msg.text = message.text;
          msg.conversation=message.conversation;
          msg.sender=message.sender;
         // user.chat_per_day-=1
         //await this.userService.create(user)
          return await this.messageRepository.save(msg)
        }

        else if(message.sender==="Ai"){
          msg.text = message.text;
          msg.conversation=message.conversation;
          msg.sender=message.sender;
          return await this.messageRepository.save(msg)
        }

        }
        
      }


          
     
    

    // update message
    async update(id: number,message:MessageDto): Promise<any> {

        const msg=await this.messageRepository.findOne( { where : { id } } );
        if(!msg){
            throw new HttpException("message does not exist",HttpStatus.CONFLICT)
        }
        msg.text=message.text;
        //msg.sender=message.sender;
        msg.conversation=message.conversation;
        return await this.messageRepository.update(id,msg);
       

    }

    // delete message
    async delete(id: number): Promise<void> {
        const subcategory = await this.findOne(id);
        if (!subcategory) {
            throw new Error("Subcategory not found !")
        }
        await this.messageRepository.delete(id);
    }




 async getMessagesByConversationId(id: number): Promise<Message[]> {
    // Find the conversation with the given conversationId
    const conversation = await this.conversationService.findOne(id)

    if (!conversation) {
      // Handle case when the conversation is not found
      throw new Error('Conversation not found');
    }

    // Use the createQueryBuilder to fetch messages for the conversationId with eager loading
    const Message = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.conversation = :id', { id })
      .getMany();

    return Message;
  }




  //count total conversations
  async countMessages(): Promise<{ totalMessages: number, monthlyCounts: { month: number, totalmessages: number }[] }> {


    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const totalMessages=await this.messageRepository.count();



    const monthlyCounts = [];
    
      for (let month = 0; month <= currentMonth; month++) {
        const startDate = new Date(currentYear, month, 1);
        const endDate = new Date(currentYear, month + 1, 0);
    
        const totalmessages = await this.messageRepository.count({
          where: {
            createdAt: Between(startDate, endDate)
          }
        });
    
        monthlyCounts.push({ month: month + 1, totalmessages }); // +1 to month to start with fitst month , because the loop begin with 0
      }
    
      return { totalMessages, monthlyCounts };
  }



  async getConversationMessagesById(id: number) {
    return this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.conversation', 'conversation')
      .where('conversation.id = :id', { id })
      .getMany();
  }



}