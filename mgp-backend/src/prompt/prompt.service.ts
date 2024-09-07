/* eslint-disable prettier/prettier */
import {Injectable,HttpException,HttpStatus, Inject, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prompt } from 'src/entities/prompt.entity';
import { SubcategoryService } from 'src/subcategory/subcategory.service';
import { HttpStatusCode } from 'axios';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/entities/category.entity';
import { Subcategory } from 'src/entities/subcategory.entity';



@Injectable()
export class PromptService {
    constructor(
        @InjectRepository(Prompt)
       private promptRepository: Repository<Prompt>,
       @Inject(SubcategoryService)
        private readonly subcategoryService:SubcategoryService,
      @Inject(CategoryService)
        private readonly categoryService:CategoryService,
      
      
    ) {}


         //search prompts
         async searchPrompts(searchquery: string): Promise<Prompt[] | null> {
            const prompts=await this.promptRepository
              .createQueryBuilder('prompt')
              .leftJoinAndSelect('prompt.subcategory', 'subcategory')
              .leftJoinAndSelect('subcategory.category', 'category')
              .select(['category.name', 'subcategory.name', 'prompt'])
              .where('prompt.prompt_text LIKE :query', { query: `%${searchquery}%` })
              
              .getRawMany();
              
              if(prompts.length===0){
                throw new HttpException("No best used prompts found ",HttpStatusCode.NotFound)
              }
              return prompts;
          }
    // get all prompts
    async findall(): Promise<Prompt[] | null> {
      const prompts=await this.promptRepository
      .createQueryBuilder('prompt')
      .leftJoinAndSelect('prompt.subcategory', 'subcategory')
      .leftJoinAndSelect('subcategory.category', 'category')
      .select(['category.name', 'subcategory.name', 'prompt'])
      
      .getRawMany();
      
      if(prompts.length===0){
        throw new HttpException("No best used prompts found ",HttpStatusCode.NotFound)
      }
      return prompts;
    }

    // get one prompt
    async findOne(id: number): Promise<Prompt> {
      const prompt=await this.promptRepository
      .createQueryBuilder('prompt')
      .leftJoinAndSelect('prompt.subcategory', 'subcategory')
      .leftJoinAndSelect('subcategory.category', 'category')
      .where('prompt.id = :id', { id })
      .select(['category.name', 'subcategory.name', 'prompt'])
      
      .getOne();
      
      return prompt
    }





    //create prompt
    async create(prompt_text:string,goal:string,id:number): Promise<Prompt> {
        const subcategory = await this.subcategoryService.findOne(id);

        if (!subcategory) {
            throw new HttpException("SubCategory not found !",HttpStatusCode.BadRequest)
         }

     
         const prompt = new Prompt();
         prompt.prompt_text = prompt_text;
         prompt.goal=goal;
         prompt.subcategory = subcategory;
      
     
         return await this.promptRepository.save(prompt);

    }


    async update(id: number,prompt_text: string,goal:string,id_subcategory:number,status:boolean): Promise<any> {
      

        const prompt=await this.promptRepository.findOne({
          where: { id: id  },
          relations: ['subcategory', 'subcategory.category'],
        });
        
        if(!prompt){

            throw new HttpException("Prompt does not exist",HttpStatus.NOT_FOUND)
        }
        prompt.prompt_text=prompt_text

        prompt.goal=goal
      const subcategoryy=await this.subcategoryService.findOne(id_subcategory)

      if(!subcategoryy){
        throw new NotFoundException("subcategory not found")
      }
      
        prompt.subcategory=subcategoryy

        prompt.status=status
        

         await this.promptRepository.update(id, prompt);
         return this.findOne(id_subcategory)
       

    }

    // delete prompt
    async delete(id: number): Promise<void> {
        const prompt = await this.findOne(id);
        if (!prompt) {
            throw new Error("Prompt not found !")
        }
        await this.promptRepository.delete(id);
    }


    async findBestUsedPrompts(limit: number): Promise<Prompt[] | null> {
      const prompts=await this.promptRepository
      .createQueryBuilder('prompt')
      .leftJoinAndSelect('prompt.subcategory', 'subcategory')
      .leftJoinAndSelect('subcategory.category', 'category')
      .orderBy('prompt.used', 'DESC')
      .limit(limit)
      .select(['category.name', 'subcategory.name', 'prompt'])
      
      .getRawMany();
      
      if(prompts.length===0){
        throw new HttpException("No best used prompts found ",HttpStatusCode.NotFound)
      }
      return prompts;
    }
      



