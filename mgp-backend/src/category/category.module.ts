/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { JwtService } from '@nestjs/jwt';




@Module({
  imports: [TypeOrmModule.forFeature([Category])],

  controllers:[CategoryController],
  providers: [CategoryService,JwtService],
  exports:[CategoryService]
})
export class CategoryModule {}