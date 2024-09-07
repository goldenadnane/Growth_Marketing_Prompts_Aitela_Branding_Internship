/* eslint-disable prettier/prettier */
import {HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpStatusCode } from "axios";
import { Home } from "src/entities/home.entity";
import { Repository } from "typeorm";
import { HomeDto } from "./home.dto";









@Injectable()
export class HomeService {
    constructor(
        @InjectRepository(Home)
       private homeRepository: Repository<Home>,
     
    ) {}



      // get home
      async findOne(id: number): Promise<Home> {
        return await this.homeRepository.findOne({ where : { id } });
    }
    


    async updateHome(
        id: number,
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
      ): Promise<any> {
        const hm = await this.homeRepository.findOne({ where: { id } });
        if (!hm) {
          throw new HttpException("element not found", HttpStatusCode.NotFound);
        }
      
        if (title) {
          hm.title = title.title;
        }

        // console.log(title_background)

        // console.log( title_background,
        //   slide_1_img ,
        //   slide_2_img ,
        //   slide_3_img ,
        //   );
        
      
        if ( title_background) {
          hm.title_background = title_background;
        }
      
        if (slide_1_text) {
          hm.slide_1_text = slide_1_text.slide_1_text;
        }

        if ( slide_1_img) {
          hm.slide_1_img = slide_1_img;
        }

        if (slide_1_description) {
          hm.slide_1_description = slide_1_description.slide_1_description;
        }
      
        if (slide_2_text) {
          hm.slide_2_text = slide_2_text.slide_2_text;
        }
        if (slide_2_img) {
          hm.slide_2_img = slide_2_img;
        }
        if (slide_2_description) {
          hm.slide_2_description = slide_2_description.slide_2_description;
        }
      
        if (slide_3_text) {
          hm.slide_3_text = slide_3_text.slide_3_text;
        }
        if (slide_3_img) {
          hm.slide_3_img = slide_3_img;
        }
        if (slide_3_description) {
          hm.slide_3_description = slide_3_description.slide_3_description;
        }
        
        return await this.homeRepository.save(hm);
        // console.log("---------------");
        
        // console.log(hm);
      }
      




}
