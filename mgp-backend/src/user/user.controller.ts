/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete, Put, Query, UploadedFile, UseInterceptors, Res, HttpException, HttpStatus} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { Express } from 'express'; // <-- Make sure this import is correct
import { FileInterceptor } from '@nestjs/platform-express'; // Import FileInterceptor
import { MulterError, diskStorage } from 'multer';
import { Response } from 'express';
import * as path from 'path'; // Import path module
import { HttpStatusCode } from 'axios';
import { existsSync } from 'fs-extra';
import { UserDto } from './dto/create_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}
  
//search users 
    @Get('/')
    async searchUsers(@Query('query') searchquery: string): Promise<User[]> {
      const users=await this.userService.searchUsers(searchquery);
      return users
    }
    //get all users
    @Get("/all")
    async findAll(): Promise<User[]> {
        return await this.userService.findall();
    }

    //get one user
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<User> {
        const user = await this.userService.findOne(id);
        if (!user) {
            throw new Error("User not found")
        } else {
            return user;
        }
    }




    //create user
    @Post("/save")
    async create(@Body() user: User): Promise<User> {
        return await this.userService.create(user);
    }

 
    //delete user
    @Delete('/delete/:id')
    async delete(@Param('id') id: number): Promise<void> {
        //handle the error if user not found
       
        await this.userService.delete(id);
  }


        @Post('/register')
        @UseInterceptors(FileInterceptor('profile_logo',{
          fileFilter:(req,file,cb)=>{
            if(file.originalname.match(/^.*\.(jpg|png|jpeg)$/)){
              cb(null,true);
            }
            else{
              cb(new MulterError('LIMIT_UNEXPECTED_FILE','profile_logo'),false);
            }
            },
            storage:diskStorage({
              destination: './src/uploads',
              filename:(req,file,cb)=>{
                cb(null,file.originalname);
              },
            
            }),
        
        }),
        )
        async register(@Body() user:UserDto,@UploadedFile() profile_logo?: Express.Multer.File):Promise<any>{
        
            return await this.userService.register(user,profile_logo);
    }


    @Get("/users/count")
    async countUsers(){
      return await this.userService.countUsersByMonth();
    
    }


    @Put('/update/:currentUserId')
  @UseInterceptors(FileInterceptor('profile_logo',{
    fileFilter:(req,file,cb)=>{
      if(file.originalname.match(/^.*\.(jpg|png|jpeg)$/)){
        cb(null,true);
      }
      else{
        cb(new MulterError('LIMIT_UNEXPECTED_FILE','profile_logo'),false);
      }
      },
      // storage:diskStorage({
      //   destination: './src/uploads',
      //   filename:(req,file,cb)=>{
      //     cb(null,file.originalname);
      //   },
      
      // }),
  
  }),
  )
  // This should match the name of the field in your file upload form
  async updateUserProfile(@Param('currentUserId') currentUserId: number,@Body() user:UpdateUserDto,@UploadedFile() profile_logo?: Express.Multer.File): Promise<any>{
   
    const userr=await this.userService.findOne(currentUserId);

    if(!userr){
      throw new HttpException("User not found",HttpStatusCode.NotFound)
    }

    return await this.userService.updateUserProfile(currentUserId,user,profile_logo);
  }



  @Get('/:id/profile_logo')
  async getUserProfileLogo(@Param('id') id: number, @Res() res: Response): Promise<void> {
    const user = await this.userService.findOne(id);

    if (!user || !user.profile_logo) {
      throw new HttpException('User or logo not found',HttpStatusCode.NotFound)
      return;
    }
    const filePath = path.join(__dirname, '../../', 'src/uploads', user.profile_logo);

    if (existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
  }

  /*
  @Get("/users/statistics")
  async getUserStatistics(): Promise<{ currentMonth: number; previousMonth: number; percentage: number }> {
    const currentMonth = await this.userService.countUsersInCurrentMonth();
    const previousMonth = await this.userService.countUsersInPreviousMonth();
    const percentage = previousMonth !== 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 100;

    return { currentMonth, previousMonth, percentage };
  }

  */


    @Get("/users/top-spent")
    async getUsersByTotalSpent(): Promise<User[]> {
      return this.userService.getUsersByTotalSpent();
    }

    @Get('/users/total-spent')
    async getTotalSpentByAllUsers(){
      return this.userService.getTotalSpentByAllUsers();
    }




}
