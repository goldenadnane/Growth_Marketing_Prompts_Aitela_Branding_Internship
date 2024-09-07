/* eslint-disable prettier/prettier */
import {Body, Injectable,HttpException,HttpStatus, Inject} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategory } from 'src/entities/subcategory.entity';
import { CategoryService } from 'src/category/category.service';
import { SubcategoryDto } from './dto/subcategory.dto';
import { Category } from 'src/entities/category.entity';


@Injectable()
export class SubcategoryService {
    constructor(
        @Inject(CategoryService)
        private readonly categoryService: CategoryService,
        @InjectRepository(Subcategory)
        private readonly subcategoryRepository: Repository<Subcategory>,
      ) {}

       //search subcategories
     async searchSubcategories(searchquery: string): Promise<Subcategory[]> {
        const subcategories=await this.subcategoryRepository
          .createQueryBuilder('subcategory')
          .where('subcategory.name LIKE :query', { query: `%${searchquery}%` })
          .getMany();
          
          return subcategories
      }

    // get all subcategories
    async findall(): Promise<Subcategory[]> {
        return await this.subcategoryRepository.find();
    }

    // get one subcategory
    async findOne(id: number): Promise<Subcategory> {
        return await this.subcategoryRepository.findOne({ where : { id } });
    }


    //this function for csv parsing csv file  // in prompp.service.ts 

    async findOrCreateSubcategory(name:string,category: Category): Promise<Subcategory> {
  
      let subcategory = await this.subcategoryRepository.findOne({
        where: { name, category },
        relations: ['category'],
      });
  
      if (!subcategory) {
        subcategory = this.subcategoryRepository.create({ name,category });
        try {
          await this.subcategoryRepository.save(subcategory);
        } catch (error) {
          throw new Error(error)
        }
      }
  
      return subcategory;
    }
    

    //create subcategory
    async create(@Body() subcategory:SubcategoryDto): Promise<Subcategory> {
      const subcategoryy=new Subcategory()
      subcategoryy.name=subcategory.name;
      subcategoryy.category=subcategory.category;

        return await this.subcategoryRepository.save(subcategoryy);

        }
       
    

    // update subcategory
    async update(id: number,subcategory: SubcategoryDto): Promise<any> {

        const subcategoryy=await this.subcategoryRepository.findOne( { where : { id } } );
        if(!subcategoryy){
            throw new HttpException("Subcategory does not exist",HttpStatus.CONFLICT)
        }
        return await this.subcategoryRepository.update(id, subcategory);
       

    }

    // delete subcategory
    async delete(id: number): Promise<void> {
        const subcategory = await this.findOne(id);
        if (!subcategory) {
            throw new Error("Subcategory not found !")
        }
        await this.subcategoryRepository.delete(id);
    }

    
    async findone(name: string): Promise<Subcategory> {
        return this.subcategoryRepository.findOne({ where: {name}});
}





 async getSubcategoriesByCategory(id: number): Promise<Subcategory[]> {
    // Find the category with the given categoryId
    const category = await this.categoryService.findOne(id)

    if (!category) {
      // Handle case when the category is not found
      throw new Error('Category not found');
    }

    // Use the createQueryBuilder to fetch subcategories for the category with eager loading
    const Subcategory = await this.subcategoryRepository
      .createQueryBuilder('subcategory')
      .where('subcategory.category = :id', { id })
      .getMany();

    return Subcategory;
  }
}