/* eslint-disable prettier/prettier */
import { IsString, IsEmail, MinLength, MaxLength, Matches,Validate, IsOptional} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { IsUniqueOnUpdate } from './is_unique_on_update';






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

export class UpdateUserDto {


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
    @IsUniqueOnUpdate({tableName:'User',column:'email',checkUniqueness:false})

    email: string;


    @IsString()
    @MinLength(4)
    @MaxLength(50)
    @Matches(/^[a-zA-Z0-9_-]+$/, {
        message: 'Username can only contain letters, numbers, underscores, and hyphens.'
    })
    username: string;

    // @IsString()
    @IsOptional()
    @MinLength(8)
    @MaxLength(100)
    // @IsStrongPassword()
    password: string;

   
    // @IsStrongPassword()
    @IsOptional()
    // @Validate(PasswordsMatchValidator, ['password']) // Check that confirmPassword matches password
    confirmPassword: string;
    
    @IsString()
    status:string
    
    @IsString()
    role: string | null;


    @IsOptional()
    spent:number;

    
    

}