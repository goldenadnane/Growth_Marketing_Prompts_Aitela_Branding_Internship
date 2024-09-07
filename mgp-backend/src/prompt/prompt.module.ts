/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prompt } from 'src/entities/prompt.entity';
import { Subcategory } from 'src/entities/subcategory.entity';
import { PromptController } from './prompt.controller';
import { PromptService } from './prompt.service';
import { SubcategoryService } from 'src/subcategory/subcategory.service';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/entities/category.entity';
import { Saved_Prompts } from 'src/entities/saved_prompt.entity';
import { SavedPromptsService } from './savedprompts.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/entities/user.entity';
import { Custom_Instructions } from 'src/entities/custom_instructions.entity';
import { Custom_InstructionsService } from './custom_instructions.service';




@Module({
  imports: [TypeOrmModule.forFeature([Prompt,Subcategory,Category,Saved_Prompts,User,Custom_Instructions])],

  controllers:[PromptController],
  providers: [PromptService,SubcategoryService,CategoryService,SavedPromptsService,JwtService,UserService,Custom_InstructionsService],
  exports:[PromptService]
})
export class PromptModule {}