import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards, 
  Req, 
  UseInterceptors, 
  UploadedFile,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('technician/inbox')
  async getTechnicianInbox(@Req() req: any) {
    const technicianId = Number(req.user?.sub || req.user?.userId || req.user?.id);
    return this.messagesService.getTechnicianInbox(technicianId);
  }

  @Get('chat/:otherUserId')
  async getChatHistory(@Req() req: any, @Param('otherUserId') otherUserId: string) {
    const userId = Number(req.user?.sub || req.user?.userId || req.user?.id);
    return this.messagesService.getChatHistory(userId, Number(otherUserId));
  }

  @Post()
  async sendMessage(@Req() req: any, @Body() body: { receiverId: number; content: string }) {
    const senderId = Number(req.user?.sub || req.user?.userId || req.user?.id);
    return this.messagesService.sendMessage(senderId, Number(body.receiverId), body.content, null, null);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadMedia(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    try {
      if (!file) {
        throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
      }

      const senderId = Number(req.user?.sub || req.user?.userId || req.user?.id);
      const receiverId = Number(body?.receiverId);

      if (!receiverId) {
        throw new HttpException('Receiver ID is missing', HttpStatus.BAD_REQUEST);
      }

      const fileUrl = `http://192.168.0.106:3000/uploads/${file.filename}`;
      const fileType = file.mimetype.startsWith('video') ? 'VIDEO' : 'IMAGE';

      return await this.messagesService.sendMessage(
        senderId, 
        receiverId, 
        null, 
        fileUrl, 
        fileType
      );
    } catch (error: any) {
      console.error('Upload Error Details:', error);
      throw new HttpException(
        error.message || 'Failed to process media upload', 
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}