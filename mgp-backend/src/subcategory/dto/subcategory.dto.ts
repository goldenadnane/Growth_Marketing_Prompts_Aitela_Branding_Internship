/* eslint-disable prettier/prettier */
import { IsString,MinLength, MaxLength, IsNotEmpty} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { IsUnique } from 'src/user/dto/is_unique_on_create';
import { Category } from 'src/entities/category.entity';




@Injectable()

export class SubcategoryDto {

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsUnique({tableName:'Subcategory',column:'name'})
    name: string;

@IsNotEmpty()

category:Category;


    

}