/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Subcategory } from 'src/entities/subcategory.entity';
import { SubcategoryController } from './subcategory.controller';
import { SubcategoryService } from './subcategory.service';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/entities/category.entity';
import { JwtService } from '@nestjs/jwt';




@Module({
  imports: [TypeOrmModule.forFeature([Subcategory,Category])],

  controllers:[SubcategoryController],
  providers: [SubcategoryService,CategoryService,JwtService],
  exports:[SubcategoryService]
})
export class SubcategoryModule {}