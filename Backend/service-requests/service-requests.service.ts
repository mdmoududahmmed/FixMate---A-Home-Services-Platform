import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiceRequestsService {
  constructor(private prisma: PrismaService) {}

  // রিকোয়েস্ট তৈরি করার মেথড (already exists)
  async create(customerId: number, categoryId: number, description: string, location: string) {
    return this.prisma.serviceRequest.create({
      data: {
        customerId,
        categoryId,
        description,
        location,
        status: 'PENDING',
      },
    });
  }

  // নতুন যোগ করা: নিজের সব রিকোয়েস্ট লিস্ট করার মেথড
  async findMyOrders(customerId: number) {
    return this.prisma.serviceRequest.findMany({
      where: { customerId },
      include: {
        category: true, // ক্যাটাগরির নাম দেখানোর জন্য
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}