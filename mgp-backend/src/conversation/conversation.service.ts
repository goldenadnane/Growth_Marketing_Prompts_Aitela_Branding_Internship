/* eslint-disable prettier/prettier */
import {HttpException, Inject, Injectable, Req} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Conversation } from 'src/entities/conversation.entity';
import { UserService } from 'src/user/user.service';
import { CategoryService } from 'src/category/category.service';
import { HttpStatusCode } from 'axios';
import { Message } from 'src/entities/message.entity';


@Injectable()
export class ConversationService {
    constructor(
        @InjectRepository(Conversation)
       private conversationRepository: Repository<Conversation>,
       @Inject(UserService)
        private readonly userService:UserService,
        @Inject(CategoryService)
        private readonly categoryService: CategoryService,
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
    ) {}

    // get all conversations
    async findAllOrderedByEndDate(): Promise<Conversation[]> {
        return this.conversationRepository.find({
          order: { endDate: 'DESC' }, // Order conversations by endDate in descending order
        });
      }

    
    // get one conversation
    async findOne(id: number): Promise<Conversation | undefined> {
        return await this.conversationRepository.findOne({ where : { id } });
    }


    //create conversation
    async create(@Req() req,title?: string,id_category?:number): Promise<Conversation> {
        const user = await this.userService.findOne(req.userId);
        const category = await this.categoryService.findOne(id_category);


        if (!user) {
            throw new HttpException("User not found !",HttpStatusCode.BadRequest)

        }

       if (!category) {
           throw new HttpException("Category not found !",HttpStatusCode.BadRequest)
        }
        
       
    
        const conversation = new Conversation();
        conversation.title = title;
        conversation.user = user
        //conversation.category=category;

    
        return await this.conversationRepository.save(conversation);
        
        }
        
      



    // delete conversation
    async delete(id: number): Promise<void> {
        const conversation = await this.findOne(id);
        if (!conversation) {
            throw new Error("Conversation not found !")
        }

        await this.messageRepository.delete({ conversation: conversation });
        await this.conversationRepository.delete(id);
    }

    //count total conversations
    async countConversations(): Promise<{ totalConversations: number, monthlyCounts: { month: number, totalconversations: number }[] }> {


        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        const totalConversations=await this.conversationRepository.count();



        const monthlyCounts = [];
        
          for (let month = 0; month <= currentMonth; month++) {
            const startDate = new Date(currentYear, month, 1);
            const endDate = new Date(currentYear, month + 1, 0);
        
            const totalconversations = await this.conversationRepository.count({
              where: {
                startDate:MoreThanOrEqual(startDate),
                endDate: LessThanOrEqual(endDate)
              }
            });
        
            monthlyCounts.push({ month: month + 1, totalconversations }); // +1 to month to start with fitst month , because the loop begin with 0
          }
        
          return { totalConversations, monthlyCounts };
      }



      async getConversationById(id: number){
        return this.conversationRepository
          .createQueryBuilder('conversation')
          .leftJoinAndSelect('conversation.message', 'message')
          .where('conversation.id = :id', { id })
          .getOne();
      }



      async getConversationByUserId(id_user: number){
        return this.conversationRepository
          .createQueryBuilder('conversation')
          // .leftJoinAndSelect('conversation.message', 'message')
          .where('conversation.user.id = :id_user', { id_user})
          .orderBy('conversation.endDate', 'DESC')
          .getMany();
      }



      async findLastConversationByUserId(userId: number): Promise<Conversation> {
        return await this.conversationRepository
          .createQueryBuilder('conversation')
          .where('conversation.user.id = :userId', { userId })
          .orderBy('conversation.endDate', 'DESC')
          .getOne();
      }


}