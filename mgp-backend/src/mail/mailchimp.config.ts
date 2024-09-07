/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Mail } from 'src/entities/mail.entity';
import { UserService } from 'src/user/user.service';
import { MailService } from './mail.service';
import { MailUser } from 'src/entities/mail_user.entity';
import { MailUserService } from './mail_user.service';
import axios from 'axios';
import { response } from 'express';



@Injectable()
export class MailchimpService {
  url=process.env.BASE_URL




 
  constructor(@Inject('PLUNK_API_KEY') private readonly apikey: string,@Inject(UserService) private readonly userService:UserService,@Inject(MailService) private readonly mailService:MailService,
  @Inject(MailUserService) private readonly mailuserService:MailUserService
  ) {



  }
  

  /*async sendLinkToResetPassword(email: string, resetToken: string): Promise<void> {
    const mailOptions = {
      from: 'adnaneabouelmakarim@gmail.com', // Replace with your email address
      to: email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: `${this.url}/reset-password/${resetToken}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
*/
  



  async sendMail(to: string | string[], subject: string, body: string): Promise<void> {

    const toRecipients: string[] = Array.isArray(to) ? to : [to];

      // Validate the email recipients using the UserService
      const validRecipients = await Promise.all(
        toRecipients.map(async (to) => {
          const user = await this.userService.findone(to);
          return user && user.subscribed !==false ? user : null;
        }),
      );

      
      // Remove null values (non-existent user emails)
      

      const filteredRecipients = validRecipients.filter((user) => user !== null);
      

      // If no valid recipients, throw an error
      if (filteredRecipients.length === 0) {
        throw new HttpException('there is an invalid recipients found', HttpStatus.BAD_REQUEST);
      }
      


      try {

      // Save the email and recipients in the database (assuming the functions are correctly implemented)
      const mail = new Mail();
      mail.title = subject;
      mail.text = body;
      await this.mailService.create(mail);

      //Save the email id and recipients id in the database

      for (const user of filteredRecipients) {
        const userr = await this.userService.findone(user.email);
        const mailuser = new MailUser();
        mailuser.user = userr;
        mailuser.mail = mail;
        await this.mailuserService.create(mailuser);

        const response=await axios.post('https://api.useplunk.com/v1/send', {
          to,
          subject,
          body,
        },{
          headers: {
            'Authorization': `Bearer ${this.apikey}`,
            'Content-Type': 'application/json',
          }
        });
        return response.data
      
       
     
    }
    
      } catch (error) {
        console.error('Error :', error);
        throw new Error(error);
      }
    }
      
  
}





