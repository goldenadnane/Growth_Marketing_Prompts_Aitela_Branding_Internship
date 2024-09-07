/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { IsEmail, IsNotEmpty, IsStrongPassword, MaxLength } from "class-validator";

@Injectable()

export class LoginDto {



    @IsEmail()
    @MaxLength(255)

    email: string;





    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
}