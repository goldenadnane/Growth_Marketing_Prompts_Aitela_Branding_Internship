/* eslint-disable prettier/prettier */
import { IsString, IsEmail, MinLength, MaxLength, Matches,IsStrongPassword, Validate} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { IsUnique } from './is_unique_on_create';







@ValidatorConstraint({ name: 'passwordsMatch', async: false })
export class PasswordsMatchValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} must match ${relatedPropertyName}`;
  }
}







@Injectable()

export class UserDto {

    
    profile_logo: string | null ; 

    @IsString()
    @MinLength(2)
    @MaxLength(50)

    firstname: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    lastname: string;

    @IsEmail()
    @MaxLength(255)
    @IsUnique({tableName:'User',column:'email'})

    email: string;


    @IsString()
    @MinLength(4)
    @MaxLength(50)
    @Matches(/^[a-zA-Z0-9_-]+$/, {
        message: 'Username can only contain letters, numbers, underscores, and hyphens.'
    })
    username: string;


    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @IsStrongPassword()
    password: string;

    @MinLength(8, { message: 'Confirm password must be at least 8 characters long' })
    // @IsStrongPassword()
    @Validate(PasswordsMatchValidator, ['password'], { message: 'Confirm password must match password' })
    confirmPassword: string;
    
    
    role: string | null;


    
    spent:number | null;

    subscribed:boolean|null;


    pre_made_prompt:number | null;


    chat_per_day:number | null;

    saved_prompt:number | null;


    custom_instructions:number | null;

    


 
    

}