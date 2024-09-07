/* eslint-disable prettier/prettier */
import { Injectable, Req} from '@nestjs/common';
import { Custom_InstructionsService } from 'src/prompt/custom_instructions.service';
import { Request } from 'express';
import { ConversationService } from 'src/conversation/conversation.service';
import { MessageService } from 'src/message/message.service';
import OpenAI from "openai";
import { Conversation } from 'src/entities/conversation.entity';
import { Message } from 'src/entities/message.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AiService {
  constructor(private readonly custom_instrcutionsService:Custom_InstructionsService,private readonly conversationService:ConversationService,
    private readonly messageService:MessageService,private readonly userService:UserService) {}
  private readonly apikey=process.env.apikey;


  async generateText(prompt: string): Promise<string> {
    //const url = process.env.url;
//console.log(url);

    try {
      const openai = new OpenAI({
        apiKey: this.apikey,
      });
      
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: `${prompt}` },
        ],
        temperature: 0.8,
        max_tokens: 1024,
      });

      
  
      return response.choices[0].message.content
    } catch (error) {
      throw new Error('Error generating text: ' + error);
    }
  }

  

  async processRequest(@Req() req:Request,promptText: string, customInstructionId?: number) {

    

    let conversation=null
    //let savedconversation=null
    let custom_instructions = null;
    let aiResponse=null;
    let combinedRequest=null;
    let history=null;
    const user_msg=new Message()
    const ai_msg=new Message()


      //try{
        const user=await this.userService.findOne(req.userId)
        console.log("useer chat ",user)
  
 
   
        const currentDate = new Date();
        const planExpirationDate = new Date(user.plan_expiration_date);
        //console.log(currentDate)
   
      if(currentDate >= planExpirationDate){
        user.custom_instuctions_status=false
        user.chat_per_day=0
        user.saved_prompt=0
        user.custom_instructions=0
        user.pre_made_prompt=0
        await this.userService.create(user)
        aiResponse="Your plan has expired"
      }  

      else{
    

          if (customInstructionId) {
              custom_instructions= await this.getAdditionalData(customInstructionId);
          }


          if(Number(req.params.id)){
              history=await this.messageService.getMessagesByConversationId(Number(req.params.id))
              conversation = await this.conversationService.findOne(Number(req.params.id));

          }
    
          if(user.chat_per_day<=0){
              aiResponse = "Upgrade your plan ! You cannot make more chats "
          }

     else{
      combinedRequest = `In the role of a Growth Marketing Expert, address the following query: '${promptText}'. 
                          Consider these specific instructions: ${JSON.stringify(custom_instructions)}.
                          Also, take into account this conversation history: ${JSON.stringify(history)}.
                           We're counting on your insights! `
      try{

                  aiResponse = await this.generateText(combinedRequest);
                }
              catch(error){
                  aiResponse="an error occured when generating Ai response ! please contact support."
                }
      
              }



     if(!Number(req.params.id)){
      conversation=new Conversation()
      const title=`Summarize the following prompt text in 6 words or less.
                  DO NOT PASS 6 WORDS AND DO NOT ANSWER THE PROMPT TEXT ONLY SUMMARIZE IT ITS IMPORTANT.  
                  DO NOT RETURN THE RESPONSE IN ANY TYPE OF QUOTES.

                  Prompt text : ${promptText}. `
      
          const generatedTitle = await this.generateText(title);

     
          if (generatedTitle) {
            conversation.title = generatedTitle
          } else {
            const words = promptText.split(' ');
            conversation.title = words.slice(0, 7).join(' ');
          }
      conversation=await this.conversationService.create(req, conversation.title) //JSON.parse to get generated title without "" 
    
     }


    
          user_msg.text=promptText;
          user_msg.conversation=conversation;
          user_msg.sender="user";


          ai_msg.text=aiResponse
          ai_msg.conversation=conversation
          ai_msg.sender="Ai"
   
     
  
          await this.messageService.create(req,user_msg)
  
          await this.messageService.create(req,ai_msg)
    
    
        }

 
    return aiResponse;




   /* }catch(error){
      throw new Error("this error is because of  "+)
  }
  */
 
}




  private async getAdditionalData(customInstructionId: number) {
    
    const custom_instruction=await this.custom_instrcutionsService.findone(customInstructionId)
    return custom_instruction
  }


  
}
