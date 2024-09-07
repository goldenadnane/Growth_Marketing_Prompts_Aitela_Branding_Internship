/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete, Put, NotFoundException, Req, UseGuards} from '@nestjs/common';
import { MessageService } from 'src/message/message.service';
import { Message } from 'src/entities/message.entity';
import { MessageDto } from './dto/message.dto';
import { Request } from 'express';
import { AuthenticateTokenMiddleware } from 'src/middleware/AuthenticateTokenMiddleware';
import { AdminMiddleware } from 'src/middleware/AdminMiddleware';



@Controller('messages')
@UseGuards(AuthenticateTokenMiddleware)

export class MessageController {
    constructor(private readonly messageService: MessageService) {}
  
    //get all messages
    @UseGuards(AdminMiddleware)
    @Get("/all")
    async findAll(): Promise<Message[]> {
        return await this.messageService.findall();
    }

    //get one message
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Message> {
        const message = await this.messageService.findOne(id);
        if (!message) {
            throw new Error(" message not found")
        } else {
            return message;
        }
    }




    //create message
    @Post("/save")
    async create(@Req() req:Request,@Body() message: Message) {
        return await this.messageService.create(req,message);
    }

 

    //update message
    @Put('/update/:id')
    async update(@Param('id') id: number,@Body() message: MessageDto): Promise<Message> {
        return this.messageService.update(id, message);
    }

    //delete message
    @Delete('/delete/:id')
    async delete(@Param('id') id: number): Promise<void> {       
        await this.messageService.delete(id);
  }

  @Get('/byConversationId/:id')
  async getMessagesByConversationId(@Param('id') id: number): Promise<Message[]> {
    try {
      const messages = await this.messageService.getMessagesByConversationId(id);
      return messages;
    } catch (error) {
      // Handle error, for example, return a 404 response when the message is not found
      throw new NotFoundException('Messages not found');
    }
  }
  

  /*@Get("/messages/statistics")
  async getUserStatistics(): Promise<{ currentMonth: number; previousMonth: number; percentage: number }> {
    const currentMonth = await this.messageService.countMessagesInCurrentMonth();
    const previousMonth = await this.messageService.countMessagesInPreviousMonth();
    const percentage = previousMonth !== 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 100;

    return { currentMonth, previousMonth, percentage };
  }
  */

  @Get("/messages/count")
  async countMessages(){
    return await this.messageService.countMessages()
  }

}