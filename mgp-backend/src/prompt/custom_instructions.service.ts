/* eslint-disable prettier/prettier */
import {BadRequestException, HttpException, HttpStatus, Injectable,NotFoundException,Req} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Custom_Instructions } from 'src/entities/custom_instructions.entity';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';





@Injectable()
export class Custom_InstructionsService {

    constructor(
        @InjectRepository(Custom_Instructions)
       private custominstructionsRepository: Repository<Custom_Instructions>,
       private userservice:UserService,

       ) {}


    
     async create(@Req() req: Request,brand:string,product_service: string,feature1: string,feature2: string,feature3: string,target_audience:string): Promise<any> {
        
        
        const custom_instruction=new Custom_Instructions()

        const user=await this.userservice.findOne(req.userId);
        if(user.plan===null){
          throw new BadRequestException("You must be subscribed to one of our plans to use custom_instructions")
        }


        const currentDate = new Date();

        const planExpirationDate = new Date(user.plan_expiration_date);
        //console.log(currentDate)

        if(user.plan && currentDate >= planExpirationDate){
          user.custom_instuctions_status=false
          user.chat_per_day=0
          user.saved_prompt=0
          user.custom_instructions=0
          user.pre_made_prompt=0
          await this.userservice.create(user)
          throw new BadRequestException("Your plan has expired")
        }  

        else if(user.plan && currentDate < planExpirationDate){


            if(user.custom_instructions<=0){
              throw new BadRequestException("Upgrade your plan.You cannot use more custom_instructions")
            
            }
          
      
      
            else{

            custom_instruction.brand=brand,
            custom_instruction.product_service=product_service,
            custom_instruction.feature1=feature1,
            custom_instruction.feature2=feature2,
            custom_instruction.feature3=feature3,
            custom_instruction.user=user
            custom_instruction.target_audience=target_audience
    
          
            user.custom_instructions-=1
            await this.userservice.create(user)
            await this.custominstructionsRepository.save(custom_instruction)
            }
        }

    
    }



    async edit(@Req() req: Request,customInstructionId:number,brand:string,product_service: string,feature1: string,feature2: string,feature3: string,target_audience:string): Promise<any> {
      const custom_instruction=await this.custominstructionsRepository.findOne({where:{id:customInstructionId}})
      const user=await this.userservice.findOne(req.userId);
      if(user.plan===null){
        throw new BadRequestException("You must be subscribed to one of our plans to use custom_instructions")
      }

      const currentDate = new Date();

      const planExpirationDate = new Date(user.plan_expiration_date);
      //console.log(currentDate)

      if(user.plan && currentDate >= planExpirationDate){
        user.custom_instuctions_status=false
        user.custom_instuctions_status=false
        user.chat_per_day=0
        user.saved_prompt=0
        user.custom_instructions=0
        user.pre_made_prompt=0
        await this.userservice.create(user)
        throw new BadRequestException("Your plan has expired")
      }  

      else if(user.plan && currentDate < planExpirationDate){
        if(user.custom_instructions<=0){
          throw new BadRequestException("Upgrade your plan.You cannot use more custom_instructions")
        
        }
        else{

            custom_instruction.brand=brand,
            custom_instruction.product_service=product_service,
            custom_instruction.feature1=feature1,
            custom_instruction.feature2=feature2,
            custom_instruction.feature3=feature3,
            custom_instruction.user=user
            custom_instruction.target_audience=target_audience
    
          
            await this.custominstructionsRepository.save(custom_instruction)
        }

    }

  }


    async findone(id:number): Promise<any>{
        const custom_instruction = await this.custominstructionsRepository.findOne({ where : { id } });
        if(!custom_instruction){
            throw new HttpException('Custom instruction with the given id  Not Found', HttpStatus.NOT_FOUND);
        }
        return {
            brand: custom_instruction.brand,
            product_service: custom_instruction.product_service,
            feature1: custom_instruction.feature1,
            feature2: custom_instruction.feature2,
            feature3: custom_instruction.feature3,
            target_audience:custom_instruction.target_audience
          };
    }



    async findCustomInstructionsByUserId(id:number):Promise<Custom_Instructions[]>{
      const instructions =await this.custominstructionsRepository.find({where: { user: { id: id } }})
      return instructions
    }


    async findAllCustomInstructions():Promise<Custom_Instructions[]>{
      return await this.custominstructionsRepository.find()
    }


    async updateCustomInstructionUserByGivenStatus(@Req() req:Request,custom_instuctions_status:boolean):Promise<any>{
        const user=await this.userservice.findOne(req.userId)
        user.custom_instuctions_status=custom_instuctions_status
        await this.userservice.create(user)

    }


    async deleteCustomInstruction(id:number):Promise<any>{
      const custom_instruction=await this.custominstructionsRepository.findOne({where:{id:id}})
      if(!custom_instruction){
        throw new NotFoundException(`The Custom Instruction with ID "${id}" not found`)
      }

      await this.custominstructionsRepository.delete(id)
    }




}