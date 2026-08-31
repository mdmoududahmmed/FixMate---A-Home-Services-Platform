import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TechniciansService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      where: { role: 'TECHNICIAN' },
      select: {
        id: true,
        fullName: true,
        phone: true,
      },
    });
  }
}