import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  // মেসেজ পাঠানো
  async sendMessage(senderId: number, receiverId: number, content: string) {
    return this.prisma.message.create({
      data: { senderId, receiverId, content },
    });
  }

  // দুইজনের মধ্যে কথোপকথন দেখা
  async getChat(userOneId: number, userTwoId: number) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userOneId, receiverId: userTwoId },
          { senderId: userTwoId, receiverId: userOneId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}