    async getBestUsedPromptLastMonth():Promise<Prompt[] | null>{
        const now = new Date();

        const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        // Calculate the last day of the last month
        const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    
        const bestUsedPrompt = await this.promptRepository
        .createQueryBuilder('prompt')
        .leftJoinAndSelect('prompt.subcategory', 'subcategory')
        .leftJoinAndSelect('subcategory.category', 'category')
        .where('prompt.createdAt BETWEEN :startDate AND :endDate', {
          startDate: firstDayOfLastMonth,
          endDate: lastDayOfLastMonth,
        })
        .orderBy('prompt.used', 'DESC')
        .select(['category.name', 'subcategory.name', 'prompt'])
        .getMany();
  
      if(bestUsedPrompt.length===0){
        throw new HttpException("No best used prompts found for last month",HttpStatusCode.NotFound)
      }
      return bestUsedPrompt;
    }
     
    
    async findLessUsedPrompts(): Promise<Prompt[] | null> {
      const prompts=await this.promptRepository
      .createQueryBuilder('prompt')
      .leftJoinAndSelect('prompt.subcategory', 'subcategory')
      .leftJoinAndSelect('subcategory.category', 'category')
      .orderBy('prompt.used', 'ASC')
      .select(['category.name', 'subcategory.name', 'prompt'])
      
      .getRawMany();
      
      if(prompts.length===0){
        throw new HttpException("No less used prompts found ",HttpStatusCode.NotFound)
      }
      return prompts;

      }
    




      async uploadAndProcessCsv(file: Express.Multer.File): Promise<void> {
        const categoryMap = new Map<string, any>();
        const subcategoryMap = new Map<string, any>();
    
        const rows = [];
        fs.createReadStream(file.path)
          .pipe(csvParser({ separator: ',' }))
          .on('data', (row: any) => {
              rows.push(row);
          })
          .on('end', async () => {
              for (const row of rows) {
                  await this.processRow(row, categoryMap, subcategoryMap);
              }
              console.log('CSV file successfully processed.');
          });
    }
    
    async processRow(row: any, categoryMap: Map<string, any>, subcategoryMap: Map<string, any>): Promise<void> {
        const categoryName = row.Category;
        const subcategoryName = row.SubCategory;
        const promptText = row.Prompt;
        const purposeName = row.Purpose;
    
        let category;
    
        if (categoryMap.has(categoryName)) {
            category = categoryMap.get(categoryName);
        } else {
            category = await this.categoryService.findone(categoryName);
            if (!category) {
                category = await this.categoryService.create({ name: categoryName });
                categoryMap.set(categoryName, category);
            }
        }
    
        let subcategory;
        const subcategoryKey = `${categoryName}-${subcategoryName}`;
    
        if (subcategoryMap.has(subcategoryKey)) {
            subcategory = subcategoryMap.get(subcategoryKey);
        } else {
            subcategory = await this.subcategoryService.findOrCreateSubcategory(subcategoryName, category);
            subcategoryMap.set(subcategoryKey, subcategory);
        }
    
        const promptExists = await this.promptRepository.findOne({ where: { prompt_text: promptText, subcategory }});
    
        if (!promptExists) {
            const newPrompt = this.promptRepository.create({ prompt_text: promptText, subcategory: subcategory, goal: purposeName });
            await this.promptRepository.save(newPrompt);
        }
    }
    


        async findActivePrompts(): Promise<Prompt[] | Prompt> {
          const prompt=await this.promptRepository
          .createQueryBuilder('prompt')
          .leftJoinAndSelect('prompt.subcategory', 'subcategory')
          .leftJoinAndSelect('subcategory.category', 'category')
          .where('prompt.status = :status', { status: true })
          .select(['category.name', 'subcategory.name', 'prompt'])
          
          .getRawMany();
          
          return prompt
        }



        async findFreePrompts(): Promise<Prompt[] | Prompt> {
          const prompt=await this.promptRepository
          .createQueryBuilder('prompt')
          .innerJoin('prompt.subcategory', 'subcategory')
          .innerJoin('subcategory.category', 'category')
          .where('category.is_free = :is_free', { is_free: true })
          .select(['category.name', 'subcategory.name', 'prompt'])
          
          .getRawMany();
          
          return prompt
        }



        async increaseUsedPrompt(promptId:number):Promise<any>{
          // let used_prompt=null
          const used_prompt=await this.promptRepository.findOne({where:{id:promptId}})
          
          // if(!used_prompt){
          //   used_prompt=`the prompt with id : ${promptId} not found`
          // }
          console.log(used_prompt.used);
          
          const num = Number(used_prompt.used);
          used_prompt.used =  num + 1
          console.log(used_prompt.used);
          
          return await this.promptRepository.save(used_prompt)
          
        }
      
          
        


  } 


