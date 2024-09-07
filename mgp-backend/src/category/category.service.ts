/* eslint-disable prettier/prettier */
import {Injectable,HttpException,HttpStatus} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/entities/category.entity';
import { CategoryDto } from './dto/category.dto';


@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
       private categoryRepository: Repository<Category>,
    ) {}

    async searchCategories(searchquery: string): Promise<Category[]> {
        const categories=await this.categoryRepository
          .createQueryBuilder('category')
          .where('category.name LIKE :query', { query: `%${searchquery}%` })
          .getMany();
          
          return categories
      }
    // get all categories
    async findall(): Promise<Category[]> {
        return await this.categoryRepository.find();
    }

    
    // get one category
    async findOne(id: number): Promise<Category> {
        return await this.categoryRepository.findOne({ where : { id } });
    }


    //create category
    async create(body:CategoryDto): Promise<Category> {
        const category=new Category()
        category.name=body.name
        return await this.categoryRepository.save(category);

        }
       
    

    // update category
    async update(id: number,category: CategoryDto): Promise<any> {

        const categoryy=await this.findOne(id);
        if(!categoryy){
            throw new HttpException("Category does not exist",HttpStatus.CONFLICT)
        }
        categoryy.name=category.name;
        return await this.categoryRepository.update(id, categoryy);
       

    }



    // delete user
    async delete(id: number): Promise<void> {
        const category = await this.findOne(id);
        if (!category) {
            throw new Error("Category not found !")
        }
        await this.categoryRepository.delete(id);
        throw new HttpException(`category with id ${id} was deleted succesfully`,HttpStatus.OK)
    }
    async findone(name: string): Promise<Category> {
        return this.categoryRepository.findOne({ where: {name}});
}



async getFreeCategories(): Promise<Category[] | Category> {
    return this.categoryRepository.find({
      where: {
        is_free: true,
      },
    });
  }
}