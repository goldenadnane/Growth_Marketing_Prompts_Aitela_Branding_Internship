/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpException,Param, Put, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { HomeService } from "./home.service";
import { diskStorage } from "multer";
import { Home } from "src/entities/home.entity";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { HttpStatusCode } from "axios";
import { HomeDto } from "./home.dto";
import { log } from "console";




@Controller('home')
export class HomeController {
    constructor(private readonly homeService: HomeService) {}


    @Get(':currentHomeId')
    getOne(@Param("currentHomeId") id:number):Promise <Home>{
        return this.homeService.findOne(id)
    }

    @Put('/update/:currentHomeId')
    @UseInterceptors(
      FileFieldsInterceptor([
        { name: 'title_background' , maxCount:1},
        { name: 'slide_1_img', maxCount: 1 },
        { name: 'slide_2_img', maxCount: 1 },
        { name: 'slide_3_img', maxCount: 1 },
      ], {
        fileFilter: (req, file, cb) => {
          if (file.originalname.match(/^.*\.(jpg|png|jpeg)$/)) {
            cb(null, true);
          } else {
            cb(new Error('Invalid file format'), false);
          }
        },
       
      }),
    )
    async updateHome(
      @Param('currentHomeId') currentHomeId: number,
      // @Body() home: HomeDto,
      @UploadedFiles() images: { 
        title_background?: Express.Multer.File, 
        slide_1_img?: Express.Multer.File, 
        slide_2_img?: Express.Multer.File,
        slide_3_img?: Express.Multer.File,
        
        
      },
      @Body() title ?: string,
      @Body() slide_1_text?: string,
      @Body() slide_1_description?: string,
      @Body() slide_2_text?: string,
      @Body() slide_2_description?: string,
      @Body() slide_3_text?: string,
      @Body() slide_3_description?: string,
    ): Promise<any> {

      // console.log('images', images);
      
      const title_background = images.title_background[0].originalname;
      const slide_1_img = images.slide_1_img[0].originalname;
      const slide_2_img = images.slide_2_img[0].originalname;
      const slide_3_img = images.slide_3_img[0].originalname;
// console.log("title_background ", images.title_background[0].originalname);

      const hm = await this.homeService.findOne(currentHomeId);
  
      if (!hm) {
        throw new HttpException('Home not found', HttpStatusCode.NotFound);
      }
  
     return await this.homeService.updateHome(
        currentHomeId, 
        title_background,
         slide_1_img ,
         slide_2_img ,
         slide_3_img ,
         title ,
         slide_1_text ,
         slide_1_description ,
         slide_2_text ,
         slide_2_description ,
         slide_3_text ,
         slide_3_description ,
        )
    }
}