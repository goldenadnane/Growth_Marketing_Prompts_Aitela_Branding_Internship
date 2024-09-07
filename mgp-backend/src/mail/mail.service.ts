/* eslint-disable prettier/prettier */
import {Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Mail } from 'src/entities/mail.entity';




@Injectable()
export class MailService {
    constructor(
        @InjectRepository(Mail)
       private mailRepository: Repository<Mail>,
       
    ) {}

    //search mails

    async searchMails(searchquery: string): Promise<Mail[]> {
        const mails=await this.mailRepository
          .createQueryBuilder('mail')
          .where('mail.title LIKE :query', { query: `%${searchquery}%` })
        
          .getMany();
          
          return mails
      }
        
    // get all mails
    async findall(): Promise<Mail[]> {
        return await this.mailRepository.find();
    }

    // get one user
    async findOne(id: number): Promise<Mail> {
        return await this.mailRepository.findOne({ where : { id } });
    }


    //create user
    async create(mail: Mail): Promise<Mail> {
       
        return await this.mailRepository.save(mail);
    }


    
 


}