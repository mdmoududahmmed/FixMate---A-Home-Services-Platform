import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getChatHistory(userId: number, otherUserId: number) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(senderId: number, receiverId: number, content: string | null, fileUrl: string | null, fileType: string | null) {
    return this.prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
        fileUrl,
        fileType,
      },
    });
  }

  async getTechnicianInbox(technicianId: number) {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: technicianId },
          { receiverId: technicianId },
        ],
      },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const inboxMap = new Map();

    messages.forEach((msg) => {
      const customerId = msg.senderId === technicianId ? msg.receiverId : msg.senderId;
      const customer = msg.senderId === technicianId ? msg.receiver : msg.sender;

      if (!inboxMap.has(customerId)) {
        inboxMap.set(customerId, {
          customerId,
          customerName: customer.fullName,
          lastMessage: msg.content || (msg.fileType ? `[${msg.fileType}]` : ''),
          timestamp: msg.createdAt,
        });
      }
    });

    return Array.from(inboxMap.values());
  }
}