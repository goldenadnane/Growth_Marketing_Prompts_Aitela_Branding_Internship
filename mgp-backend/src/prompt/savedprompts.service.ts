/* eslint-disable prettier/prettier */


import {BadRequestException, NotFoundException, Injectable,Req} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Saved_Prompts } from 'src/entities/saved_prompt.entity';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { PromptService } from './prompt.service';
import { Prompt } from 'src/entities/prompt.entity';




@Injectable()
export class SavedPromptsService {
  constructor(
    @InjectRepository(Saved_Prompts)
    private savedPromptsRepository: Repository<Saved_Prompts>,
    private userservice:UserService,
    private promptservice:PromptService,
    
    @InjectRepository(Prompt)
       private promptRepository: Repository<Prompt>,
  ) {}
  
  




async addExistingPrompts_to_SavedPrompts(@Req() req:Request,promptId: number): Promise<any> {

  try{
    
    const user=await this.userservice.findOne(req.userId);    
    const prompt=await this.promptservice.findOne(promptId)
    
    if (!prompt) {
      console.log('prompt not exist: ', promptId );
      throw new BadRequestException("Prompt not exist");
      
    }
    // console.log('prompt :' , prompt);

    const currentDate = new Date();
    const planExpirationDate = new Date(user.plan_expiration_date);
    //console.log(currentDate)

  if(currentDate >= planExpirationDate){
    user.custom_instuctions_status=false
    user.chat_per_day=0
    user.saved_prompt=0
    user.custom_instructions=0
    user.pre_made_prompt=0
    await this.userservice.create(user)
    throw new BadRequestException("Your plan has expired")
  }  

  else{


    const saved_prompts = await this.savedPromptsRepository.findOne({
      where:{
      user: { id: req.userId }, 
      prompt:{id:promptId},
      },
      });

      

      if (saved_prompts) {
        // If it doesn't exist, you may want to create it or handle the scenario accordingly.
        throw new BadRequestException("this Prompt already exists");
        
      }
    

     // console.log("saved",saved_prompts)
      else{

        if(user.saved_prompt<=0){
          throw new BadRequestException("Upgrade your plan.You cannot save more prompts")
        }
     
  
        if(user.saved_prompt>0 && !saved_prompts){
          user.saved_prompt-=1
          await this.userservice.create(user)
        }
     
        const newSavedPrompt = new Saved_Prompts();
        newSavedPrompt.user = user
        newSavedPrompt.prompt =prompt
        newSavedPrompt.content = null

    
        // await this.promptRepository.save(prompt);
        await this.savedPromptsRepository.save(newSavedPrompt)

    
      }
    }
  }
  catch(error){
    console.error('Error in addExistingPrompts_to_SavedPrompts:', error);
    //throw new HttpException("Something went wrong", HttpStatusCode.Forbidden);
  }
  }

  
  
  async addNewPrompts_to_SavedPrompts(@Req() req:Request,content:string): Promise<any> {


    
    const currentDate = new Date();

    const user=await this.userservice.findOne(req.userId);
    const planExpirationDate = new Date(user.plan_expiration_date);
    //console.log(currentDate)

    if(currentDate >= planExpirationDate){
      user.custom_instuctions_status=false
      user.chat_per_day=0
      user.saved_prompt=0
      user.custom_instructions=0
      user.pre_made_prompt=0
      await this.userservice.create(user)
      throw new BadRequestException("Your plan has expired")
    }  


    else{
       

      const saved_prompts = await this.savedPromptsRepository.findOne({
        where:{
        user: { id: req.userId }, 
        content:content
        },
        });

      if(user.pre_made_prompt<=0){
        throw new BadRequestException("Upgrade your plan.You cannot save more pre-made-prompts")
      }


      if(user.pre_made_prompt>0 && !saved_prompts){
        user.pre_made_prompt-=1
        await this.userservice.create(user)
      }



      if (saved_prompts) {
        // If it doesn't exist, you may want to create it or handle the scenario accordingly.
        // throw new BadRequestException("this Prompt already exists");
      throw new NotFoundException('this Prompt already exists');

        
      }
    

     // console.log("saved",saved_prompts)
      else{

        const newSavedPrompt = new Saved_Prompts();
        newSavedPrompt.user = user
        newSavedPrompt.content = content; 
    
        await this.savedPromptsRepository.save(newSavedPrompt);
      }
    }
    

}


  async getSavedPromptsByUserId(@Req() req:Request) {
    const userId = req.userId;
    console.log(userId);
    
     return this.savedPromptsRepository
    .createQueryBuilder('saved_prompts')
    .leftJoinAndSelect('saved_prompts.prompt', 'prompt')
    .leftJoinAndSelect('prompt.subcategory', 'subcategory')
    .leftJoinAndSelect('subcategory.category', 'category')
    .where('saved_prompts.user.id = :userId',{userId})
    .getMany();
}

}