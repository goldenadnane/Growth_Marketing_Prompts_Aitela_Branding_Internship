/* eslint-disable prettier/prettier */
import {Body, Controller,Post,Req } from "@nestjs/common";
import { AiService } from "./ai.service";
import { Request } from "express";






@Controller('ai-responses')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate/:id?')
  async generateText(
    @Req() req:Request,
    @Body('promptText') promptText: string,
    @Body('customInstructionId') customInstructionId?: number,


  ) {

    
    const generatedText = await this.aiService.processRequest(req,promptText, customInstructionId);
    return generatedText;
  }
}