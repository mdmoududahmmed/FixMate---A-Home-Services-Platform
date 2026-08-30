import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('service-categories')
export class ServiceCategoriesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.serviceCategory.findMany({
      orderBy: { id: 'asc' },
    });
  }
}