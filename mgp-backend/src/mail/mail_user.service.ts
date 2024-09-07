/* eslint-disable prettier/prettier */
import {Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailUser } from 'src/entities/mail_user.entity';
import { User } from 'src/entities/user.entity';




@Injectable()
export class MailUserService {
    constructor(
        @InjectRepository(MailUser)
       private mailuserRepository: Repository<MailUser>
    ) {}



  
        
    // get all mails
    async findall(): Promise<MailUser[]> {
        return await this.mailuserRepository.find();
    }

    // get one user
    async findOne(id: number): Promise<MailUser> {
        return await this.mailuserRepository.findOne({ where : { id } });
    }


    //create user
    async create(mailuser: MailUser): Promise<MailUser> {
       
        return await this.mailuserRepository.save(mailuser);
    }

    


    async findAllUsersByEmailId(emailId: number): Promise<User[]> {
        const mailUsers = await this.mailuserRepository.find({
          where: { mail: { id: emailId } },
          relations: ['user'],
        });
    
        // Extract users from mailUsers and return them as an array
        return mailUsers.map((mailUser) => mailUser.user);
      }


}