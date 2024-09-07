/* eslint-disable prettier/prettier */
import { IsString,MinLength} from 'class-validator';
import { Injectable } from '@nestjs/common';
//import { IsUnique } from 'src/user/dto/is_unique_on_create';




@Injectable()

export class CategoryDto {

  @IsString()
  @MinLength(3)
  //@MaxLength(20)
  //@IsUnique({tableName:'Category',column:'name'})
    name: string;




    

}