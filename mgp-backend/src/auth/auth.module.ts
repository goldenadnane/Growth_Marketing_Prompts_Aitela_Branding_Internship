/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {UserModule} from "../user/user.module";
import { AuthController } from './auth.controller';
import { MailchimpService } from 'src/mail/mailchimp.config';
import { MailService } from 'src/mail/mail.service';
import { MailUserService } from 'src/mail/mail_user.service';
import { Mail } from 'src/entities/mail.entity';
import { MailUser } from 'src/entities/mail_user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailController } from 'src/mail/mail.controller';
import { UserService } from 'src/user/user.service';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { GoogleAuthService } from './google_auth.service';
import { AuthGoogleController } from './google_auth.controller';



@Module({
  imports: [
    TypeOrmModule.forFeature([Mail,MailUser,User]),
      UserModule,
      


  
  ],
  controllers:[AuthController,MailController,AuthGoogleController],
  providers: [AuthService,MailchimpService,MailService,MailUserService,UserService,JwtService,GoogleAuthService,
    {
      provide: 'PLUNK_API_KEY',

      useValue: 'sk_be205d875188a3ce135d9f3414d055487e48c2a78add5e01', // Replace with your actual Mailchimp API key
    },
   

   ],
  
  exports:[ 'PLUNK_API_KEY',AuthService,MailService,MailchimpService,MailUserService,GoogleAuthService]
})
export class AuthModule{}