/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { Conversation } from 'src/entities/conversation.entity';
import { Request } from 'express';
import { AdminMiddleware } from 'src/middleware/AdminMiddleware';

@Controller('conversations')
export class ConversationController {
    constructor(private readonly conversationService: ConversationService) {}
  
    @UseGuards(AdminMiddleware)
    @Get('/all')
    //get all conversations
    async findAllOrderedByEndDate(): Promise<Conversation[]> {
        return this.conversationService.findAllOrderedByEndDate()
      }

    //get one conversation
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Conversation> {
        const conversation = await this.conversationService.findOne(id);
        if (!conversation) {
            throw new Error("Conversation not found")
        } else {
            return conversation;
        }
    }




    //create conversation
    @Post("/save")
    async create(@Req() req:Request,@Body('title') title?:string,@Body('category') id_category?:number) {
        return await this.conversationService.create(req,title,id_category);
    }
    

 



    //delete conversation
    @Delete('/delete/:id')
    async delete(@Param('id') id: number): Promise<void> {       
        await this.conversationService.delete(id);
  }


  @Get('/conversations/count')
  async countConversations(){
    const total = await this.conversationService.countConversations();
    return total ;
  }


  @Get('/conversations/:id')
  async getConversationById(@Param('id') id: number){
    return await this.conversationService.getConversationById(id)
}


@Get('/userconversations/:id_user')
async getConversationByUserId(@Param('id_user') id_user: number){
    return await this.conversationService.getConversationByUserId(id_user)
}

@Get('lastconversation_of_user/:userId')
async findLastConversationByUserId(@Param('userId') userId: number){
    return await this.conversationService.findLastConversationByUserId(userId)
}



}