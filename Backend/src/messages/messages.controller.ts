import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async send(@Request() req, @Body() body: any) {
    return this.messagesService.sendMessage(
      req.user.sub,
      body.receiverId,
      body.content,
    );
  }

  @Get('chat/:userId')
  @UseGuards(JwtAuthGuard)
  async getChat(@Request() req, @Param('userId') userId: string) {
    return this.messagesService.getChat(req.user.sub, Number(userId));
  }
}