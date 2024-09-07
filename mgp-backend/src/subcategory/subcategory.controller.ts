/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete, Put, NotFoundException, Query, UseGuards} from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { Subcategory } from 'src/entities/subcategory.entity';
import { SubcategoryDto } from './dto/subcategory.dto';
import { AdminMiddleware } from 'src/middleware/AdminMiddleware';


@Controller('subcategories')
export class SubcategoryController {
    constructor(private readonly subcategoryService: SubcategoryService) {}
  

    @Get('/')
    async searchSubcategories(@Query('query') searchquery: string): Promise<Subcategory[]> {
      const subcategories=await this.subcategoryService.searchSubcategories(searchquery);
      return subcategories
    }
    //get all subcategories
    @Get("/all")
    async findAll(): Promise<Subcategory[]> {
        return await this.subcategoryService.findall();
    }

    //get one subcategory
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Subcategory> {
        const subcategory = await this.subcategoryService.findOne(id);
        if (!subcategory) {
            throw new Error("Subcategory not found")
        } else {
            return subcategory;
        }
    }




    //create subcategory
    @UseGuards(AdminMiddleware)
    @Post("/save")
    async create(@Body() subcategory:SubcategoryDto): Promise<Subcategory> {
        return await this.subcategoryService.create(subcategory);
    }

    //update subcategory
    @UseGuards(AdminMiddleware)
    @Put('/update/:id')
    async update(@Param('id') id: number,@Body() subcategory: SubcategoryDto): Promise<Subcategory> {
        return this.subcategoryService.update(id, subcategory);
    }

    //delete subcategory
    @UseGuards(AdminMiddleware)
    @Delete('/delete/:id')
    async delete(@Param('id') id: number): Promise<void> {       
        await this.subcategoryService.delete(id);
  }

  @Get('/bycategory/:id')
  async getSubcategoriesByCategory(@Param('id') id: number): Promise<Subcategory[]> {
    try {
      const subcategories = await this.subcategoryService.getSubcategoriesByCategory(id);
      return subcategories;
    } catch (error) {
      // Handle error, for example, return a 404 response when the category is not found
      throw new NotFoundException('Category not found');
    }
  }
  



}