/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Query, Inject} from '@nestjs/common';
import { MailService } from './mail.service';
import { Mail } from 'src/entities/mail.entity';
import { MailchimpService } from './mailchimp.config';
import { MailUserService } from './mail_user.service';
import { User } from 'src/entities/user.entity';


@Controller('mails')
export class MailController {
    constructor(private readonly mailService: MailService,@Inject(MailchimpService) private readonly mailchimpService:MailchimpService,
    @Inject(MailUserService) private readonly mailuserService:MailUserService) {}
  
//search users 
    @Get('/')
    async searchMails(@Query('query') searchquery: string): Promise<Mail[]> {
      const mails=await this.mailService.searchMails(searchquery);
      return mails
    }
    //get all users
    @Get("/all")
    async findAll(): Promise<Mail[]> {
        return await this.mailService.findall();
    }

    //get one user
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Mail> {
        const mail = await this.mailService.findOne(id);
        if (!mail) {
            throw new Error("Mail not found")
        } else {
            return mail;
        }
    }





    
    @Post('/send')
    async sendEmail(@Body() data: { to: string | string[]; subject: string; body: string }): Promise<string> {
      const { to, subject, body } = data;
  
      try {
        await this.mailchimpService.sendMail(to, subject, body);
        return 'Email sent successfully.';
      } catch (error) {
        return `Failed to send email: ${error.message}`;
      }
    }



    @Get(':emailId/users')
    async getUsersByEmailId(@Param('emailId') emailId: number): Promise<User[]> {
      const users = await this.mailuserService.findAllUsersByEmailId(emailId);
      return users;
    }



   
 
  
    
  }
