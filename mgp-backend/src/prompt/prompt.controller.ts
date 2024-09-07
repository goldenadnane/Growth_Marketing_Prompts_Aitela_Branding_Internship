/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseInterceptors, UploadedFile,  Req, UseGuards} from '@nestjs/common';
import { Prompt } from 'src/entities/prompt.entity';
import { PromptService } from './prompt.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { SavedPromptsService } from './savedprompts.service';
import { Request } from 'express';
import { Custom_InstructionsService } from './custom_instructions.service';
import { AdminMiddleware } from 'src/middleware/AdminMiddleware';




@Controller('prompts')
export class PromptController {
    constructor(private readonly promptService: PromptService,private savedPromptService: SavedPromptsService,private custominstructionsService:Custom_InstructionsService) {}
  

    //search prompts
    @Get('/')
    async searchPrompts(@Query('query') searchquery: string): Promise<Prompt[]> {
      const prompts=await this.promptService.searchPrompts(searchquery);
      return prompts
    }
    
    //get all prompts
    @Get("/all")
    async findAll(): Promise<Prompt[] | null> {
        return await this.promptService.findall();
    }

    //get one prompt
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Prompt> {
        const prompt = await this.promptService.findOne(id);
        if (!prompt) {
            throw new Error(" message not found")
        } else {
            return prompt;
        }
    }




    //create prompt
    @UseGuards(AdminMiddleware)
    @Post("/save")
    async create(@Body('prompt_text') prompt_text:string,@Body('goal') goal: string,@Body('id_subcategory') id:number): Promise<Prompt> {
        return await this.promptService.create(prompt_text,goal,id);
    }

    //update prompt
    @UseGuards(AdminMiddleware)
    @Put('/update/:promptId')
    async update(@Param('promptId') promptId: number,@Body('prompt_text') prompt_text: string,@Body('goal') goal: string,
    @Body('id_subcategory') id:number,@Body('status') status: boolean): Promise<Prompt> {
        return await this.promptService.update(promptId, prompt_text,goal,id,status);

    }

    //delete prompt
    @UseGuards(AdminMiddleware)
    @Delete('/delete/:id')
    async delete(@Param('id') id: number): Promise<void> {       
        await this.promptService.delete(id);
  }


  @Get('/prompts/best-used/:limit')
  async findBestUsedPrompts(@Param('limit') limit: number): Promise<Prompt[] | null> {
    return this.promptService.findBestUsedPrompts(limit);
  }
 
  @Get('/prompts/best-used-last-month')
  async getBestUsedPromptLastMonth(): Promise<Prompt[] | null> {
    const bestUsedPrompt = await this.promptService.getBestUsedPromptLastMonth();
    return bestUsedPrompt;
  }

  @Get('/prompts/less-used')
  async findLessUsedPrompts(): Promise<Prompt[] | null> {
    return this.promptService.findLessUsedPrompts();
  }

  @UseGuards(AdminMiddleware)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file',{
    fileFilter:(req,file,cb)=>{
      if(file.originalname.match(/^.*\.(csv)$/)){
        cb(null,true);
      }
      else{
        cb(new MulterError('LIMIT_UNEXPECTED_FILE','file'),false);
      }
      },
      storage:diskStorage({
        destination: './src/uploads',
        filename:(req,file,cb)=>{
          cb(null,file.originalname);
        },
      
      }),
  
  }),
  )
  async uploadCsv(@UploadedFile() file: Express.Multer.File): Promise<void> {
    
   

    await this.promptService.uploadAndProcessCsv(file);
  }




  @Post(':promptId')
  async addExistingPrompts_to_SavedPrompts(
    @Req() req:Request,
    @Param('promptId') promptId: number,
    

  ) {
    return this.savedPromptService.addExistingPrompts_to_SavedPrompts(req,promptId);
  }



  @Post('saved_prompts/new_saved_prompt')
  async addNewPrompts_to_SavedPrompts(
    @Req() req:Request,
    @Body('content') content: string,
    

  ) {
    return this.savedPromptService.addNewPrompts_to_SavedPrompts(req,content);
  }


  @Post('/prompts/custom_instructions')
  async addCustomInstructions(@Req() req:Request,@Body('brand') brand:string,@Body('product_service') product_service: string,@Body('feature1') feature1: string,@Body('feature2')feature2: string,@Body('feature3') feature3: string,@Body('target_audience') target_audience: string){
      return await this.custominstructionsService.create(req,brand,product_service,feature1,feature2,feature3,target_audience)
  }



  @Get('/prompts/active')
  async findActivePrompts(){
    return await this.promptService.findActivePrompts()
  }

  @Get('/prompts/free')
  async findFreePrompts(){
    return await this.promptService.findFreePrompts()
  }


  @Get('/prompts/custom_instructions_of_user/:id')
  async findCustomInstructionsByUserId(@Param('id') id:number){
    return await this.custominstructionsService.findCustomInstructionsByUserId(id)
  }
  

  @Get('/prompts/custom_instructions')
  async findAllCustomInstructions(){
    return await this.custominstructionsService.findAllCustomInstructions()
  }

  @Put('/prompts/custom_instruction')
  async updateCustomInstructionUserByGivenStatus(@Req() req:Request,@Body('custom_instuctions_status') custom_instuctions_status:boolean){
    return await this.custominstructionsService.updateCustomInstructionUserByGivenStatus(req,custom_instuctions_status)
  }




  @Delete('/prompts/custom_instruction/:id')
  async deleteCustomInstruction(@Param('id') id:number){
    await this.custominstructionsService.deleteCustomInstruction(id)
  }


  @Get('/prompts/savedprompts')
  async getSavedPromptsByUserId(@Req() req:Request) {
    console.log(req);
    
    return await this.savedPromptService.getSavedPromptsByUserId(req)
  }

  @Post('/prompts/get_prompt_to_increase_used_field/:promptId')
  async increaseUsedPrompt(@Param('promptId') promptId:number){
    
    return await this.promptService.increaseUsedPrompt(promptId)
  }

  @Put('/prompts/custom_instruction/:customInstructionId')
  async edit(@Req() req: Request,@Param('customInstructionId') customInstructionId:number,@Body('brand') brand:string,@Body('product_service') product_service: string,@Body('feature1') feature1: string,@Body('feature2')feature2: string,@Body('feature3') feature3: string,@Body('target_audience') target_audience: string){
      
    return await this.custominstructionsService.edit(req,customInstructionId,brand,product_service,feature1,feature2,feature3,target_audience)

}

}

