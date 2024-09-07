/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from 'src/entities/category.entity';
import { CategoryDto } from './dto/category.dto';
import { AdminMiddleware } from 'src/middleware/AdminMiddleware';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
  

    @Get('/')
    async searchCategories(@Query('query') searchquery: string): Promise<Category[]> {
      const subcategories=await this.categoryService.searchCategories(searchquery);
      return subcategories
    }
    //get all categories
    @Get("/all")
    async findAll(): Promise<Category[]> {
        return await this.categoryService.findall();
    }
    

    //get one user
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Category> {
        const category = await this.categoryService.findOne(id);
        if (!category) {
            throw new Error("Category not found")
        } else {
            return category;
        }
    }

    





    //create category
    @UseGuards(AdminMiddleware)
    @Post("/save")
    async create(@Body() name:CategoryDto):Promise<Category>{
        return await this.categoryService.create(name);
    }

    //update category
    @UseGuards(AdminMiddleware)
    @Put('/update/:id')
    async update(@Param('id') id: number,@Body() category: CategoryDto): Promise<Category> {
        
        return this.categoryService.update(id, category);
    }



    //delete category
    @UseGuards(AdminMiddleware)
    @Delete('/delete/:id')
    async delete(@Param('id') id: number): Promise<void> {       
        await this.categoryService.delete(id);
  }


  
  @Get('/categories/free')
  async getFreeCategories(): Promise<Category[] | Category> {
      return this.categoryService.getFreeCategories();
  }

}