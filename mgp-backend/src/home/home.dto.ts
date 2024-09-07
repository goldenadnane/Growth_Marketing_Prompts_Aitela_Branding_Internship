/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { IsString } from "class-validator";





@Injectable()

export class HomeDto {



@IsString()
title:string;


title_background:string | null;


slide_1_text:string | null ;


slide_1_img:string | null;


slide_1_description : string | null;



slide_2_text:string | null;

slide_2_img:string | null;

slide_2_description:string | null;


slide_3_text:string | null;

slide_3_img:string | null;

slide_3_description:string | null;
}